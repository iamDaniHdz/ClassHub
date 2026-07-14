import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
import { CalendarScreen } from '../features/calendar/screens/CalendarScreen';
import { AcademiesScreen } from '../features/academies/screens/AcademiesScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export const TabsNavigator = () => {
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
                ? 'book'
                : 'book-outline';
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

        tabBarActiveTintColor: '#1976D2',
        tabBarInactiveTintColor: '#757575',
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{ title: 'Inicio' }}
      />

      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: 'Calendario' }}
      />

      <Tab.Screen
        name="Academies"
        component={AcademiesScreen}
        options={{ title: 'Academias' }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Ajustes' }}
      />
    </Tab.Navigator>
  );
};