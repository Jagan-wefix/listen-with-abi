import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { MessageSquare } from 'lucide-react';

export default function ThoughtCard({ thought, onOpen, onAddComment }) {
  const excerpt = thought.content.length > 260 ? thought.content.slice(0, 260) + '…' : thought.content;
  const date = thought.createdAt && thought.createdAt.toDate ? thought.createdAt.toDate() : new Date();
  const readingMinutes = Math.max(1, Math.round(thought.content.split(/\s+/).length / 200));
  const tags = thought.tags || [];

  return (
    <Card className="thought-card mb-4">
      <Card.Body className="d-flex gap-3">
        <div className="thought-thumb d-flex align-items-center justify-content-center text-white">{(thought.title || 'T').slice(0,2).toUpperCase()}</div>
        <div className="flex-grow-1">
          <div className="d-flex align-items-start justify-content-between gap-2">
            <div>
              <Card.Title className="mb-1">{thought.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-white small">{date.toLocaleDateString()} • {readingMinutes} min read</Card.Subtitle>
            </div>
            <div className="d-flex gap-1 align-items-start">
              {/* Like / Save / Share buttons removed as requested */}
            </div>
          </div>

          <Card.Text className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>{excerpt}</Card.Text>

          <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="d-flex gap-2 align-items-center flex-wrap">
              {tags.map(t => <Badge key={t} bg="secondary" className="tag-chip">#{t}</Badge>)}
            </div>
            <div className="d-flex gap-2 align-items-center">
              <Button className="btn-outline-brand" size="sm" onClick={() => onOpen(thought)}>Read more</Button>
              <Button variant="outline-secondary" size="sm" onClick={() => onAddComment(thought.id)}><MessageSquare size={14} /></Button>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
