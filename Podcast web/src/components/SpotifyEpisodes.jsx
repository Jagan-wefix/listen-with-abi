import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../data/firebase'
import { Row, Col } from 'react-bootstrap'
import { ArrowRight } from 'lucide-react'
import EpisodeCard from './EpisodeCard'
import { podcastInfo } from '../data/podcastData'

function extractSpotifyEpisodeId(url) {
  try {
    const m = url.match(/open.spotify.com\/episode\/([a-zA-Z0-9]+)(\?|$)/)
    return m ? m[1] : null
  } catch (err) {
    return null
  }
}

function stripHtml(str) {
  if (!str) return ''
  // quick HTML tag stripper
  return str.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
}

function parseRss(xmlText) {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlText, 'text/xml')
    const items = Array.from(doc.querySelectorAll('item')).map((it) => {
      const title = stripHtml(it.querySelector('title')?.textContent || '')
      const link = it.querySelector('link')?.textContent || ''
      const rawDescription = it.querySelector('description')?.textContent || ''
      const description = stripHtml(rawDescription)
      const pubDate = it.querySelector('pubDate')?.textContent || ''
      const enclosure = it.querySelector('enclosure')
      const mp3Url = enclosure ? enclosure.getAttribute('url') : null
      let image = null
      const itunesImage = it.getElementsByTagName('itunes:image')[0]
      if (itunesImage) image = itunesImage.getAttribute('href')
      if (!image) {
        const media = it.getElementsByTagName('media:content')[0]
        if (media) image = media.getAttribute('url')
      }
      return {
        id: it.querySelector('guid')?.textContent || link || title,
        title,
        link,
        description,
        pubDate: pubDate ? new Date(pubDate).toISOString() : null,
        mp3Url,
        image,
        source: 'rss',
      }
    })
    return items
  } catch (err) {
    console.error('Failed to parse RSS', err)
    return []
  }
}

export async function loadSpotifyEpisodes(rssUrl = 'https://anchor.fm/s/133292dc/podcast/rss') {
  const results = []

  // Try RSS feed first
  try {
    const res = await fetch(rssUrl)
    if (res.ok) {
      const txt = await res.text()
      const rssItems = parseRss(txt)
      results.push(...rssItems)
    } else {
      console.warn('RSS fetch returned', res.status)
    }
  } catch (rssErr) {
    console.warn('RSS fetch failed', rssErr)
  }

  // Fallback to Firestore collection
  try {
    const q = query(collection(db, 'spotifyEpisodes'), orderBy('pubDate', 'desc'))
    const snap = await getDocs(q)
    const dbItems = snap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        title: stripHtml(data.title || ''),
        link: data.link,
        description: stripHtml(data.description || ''),
        pubDate: data.pubDate ? new Date(data.pubDate).toISOString() : null,
        mp3Url: data.mp3Url || data.enclosure || null,
        image: data.image || null,
        source: 'db',
      }
    })
    results.push(...dbItems)
  } catch (dbErr) {
    console.warn('Firestore fetch failed', dbErr)
  }

  // Deduplicate and sort
  const map = new Map()
  results.forEach((r) => {
    if (!r || !r.id) return
    if (!map.has(r.id)) map.set(r.id, r)
  })
  const merged = Array.from(map.values()).filter(Boolean)
  merged.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate) : new Date(0)
    const db = b.pubDate ? new Date(b.pubDate) : new Date(0)
    return db - da
  })

  return merged
}

