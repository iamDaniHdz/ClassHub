import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
  Image,
} from 'react-native';
import { useAuthStore } from '../store/auth.store';
import { Text, Button, TextInput, useTheme, Checkbox, Icon } from 'react-native-paper'; // Importamos Checkbox
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

export const LoginScreen = ({ navigation }: any) => {
  const { login, loading } = useAuthStore();
  const { colors } = useTheme() as any;
  const isDarkMode = useColorScheme() === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Estado para el Checkbox

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setError('');
      await login(email, password);
    } catch (err: any) {
      if (!err.response) {
        setError('No se pudo conectar al servidor');

        setTimeout(() => {
          setError('');
        }, 4000);
        return;
      }
      console.log(err.response);
      if (err.response.status === 422) {
        setError('Credenciales incorrectas');
        setTimeout(() => {
          setError('');
        }, 4000);
      } else if (err.response?.status === 401) {
        setError('Sesión expirada, inicia sesión nuevamente');
        setTimeout(() => {
          setError('');
        }, 4000);
      } else {
        setError('Error del servidor');
        setTimeout(() => {
          setError('');
        }, 4000);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView} edges={['left', 'right', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={[
                colors.gradientPrimary,
                colors.gradientSecondary,
                colors.gradientTerciary,
              ]}
              style={styles.gradientBackground}
            >

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.content, {backgroundColor:colors.backgroundShadow}]}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/classhub-logo.png')}
                style={[{ width: 100, height: 100 }]}
              />
            </View>

            <Text variant="headlineMedium" style={[styles.title, {color:colors.titleColor}]}>
              ¡Bienvenido de nuevo!
            </Text>

            <Text style={[styles.subtitle, {color:colors.gray}]}>
              Ingresa tu correo y contraseña para iniciar sesión
            </Text>

            {/* INPUT CORREO */}

            <Text style={{color:colors.gray}}>
              Correo
            </Text>

            <TextInput
              placeholder="example@gmail.com"
              mode="outlined"
              style={[styles.input, {backgroundColor:colors.backgroundShadow}]}
              activeOutlineColor= {colors.primary}
              outlineStyle = {{borderRadius:14, borderWidth: 1}}
              outlineColor={colors.backgroundShadow}
              textColor={colors.textColor}
              placeholderTextColor={colors.gray}
              keyboardType="email-address"
              value={email}
              onChangeText={text => setEmail(text)}
            />

            {/* INPUT CONTRASEÑA */}

            <Text style={{color:colors.gray}}>
              Contraseña
            </Text>

            <TextInput
              activeOutlineColor= {colors.primary}
              outlineStyle = {{borderRadius:14, borderWidth: 1,}}
              placeholder="*********"
              secureTextEntry={!showPassword}
              mode="outlined"
              outlineColor={colors.backgroundShadow}
              style={[styles.input, {backgroundColor:colors.backgroundShadow}]}
              textColor={colors.textColor}
              placeholderTextColor={colors.gray}
              value={password}
              onChangeText={pass => setPassword(pass)}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  color={colors.gray}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <View style={styles.rowBetween}>
              <View style={styles.rememberMeContainer}>
                <Checkbox
                  status={rememberMe ? 'checked' : 'unchecked'}
                  onPress={() => setRememberMe(!rememberMe)}
                  color={colors.primary}
                />
                <Text style={{color:colors.gray}}>Recordarme</Text>
              </View>
              <TouchableOpacity onPress={() => console.log('Forgot Password')}>
                <Text style={[styles.forgotPasswordText, {color:colors.primary}]}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
            </View>

            {/* MENSAJE DE ERROR */}
            <View style={{ height: 40, justifyContent: 'center' }}>
              {error ? (
                <View
                  style={{
                    backgroundColor: colors.textErrorBackground,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    display:'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon source={"alert-circle"} size={24} color={colors.textError} />
                  <Text variant='labelLarge' style={{ color: colors.textError, paddingHorizontal: 10 }}>
                    {error || 'Ocurrio un error'}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* BOTÓN LOGIN */}
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={[styles.loginButton]}
              labelStyle={styles.loginButtonLabel}
            >
              Iniciar sesión
            </Button>

            {/* REGISTRARSE */}
            <View style={styles.footerRow}>
              <Text style={{color:colors.gray}}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.signUpText, {color:colors.primary}]}>Registrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#FF8FC7',
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  content: {
    padding: 24,
    borderRadius: 28,
    marginHorizontal: 20,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14,
  },
  input: {
    marginBottom: 16,
    marginTop: 5,
    borderRadius: 14,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    height: 56,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  forgotPasswordText: {
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 14,
    paddingVertical: 6,
    marginTop: 10,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  signUpText: {
    fontWeight: 'bold',
  },
});