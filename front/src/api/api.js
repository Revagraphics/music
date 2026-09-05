const API_URL = import.meta.env.VITE_API_URL || 'https://music-1-vm7s.onrender.com';

const mediaUrl = (value) => {
  if (!value || value.startsWith('http://') || value.startsWith('https://')) {
    return value || '';
  }

  return `${API_URL}${value.startsWith('/') ? value : `/${value}`}`;
};

const normalizeSong = (song) => ({
  ...song,
  id: song._id,
  movie: song.album || '',
  coverImage: mediaUrl(song.coverImage),
  audioUrl: mediaUrl(song.audioUrl),
});

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const api = {
  async getSongs() {
    const response = await fetch(`${API_URL}/api/songs`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to load songs');
    }

    return data.songs.map(normalizeSong);
  },

  async loginAdmin(username, password) {
    const data = await request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return data.token;
  },

  async getAdminSongs(token) {
    const data = await request('/api/songs/admin/all', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.songs.map(normalizeSong);
  },

  async createSong(token, formData) {
    const data = await request('/api/songs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return normalizeSong(data.song);
  },

  async updateSong(token, id, updates) {
    const data = await request(`/api/songs/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
    return normalizeSong(data.song);
  },

  async deleteSong(token, id) {
    return request(`/api/songs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
