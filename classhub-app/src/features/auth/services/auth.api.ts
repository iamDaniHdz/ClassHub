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
    const res = await api.get('/me');
    return res.data.data;
  },

  async logout() {
    await AsyncStorage.removeItem('token');
  }
};