import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';

// Admin
import { AdminScreen } from '../features/admin/screens/AdminScreen';
import { UsersScreen } from '../features/admin/screens/UsersScreen';

// Teacher
import { TeacherScreen } from '../features/teacher/screens/TeacherScreen';
import { ClassesScreen } from '../features/teacher/screens/ClassesScreen';

import { useAuthStore } from '../features/auth/store/auth.store';
import { SchoolSelectionScreen } from '../features/schoool/screens/SchoolSelectionScreen';
import { AcademiesScreen } from '../features/academies/screens/AcademiesScreen';
import { ClassroomsScreen } from '../features/classrooms/screens/ClassroomsScreen';
import { StudentsScreen } from '../features/students/screens/StudentsScreen';
import { StudentDetailScreen } from '../features/students/screens/StudentDetailScreen';
import { TabsNavigator } from './TabsNavigator';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {

  const { user, currentSchoolId } = useAuthStore();

  return (
    <Stack.Navigator>

      {!currentSchoolId ? (
        // Seleccionar escuela primero
        <Stack.Screen
          name="SchoolSelection"
          component={SchoolSelectionScreen}
        />
      ) : (
        <>
          <Stack.Screen
            name="MainTabs"
            component={TabsNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Academies" component={AcademiesScreen} />
          <Stack.Screen name="Classrooms" component={ClassroomsScreen} />
          <Stack.Screen name="Students" component={StudentsScreen} />
          <Stack.Screen name="StudentDetail" component={StudentDetailScreen}/>

          {user?.role?.key === 'admin' && (
            <>
              <Stack.Screen name="Admin" component={AdminScreen} />
              <Stack.Screen name="Users" component={UsersScreen} />
            </>
          )}

          {user?.role?.key === 'teacher' && (
            <>
              <Stack.Screen name="Teacher" component={TeacherScreen} />
              <Stack.Screen name="Classes" component={ClassesScreen} />
            </>
          )}
        </>
      )}

    </Stack.Navigator>
  );
};