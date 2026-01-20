import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor para adicionar JWT automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para renovar token automaticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Se o erro for 401 e não for uma tentativa de retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (storedRefreshToken) {
        try {
          const response = await api.post('/auth/refresh', { refreshToken: storedRefreshToken });
          const { token, refreshToken: newRefreshToken } = response.data;
          
          // Atualizar tokens no localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Atualizar header da requisição original
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // Repetir a requisição original
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh falhou - limpar tokens e redirecionar para login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// REPLICATE
export const generateVideo = (data) =>
  api.post('/replicate/generate-video', data);

export const generateImage = (prompt, model) =>
  api.post('/replicate/generate-image', { prompt, model });

export const getPrediction = (predictionId) =>
  api.get(`/replicate/prediction/${predictionId}`);

// AUTH
export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (name, email, password) =>
  api.post('/auth/register', { name, email, password });

// Renovar token
export const refreshToken = (refreshToken) =>
  api.post('/auth/refresh', { refreshToken });

// Logout
export const logoutUser = (refreshToken) =>
  api.post('/auth/logout', { refreshToken });

// SESSIONS (exemplo de rota protegida)
export const getSessions = () =>
  api.get('/sessions');

// ASSETS
export const getAssets = () =>
  api.get('/assets');

export const uploadAsset = (formData) =>
  api.post('/assets/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export const deleteAsset = (assetId) =>
  api.delete(`/assets/${assetId}`);

export default api;
