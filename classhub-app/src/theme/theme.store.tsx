import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode =
  | 'light'
  | 'dark';

interface ThemeState {
  mode: ThemeMode;

  hydrateTheme: () => Promise<void>;

  toggleTheme: () => Promise<void>;
}

export const useThemeStore =
  create<ThemeState>((set, get) => ({
    mode: 'light',

    hydrateTheme: async () => {
      const savedTheme =
        await AsyncStorage.getItem(
          'theme'
        );

      if (
        savedTheme === 'light' ||
        savedTheme === 'dark'
      ) {
        set({
          mode: savedTheme,
        });
      }
    },

    toggleTheme: async () => {
      const nextTheme =
        get().mode === 'light'
          ? 'dark'
          : 'light';

      await AsyncStorage.setItem(
        'theme',
        nextTheme
      );

      set({
        mode: nextTheme,
      });
    },
  }));