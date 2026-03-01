import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof document !== 'undefined') {
    const csrf = document.cookie.split('; ').find((row) => row.startsWith('csrf_token='))?.split('=')[1];
    if (csrf) config.headers['X-CSRF-Token'] = csrf;
  }
  return config;
});

export default api;
