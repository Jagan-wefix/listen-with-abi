import React from 'react';
import { Card } from 'react-bootstrap';
import { Play, Pause, Heart, MessageCircle, Share2, ChevronsUp } from 'lucide-react';

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

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: currentEpisode.title, url });
      } catch (e) {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('Episode link copied to clipboard');
      } catch (e) {
        alert('Unable to copy link');
      }
    }
  };

  const toggleCommentBox = (episodeId) => {
    setShowCommentBoxes(prev => ({ ...(prev || {}), [episodeId]: !prev?.[episodeId] }));
  }

  const CommentForm = ({ onAdd }) => {
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

            <div className="interaction-controls">
              <button className={`interaction-btn like-btn ${interactions[currentEpisode.id]?.liked ? 'liked' : ''}`} onClick={() => toggleLike(currentEpisode.id)} title="Like">
                <Hear t size={16} /> <span className="ms-1 small">{interactions[currentEpisode.id]?.likes || 0}</span>
              </button>

              <button className="interaction-btn comment-btn" onClick={() => toggleCommentBox(currentEpisode.id)} title="Comments">
                <MessageCircle size={16} />
              </button>

              <button className="interaction-btn share-btn" onClick={handleShare} title="Share">
                <Share2 size={16} />
              </button>
            </div>

            {/* Comments panel */}
            {showCommentBoxes?.[currentEpisode.id] && (
              <div className="comments-panel">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <strong>Comments</strong>
                  <button className="btn btn-sm btn-outline-utility comment-toggle-btn" onClick={() => toggleCommentBox(currentEpisode.id)} aria-label="Toggle comments">
                    <ChevronsUp size={14} />
                  </button>
                </div>

                <div className="comment-list mb-2">
                  {(interactions[currentEpisode.id]?.comments || []).length === 0 && (
                    <div className="text-muted small">No comments yet</div>
                  )}
                  {(interactions[currentEpisode.id]?.comments || []).map((c, idx) => (
                    <div className="comment-item mb-2" key={idx}>
                      <div className="small text-muted">{new Date(c.createdAt).toLocaleString()}</div>
                      <div>{c.text}</div>
                    </div>
                  ))}
                </div>

                <CommentForm onAdd={(text) => addComment(currentEpisode.id, text)} />
              </div>
            )}
            )

          </div>
        </Card>
      </div>
    </>
  );
};

export default AudioPlayer;