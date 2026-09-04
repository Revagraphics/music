import { useEffect, useRef, useState } from 'react';
import { api } from '../api/api';

const tokenKey = 'music_admin_token';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const token = await api.loginAdmin(username, password);
      localStorage.setItem(tokenKey, token);
      onLogin(token);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#ce9353] px-5 pb-32 pt-32 text-[#20150f] md:px-12">
      <div className="mx-auto max-w-md rounded-2xl border border-[#20150f]/10 bg-white/60 p-7 shadow-xl backdrop-blur-md md:p-9">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#a86b00]">Private studio</p>
        <h1 className="mt-2 font-display text-4xl">Admin access</h1>
        <p className="mt-2 font-body text-sm text-[#20150f]/60">Manage the music library from one place.</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" autoComplete="username" className="w-full rounded-lg border border-[#20150f]/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#a86b00]" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" autoComplete="current-password" className="w-full rounded-lg border border-[#20150f]/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#a86b00]" />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button disabled={busy} className="w-full rounded-lg bg-[#20150f] px-4 py-3 font-body text-sm text-white transition hover:bg-[#a86b00] disabled:opacity-50">
            {busy ? 'Checking...' : 'Open dashboard'}
          </button>
        </form>
      </div>
    </main>
  );
}

function UploadBox({ token, onCreated }) {
  const inputRef = useRef(null);
  const [audio, setAudio] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [form, setForm] = useState({ title: '', artist: '', album: '', genre: '' });
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!audio) return setError('Choose an audio file first.');
    setBusy(true);
    setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      data.append('audio', audio);
      if (coverImage) data.append('coverImage', coverImage);
      const song = await api.createSong(token, data);
      onCreated(song);
      setAudio(null);
      setCoverImage(null);
      setForm({ title: '', artist: '', album: '', genre: '' });
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusy(false);
    }
  };

  const acceptAudio = (file) => {
    if (file?.type.startsWith('audio/')) {
      setAudio(file);
      setForm((current) => ({ ...current, title: current.title || file.name.replace(/\.[^.]+$/, '') }));
    } else {
      setError('Please choose an audio file.');
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-[#20150f]/10 bg-white/70 p-5 shadow-lg backdrop-blur-md md:p-7">
      <div className="flex items-center justify-between gap-4">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#a86b00]">New release</p><h2 className="mt-1 font-display text-2xl">Add a song</h2></div>
        <i className="ri-upload-cloud-2-line text-2xl text-[#a86b00]" />
      </div>
      <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); acceptAudio(event.dataTransfer.files[0]); }} className={`mt-5 flex min-h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 text-center transition ${dragging ? 'border-[#a86b00] bg-[#a86b00]/10' : 'border-[#20150f]/20 bg-[#f4eee4]/70'}`}>
        <i className="ri-music-2-line text-2xl text-[#a86b00]" />
        <span className="mt-2 text-sm font-medium">{audio ? audio.name : 'Drop audio here or browse'}</span>
        <span className="mt-1 text-xs text-[#20150f]/50">MP3, WAV, or OGG · up to 50 MB</span>
      </button>
      <input ref={inputRef} type="file" accept="audio/*" className="hidden" onChange={(event) => acceptAudio(event.target.files[0])} />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {['title', 'artist', 'album', 'genre'].map((field) => <input key={field} required={field === 'title' || field === 'artist'} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} placeholder={field[0].toUpperCase() + field.slice(1)} className="rounded-lg border border-[#20150f]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#a86b00]" />)}
      </div>
      <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-lg border border-[#20150f]/10 bg-white px-3 py-2.5 text-xs text-[#20150f]/60"><i className="ri-image-add-line text-lg text-[#a86b00]" />{coverImage ? coverImage.name : 'Optional cover image'}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => setCoverImage(event.target.files[0])} /></label>
      {error && <p className="mt-3 text-xs text-red-700">{error}</p>}
      <button disabled={busy} className="mt-4 w-full rounded-lg bg-[#20150f] px-4 py-3 text-sm text-white transition hover:bg-[#a86b00] disabled:opacity-50">{busy ? 'Uploading...' : 'Upload song'}</button>
    </form>
  );
}

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey));
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(Boolean(token));

  const loadSongs = async (activeToken = token) => {
    try {
      setLoading(true);
      setSongs(await api.getAdminSongs(activeToken));
    } catch (loadError) {
      setError(loadError.message);
      if (loadError.message.toLowerCase().includes('token')) logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) loadSongs(token); }, [token]);

  const logout = () => { localStorage.removeItem(tokenKey); setToken(null); setSongs([]); };
  const update = async (id, updates) => { try { const song = await api.updateSong(token, id, updates); setSongs((items) => items.map((item) => item.id === id ? { ...item, ...song } : item)); } catch (updateError) { setError(updateError.message); } };
  const remove = async (song) => { if (!window.confirm(`Delete "${song.title}"?`)) return; try { await api.deleteSong(token, song.id); setSongs((items) => items.filter((item) => item.id !== song.id)); } catch (deleteError) { setError(deleteError.message); } };

  if (!token) return <Login onLogin={setToken} />;

  return (
    <main className="min-h-screen bg-[#f4eee4] px-5 pb-32 pt-28 text-[#20150f] md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#a86b00]">Control room</p><h1 className="mt-2 font-display text-5xl">Your library</h1><p className="mt-2 text-sm text-[#20150f]/60">Upload, publish, and curate every track.</p></div><button onClick={logout} className="rounded-full border border-[#20150f]/15 px-4 py-2 text-xs hover:border-[#a86b00]">Sign out</button></div>
        {error && <div className="mt-6 flex items-center justify-between rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800"><span>{error}</span><button onClick={() => setError('')} aria-label="Dismiss error"><i className="ri-close-line" /></button></div>}
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]"><UploadBox token={token} onCreated={(song) => setSongs((items) => [song, ...items])} /><section className="rounded-2xl border border-[#20150f]/10 bg-white/55 p-5 shadow-lg backdrop-blur-md md:p-7"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-[#20150f]/45">Catalogue</p><h2 className="mt-1 font-display text-2xl">{songs.length} tracks</h2></div><button onClick={() => loadSongs()} className="h-9 w-9 rounded-full border border-[#20150f]/15 hover:border-[#a86b00]" aria-label="Refresh songs"><i className="ri-refresh-line" /></button></div>{loading ? <p className="py-10 text-center text-sm text-[#20150f]/50">Loading catalogue...</p> : <div className="mt-5 divide-y divide-[#20150f]/10">{songs.map((song) => <article key={song.id} className="flex items-center gap-3 py-3"><div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-[#20150f]/10">{song.coverImage && <img src={song.coverImage} alt="" className="h-full w-full object-cover" />}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{song.title}</p><p className="truncate text-xs text-[#20150f]/55">{song.artist}{song.album ? ` · ${song.album}` : ''}</p></div><button onClick={() => update(song.id, { isPublished: !song.isPublished })} className={`rounded-full px-3 py-1 text-[11px] ${song.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-[#20150f]/10 text-[#20150f]/60'}`}>{song.isPublished ? 'Published' : 'Draft'}</button><button onClick={() => remove(song)} className="h-8 w-8 rounded-full text-red-700 hover:bg-red-100" aria-label={`Delete ${song.title}`}><i className="ri-delete-bin-6-line" /></button></article>)}</div>}</section></div>
      </div>
    </main>
  );
}