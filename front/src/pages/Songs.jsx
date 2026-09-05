import { useMemo, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useSongs } from '../context/SongContext';

export default function Songs() {
  const [query, setQuery] = useState('');
  const { songs, loading, error } = useSongs();
  const { playSong, currentSong, isPlaying, formatDate } = usePlayer();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.movie.toLowerCase().includes(q)
    );
  }, [songs, query]);

  return (
    <div className="min-h-screen bg-[#ce9353] backdrop-blur-sm pt-28 pb-40 px-6 md:px-12">
      <h1 className="font-display text-3xl md:text-4xl text-cream mb-2">All songs</h1>
      <p className="text-black font-body mb-6">Every track in the deck.</p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search title, singer, movie…"
        className="w-full max-w-md mb-8 px-4 py-2.5 rounded-lg bg-panel border border-turmeric/20 text-black placeholder:text-black font-body text-sm focus:outline-none focus:border-turmeric"
      />

      {loading && <p className="text-muted font-body text-sm">Loading songs...</p>}
      {!loading && error && <p className="text-red-200 font-body text-sm">{error}</p>}

      {!loading && !error && <ol className="divide-y divide-turmeric/10 border-t border-b border-turmeric/10">
        {filtered.map((song, i) => {
          const active = currentSong?.id === song.id;
          return (
            <li
              key={song.id}
              onClick={() => playSong(song, filtered)}
              className={`flex items-center gap-4 py-3.5 px-2 cursor-pointer hover:bg-panel transition-colors ${
                active ? 'text-turmeric' : 'text-cream'
              }`}
            >
              <div className="w-9 h-9 rounded-md overflow-hidden flex-shrink-0 bg-panel">
                <img src={song.coverImage} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="font-mono text-xs w-6 text-muted flex-shrink-0">
                {active && isPlaying ? '♪' : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-body text-sm md:text-base truncate">{song.title}</p>
                <p className="font-body text-xs text-muted truncate">
                  {song.artist} · {song.movie} · {formatDate(song.createdAt)}
                </p>
              </div>
            </li>
          );
        })}
        {!filtered.length && (
          <li className="py-8 text-center text-muted font-body text-sm">
            Nothing matches "{query}".
          </li>
        )}
      </ol>}
    </div>
  );
}
