import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Play, Pause, Calendar, Clock } from 'lucide-react';
import { podcastInfo } from '../data/podcastData';

const EpisodeCard = ({ episode, isPlaying, currentEpisode, onPlay, loading, isActive = false }) => {
  const isCurrentEpisode = currentEpisode?.id === episode.id;
  // allow external/embedded players to mark an episode as active via `isActive`
  const isCurrentlyPlaying = isActive || (isCurrentEpisode && isPlaying);

  return (
    <Card className="episode-card h-100">
      <div className="episode-card-image">
        {(() => {
          const thumb = episode.thumbnail || podcastInfo.cover || '';
          return (
            <img
              src={thumb}
              alt={episode.title}
              className="card-img-top"
              loading="lazy"
              decoding="async"
            />
          );
        })()}
        <div className="play-overlay">
          <button 
            className="play-overlay-btn"
            onClick={() => {
              onPlay(episode);
              try { window.dispatchEvent(new CustomEvent('player:activate', { detail: { episodeId: episode.id } })); } catch (e) {}
            }}
            disabled={loading && isCurrentEpisode}
            aria-label={`Play ${episode.title}`}
          >
            {loading && isCurrentEpisode ? (
              <div className="loading-spinner-overlay"></div>
            ) : isCurrentlyPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} />
            )}
          </button>
        </div>
        {episode.featured && (
          <Badge bg="danger" className="featured-badge">
            Featured
          </Badge>
        )}
      </div>
      
      <Card.Body className="episode-card-body">
        <div className="episode-card-content">
          <div>
            <Card.Title className="episode-card-title">{episode.title}</Card.Title>
            <Card.Text className="episode-description">
              {episode.description}
            </Card.Text>
            <div className="episode-meta">
              <div className="meta-item">
                <span>{episode.date ? new Date(episode.date).toLocaleDateString() : ''}</span>
              </div>
              <div className="meta-item">
                <span>{episode.duration}</span>
              </div>
            </div>
          </div>

          <div className="play-button-compact">
            <button 
              className="episode-play-btn"
              onClick={() => {
                onPlay(episode);
                try { window.dispatchEvent(new CustomEvent('player:activate', { detail: { episodeId: episode.id } })); } catch (e) {}
              }}
              disabled={loading && isCurrentEpisode}
            >
              {loading && isCurrentEpisode ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Loading...
                </>
              ) : isCurrentlyPlaying ? (
                <>
                  <Pause size={16} />
                  <span className="d-none d-sm-inline"> Pause</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span className="d-none d-sm-inline"> Play</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EpisodeCard;