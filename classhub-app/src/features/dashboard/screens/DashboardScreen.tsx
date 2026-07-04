import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useAuthStore } from '../../auth/store/auth.store';
import { Button, Text } from 'react-native-paper';

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

          {user.role && <Text>Rol: {user.role.name}</Text>}
        </>
      )}

      {/* ADMIN */}
      {user?.role?.key === 'admin' && (
        <>
          <Button
            title="Panel Admin"
            onPress={() => navigation.navigate('Admin')}
          />
          <Button
            title="Usuarios"
            onPress={() => navigation.navigate('Users')}
          />
        </>
      )}

      {/* TEACHER */}
      {user?.role?.key === 'teacher' && (
        <>
          <Button
            mode="contained"
            style={{ marginTop: 16 }}
            onPress={() => navigation.navigate('Teacher')}
          >
            Dashboard Maestro
          </Button>

          <Button
            mode="contained"
            style={{ marginTop: 16 }}
            onPress={() => navigation.navigate('Classes')}
          >
            Clases
          </Button>
        </>
      )}

      <Button
        mode="contained"
        style={{ marginTop: 16 }}
        onPress={async () => {
          await logout();
          navigation.replace('Login');
        }}
      >
      Logout
      </Button>


      <Button
        mode="contained"
        style={{ marginTop: 16 }}
        onPress={() => navigation.navigate('Academies')}
      >
        Ver Academias
      </Button>

    </View>
  );
};
