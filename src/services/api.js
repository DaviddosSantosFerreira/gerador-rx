import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const register = (name, email, password) => {
  return api.post('/auth/register', { name, email, password });
};

// Replicate - Image Generation
export const generateImage = (prompt) => {
  return api.post('/replicate/generate-image', { prompt });
};

// Replicate - Video Generation
export const generateVideo = (data) => {
  return api.post('/replicate/generate-video', data);
};

export const getPrediction = (id) => {
  return api.get(`/replicate/prediction/${id}`);
};

export const updateSession = (sessionId, data) => {
  return api.post(`/replicate/update-session/${sessionId}`, data);
};

// Sessions
export const getSessions = (userId) => {
  return api.get(`/sessions/${userId}`);
};

export const getSession = (id) => {
  return api.get(`/sessions/session/${id}`);
};

// Assets
export const getAssets = (userId) => {
  return api.get(`/assets/${userId}`);
};

export const uploadAsset = (formData) => {
  return api.post('/assets/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteAsset = (id) => {
  return api.delete(`/assets/${id}`);
};

export const toggleFavoriteAsset = (id, favorite) => {
  return api.patch(`/assets/${id}`, { favorite });
};

