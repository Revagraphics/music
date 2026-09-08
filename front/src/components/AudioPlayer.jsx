import { useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

function formatTime(s) {
  if (!s || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${sec}`;
}

const AudioPlayer = () => {
  const {
    currentSong,
    playbackError,
    isPlaying,
    progress,
    duration,
    togglePlay,
    next,
    prev,
    volume,
    setVolume,
    seekTo,
    repeat,
    shuffle,
    toggleRepeat,
    toggleShuffle,
  } = usePlayer();

  const pct = duration ? Math.min(100, (progress / duration) * 100) : 0;
  const hasTrack = Boolean(currentSong);
  const seekbarRef = useRef(null);
  const draggingRef = useRef(false);

  const seekFromPointer = (e) => {
    if (!hasTrack || !duration || !seekbarRef.current) return;
    const rect = seekbarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.min(1, Math.max(0, x / rect.width));
    seekTo(duration * ratio);
  };

  const handleSeekPointerDown = (e) => {
    if (!hasTrack) return;
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    seekFromPointer(e);
  };

  const handleSeekPointerMove = (e) => {
    if (draggingRef.current) seekFromPointer(e);
  };

  const stopSeeking = (e) => {
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center px-3 md:px-4 pb-3 md:pb-4 pointer-events-none">
      <div
        className="pointer-events-auto w-full max-w-2xl rounded-2xl p-3 md:p-4 flex flex-col gap-2.5 text-white border border-cream/10 shadow-2xl bg-green/40 backdrop-blur-md"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Cover + title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={`w-11 h-11 rounded-full border-2 border-turmeric/40 overflow-hidden flex-shrink-0 bg-panel ${
                isPlaying ? 'animate-vinyl' : ''
              }`}
              style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
            >
              {hasTrack ? (
                <img
                  src={currentSong.coverImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted">
                  <i className="ri-music-2-line" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-body font-semibold leading-tight truncate">
                {currentSong?.title || 'Nothing queued'}
              </h4>
              <span className="text-[11px] text-muted truncate block">
                {currentSong?.artist || 'Pick a track to start listening'}
              </span>
            </div>
          </div>

          {/* Transport controls */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <button
              onClick={toggleRepeat}
              disabled={!hasTrack}
              aria-label={repeat ? 'Disable repeat' : 'Enable repeat'}
              aria-pressed={repeat}
              title={repeat ? 'Disable repeat' : 'Repeat current song'}
              className={`transition disabled:opacity-30 ${repeat ? 'text-turmeric' : 'text-white hover:text-cream'}`}
            >
              <i className="ri-repeat-2-line text-lg" />
            </button>
            <button
              onClick={prev}
              disabled={!hasTrack}
              aria-label="Previous track"
              className="text-white hover:text-cream disabled:opacity-30 disabled:hover:text-cream/70 transition"
            >
              <i className="ri-skip-back-fill text-lg" />
            </button>
            <button
              onClick={togglePlay}
              disabled={!hasTrack}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-turmeric text-white flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition shadow-glow"
            >
              <i className={isPlaying ? 'ri-pause-fill text-lg' : 'ri-play-fill text-lg'} />
            </button>
            <button
              onClick={next}
              disabled={!hasTrack}
              aria-label="Next track"
              className="text-white hover:text-cream disabled:opacity-30 disabled:hover:text-cream/70 transition"
            >
              <i className="ri-skip-forward-fill text-lg" />
            </button>
            <button
              onClick={toggleShuffle}
              disabled={!hasTrack}
              aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
              aria-pressed={shuffle}
              title={shuffle ? 'Disable shuffle' : 'Shuffle queue'}
              className={`transition disabled:opacity-30 ${shuffle ? 'text-turmeric' : 'text-white hover:text-cream'}`}
            >
              <i className="ri-shuffle-line text-lg" />
            </button>

            {/* Volume — hidden on very small screens */}
            <div className="hidden sm:flex items-center gap-1.5 ml-1">
              <i className="ri-volume-down-line text-muted text-sm" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-16 md:w-20 accent-turmeric"
              />
              <i className="ri-volume-up-line text-muted text-sm" />
            </div>
          </div>
        </div>

        {playbackError && (
          <p className="text-[11px] text-red-200 truncate" role="alert">
            {playbackError}
          </p>
        )}

        {/* Seek bar */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-muted px-0.5">
          <span className="w-8  text-right">{formatTime(progress)}</span>
          <div
            ref={seekbarRef}
            onClick={seekFromPointer}
            onPointerDown={handleSeekPointerDown}
            onPointerMove={handleSeekPointerMove}
            onPointerUp={stopSeeking}
            onPointerCancel={stopSeeking}
            className={`flex-1 h-2 touch-none bg-white/35 rounded-full relative group ${
              hasTrack ? 'cursor-pointer' : 'cursor-not-allowed'
            }`}
          >
            <div
              style={{ width: `${pct}%` }}
              className="h-full rounded-full bg-turmeric duration-150"
            />
            <div
              className="absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-white bg-cocoa shadow-lg transition-[left] duration-150"
              style={{ left: `${pct}%` }}
              aria-hidden="true"
            >
              {currentSong?.coverImage ? (
                <img
                  src={currentSong.coverImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <i className="ri-music-2-line flex h-full w-full items-center justify-center text-xs text-turmeric" />
              )}
            </div>
          </div>
          <span className="w-8">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
