import axios from 'axios';

const api = axios.create({
  // Ganti dengan URL backend Vercel Anda
  baseURL: 'https://dq-univerze-api.vercel.app/api',
  withCredentials: true,
});

// Interceptor untuk menyertakan Token JWT secara otomatis jika ada di localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;