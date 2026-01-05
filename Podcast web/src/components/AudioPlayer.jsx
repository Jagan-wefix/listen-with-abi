import React from 'react';
import { Card } from 'react-bootstrap';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const AudioPlayer = ({
  audioRef,
  isPlaying,
  currentTime,
  duration,
  volume,
  loading,
  currentEpisode,
  play,
  pause,
  seek,
  setVolumeLevel,
  formatTime,
  showCommentBoxes,
  setShowCommentBoxes,
  interactions,
  toggleLike,
  addComment
}) => {
  if (!currentEpisode) return null;

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    seek(newTime);
  };

  const handleVolumeChange = (e) => {
    setVolumeLevel(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    setVolumeLevel(volume === 0 ? 1 : 0);
  };

  const CommentForm = ({ episodeId, onAdd }) => {
    const [text, setText] = React.useState('')
    return (
      <div className="d-flex gap-2">
        <input className="form-control form-control-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a comment..." />
        <button className="btn btn-brand btn-sm" onClick={() => { onAdd(text); setText('') }}>Add</button>
      </div>
    )
  }





  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;



  return (
    <>
      <audio ref={audioRef} />
      <div className="audio-player-container">
        <Card className="audio-player-card">
          <div className="audio-player-content">
            <div className="episode-info">
              <img 
                src={currentEpisode.thumbnail} 
                alt={currentEpisode.title}
                className="episode-thumbnail"
              />
              <div className="episode-details">
                <h6 className="episode-title">{currentEpisode.title}</h6>
                <p className="episode-meta">Listen with Abi</p>
              </div>
            </div>

            <div className="player-controls">
              <button
                className="play-pause-btn"
                onClick={isPlaying ? pause : () => play(currentEpisode)}
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : isPlaying ? (
                  <Pause size={20} />
                ) : (
                  <Play size={20} />
                )}
              </button>

              <div className="progress-container">
                <span className="time-display">{formatTime(currentTime)}</span>
                <div 
                  className="progress-bar-container"
                  onClick={handleProgressClick}
                >
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="time-display">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="volume-control">
              <button className="volume-btn" onClick={toggleMute}>
                {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>

            </div>




          </div>
        </Card>
      </div>
    </>
  );
};

export default AudioPlayer;