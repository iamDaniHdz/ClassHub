import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
import { AdminScreen } from '../features/admin/screens/AdminScreen';
import { UsersScreen } from '../features/admin/screens/UsersScreen';
import { TeacherScreen } from '../features/teacher/screens/TeacherScreen';
import { ClassesScreen } from '../features/teacher/screens/ClassesScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />

      {/* ADMIN */}
      <Stack.Screen name="Admin" component={AdminScreen} />
      <Stack.Screen name="Users" component={UsersScreen} />

      {/* TEACHER */}
      <Stack.Screen name="Teacher" component={TeacherScreen} />
      <Stack.Screen name="Classes" component={ClassesScreen} />

    </Stack.Navigator>
  );
};