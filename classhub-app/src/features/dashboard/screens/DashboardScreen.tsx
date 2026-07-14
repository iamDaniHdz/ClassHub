import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useAuthStore } from '../../auth/store/auth.store';
import { Button, Text } from 'react-native-paper';
import { useAppTheme } from '../../../theme/useAppTheme';

export const DashboardScreen = ({ navigation }: any) => {
  const { user, bootstrap } = useAuthStore();
  const theme = useAppTheme();

  useEffect(() => {
    bootstrap();
  }, []);

  return (
    <View style={{backgroundColor: theme.background}}>
      <Text>Dashboard</Text>

      {user && (
        <>
          <Text>Nombre: {user.name}</Text>
          <Text>Email: {user.email}</Text>

          {user.role && <Text>Rol: {user.role.name}</Text>}
        </>
      )}

    </View>
  );
};
