import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../features/auth/screens/LoginScreen';

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);