import axios from 'axios';
import { useAuthStore } from '../store/auth.store';
import { API_URL } from '../../../core/config/env';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Obtener escuelas del usuario
export const fetchUserSchools = async () => {
  const response = await api.get('/me');

  return response.data.data.user.schools;
};
