import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Play, Pause, Download, Users, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { podcastInfo, fetchEpisodes } from '../data/podcastData';
import { fetchLatestThought } from '../data/firestoreService';
import EpisodeCard from '../components/EpisodeCard';
import SpotifyEpisodes from '../components/SpotifyEpisodes';

const Homepage = ({ audioPlayer }) => {
  const { isPlaying, currentEpisode, play, pause, loading } = audioPlayer;
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const featuredEpisode = episodes.find(ep => ep.featured) || episodes[0];
  const latestEpisodes = episodes.slice(0, 3);
  // We'll fetch Spotify latest for playing directly from homepage
  const [spotifyLatest, setSpotifyLatest] = useState([]);
  const [latestThought, setLatestThought] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadEpisodes() {
      try {
        setFetchError(null);
        setLoadingEpisodes(true);
        const items = await fetchEpisodes();
        if (mounted) setEpisodes(items);
      } catch (err) {
        console.error('Failed to load episodes', err);
        if (mounted) setFetchError(err.message || String(err));
      } finally {
        if (mounted) setLoadingEpisodes(false);
      }
    }
    loadEpisodes();

    // fetch spotify latest separately
    (async () => {
      try {
        const s = await import('../components/SpotifyEpisodes').then(m => m.loadSpotifyEpisodes());
        if (mounted) setSpotifyLatest(s || []);
      } catch (err) {
        console.warn('Failed to load spotify latest', err);
      }
    })();

    // fetch latest thought (single recent item)
    (async () => {
      try {
        const t = await fetchLatestThought();
        if (mounted) setLatestThought(t);
      } catch (err) {
        console.warn('Failed to load latest thought', err);
      }
    })();

    return () => (mounted = false);
  }, []);

  const retryLoad = async () => {
    setFetchError(null);
    setLoadingEpisodes(true);
    try {
      const items = await fetchEpisodes();
      setEpisodes(items);
    } catch (err) {
      console.error('Retry failed to load episodes', err);
      setFetchError(err.message || String(err));
    } finally {
      setLoadingEpisodes(false);
    }
  };

  const navigate = useNavigate();

  const handleHeroPlay = () => {
    // Play latest Spotify episode if available, else fall back to featured/web episode
    const sp = spotifyLatest && spotifyLatest.length > 0 ? spotifyLatest[0] : null;
    if (sp) {
      // if we have a direct mp3, play it; otherwise navigate to Spotify Fire page
      if (sp.mp3Url) {
        const target = {
          id: sp.id,
          title: sp.title,
          description: sp.description,
          audioUrl: sp.mp3Url,
          thumbnail: sp.image || podcastInfo.cover || '',
        }
        const isCurrentEpisode = currentEpisode?.id === target?.id;
        const isCurrentlyPlaying = isCurrentEpisode && isPlaying;
        if (isCurrentlyPlaying) {
          pause();
        } else {
          play(target);
        }
        return;
      } else {
        // no direct mp3 available — take user to Spotify page
        navigate('/spotify-fire');
        return;
      }
    }

    // fallback
    const target = featuredEpisode;
    if (!target) return;
    const isCurrentEpisode = currentEpisode?.id === target?.id;
    const isCurrentlyPlaying = isCurrentEpisode && isPlaying;

    if (isCurrentlyPlaying) {
      pause();
    } else {
      play(target);
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
                    variant="cta"
                    className="hero-play-btn"
                    onClick={handleHeroPlay}
                    disabled={loadingEpisodes || (loading && currentEpisode?.id === featuredEpisode?.id)}
                  >
                    {loading && currentEpisode?.id === featuredEpisode?.id ? (
                      <div className="loading-spinner-small me-2"></div>
                    ) : (currentEpisode?.id === featuredEpisode?.id && isPlaying) ? (
                      <Pause size={20} className="me-2" />
                    ) : (
                      <Play size={20} className="me-2" />
                    )}
                    {(currentEpisode?.id === featuredEpisode?.id && isPlaying) ? 'Pause Latest' : 'Play Latest Episode'}
                  </Button>
                </div>
            
                {latestThought && (
                  <div className="mt-4">
                    <Card className="p-3 latest-thought-card">
                      <div className="d-flex align-items-start gap-3">
                        <div style={{minWidth: 56}}>
                          <div className="thought-thumb" style={{width:56,height:56,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700}}>{(latestThought.title||'T').slice(0,2).toUpperCase()}</div>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-1">{latestThought.title}</h5>
                          <div className="text-muted small mb-2">{latestThought.createdAt && latestThought.createdAt.toDate ? latestThought.createdAt.toDate().toLocaleDateString() : ''}</div>
                          <div className="text-white-75" style={{whiteSpace:'pre-wrap'}}>{(latestThought.content||'').slice(0,160)}{(latestThought.content||'').length>160 ? '…' : ''}</div>
                          <div className="mt-2">
                            <Button as={Link} to="/thoughts" className="btn-brand btn-sm d-inline-flex align-items-center" style={{padding: '0.45rem 0.9rem'}}>
                              See all thoughts <ArrowRight size={14} className="ms-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
          </Col>
          
          <Col lg={6}>
            <div className="hero-image">
              <img 
                src={podcastInfo.thumbnail}
                alt="Featured Episode"
                className="featured-image"
              />
            </div>
          </Col>
          </Row>
        </Container>
      </section>



      {/* Latest Episodes */}
      <section className="latest-episodes">
        <Container>
          <Row className="align-items-center mb-3">
            <Col>
              <h2 className="section-title">Latest Episodes</h2>
              <p className="section-subtitle">Catch up on our most recent Episode</p>
            </Col>
  
          </Row>

          <Row>
            {fetchError ? (
              <Col>
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Failed to load episodes:</strong> {fetchError}
                  </div>
                  <div>
                    <button className="btn btn-sm btn-outline-light" onClick={retryLoad}>Retry</button>
                  </div>
                </div>
              </Col>
            ) : (
              <Col>
                <SpotifyEpisodes rssUrl="https://anchor.fm/s/133292dc/podcast/rss" latestCount={3} audioPlayer={audioPlayer} allLink="/spotify-fire" />
              </Col>
            )}
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
                  src="https://open.spotify.com/embed/episode/5NkwPvAZG8j9hX8A97rxWv?utm_source=generator" 
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
