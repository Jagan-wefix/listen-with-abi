import { useState, useRef, useEffect } from 'react';

export const useAudioPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  const [showCommentBoxes, setShowCommentBoxes] = useState({})

  // per-episode interactions (likes/comments) persisted in localStorage
  const storageKey = 'lwa_player_interactions_v1'
  const [interactions, setInteractions] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : {}
    } catch (e) { return {} }
  })

  const saveInteractions = (next) => {
    setInteractions(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch (e) {}
  }

  const toggleLike = (episodeId) => {
    const current = interactions[episodeId] || { liked: false, likes: 0, comments: [] }
    const liked = !current.liked
    const likes = liked ? (current.likes || 0) + 1 : Math.max(0, (current.likes || 1) - 1)
    const next = { ...interactions, [episodeId]: { ...current, liked, likes, comments: current.comments || [] } }
    saveInteractions(next)
  }

  const addComment = (episodeId, text) => {
    if (!text || !text.trim()) return
    const current = interactions[episodeId] || { liked: false, likes: 0, comments: [] }
    const comment = { text: text.trim(), createdAt: new Date().toISOString() }
    const next = { ...interactions, [episodeId]: { ...current, comments: [comment, ...(current.comments || [])], liked: current.liked, likes: current.likes || 0 } }
    saveInteractions(next)
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setLoading(true);
    const handleLoadedData = () => {
      setLoading(false);
      setDuration(audio.duration);
      setError(null);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleError = (e) => {
      setLoading(false);
      setError('Failed to load audio');
      console.error('Audio error:', e);
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentEpisode]);

  const play = (episode = null) => {
    if (!episode || !episode.audioUrl) return;
    if (episode !== currentEpisode) {
      setCurrentEpisode(episode);
      if (audioRef.current) {
        audioRef.current.src = episode.audioUrl;
      }
    }
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolumeLevel = (level) => {
    const clampedLevel = Math.max(0, Math.min(1, level));
    if (audioRef.current) {
      audioRef.current.volume = clampedLevel;
    }
    setVolume(clampedLevel);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    loading,
    error,
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
    addComment,
  };
};