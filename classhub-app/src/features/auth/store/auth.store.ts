import { create } from 'zustand';
import { AuthApi } from '../services/auth.api';

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
    await AuthApi.logout();
    set({ user: null });
  }

}));