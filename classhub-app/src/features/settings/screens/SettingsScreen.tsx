import { View } from 'react-native';

import {
  Button,
  List,
  Switch,
  Text,
} from 'react-native-paper';

import { useAuthStore } from '../../auth/store/auth.store';
import { useThemeStore } from '../../../theme/theme.store';

export const SettingsScreen = () => {

  const { logout } = useAuthStore();

    const mode = useThemeStore(
    state => state.mode
    );

    const toggleTheme = useThemeStore(
    state => state.toggleTheme
    );


  return (
    <View
      style={{
        flex: 1,
        padding: 16,
      }}
    >
      <Text variant="headlineSmall">
        Ajustes
      </Text>

      
<List.Item
  title="Modo oscuro"
  right={() => (
    <Switch
      value={mode === 'dark'}
      onValueChange={toggleTheme}
    />
  )}
/>


      <Button
        mode="contained"
        onPress={logout}
      >
        Cerrar sesión
      </Button>
    </View>
  );
};