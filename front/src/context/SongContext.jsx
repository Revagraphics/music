import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/api';

const SongContext = createContext(null);

export function SongProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api
      .getSongs()
      .then((loadedSongs) => {
        if (active) setSongs(loadedSongs);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'Failed to load songs');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <SongContext.Provider value={{ songs, loading, error }}>
      {children}
    </SongContext.Provider>
  );
}

export function useSongs() {
  const context = useContext(SongContext);

  if (!context) {
    throw new Error('useSongs must be used inside SongProvider');
  }

  return context;
}