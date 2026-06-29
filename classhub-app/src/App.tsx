import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Firebase test function
//import { testFirestoreWrite } from './services/firebase/firestore';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Prueba de conexión Firebase
    // testFirestoreWrite();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <Text style={styles.text}>ClassHub</Text>
        <Text style={styles.subtext}>Firebase Firestore Test</Text>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtext: {
    marginTop: 10,
    fontSize: 14,
    opacity: 0.6,
  },
});

export default App;