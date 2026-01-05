import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../data/firebase';

const Thoughts = () => {
  const [thoughts, setThoughts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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

  if (loading) {
    return (
      <Container>
        <Row>
          <Col>
            <h1 style={{color: 'white'}}>Thoughts</h1>
            <p>Loading...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1 style={{color: 'white'}}>Thoughts</h1>
          {thoughts.length === 0 ? (
            <p>No thoughts posted yet.</p>
          ) : (
            thoughts.map(thought => (
              <Card key={thought.id} className="mb-4">
                <Card.Body>
                  <Card.Title>{thought.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {thought.createdAt && thought.createdAt.toDate ? thought.createdAt.toDate().toLocaleDateString() : ''}
                  </Card.Subtitle>
                  <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{thought.content}</Card.Text>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Thoughts;