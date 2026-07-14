import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useAuthStore } from '../../auth/store/auth.store';

export const SettingsScreen = ({ navigation }: any) => {

  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineSmall">
        Ajustes
      </Text>

      <Button
        mode="contained"
        onPress={handleLogout}
      >
        Cerrar sesión
      </Button>
    </View>
  );
};