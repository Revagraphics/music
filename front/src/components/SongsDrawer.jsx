import { useEffect, useMemo, useRef, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useSongs } from '../context/SongContext';

export default function SongsDrawer({ onClose }) {
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  const { songs, loading, error } = useSongs();
  const { playSong, currentSong, isPlaying, formatDate } = usePlayer();

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return songs;

    return songs.filter((song) =>
      [song.title, song.artist, song.movie]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(value))
    );
  }, [songs, query]);

  useEffect(() => {
    searchRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Song library">
      <button
        type="button"
        aria-label="Close song library"
        onClick={onClose}
        className="absolute inset-0 w-full cursor-default bg-black/45 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full flex-col bg-[#ce9353] text-cream shadow-2xl md:w-[min(30rem,100vw)] md:max-w-[30rem]">
        <div className="flex items-start justify-between border-b border-cream/10 px-5 pb-4 pt-6 md:px-7">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-turmeric">The library</p>
            <h2 className="mt-1 font-display text-3xl">All songs</h2>
            <p className="mt-1 font-body text-sm text-muted">Choose a track to start listening.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close song library"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/10 text-cream/80 transition hover:border-turmeric/60 hover:text-turmeric"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        <div className="px-5 py-4 md:px-7">
          <label className="relative block">
            <span className="sr-only">Search songs</span>
            <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, singer, album"
              className="w-full rounded-lg border border-cream/10 bg-white/5 py-3 pl-10 pr-4 font-body text-sm text-cream outline-none placeholder:text-muted focus:border-turmeric/70"
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-28 md:px-7">
          {loading && <p className="py-8 text-center font-body text-sm text-muted">Loading songs...</p>}
          {!loading && error && <p className="py-8 text-center font-body text-sm text-red-200">{error}</p>}

          {!loading && !error && (
            <ol className="divide-y divide-cream/10 border-y border-cream/10">
              {filtered.map((song, index) => {
                const active = currentSong?.id === song.id;

                return (
                  <li key={song.id}>
                    <button
                      type="button"
                      onClick={() => playSong(song, filtered)}
                      className={`flex w-full items-center gap-3 py-3 text-left transition hover:bg-white/5 ${
                        active ? 'text-turmeric' : 'text-cream'
                      }`}
                    >
                      <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-md bg-white/5">
                        {song.coverImage && <img src={song.coverImage} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <span className="w-5 flex-shrink-0 text-center font-mono text-xs text-muted">
                        {active && isPlaying ? '♪' : index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-body text-sm">{song.title}</span>
                        <span className="block truncate font-body text-xs text-muted">
                          {song.artist}{song.movie ? ` · ${song.movie}` : ''}{song.createdAt ? ` · ${formatDate(song.createdAt)}` : ''}
                        </span>
                      </span>
                      <i className={`ri-${active && isPlaying ? 'pause' : 'play'}-mini-fill flex-shrink-0 text-lg ${active ? 'text-turmeric' : 'text-muted'}`} />
                    </button>
                  </li>
                );
              })}
              {!filtered.length && <li className="py-8 text-center font-body text-sm text-muted">Nothing matches &quot;{query}&quot;.</li>}
            </ol>
          )}
        </div>
      </aside>
    </div>
  );
}