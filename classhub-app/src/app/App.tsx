import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
} from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';

import { lightTheme, darkTheme } from '../theme';

import { useAuthStore } from '../features/auth/store/auth.store';
import { useThemeStore } from '../theme/theme.store';

import { AuthNavigator } from '../navigation/AuthNavigator';
import { AppNavigator } from '../navigation/AppNavigator';

function App(): React.JSX.Element {
  const { user, bootstrap, initializing } = useAuthStore();

  const mode = useThemeStore(
    state => state.mode
  );

  const hydrateTheme = useThemeStore(
    state => state.hydrateTheme
  );

  const theme =
    mode === 'dark'
      ? darkTheme
      : lightTheme;

  useEffect(() => {
    bootstrap();
    hydrateTheme();
  }, []);

  if (initializing) {
    return (
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                theme.colors.background,
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        </SafeAreaProvider>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>

        <StatusBar
          backgroundColor={
            theme.colors.background
          }
          barStyle={
            mode === 'dark'
              ? 'light-content'
              : 'dark-content'
          }
        />

        <NavigationContainer>
          {user ? (
            <AppNavigator />
          ) : (
            <AuthNavigator />
          )}
        </NavigationContainer>

      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default App;