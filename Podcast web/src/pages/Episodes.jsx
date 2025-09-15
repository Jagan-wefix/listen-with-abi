import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { episodes } from '../data/podcastData';
import EpisodeCard from '../components/EpisodeCard';

const Episodes = ({ audioPlayer }) => {
  const { isPlaying, currentEpisode, play, loading } = audioPlayer;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

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
  }, [searchTerm, sortOrder]);

  return (
    <div className="episodes-page">
      <Container>
        <Row>
          <Col>
            <div className="page-header">
              <h1 className="page-title">All Episodes</h1>
              <p className="page-subtitle">
                Browse our complete library of {episodes.length} episodes
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
                variant={sortOrder === 'newest' ? 'primary' : 'outline-primary'}
                onClick={() => setSortOrder('newest')}
                className="sort-btn"
              >
                <SortDesc size={16} className="me-1" />
                Newest First
              </Button>
              <Button
                variant={sortOrder === 'oldest' ? 'primary' : 'outline-primary'}
                onClick={() => setSortOrder('oldest')}
                className="sort-btn ms-2"
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
            <p className="results-info">
              Showing {filteredAndSortedEpisodes.length} of {episodes.length} episodes
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </Col>
        </Row>

        {/* Episodes Grid */}
        <Row>
          {filteredAndSortedEpisodes.length > 0 ? (
            filteredAndSortedEpisodes.map(episode => (
              <Col lg={4} md={6} className="mb-4" key={episode.id}>
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
                  variant="primary" 
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