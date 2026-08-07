import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useAuthStore } from '../store/auth.store';
import {
  Text,
  Button,
  TextInput,
  useTheme,
  Icon,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

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

      setError('')
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
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[
          colors.gradientPrimary,
          colors.gradientSecondary,
          colors.gradientTertiary,
        ]}
        style={styles.gradientBackground}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.content, {backgroundColor:colors.backgroundShadow}]}>
            <Text variant="headlineMedium" style={[styles.title, {color:colors.titleColor}]}>
              ¡Registrate!
            </Text>

            <Text style={[styles.subtitle, { color: colors.gray }]}>
              Crea tu cuenta para continuar
            </Text>

            {/* INPUT NOMBRE */}
            <Text style={{ color: colors.gray }}>Nombre completo</Text>
            <TextInput
              placeholder="Daniel Hernández"
              mode="outlined"
              style={[styles.input, {backgroundColor:colors.backgroundShadow}]}
              activeOutlineColor={colors.primary}
              outlineColor={colors.backgroundShadow}
              outlineStyle={{ borderRadius: 14, borderWidth: 1 }}
              textColor={colors.textColor}
              placeholderTextColor={colors.gray}
              value={name}
              onChangeText={text => setName(text)}
            />

            {/* INPUT CORREO */}
            <Text style={{ color: colors.gray }}>Correo electronico</Text>
            <TextInput
              placeholder="example@gmail.com"
              mode="outlined"
              style={[styles.input, {backgroundColor:colors.backgroundShadow}]}
              activeOutlineColor={colors.primary}
              outlineStyle={{ borderRadius: 14, borderWidth: 1 }}
              textColor={colors.textColor}
              outlineColor={colors.backgroundShadow}
              placeholderTextColor={colors.gray}
              keyboardType="email-address"
              value={email}
              onChangeText={text => setEmail(text)}
            />

            {/* INPUT CONTRASEÑA */}
            <Text style={{ color: colors.gray }}>Contraseña</Text>
            <TextInput
              activeOutlineColor={colors.primary}
              outlineStyle={{ borderRadius: 14, borderWidth: 1 }}
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

            <Text style={{ color: colors.gray }}>Confirmar contraseña</Text>
            <TextInput
              activeOutlineColor={colors.primary}
              outlineStyle={{ borderRadius: 14, borderWidth: 1 }}
              placeholder="*********"
              secureTextEntry={!showPassword}
              mode="outlined"
              outlineColor={colors.backgroundShadow}
              style={[styles.input, {backgroundColor:colors.backgroundShadow}]}
              textColor={colors.textColor}
              placeholderTextColor={colors.gray}
              value={confirmPassword}
              onChangeText={pass => setConfirmPassword(pass)}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  color={colors.gray}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />

            <View style={{ height: 40 }}>
              {error ? (
                <View
                  style={{
                    backgroundColor: colors.textErrorBackground,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon
                    source={'alert-circle'}
                    size={24}
                    color={colors.textError}
                  />
                  <Text
                    variant="labelLarge"
                    style={{ color: colors.textError, paddingHorizontal: 10 }}
                  >
                    {error || 'Ocurrio un error'}
                  </Text>
                </View>
              ) : null}

              {success ? (
                <View
                  style={{
                    backgroundColor: colors.textSuccessBackground,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon
                    source={'check-circle'}
                    size={24}
                    color={colors.textSuccess}
                  />
                  <Text
                    variant="labelLarge"
                    style={{ color: colors.textSuccess, paddingHorizontal: 10 }}
                  >
                    {success || 'Exito'}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* BOTÓN REGISTER */}
            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={[styles.registerButton]}
              labelStyle={styles.registerButtonLabel}
            >
              Crear cuenta
            </Button>

            {/* REGISTRARSE */}
            <View style={styles.footerRow}>
              <Text style={{ color: colors.gray }}>
                ¿Ya tienes una cuenta?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text style={[styles.signUpText, { color: colors.primary }]}>
                  Inicia sesión
                </Text>
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
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  policityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  policityText: {
    fontWeight: '600',
    fontSize: 14,
  },
  registerButton: {
    borderRadius: 14,
    paddingVertical: 6,
    marginTop: 10,
  },
  registerButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
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
