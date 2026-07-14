import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useAuthStore } from '../../auth/store/auth.store';

export const ProfileScreen = () => {
  const { user } = useAuthStore();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineSmall">
        Perfil
      </Text>

      <Text>
        {user?.name}
      </Text>

      <Text>
        {user?.email}
      </Text>
    </View>
  );
};
