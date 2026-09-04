import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import App from './App.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';
import { SongProvider } from './context/SongContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlayerProvider>
        <SongProvider>
          <App />
        </SongProvider>
      </PlayerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
