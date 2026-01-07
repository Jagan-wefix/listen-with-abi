import React from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Modal, Badge, Spinner } from 'react-bootstrap';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../data/firebase';
import ThoughtCard from '../components/ThoughtCard';
import { addCommentToThought, subscribeComments } from '../data/firestoreService';

const PAGE_SIZE = 6;

const Thoughts = () => {
  const [thoughts, setThoughts] = React.useState([]);
  const [visible, setVisible] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [activeTag, setActiveTag] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState(null);
  const [comments, setComments] = React.useState({});
  const [focusCommentFor, setFocusCommentFor] = React.useState(null);
  const [commentDraft, setCommentDraft] = React.useState('');

  React.useEffect(() => {
    const loadThoughts = async () => {
      try {
        const q = query(collection(db, 'thoughts'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setThoughts(items);
      } catch (err) {
        console.error('Failed to load thoughts', err);
      } finally {
        setLoading(false);
      }
    };
    loadThoughts();
  }, []);



  // Subscribe to comments for the currently selected thought
  React.useEffect(() => {
    let unsub;
    if (selected) {
      unsub = subscribeComments(selected.id, (list) => {
        setComments(prev => ({ ...prev, [selected.id]: list }));
      });
    }
    return () => { if (unsub) unsub(); };
  }, [selected]);

  const addComment = async (id, text) => {
    if (!text || !text.trim()) return;
    try {
      await addCommentToThought(id, text.trim());
    } catch (err) {
      console.error('Failed to add comment', err);
      // fallback: optimistic local update
      setComments(prev => ({ ...prev, [id]: [{ text: text.trim(), createdAt: Date.now() }, ...(prev[id] || [])] }));
    }
    setCommentDraft('');
  };



  React.useEffect(() => {
    const filtered = thoughts.filter(t => {
      const matchesSearch = search.trim() === '' || (t.title && t.title.toLowerCase().includes(search.toLowerCase())) || (t.content && t.content.toLowerCase().includes(search.toLowerCase()));
      const matchesTag = !activeTag || (t.tags && t.tags.includes(activeTag));
      return matchesSearch && matchesTag;
    });
    setVisible(filtered.slice(0, PAGE_SIZE * page));
  }, [thoughts, search, activeTag, page]);

  const allTags = Array.from(new Set(thoughts.flatMap(t => t.tags || [])));



  if (loading) {
    return (
      <Container className="hero-section thoughts-page">
        <Row>
          <Col>
            <h1 >Thoughts</h1>
            <div className="d-flex align-items-center gap-3"><Spinner animation="border" size="sm" /> Loading thoughts…</div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <section className="hero-section thoughts-page">
      <Container>
      <Row className="align-items-center mb-4">
        <Col md={8}>
          <h1 className="page-title">Thoughts</h1>
          <p className="muted">Thoughts, as they come.</p>
        </Col>v
        <Col md={4} className="d-flex justify-content-end">
          <InputGroup style={{maxWidth: 360}}>
            <Form.Control placeholder="Search thoughts" value={search} onChange={e => setSearch(e.target.value)} />
            <Button variant="outline-secondary" onClick={() => setSearch('')}>Clear</Button>
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <div className="d-flex gap-2 flex-wrap">
            <Button className={!activeTag ? 'btn-brand' : 'btn-outline-brand'} size="sm" onClick={() => setActiveTag(null)}>All</Button>
            {allTags.map(tag => (
              <Button key={tag} className={activeTag === tag ? 'btn-brand' : 'btn-outline-brand'} size="sm" onClick={() => setActiveTag(tag)}>#{tag}</Button>
            ))}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          {visible.length === 0 ? (
            <Card className="p-4 text-center">
              <Card.Body>
                <h4>No matching thoughts</h4>
                <p>Try a different search or tag.</p>
              </Card.Body>
            </Card>
          ) : (
            visible.map(t => (
              <ThoughtCard
                key={t.id}
                thought={t}
                onOpen={setSelected}
                onAddComment={(id) => { const t = thoughts.find(x => x.id === id); setSelected(t); setFocusCommentFor(id); setTimeout(() => { const el = document.querySelector('#thought-comment-input'); if (el) el.focus(); }, 150); }}
              />
            ))
          )}

          {visible.length < thoughts.filter(t => {
            const matchesSearch = search.trim() === '' || (t.title && t.title.toLowerCase().includes(search.toLowerCase())) || (t.content && t.content.toLowerCase().includes(search.toLowerCase()));
            const matchesTag = !activeTag || (t.tags && t.tags.includes(activeTag));
            return matchesSearch && matchesTag;
          }).length && (
            <div className="text-center mt-4">
              <Button className="btn-outline-brand" onClick={() => setPage(p => p + 1)}>Load more</Button>
            </div>
          )}
        </Col>
      </Row>

      <Modal show={!!selected} onHide={() => { setSelected(null); setFocusCommentFor(null); setCommentDraft(''); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selected && selected.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <>
              <div className="mb-2 text-muted small" style={{ color: 'white' }}>{selected.createdAt && selected.createdAt.toDate ? selected.createdAt.toDate().toLocaleString() : ''}</div>
              <div className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>{selected.content}</div>

              <div className="d-flex gap-2 flex-wrap mb-3">
                {(selected.tags || []).map(t => <Badge key={t} bg="secondary">#{t}</Badge>)}
              </div>

              <hr />

              <div className="comments-section">
                <h6 className="mb-2">Comments ({(comments[selected.id] || []).length})</h6>

                <div className="comment-list mb-3">
                  {(comments[selected.id] || []).length === 0 && <div className="text-muted small">Be the first to comment on this thought.</div>}
                  {(comments[selected.id] || []).map((c, idx) => (
                    <div className="mb-2" key={idx}>
                      <div className="small text-muted">{c.createdAt && c.createdAt.toDate ? c.createdAt.toDate().toLocaleString() : (c.createdAt ? new Date(c.createdAt).toLocaleString() : '')}</div>
                      <div>{c.text}</div>
                    </div>
                  ))}
                </div>

                <div className="d-flex gap-2">
                  <input id="thought-comment-input" className="form-control" placeholder="Write a comment..." value={commentDraft} onChange={e => setCommentDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { addComment(selected.id, commentDraft); } }} />
                  <Button onClick={() => addComment(selected.id, commentDraft)} className="btn-brand">Add</Button>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
        </Modal.Footer>
      </Modal>
      </Container>
    </section>
  );
};

export default Thoughts;