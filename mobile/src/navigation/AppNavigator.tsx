/**
 * App Navigator
 * Main navigation structure for the mobile app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SCREENS } from '../config/constants';
import { Colors } from '../config/theme';

// Import screens (we'll create these next)
import { LoginScreen } from '../screens/auth/LoginScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { CharacterScreen } from '../screens/dashboard/CharacterScreen';
import { InventoryScreen } from '../screens/dashboard/InventoryScreen';
import { MapsScreen } from '../screens/dashboard/MapsScreen';
import { SessionToolsScreen } from '../screens/dashboard/SessionToolsScreen';

// Type definitions for navigation
export type RootStackParamList = {
  [SCREENS.LOGIN]: undefined;
  MainTabs: undefined;
};

export type MainTabsParamList = {
  [SCREENS.DASHBOARD]: undefined;
  [SCREENS.CHARACTER]: undefined;
  [SCREENS.INVENTORY]: undefined;
  [SCREENS.MAPS]: undefined;
  [SCREENS.SESSION_TOOLS]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

/**
 * Main Tabs Navigator
 * Bottom tab navigation for player-facing screens
 */
function MainTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.background.secondary,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: Colors.primary.pink,
        tabBarInactiveTintColor: Colors.text.muted,
        headerStyle: {
          backgroundColor: Colors.background.secondary,
        },
        headerTintColor: Colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name={SCREENS.DASHBOARD}
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => {
            // We'll add icons in the UI components section
            return null;
          },
        }}
      />
      <Tab.Screen
        name={SCREENS.CHARACTER}
        component={CharacterScreen}
        options={{
          title: 'Character',
          tabBarIcon: ({ color, size }) => null,
        }}
      />
      <Tab.Screen
        name={SCREENS.INVENTORY}
        component={InventoryScreen}
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color, size }) => null,
        }}
      />
      <Tab.Screen
        name={SCREENS.MAPS}
        component={MapsScreen}
        options={{
          title: 'Maps',
          tabBarIcon: ({ color, size }) => null,
        }}
      />
      <Tab.Screen
        name={SCREENS.SESSION_TOOLS}
        component={SessionToolsScreen}
        options={{
          title: 'Tools',
          tabBarIcon: ({ color, size }) => null,
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Root Navigator
 * Top-level stack navigation with auth flow
 */
export function AppNavigator() {
  // TODO: Add auth state management
  const isAuthenticated = false;

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: Colors.primary.pink,
          background: Colors.background.primary,
          card: Colors.background.secondary,
          text: Colors.text.primary,
          border: Colors.border,
          notification: Colors.primary.pink,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background.primary,
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name={SCREENS.LOGIN} component={LoginScreen} />
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
