import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';

import { useAuthStore } from '../features/auth/store/auth.store';
import { SchoolSelectionScreen } from '../features/schoool/screens/SchoolSelectionScreen';
import { AcademiesScreen } from '../features/academies/screens/AcademiesScreen';
import { ClassroomsScreen } from '../features/classrooms/screens/ClassroomsScreen';
import { StudentsScreen } from '../features/students/screens/StudentsScreen';
import { StudentDetailScreen } from '../features/students/screens/StudentDetailScreen';
import { TabsNavigator } from './TabsNavigator';
import { ClassroomDetailScreen } from '../features/classrooms/screens/ClassroomDetailScreen';
import React from 'react';
import { PendingFormScreen } from '../features/pendings/screens/PendingFormScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { user, currentSchoolId } = useAuthStore();

  return (
    <Stack.Navigator
      initialRouteName={currentSchoolId ? 'MainTabs' : 'SchoolSelection'}
    >
      <>
        <Stack.Screen
          name="SchoolSelection"
          component={SchoolSelectionScreen}
          options={{
            headerShown: false,
          }}
        />
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
        <Stack.Screen
          name="StudentDetail"
          component={StudentDetailScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ClassroomDetail"
          component={ClassroomDetailScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PendingForm"
          component={PendingFormScreen}
          options={{
            title: 'Nuevo pendiente',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Perfil',
            headerShown: false,
          }}
        />
      </>
    </Stack.Navigator>
  );
};
