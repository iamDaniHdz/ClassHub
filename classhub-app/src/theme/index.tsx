import {
  MD3LightTheme,
  MD3DarkTheme,
} from 'react-native-paper';
import { mode } from '../services/themes';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...mode.light,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...mode.dark,
  },
};