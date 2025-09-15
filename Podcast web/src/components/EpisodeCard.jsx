import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Play, Pause, Calendar, Clock, TrendingUp } from 'lucide-react';

const EpisodeCard = ({ episode, isPlaying, currentEpisode, onPlay, loading }) => {
  const isCurrentEpisode = currentEpisode?.id === episode.id;
  const isCurrentlyPlaying = isCurrentEpisode && isPlaying;

  return (
    <Card className="episode-card h-100">
      <div className="episode-card-image">
        <img 
          src={episode.thumbnail} 
          alt={episode.title}
          className="card-img-top"
        />
        <div className="play-overlay">
          <button 
            className="play-overlay-btn"
            onClick={() => onPlay(episode)}
            disabled={loading && isCurrentEpisode}
          >
            {loading && isCurrentEpisode ? (
              <div className="loading-spinner-overlay"></div>
            ) : isCurrentlyPlaying ? (
              <Pause size={24} />
            ) : (
              <Play size={24} />
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
        <Card.Title className="episode-card-title">{episode.title}</Card.Title>
        <Card.Text className="episode-description">
          {episode.description}
        </Card.Text>
        
        <div className="episode-meta">
          <div className="meta-item">
            <Calendar size={14} />
            <span>{new Date(episode.date).toLocaleDateString()}</span>
          </div>
          <div className="meta-item">
            <Clock size={14} />
            <span>{episode.duration}</span>
          </div>
          <div className="meta-item">
            <TrendingUp size={14} />
            <span>{episode.plays} plays</span>
          </div>
        </div>

        <button 
          className="episode-play-btn"
          onClick={() => onPlay(episode)}
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
              Pause
            </>
          ) : (
            <>
              <Play size={16} />
              Play Episode
            </>
          )}
        </button>
      </Card.Body>
    </Card>
  );
};

export default EpisodeCard;