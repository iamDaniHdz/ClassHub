import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import {
  Button,
  Card,
  Divider,
  List,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAuthStore } from '../../auth/store/auth.store';
import { useThemeStore } from '../../../theme/theme.store';

export const SettingsScreen = ({ navigation }: any) => {
  const { colors } = useTheme() as any;

  const { logout } = useAuthStore();

  const mode = useThemeStore(
    state => state.mode
  );

  const toggleTheme = useThemeStore(
    state => state.toggleTheme
  );

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View>
          <View>
            <Text
              variant="headlineSmall"
              style={[
                styles.title,
                {
                  color: colors.titleColor,
                },
              ]}
            >
              Ajustes
            </Text>

            <Text
              variant="bodyLarge"
              style={{
                color: colors.textColor,
              }}
            >
              Personaliza tu experiencia
            </Text>
          </View>
        </View>

        {/* APARIENCIA */}
        <Text
          variant="labelLarge"
          style={[
            styles.sectionTitle,
            {
              color: colors.primary,
            },
          ]}
        >
          Apariencia
        </Text>

        <Card
          mode="contained"
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
            },
          ]}
        >
          <List.Item
            title="Modo oscuro"
            description={
              mode === 'dark'
                ? 'El modo oscuro está activado'
                : 'El modo claro está activado'
            }
            titleStyle={{
              color: colors.titleColor,
            }}
            descriptionStyle={{
              color: colors.textColor,
            }}
            left={() => (
              <View style={styles.listIcon}>
                <Ionicons
                  name={
                    mode === 'dark'
                      ? 'moon-outline'
                      : 'sunny-outline'
                  }
                  size={24}
                  color={colors.primary}
                />
              </View>
            )}
            right={() => (
              <Switch
                value={mode === 'dark'}
                onValueChange={toggleTheme}
              />
            )}
          />
        </Card>

        {/* CUENTA */}
        <Text
          variant="labelLarge"
          style={[
            styles.sectionTitle,
            {
              color: colors.primary,
            },
          ]}
        >
          Cuenta
        </Text>

        <Card
          mode="contained"
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
            },
          ]}
        >
          <List.Item
            title="Perfil"
            description="Administra tu información personal"
            titleStyle={{
              color: colors.titleColor,
            }}
            descriptionStyle={{
              color: colors.textColor,
            }}
            left={() => (
              <View style={styles.listIcon}>
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={colors.primary}
                />
              </View>
            )}
            onPress={() => {}}
          />

          <Divider />

          <List.Item
            title="Notificaciones"
            description="Configura tus preferencias"
            titleStyle={{
              color: colors.titleColor,
            }}
            descriptionStyle={{
              color: colors.textColor,
            }}
            left={() => (
              <View style={styles.listIcon}>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={colors.primary}
                />
              </View>
            )}
            onPress={() => {}}
          />

          <Divider />

          <List.Item
            title="Privacidad"
            description="Información y permisos"
            titleStyle={{
              color: colors.titleColor,
            }}
            descriptionStyle={{
              color: colors.textColor,
            }}
            left={() => (
              <View style={styles.listIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={24}
                  color={colors.primary}
                />
              </View>
            )}
            onPress={() => {}}
          />
        </Card>

        {/* INFORMACIÓN */}
        <Text
          variant="labelLarge"
          style={[
            styles.sectionTitle,
            {
              color: colors.primary,
            },
          ]}
        >
          Información
        </Text>

        <Card
          mode="contained"
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
            },
          ]}
        >
          <List.Item
            title="Acerca de Classhub"
            description="Información de la aplicación"
            titleStyle={{
              color: colors.titleColor,
            }}
            descriptionStyle={{
              color: colors.textColor,
            }}
            left={() => (
              <View style={styles.listIcon}>
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={colors.primary}
                />
              </View>
            )}
          />

          <Divider />

          <List.Item
            title="Versión"
            description="1.0.0"
            titleStyle={{
              color: colors.titleColor,
            }}
            descriptionStyle={{
              color: colors.textColor,
            }}
            left={() => (
              <View style={styles.listIcon}>
                <Ionicons
                  name="code-slash-outline"
                  size={24}
                  color={colors.primary}
                />
              </View>
            )}
          />
        </Card>

        {/* LOGOUT */}
        <Button
          mode="contained"
          icon="logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          contentStyle={styles.logoutContent}
          textColor={colors.white}
        >
          Cerrar sesión
        </Button>

        <Text
          variant="bodySmall"
          style={[
            styles.footer,
            {
              color: colors.textColor,
            },
          ]}
        >
          © Classhub
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },

  sectionTitle: {
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 20,
    marginLeft: 4,
  },

  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },

  listIcon: {
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },

  logoutButton: {
    marginTop: 32,
    borderRadius: 10,
  },

  logoutContent: {
    height: 48,
  },

  footer: {
    textAlign: 'center',
    marginTop: 20,
  },
});