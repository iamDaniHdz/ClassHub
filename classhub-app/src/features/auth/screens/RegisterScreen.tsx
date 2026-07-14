import React, { useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
} from 'react-native';
import { useAuthStore } from '../store/auth.store';
import { Text, Button, TextInput, useTheme, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export const RegisterScreen = ({ navigation }: any) => {
  const { register, loading } = useAuthStore();
  const { colors } = useTheme() as any;
  const isDarkMode = useColorScheme() === 'dark';

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const statusBarHeight =
    Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  const handleRegister = async () => {
    try {
      setError('');

      if (!name.trim()) {
        setError('Ingresa tu nombre');
        setTimeout(() => {
          setError('');
        }, 4000);
        return;
      }

      if (!email.trim()) {
        setError('Ingresa tu correo');
        setTimeout(() => {
          setError('');
        }, 4000);
        return;
      }

      if (!password) {
        setError('Ingresa una contraseña');
        setTimeout(() => {
          setError('');
        }, 4000);
        return;
      }

      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        setTimeout(() => {
          setError('');
        }, 4000);
        return;
      }

      await register(name, email, password, 'teacher');

      setSuccess('Cuenta creada correctamente');

      setTimeout(() => {
        navigation.replace('Login');
      }, 2000);
    } catch (err: any) {
      console.log(err.response);

      if (!err.response) {
        setError('No se pudo conectar al servidor');
        return;
      }

      if (err.response.status === 422) {
        setError(err.response.data.message);
      } else {
        setError('Error del servidor');
      }

      setTimeout(() => {
        setError('');
      }, 4000);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeAreaView]}
      edges={['left', 'right', 'bottom']}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <ScrollView
        style={{ backgroundColor: colors.loginBackground }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ImageBackground
          source={require('../../../assets/classhub_background.png')}
          style={[styles.header, { paddingTop: statusBarHeight }]}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text
            variant="headlineMedium"
            style={{
              color: colors.primary,
              marginBottom: 25,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Registrate
          </Text>

          <Text
            style={{ color: (colors as any).labelTextColor }}
            variant="labelLarge"
          >
            Nombre completo
          </Text>
          <TextInput
            activeOutlineColor={colors.inputActiveBorderColor}
            outlineColor={colors.inputBorderColor}
            style={[
              styles.input,
              { backgroundColor: (colors as any).textInputBackground },
            ]}
            left={
              <TextInput.Icon icon="account" size={24} color={colors.primary} />
            }
            textColor={(colors as any).inputTextColor}
            placeholderTextColor={(colors as any).inputTextColor}
            mode="outlined"
            keyboardType="default"
            value={name}
            onChangeText={text => setName(text)}
            cursorColor={(colors as any).textColor}
          />

          <Text
            style={{ color: (colors as any).labelTextColor }}
            variant="labelLarge"
          >
            Correo electrónico
          </Text>
          <TextInput
            activeOutlineColor={colors.inputActiveBorderColor}
            outlineColor={colors.inputBorderColor}
            style={[
              styles.input,
              { backgroundColor: (colors as any).textInputBackground },
            ]}
            left={
              <TextInput.Icon icon="email" size={24} color={colors.primary} />
            }
            textColor={(colors as any).inputTextColor}
            placeholderTextColor={(colors as any).inputTextColor}
            mode="outlined"
            keyboardType="email-address"
            value={email}
            onChangeText={text => setEmail(text)}
            cursorColor={(colors as any).textColor}
          />

          <Text
            style={{ color: (colors as any).labelTextColor }}
            variant="labelLarge"
          >
            Contraseña
          </Text>
          <TextInput
            secureTextEntry={!showPassword}
            activeOutlineColor={colors.inputActiveBorderColor}
            outlineColor={colors.inputBorderColor}
            style={[
              styles.input,
              { backgroundColor: (colors as any).textInputBackground },
            ]}
            textColor={(colors as any).inputTextColor}
            placeholderTextColor={(colors as any).inputTextColor}
            mode="outlined"
            keyboardType="default"
            value={password}
            onChangeText={pass => setPassword(pass)}
            cursorColor={(colors as any).textColor}
            left={
              <TextInput.Icon icon="lock" size={24} color={colors.primary} />
            }
            right={
              <TextInput.Icon
                color={(colors as any).primary}
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Text
            style={{ color: (colors as any).labelTextColor }}
            variant="labelLarge"
          >
            Confirmar contraseña
          </Text>
          <TextInput
            secureTextEntry={!showConfirmPassword}
            activeOutlineColor={colors.inputActiveBorderColor}
            outlineColor={colors.inputBorderColor}
            style={[
              styles.input,
              { backgroundColor: (colors as any).textInputBackground },
            ]}
            textColor={(colors as any).inputTextColor}
            placeholderTextColor={(colors as any).inputTextColor}
            mode="outlined"
            keyboardType="default"
            value={confirmPassword}
            onChangeText={pass => setConfirmPassword(pass)}
            cursorColor={(colors as any).textColor}
            left={
              <TextInput.Icon icon="lock" size={24} color={colors.primary} />
            }
            right={
              <TextInput.Icon
                color={(colors as any).primary}
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />

          <View style={{ height: 40 }}>
            {error ? (
              <View
                style={{
                  backgroundColor: colors.backgroundErrorColor,
                  padding: 10,
                  alignSelf: 'center',
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: colors.textErrorColor,
                    paddingHorizontal: 10,
                  }}
                >
                  {error}
                </Text>
              </View>
            ) : null}

            {success ? (
              <View
                style={{
                  backgroundColor: colors.backgroundSuccessColor,
                  padding: 10,
                  alignSelf: 'center',
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: colors.textSuccessColor,
                    paddingHorizontal: 10,
                  }}
                >
                  {success}
                </Text>
              </View>
            ) : null}
          </View>
          

          {loading && <ProgressBar indeterminate={true} color={colors.primary} />}

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={{
              marginTop: 30,
              backgroundColor: colors.primary,
            }}
          >
            <Text>Crear cuenta</Text>
          </Button>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 5,
              marginTop: 15,
            }}
          >
            <Text style={{ color: colors.labelTextColor }}>
              ¿Ya tienes una cuenta?
            </Text>
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
              <Text style={{ color: colors.primary }}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  input: {
    marginTop: 5,
    marginBottom: 15,
  },
  header: {
    width: '100%',
    height: 240,
  },
  content: {
    flex: 1,
    padding: 25,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
  },
});
