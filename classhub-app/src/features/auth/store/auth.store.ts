import { create } from 'zustand';
import { AuthApi } from '../services/auth.api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: any | null;
  loading: boolean;
  initializing: boolean;

  login: (email: string, password: string) => Promise<void>;
  bootstrap: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({

  user: null,
  loading: false,
  initializing: true,

  // LOGIN
  login: async (email, password) => {
    set({ loading: true });

    try {
      await AuthApi.login(email, password);
      const user = await AuthApi.me();

      set({ user, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // AUTOLOGIN / BOOTSTRAP
  bootstrap: async () => {
    try {
      const user = await AuthApi.me();
      set({ user, initializing: false });
    } catch {
      set({ user: null, initializing: false });
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      await AuthApi.logout();
    } catch {
      // opcional: ignorar fallo backend
    } finally {
      await AsyncStorage.removeItem('token');
      set({ user: null });
    }
  }


}));