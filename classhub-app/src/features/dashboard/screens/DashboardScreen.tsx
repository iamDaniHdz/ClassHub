import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useAuthStore } from '../../auth/store/auth.store';

export const DashboardScreen = ({ navigation }: any) => {

  const { user, bootstrap, logout } = useAuthStore();

  useEffect(() => {
    bootstrap();
  }, []);

  return (
    <View>

      <Text>Dashboard</Text>

      {user && (
        <>
          <Text>Nombre: {user.name}</Text>
          <Text>Email: {user.email}</Text>

          {user.role && (
            <Text>Rol: {user.role.name}</Text>
          )}
        </>
      )}

        <Button
            title="Logout"
            onPress={async () => {
            await logout();
            navigation.replace('Login');
            }}
        />

        <Button
            title="CONSOLE"
            onPress={async () => {
                console.log(user);
                
            }}
        />

    </View>
  );
};