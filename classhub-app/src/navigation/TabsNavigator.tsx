import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
import { CalendarScreen } from '../features/calendar/screens/CalendarScreen';
import { AcademiesScreen } from '../features/academies/screens/AcademiesScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { MyPendingsScreen } from '../features/pendings/screens/MyPendingsScreen';
import { useTheme } from 'react-native-paper';
import React from 'react';

const Tab = createBottomTabNavigator();

export const TabsNavigator = () => {
  const { colors } = useTheme() as any;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,

        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'DashboardTab':
              iconName = focused
                ? 'home'
                : 'home-outline';
              break;

            case 'Calendar':
              iconName = focused
                ? 'calendar'
                : 'calendar-outline';
              break;

            case 'Academies':
              iconName = focused
                ? 'school'
                : 'school-outline';
              break;

            case 'Pendings':
              iconName = focused
                ? 'checkmark-circle'
                : 'checkmark-circle-outline';
              break;

            case 'Profile':
              iconName = focused
                ? 'person'
                : 'person-outline';
              break;

            case 'Settings':
              iconName = focused
                ? 'settings'
                : 'settings-outline';
              break;

            default:
              iconName = 'ellipse';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,

        tabBarStyle: {
          backgroundColor: colors.tabBar, // o el color que quieras
          borderTopWidth: 0,               // opcional
          elevation: 0,                    // Android (quita sombra)
        },
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
            headerShown: false,
            title: 'Inicio'
        }}
      />

      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
            headerShown: false,
            title: 'Calendario'
        }}
      />

      <Tab.Screen
        name="Academies"
        component={AcademiesScreen}
        options={{
            headerShown: false,
            title: 'Academias'
        }}
      />

      <Tab.Screen
        name="Pendings"
        component={MyPendingsScreen}
        options={{
          headerShown: false,
          title: 'Pendientes',
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
            headerShown: false,
            title: 'Ajustes'
        }}
      />
    </Tab.Navigator>
  );
};