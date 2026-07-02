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
            title="Dashboard Maestro"
            onPress={() => navigation.navigate('Teacher')}
          />
          <Button
            title="Clases"
            onPress={() => navigation.navigate('Classes')}
          />
        </>
      )}

      <Button
        title="Logout"
        onPress={async () => {
          await logout();
          navigation.replace('Login');
        }}
      />
    </View>
  );
};
