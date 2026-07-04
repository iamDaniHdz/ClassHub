import React, { useState } from 'react';
import { View } from 'react-native';
import { useAuthStore } from '../store/auth.store';
import { Text, Button, TextInput } from 'react-native-paper';

export const LoginScreen = ({ navigation }: any) => {

  const { login, loading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      await login(email, password);
    } catch(err:any){
      if (!err.response) {
        setError('No se pudo conectar al servidor');
        return;
      }
      console.log(err.response)
      if (err.response.status === 422) {
        setError('Credenciales incorrectas');
      } else if (err.response?.status === 401) {
        setError('Sesión expirada, inicia sesión nuevamente');
      } else {
        setError('Error del servidor');
      }
    }
  };

  return (
    <View>

      <TextInput placeholder="Email" onChangeText={setEmail}/>
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button mode="contained" onPress={handleLogin}>
        {loading ? 'Cargando...' : 'Login'}
      </Button>

      {error ? <Text>{error}</Text> : null}

    </View>
  );
};