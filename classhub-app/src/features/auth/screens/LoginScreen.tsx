import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useAuthStore } from '../store/auth.store';

export const LoginScreen = ({ navigation }: any) => {

  const { login, loading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      await login(email, password);

      navigation.replace('Dashboard');
    } catch(err:any){
        if (!err.response) {
            setError('No se pudo conectar al servidor');
            return;
        }

        if (err.response.status === 401 || err.response.status === 422) {
            setError('Credenciales incorrectas');
        } else {
            setError('Error del servidor');
        }
    }
  };

  return (
    <View>

      <TextInput placeholder="Email" onChangeText={setEmail}/>
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />

      <Button
        title={loading ? 'Cargando...' : 'Login'}
        onPress={handleLogin}
      />

      {error ? <Text>{error}</Text> : null}

    </View>
  );
};