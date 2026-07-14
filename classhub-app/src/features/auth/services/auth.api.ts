import { api } from '../../../core/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthApi = {

  async login(email: string, password: string) {
    const res = await api.post('/login', { email, password });

    const token = res.data.data.token;

    await AsyncStorage.setItem('token', token);

    return token;
  },

  async me() {
    const response = await api.get('/me');
    return response.data.data.user;
  },

  async logout() {
    await AsyncStorage.removeItem('token');
  },

  async register (
    name: string,
    email: string,
    password: string,
    role: string,
  ) {
    const { data } = await api.post('/register', {
      name,
      email,
      password,
      role,
    });

    return data;
  },
};