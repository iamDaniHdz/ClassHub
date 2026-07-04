import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/env';
import { useAuthStore } from '../../features/auth/store/auth.store';

export const api = axios.create({
  baseURL: API_URL,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error getting token:', error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {

    const { response } = error;

    if (response && response.status === 401) {

      console.log('Token expirado - cerrando sesión');

      try {
        await useAuthStore.getState().logout();
      } catch (e) {
        console.warn('Error en logout:', e);
      }
    }

    return Promise.reject(error);
  }
);