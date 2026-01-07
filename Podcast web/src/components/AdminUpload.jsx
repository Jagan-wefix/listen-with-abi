import React, { useEffect, useState } from 'react'
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../data/firebase'
import { uploadToCloudinary } from '../data/cloudinary'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../data/firebase'
import { Navigate } from 'react-router-dom'

export default function AdminUpload() {
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoadingAuth(false)
    })
    return unsub
  }, [])

  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [episodeNo, setEpisodeNo] = React.useState('')
  const [file, setFile] = React.useState(null)
  const [thumbnail, setThumbnail] = React.useState('')
  const [status, setStatus] = React.useState('')
  const [progress, setProgress] = React.useState(0)

  // Thoughts state
  const [thoughtTitle, setThoughtTitle] = React.useState('')
  const [thoughtContent, setThoughtContent] = React.useState('')
  const [thoughtsList, setThoughtsList] = React.useState([])
  const [thoughtsListLoading, setThoughtsListLoading] = React.useState(false)

  // Admin controls state
  const [episodesList, setEpisodesList] = React.useState([])
  const [episodesListLoading, setEpisodesListLoading] = React.useState(false)
  const [selectedCommentsFor, setSelectedCommentsFor] = React.useState(null)
  const storageKey = 'lwa_interactions_v1'
  const [interactions, setInteractions] = React.useState(() => {
    try { const raw = localStorage.getItem(storageKey); return raw ? JSON.parse(raw) : {}; } catch (e) { return {} }
  })

  // while auth is initializing, don't render anything
  if (loadingAuth) return null
  // if not signed in, redirect to the admin auth page
  if (!user) return <Navigate to="/admin-auth" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return setStatus('Please pick an mp3 file')
    setStatus('Uploading...')
    try {
      const cloud = await uploadToCloudinary(file, setProgress)
      // cloud.secure_url and cloud.public_id are available
      await addDoc(collection(db, 'episodes'), {
        title,
        description,
        episodeNo: Number(episodeNo) || 0,
        mp3Url: cloud.secure_url,
        cloudinaryId: cloud.public_id,
        thumbnail: thumbnail || null,
        createdAt: serverTimestamp()
      })
      setStatus('Uploaded & saved to Firestore')
      setTitle('')
      setDescription('')
      setEpisodeNo('')
      setFile(null)
      setThumbnail('')
      setProgress(0)
      // refresh admin list after upload
      loadEpisodes()
    } catch (err) {
      console.error(err)
      setStatus('Upload failed: ' + err.message)
    }
  }

  async function handleThoughtSubmit(e) {
    e.preventDefault()
    if (!thoughtTitle || !thoughtContent) return setStatus('Please fill title and content')
    setStatus('Posting thought...')
    try {
      await addDoc(collection(db, 'thoughts'), {
        title: thoughtTitle,
        content: thoughtContent,
        createdAt: serverTimestamp()
      })
      setStatus('Thought posted')
      setThoughtTitle('')
      setThoughtContent('')
      loadThoughts()
    } catch (err) {
      console.error(err)
      setStatus('Post failed: ' + err.message)
    }
  }

  async function loadEpisodes() {
    setEpisodesListLoading(true)
    try {
      const q = query(collection(db, 'episodes'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setEpisodesList(items)
    } catch (err) {
      console.error('Failed to load episodes', err)
      setStatus('Failed to load episodes: ' + (err.message || String(err)))
    } finally {
      setEpisodesListLoading(false)
    }
  }

  async function loadThoughts() {
    setThoughtsListLoading(true)
    try {
      const q = query(collection(db, 'thoughts'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setThoughtsList(items)
    } catch (err) {
      console.error('Failed to load thoughts', err)
      setStatus('Failed to load thoughts: ' + (err.message || String(err)))
    } finally {
      setThoughtsListLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this episode? This cannot be undone.')) return
    try {
      await deleteDoc(doc(db, 'episodes', id))
      setStatus('Episode deleted')
      // remove from local list
      setEpisodesList(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      console.error('Failed to delete', err)
      setStatus('Failed to delete: ' + (err.message || String(err)))
    }
  }

  async function handleThoughtDelete(id) {
    if (!window.confirm('Delete this thought? This cannot be undone.')) return
    try {
      await deleteDoc(doc(db, 'thoughts', id))
      setStatus('Thought deleted')
      setThoughtsList(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error('Failed to delete thought', err)
      setStatus('Failed to delete thought: ' + (err.message || String(err)))
    }
  }

  function resetInteractions(episodeId) {
    const next = { ...interactions, [episodeId]: { liked: false, likes: 0, comments: [] } }
    setInteractions(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch (e) {}
  }

  function viewComments(episodeId) {
    setSelectedCommentsFor(episodeId === selectedCommentsFor ? null : episodeId)
  }

  function deleteComment(episodeId, index) {
    const current = interactions[episodeId] || { liked: false, likes: 0, comments: [] }
    const comments = (current.comments || []).filter((_, i) => i !== index)
    const next = { ...interactions, [episodeId]: { ...current, comments } }
    setInteractions(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch (e) {}
  }

  return (
    <div className="admin-upload container py-4" style={{color:'white'}}>
      <h2>Admin Upload</h2>
      <form onSubmit={handleSubmit} className="d-grid gap-3" style={{ maxWidth: 700 }}>
        <label className="form-label">
          Title
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label className="form-label">
          Description
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className="form-label">
          Episode No
          <input type="number" className="form-control" value={episodeNo} onChange={(e) => setEpisodeNo(e.target.value)} />
        </label>
        <label className="form-label">
          Thumbnail URL (optional)
          <input className="form-control" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://..." />
        </label>
        <label className="form-label">
          MP3 File
          <input className="form-control" type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} />
        </label>

        <div>
          <button className="btn btn-brand" type="submit">Upload</button>
        </div>
      </form>

      {progress > 0 && <div style={{color: 'white'}} className="mt-3">Upload progress: {progress}%</div>}
      {status && <div className="mt-2 alert alert-info">{status}</div>}

      <p style={{color: 'white'}} className="note text-muted mt-3">Note: This uses an unsigned Cloudinary upload preset (client-side). Restrict in production.</p>

      <hr />
      <h3 style={{color: 'white'}}>Post a Thought</h3>
      <form onSubmit={handleThoughtSubmit} className="d-grid gap-3" style={{ maxWidth: 700 }}>
        <label className="form-label">
          Title
          <input className="form-control" value={thoughtTitle} onChange={(e) => setThoughtTitle(e.target.value)} required />
        </label>
        <label className="form-label">
          Content
          <textarea className="form-control" value={thoughtContent} onChange={(e) => setThoughtContent(e.target.value)} rows="5" required />
        </label>

        <div>
          <button className="btn btn-brand" type="submit">Post Thought</button>
        </div>
      </form>

      <hr />
      <div className="admin-controls mt-4">
        <h3 style={{color: 'white'}}>Admin Controls</h3>
        <p style={{color: 'white'}} className="text-muted">Manage uploaded episodes.</p>

        <div style={{color: 'white'}} className="mb-3">
          <button style={{color: 'white'}} className="btn btn-sm btn-outline-accent me-2" onClick={loadEpisodes}>Refresh List</button>
        </div>

        {episodesListLoading ? (
          <p>Loading episodes...</p>
        ) : (
          episodesList.length === 0 ? (
            <p>No episodes uploaded.</p>
          ) : (
            <div className="list-group">
              {episodesList.map(ep => (
                <div key={ep.id} className="list-group-item d-flex justify-content-between align-items-start">
                  <div className="me-3" style={{ minWidth: 200 }}>
                    <strong>{ep.title}</strong>
                    <div className="small text-muted">{ep.pubDate ? new Date(ep.pubDate).toLocaleString() : (ep.createdAt && ep.createdAt.toDate ? ep.createdAt.toDate().toLocaleString() : '')}</div>
                  </div>

                  <div className="me-3 text-center">
                    <div>Likes: {(interactions[ep.id] && interactions[ep.id].likes) || 0}</div>
                    <div>Comments: {(interactions[ep.id] && interactions[ep.id].comments && interactions[ep.id].comments.length) || 0}</div>
                  </div>

                  <div>
                    <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDelete(ep.id)}>Delete</button>
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => viewComments(ep.id)}>View</button>
                    <button className="btn btn-sm btn-outline-warning" onClick={() => resetInteractions(ep.id)}>Reset</button>
                  </div>

                  {/* comments panel */}
                  {selectedCommentsFor === ep.id && (
                    <div className="w-100 mt-3">
                      <h6>Comments</h6>
                      {(interactions[ep.id] && interactions[ep.id].comments && interactions[ep.id].comments.length > 0) ? (
                        interactions[ep.id].comments.map((c, i) => (
                          <div key={i} className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <div className="small text-muted">{new Date(c.createdAt).toLocaleString()}</div>
                              <div>{c.text}</div>
                            </div>
                            <div>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteComment(ep.id, i)}>Delete</button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">No comments yet</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        <hr />
        <h4 style={{color: 'white'}}>Thoughts Management</h4>
        <div style={{color: 'white'}} className="mb-3">
          <button style={{color: 'white'}} className="btn btn-sm btn-outline-accent me-2" onClick={loadThoughts}>Refresh Thoughts List</button>
        </div>

        {thoughtsListLoading ? (
          <p>Loading thoughts...</p>
        ) : (
          thoughtsList.length === 0 ? (
            <p>No thoughts posted.</p>
          ) : (
            <div className="list-group">
              {thoughtsList.map(thought => (
                <div key={thought.id} className="list-group-item d-flex justify-content-between align-items-start">
                  <div className="me-3" style={{ minWidth: 200 }}>
                    <strong>{thought.title}</strong>
                    <div className="small text-muted">{thought.createdAt && thought.createdAt.toDate ? thought.createdAt.toDate().toLocaleString() : ''}</div>
                  </div>

                  <div>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleThoughtDelete(thought.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}