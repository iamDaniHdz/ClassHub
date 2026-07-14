import { create } from 'zustand';
import { AuthApi } from '../services/auth.api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface School {
  id: number;
  name: string;
}

interface AuthState {
  user: any | null;
  loading: boolean;
  initializing: boolean;

  schools: School[];
  currentSchoolId: number | null;

  login: (email: string, password: string) => Promise<void>;
  bootstrap: () => Promise<void>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;

  setCurrentSchool: (schoolId: number) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({

  user: null,
  loading: false,
  initializing: true,

  schools: [],
  currentSchoolId: null,

  // LOGIN
  login: async (email, password) => {
    set({ loading: true });

    try {
      await AuthApi.login(email, password);

      const user = await AuthApi.me();

      set({
        user,
        schools: user.schools || [],
        loading: false
      });

    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (name, email, password, role) => {
    set({ loading: true });

    try {
      await AuthApi.register(
        name,
        email,
        password,
        role
      );

      set({
        loading: false
      });

    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // BOOTSTRAP
  bootstrap: async () => {
    try {
      const user = await AuthApi.me();

      const savedSchool = await AsyncStorage.getItem('school_id');

      set({
        user,
        schools: user.schools || [],
        currentSchoolId: savedSchool ? Number(savedSchool) : null,
        initializing: false
      });

    } catch {
      set({
        user: null,
        initializing: false
      });
    }
  },

  // SELECCIONAR ESCUELA
  setCurrentSchool: async (schoolId) => {
    await AsyncStorage.setItem('school_id', String(schoolId));

    set({ currentSchoolId: schoolId });
  },

  // LOGOUT
  logout: async () => {
    try {
      await AuthApi.logout();
    } finally {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('school_id');

      set({
        user: null,
        schools: [],
        currentSchoolId: null
      });
    }
  }

}));