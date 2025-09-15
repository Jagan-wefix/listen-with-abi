import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Play, Pause, Download, Users, Star, TrendingUp } from 'lucide-react';
import { episodes, podcastInfo } from '../data/podcastData';
import EpisodeCard from '../components/EpisodeCard';

const Homepage = ({ audioPlayer }) => {
  const { isPlaying, currentEpisode, play, pause, loading } = audioPlayer;
  const featuredEpisode = episodes.find(ep => ep.featured) || episodes[0];
  const latestEpisodes = episodes.slice(0, 3);

  const handleHeroPlay = () => {
    const isCurrentEpisode = currentEpisode?.id === featuredEpisode.id;
    const isCurrentlyPlaying = isCurrentEpisode && isPlaying;
    
    if (isCurrentlyPlaying) {
      pause();
    } else {
      play(featuredEpisode);
    }
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6}>
              <div className="hero-content">
                <h1 className="hero-title">
                  Welcome to <span className="gradient-text">Listen with Abi Podcast</span>
                </h1>
                <p className="hero-description">
                 Listen with Abi is a Tamil-language self-help podcast that inspires, motivates, and guides listeners on their journey toward personal growth and mental well-being. Hosted by Abi, the show is a safe space where positivity meets practicality.
                </p>
                <div className="hero-actions">
                  <Button 
                    size="lg" 
                    className="hero-play-btn"
                    onClick={handleHeroPlay}
                    disabled={loading && currentEpisode?.id === featuredEpisode.id}
                  >
                    {loading && currentEpisode?.id === featuredEpisode.id ? (
                      <div className="loading-spinner-small me-2"></div>
                    ) : (currentEpisode?.id === featuredEpisode.id && isPlaying) ? (
                      <Pause size={20} className="me-2" />
                    ) : (
                      <Play size={20} className="me-2" />
                    )}
                    {(currentEpisode?.id === featuredEpisode.id && isPlaying) ? 'Pause Latest' : 'Play Latest Episode'}
                  </Button>

                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image">
                <img 
                  src="https://image-cdn-fa.spotifycdn.com/image/ab67656300005f1fc9bd0b9dd1dd191613f7c3fb"
                  alt="Featured Episode"
                  className="featured-image"
                />
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">{podcastInfo.totalEpisodes}+</span>
                    <span className="stat-label">Episodes</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{podcastInfo.totalDownloads}</span>
                    <span className="stat-label">Downloads</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <Container>
          <Row>
            <Col md={3} sm={6} className="mb-4">
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <TrendingUp size={40} className="stat-icon" />
                  <h3>{podcastInfo.avgListeners}</h3>
                  <p>Avg. Listeners</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <Download size={40} className="stat-icon" />
                  <h3>{podcastInfo.totalDownloads}</h3>
                  <p>Total Downloads</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <Users size={40} className="stat-icon" />
                  <h3>{podcastInfo.totalEpisodes}</h3>
                  <p>Episodes</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <Star size={40} className="stat-icon" />
                  <h3>{podcastInfo.rating}</h3>
                  <p>Rating</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Latest Episodes */}
      <section className="latest-episodes">
        <Container>
          <Row>
            <Col>
              <h2 className="section-title">Latest Episodes</h2>
              <p className="section-subtitle">Catch up on our most recent discussions</p>
            </Col>
          </Row>
          <Row>
            {latestEpisodes.map(episode => (
              <Col lg={4} md={6} className="mb-4" key={episode.id}>
                <EpisodeCard 
                  episode={episode}
                  isPlaying={isPlaying}
                  currentEpisode={currentEpisode}
                  onPlay={play}
                  loading={loading}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Spotify Embed Section */}
      <section className="spotify-section">
        <Container>
          <Row>
            <Col>
              <h2 className="section-title text-center">Listen on Spotify</h2>
              <p className="section-subtitle text-center">
                Subscribe and get notified when new episodes are released
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={8} className="mx-auto">
              <div className="spotify-embed-container">
                <iframe 
                  src="https://open.spotify.com/embed/show/4rOoJ6Egrf8K2IrywzwOMk" 
                  width="100%" 
                  height="352" 
                  frameBorder="0" 
                  allowTransparency="true" 
                  allow="encrypted-media"
                  title="Spotify Podcast Player"
                  className="spotify-iframe"
                ></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Homepage;