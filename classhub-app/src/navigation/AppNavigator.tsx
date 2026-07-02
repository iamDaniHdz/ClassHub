import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';

// Admin
import { AdminScreen } from '../features/admin/screens/AdminScreen';
import { UsersScreen } from '../features/admin/screens/UsersScreen';

// Teacher
import { TeacherScreen } from '../features/teacher/screens/TeacherScreen';
import { ClassesScreen } from '../features/teacher/screens/ClassesScreen';

import { useAuthStore } from '../features/auth/store/auth.store';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {

  const { user } = useAuthStore();

  return (
    <Stack.Navigator>

      <Stack.Screen name="Dashboard" component={DashboardScreen} />

      {/* ADMIN STACK */}
      {user?.role?.key === 'admin' && (
        <>
          <Stack.Screen name="Admin" component={AdminScreen} />
          <Stack.Screen name="Users" component={UsersScreen} />
        </>
      )}

      {/* TEACHER STACK */}
      {user?.role?.key === 'teacher' && (
        <>
          <Stack.Screen name="Teacher" component={TeacherScreen} />
          <Stack.Screen name="Classes" component={ClassesScreen} />
        </>
      )}

    </Stack.Navigator>
  );
};