import axios from 'axios';
import { useAuthStore } from '../store/authStore.js';

// Prefer an explicit env value; otherwise call the backend on the same host
// the page was opened from (so LAN/IP access works without hard-coding).
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:4000/api`;

export const api = axios.create({ baseURL });

// Attach the JWT to every request when available.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Log the user out on 401 responses.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