export default function SpotifyEpisodes({ rssUrl = 'https://anchor.fm/s/133292dc/podcast/rss', latestCount = 5, audioPlayer, allLink = null }) {
  const [episodes, setEpisodes] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [showAll, setShowAll] = React.useState(false)
  const [activeSpotifyId, setActiveSpotifyId] = useState(null)
  const [showCommentBoxes, setShowCommentBoxes] = useState({})
  const [showCommentsLists, setShowCommentsLists] = useState({})

  // per-episode interactions (likes/comments) persisted in localStorage
  const storageKey = 'lwa_interactions_v1'
  const [interactions, setInteractions] = React.useState(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : {}
    } catch (e) { return {} }
  })

  const saveInteractions = (next) => {
    setInteractions(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch (e) {}
  }

  const toggleLike = (episodeId) => {
    const current = interactions[episodeId] || { liked: false, likes: 0, comments: [] }
    const liked = !current.liked
    const likes = liked ? (current.likes || 0) + 1 : Math.max(0, (current.likes || 1) - 1)
    const next = { ...interactions, [episodeId]: { ...current, liked, likes, comments: current.comments || [] } }
    saveInteractions(next)
  }

  const addComment = (episodeId, text) => {
    if (!text || !text.trim()) return
    const current = interactions[episodeId] || { liked: false, likes: 0, comments: [] }
    const comment = { text: text.trim(), createdAt: new Date().toISOString() }
    const next = { ...interactions, [episodeId]: { ...current, comments: [comment, ...(current.comments || [])], liked: current.liked, likes: current.likes || 0 } }
    saveInteractions(next)
  }

  const { play, isPlaying, currentEpisode, loading: playerLoading } = audioPlayer || {}

  React.useEffect(() => {
    let mounted = true
    async function fetchEpisodes() {
      try {
        const merged = await loadSpotifyEpisodes(rssUrl)
        if (mounted) setEpisodes(merged)
      } catch (err) {
        console.error('Failed to load episodes', err)
        if (mounted) setError(err.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchEpisodes()
    return () => (mounted = false)
  }, [rssUrl])

  const displayed = showAll ? episodes : episodes.slice(0, latestCount)

  const CommentForm = ({ episodeId, onAdd }) => {
    const [text, setText] = React.useState('')
    return (
      <div className="d-flex gap-2">
        <input className="form-control form-control-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a comment..." />
        <button className="btn btn-brand btn-sm" onClick={() => { onAdd(text); setText('') }}>Add</button>
      </div>
    )
  }

  const handlePlay = (ep) => {
    // If mp3 available, use central audio player
    if (ep.mp3Url) {
      const playEpisode = {
        id: ep.id,
        title: ep.title,
        description: ep.description,
        audioUrl: ep.mp3Url,
        thumbnail: ep.image || null,
      }
      play && play(playEpisode)
      // close any active spotify embed
      setActiveSpotifyId(null)
      return
    }

    // If spotify link, toggle embed display
    const sid = extractSpotifyEpisodeId(ep.link)
    if (sid) {
      setActiveSpotifyId((prev) => (prev === ep.id ? null : ep.id))
    }
  }

  return (
    <div className="spotify-episodes">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0 text-white">Latest</h2>
        {episodes.length > latestCount && (
          allLink ? (
            <Link to={allLink} className="btn-brand btn-sm d-inline-flex align-items-center" style={{padding: '0.4rem 0.9rem'}}>
              Show all {episodes.length} <ArrowRight size={14} className="ms-2" />
            </Link>
          ) : (
            <button
              className="btn-outline-brand btn-sm d-inline-flex align-items-center"
              onClick={() => setShowAll((s) => !s)}
              style={{padding: '0.35rem 0.6rem'}}
            >
              {showAll ? `Show less` : `Show all ${episodes.length}`}
            </button>
          )
        )}
      </div>

      {loading && <p className="text-white">Loading…</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && episodes.length === 0 && <p>No episodes found.</p>}

      {!loading && episodes.length > 0 && (
        <>
          <Row className="gy-4">
            {displayed.map((ep) => {
              const cardEp = {
                id: ep.id,
                title: ep.title,
                description: ep.description,
                thumbnail: ep.image || podcastInfo.cover || '',
                duration: ep.duration || '',
                featured: ep.featured || false,
              }

              return (
                <Col xs={12} key={ep.id}>
                  <EpisodeCard
                    episode={cardEp}
                    isPlaying={isPlaying}
                    currentEpisode={currentEpisode}
                    onPlay={() => handlePlay(ep)}
                    loading={playerLoading}
                    isActive={activeSpotifyId === ep.id}
                  />

                  {/* Render Spotify iframe when active */}
                  {activeSpotifyId === ep.id && extractSpotifyEpisodeId(ep.link) && (
                    <div className="spotify-embed mt-3">
                      <iframe
                        title={`spotify-${ep.id}`}
                        src={`https://open.spotify.com/embed/episode/${extractSpotifyEpisodeId(ep.link)}`}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="encrypted-media"
                      />

                   {/* Like and Comment section */}
                   <div className="episode-interactions mt-2">
                     <div className="d-flex justify-content-between align-items-center mb-2">
                       <div>
                         <button className="btn btn-outline-dark btn-sm me-2" onClick={() => toggleLike(ep.id)}>
                           { (interactions[ep.id] && interactions[ep.id].liked) ? '♥ Liked' : '♡ Like' }
                           <span className="ms-2">{(interactions[ep.id] && interactions[ep.id].likes) || 0}</span>
                         </button>
                         <button className="btn btn-outline-dark btn-sm" onClick={() => setShowCommentBoxes(prev => ({ ...prev, [ep.id]: !prev[ep.id] }))}>💬 Comment</button>
                       </div>
                     </div>

                     {showCommentBoxes[ep.id] && (
                       <div className="comments-box mb-2">
                         <CommentForm episodeId={ep.id} onAdd={(txt) => addComment(ep.id, txt)} />
                       </div>
                     )}

                     <div className="comments-list">
                       { (interactions[ep.id] && interactions[ep.id].comments && interactions[ep.id].comments.length > 0) ? (
                         interactions[ep.id].comments.map((c, i) => (
                           <div key={i} className="comment-item mb-2">
                             <div className="small text-muted">{new Date(c.createdAt).toLocaleString()}</div>
                             <div>{c.text}</div>
                           </div>
                         ))
                       ) : null}
                     </div>
                   </div>                    </div>
                  )}
                </Col>
              )
            })}
          </Row>
        </>
      )}
    </div>
  )
}
