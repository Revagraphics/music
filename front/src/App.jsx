import { useCallback, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AudioPlayer from './components/AudioPlayer';
import Header from './components/Header';
import SongsDrawer from './components/SongsDrawer';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import { usePlayer } from './context/PlayerContext';
import { useSongs } from './context/SongContext';

import BubbleBlower from './components/BubbleBlower';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const songsOpen = location.pathname === '/songs';
  const closeSongs = useCallback(() => navigate('/'), [navigate]);
  const { songs } = useSongs();
  const { currentSong, prepareSong } = usePlayer();

  useEffect(() => {
    if (songs.length && !currentSong) prepareSong(songs[0], songs);
  }, [songs, currentSong, prepareSong]);

  return (
    <div className="relative min-h-screen bg-cocoa">
      <Header />
      <BubbleBlower/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/songs" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {songsOpen && <SongsDrawer onClose={closeSongs} />}

      {/* Persistent player — stays mounted across route changes so audio
          never stops when you navigate between Home and Songs. */}
      <AudioPlayer />
    </div>
  );
}

export default App;
