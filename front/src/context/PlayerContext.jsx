import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const queueRef = useRef([]);
  const indexRef = useRef(-1);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState('');
  const [volume, setVolumeState] = useState(0.8);

  // Create the underlying <audio> element once and wire up its events.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMeta = () => {
      const audioDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
      setDuration(audioDuration);
      setCurrentSong((song) => (song ? { ...song, duration: audioDuration } : song));
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => next();
    const onError = () => {
      setIsPlaying(false);
      setPlaybackError(`Unable to play ${audio.src || 'this audio file'}.`);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMeta);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMeta);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAndPlay = useCallback((song) => {
    const audio = audioRef.current;
    if (!audio || !song) return;
    if (audio.src !== song.audioUrl) {
      audio.src = song.audioUrl;
      audio.load();
      setProgress(0);
      setDuration(0);
    }
    setPlaybackError('');
    setCurrentSong(song);
    audio.play().catch((error) => {
      if (error.name !== 'AbortError') {
        setPlaybackError(error.message || 'Unable to play this audio file.');
      }
    });
  }, []);

  const playSong = useCallback(
    (song, list) => {
      const nextQueue = list && list.length ? list : queueRef.current;
      const idx = nextQueue.findIndex((s) => s.id === song.id);
      queueRef.current = nextQueue;
      indexRef.current = idx === -1 ? 0 : idx;
      loadAndPlay(nextQueue[indexRef.current] ?? song);
    },
    [loadAndPlay]
  );

  const next = useCallback(() => {
    if (!queueRef.current.length) return;
    indexRef.current = (indexRef.current + 1) % queueRef.current.length;
    loadAndPlay(queueRef.current[indexRef.current]);
  }, [loadAndPlay]);

  const prev = useCallback(() => {
    if (!queueRef.current.length) return;
    indexRef.current =
      (indexRef.current - 1 + queueRef.current.length) % queueRef.current.length;
    loadAndPlay(queueRef.current[indexRef.current]);
  }, [loadAndPlay]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (audio.paused) {
      audio.play().catch((error) => {
        if (error.name !== 'AbortError') {
          setPlaybackError(error.message || 'Unable to play this audio file.');
        }
      });
    }
    else audio.pause();
  }, [currentSong]);

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const seekTo = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(time)) return;
    audio.currentTime = time;
    setProgress(time);
  }, []);

  const formatDate = useCallback((value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  const value = useMemo(
    () => ({
      currentSong,
      playbackError,
      isPlaying,
      progress,
      duration,
      volume,
      playSong,
      togglePlay,
      next,
      prev,
      setVolume,
      seekTo,
      formatDate,
    }),
    [
      currentSong,
      playbackError,
      isPlaying,
      progress,
      duration,
      volume,
      playSong,
      togglePlay,
      next,
      prev,
      setVolume,
      seekTo,
      formatDate,
    ]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside a PlayerProvider');
  return ctx;
}
