import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
  </Stack.Navigator>
);