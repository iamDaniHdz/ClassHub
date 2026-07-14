import { useThemeStore } from './theme.store';
import { mode } from './themes';

export const useAppTheme = () => {
  const selectedMode = useThemeStore(
    state => state.mode
  );

  return mode[selectedMode];
};