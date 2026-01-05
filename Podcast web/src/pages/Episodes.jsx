import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import EpisodeCard from '../components/EpisodeCard';
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db, auth } from '../data/firebase'
import { signInAnonymously } from 'firebase/auth'
import { podcastInfo } from '../data/podcastData';

const Episodes = ({ audioPlayer }) => {
  const { isPlaying, currentEpisode, play, loading } = audioPlayer;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [episodes, setEpisodes] = useState([])
  const [loadingEpisodes, setLoadingEpisodes] = useState(true)

  const [fetchError, setFetchError] = useState(null)

  const [showCommentBoxes, setShowCommentBoxes] = useState({})

  // per-episode interactions (likes/comments) persisted in localStorage
  const storageKey = 'lwa_episodes_interactions_v1'
  const [interactions, setInteractions] = useState(() => {
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

  const CommentForm = ({ episodeId, onAdd }) => {
    const [text, setText] = React.useState('')
    return (
      <div className="d-flex gap-2">
        <input className="form-control form-control-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a comment..." />
        <button className="btn btn-brand btn-sm" onClick={() => { onAdd(text); setText('') }}>Add</button>
      </div>
    )
  }

  React.useEffect(() => {
    let mounted = true
    async function fetchEpisodes() {
      try {
        setFetchError(null)
        setLoadingEpisodes(true)
        const q = query(collection(db, 'episodes'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        const items = snap.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            title: data.title || '',
            description: data.description || '',
            date: data.pubDate || (data.createdAt ? data.createdAt.toDate().toISOString() : null),
            duration: data.duration || '',
            audioUrl: data.mp3Url || data.audioUrl || null,
            thumbnail: data.thumbnail || podcastInfo.cover || '',

            featured: data.featured || false,
          }
        })
        if (mounted) {
          setEpisodes(items)
          setFetchError(null)
        }
      } catch (err) {
        console.error('Failed to load episodes from Firestore', err)
        // If permission issue, try anonymous sign-in once in development and retry
        const msg = (err && err.message) || String(err)
        if ((msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('insufficient')) && import.meta.env.MODE === 'development') {
          try {
            await signInAnonymously(auth)
            // retry
            const q = query(collection(db, 'episodes'), orderBy('createdAt', 'desc'))
            const snap = await getDocs(q)
            const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
            if (mounted) {
              setEpisodes(items)
              setFetchError(null)
            }
          } catch (retryErr) {
            console.error('Retry after anonymous sign-in failed', retryErr)
            if (mounted) setFetchError(retryErr.message || String(retryErr))
          }
        } else {
          if (mounted) setFetchError(err.message || String(err))
        }
      } finally {
        if (mounted) setLoadingEpisodes(false)
      }
    }
    fetchEpisodes()
    return () => (mounted = false)
  }, [])

  const retryFetch = () => {
    // simple retry by re-running the effect: call fetch again via a small helper
    setLoadingEpisodes(true)
    setFetchError(null)
    // call the same logic by triggering the effect: simpler to just call an async wrapper
    (async () => {
      try {
        const q = query(collection(db, 'episodes'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        const items = snap.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            title: data.title || '',
            description: data.description || '',
            date: data.pubDate || (data.createdAt ? data.createdAt.toDate().toISOString() : null),
            duration: data.duration || '',
            audioUrl: data.mp3Url || data.audioUrl || null,
            thumbnail: data.thumbnail || podcastInfo.cover || '',

            featured: data.featured || false,
          }
        })
        setEpisodes(items)
        setFetchError(null)
      } catch (err) {
        console.error('Retry failed to load episodes from Firestore', err)
        setFetchError(err.message || String(err))
      } finally {
        setLoadingEpisodes(false)
      }
    })()
  }

  const filteredAndSortedEpisodes = useMemo(() => {
    let filtered = episodes.filter(episode =>
      episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      episode.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [episodes, searchTerm, sortOrder]);

  return (
    <div className="episodes-page">
      <Container>
        <Row>
          <Col>
            <div className="page-header">
              <h1 className="page-title">Web Only Episodes</h1>
              <p className="page-subtitle">
                Browse our web-only episodes collection
              </p>
            </div>
          </Col>
        </Row>

        {/* Search and Filter Controls */}
        <Row className="mb-4">
          <Col lg={8}>
            <InputGroup className="search-group">
              <InputGroup.Text>
                <Search size={18} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search episodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </InputGroup>
          </Col>
          <Col lg={4}>
            <div className="sort-controls">
              <Button
                variant="outline-light"
                onClick={() => setSortOrder('newest')}
                className="sort-btn web-only-btn"
                style={{borderColor: 'white', color: 'white'}}
              >
                <SortDesc size={16} className="me-1" />
                Newest First
              </Button>
              <Button
                variant={sortOrder === 'oldest' ? 'light' : 'outline-light'}
                onClick={() => setSortOrder('oldest')}
                className="sort-btn ms-2 web-only-btn"
                style={sortOrder === 'oldest' ? {backgroundColor: 'white', color: 'black'} : {borderColor: 'white', color: 'white'}}
              >
                <SortAsc size={16} className="me-1" />
                Oldest First
              </Button>
            </div>
          </Col>
        </Row>

        {/* Results Info */}
        <Row>
          <Col>
            {fetchError ? (
              <div className="alert alert-danger d-flex justify-content-between align-items-center">
                <div>
                  <strong>Failed to load episodes:</strong> {fetchError}
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-light" onClick={retryFetch}>Retry</button>
                </div>
              </div>
            ) : (
              <p className="results-info">
                Showing {filteredAndSortedEpisodes.length} episodes
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            )}
          </Col>
        </Row>

        {/* Episodes List */}
        <Row>
          {filteredAndSortedEpisodes.length > 0 ? (
            filteredAndSortedEpisodes.map(episode => (
              <Col xs={12} className="mb-3" key={episode.id}>
                <EpisodeCard 
                  episode={episode}
                  isPlaying={isPlaying}
                  currentEpisode={currentEpisode}
                  onPlay={play}
                  loading={loading}
                />
              </Col>
            ))
          ) : (
            <Col>
              <div className="no-results">
                <Filter size={48} className="no-results-icon" />
                <h3>No episodes found</h3>
                <p>Try adjusting your search terms or browse all episodes.</p>
                <Button 
                  variant="utility" 
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Episodes;