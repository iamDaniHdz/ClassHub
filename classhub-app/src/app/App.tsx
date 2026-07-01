import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { useAuthStore } from '../features/auth/store/auth.store';
import { AuthNavigator } from '../navigation/AuthNavigator';
import { AppNavigator } from '../navigation/AppNavigator';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const { user, bootstrap, initializing } = useAuthStore();

  useEffect(() => {
    bootstrap();
  }, []);

  // Splash / loading inicial (muy importante)
  if (initializing) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>

      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <NavigationContainer>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>

    </SafeAreaProvider>
  );
}

export default App;
