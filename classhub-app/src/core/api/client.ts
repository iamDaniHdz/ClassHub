import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/env';
import { useAuthStore } from '../../features/auth/store/auth.store';

export const api = axios.create({
  baseURL: API_URL,
});

// REQUEST → token automático
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE → manejo 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {

    const { response } = error;

    // Detectar sesión expirada
    if (response && response.status === 401) {

      console.log('Token expirado - cerrando sesión');

      try {
        await AsyncStorage.removeItem('token');
      } catch (storageError) {
        console.warn('Error limpiando token:', storageError);
      }

      // Limpiar estado global
      useAuthStore.getState().logout();

    }

    return Promise.reject(error);
  }
);