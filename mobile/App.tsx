/**
 * Main App Entry Point
 * Shadowkeep Campaign Manager - Mobile App
 */

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ConvexProvider } from './src/contexts/ConvexProvider';
import { AuthProvider } from './src/contexts/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { registerForPushNotifications } from './src/services/notifications';
import { Colors } from './src/config/theme';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize app
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Register for push notifications
      await registerForPushNotifications();

      // Add any other initialization here
      // For example: load fonts, check for updates, etc.

      setIsReady(true);
    } catch (error) {
      console.error('Error initializing app:', error);
      // Still set ready to true to prevent blocking the app
      setIsReady(true);
    }
  };

  if (!isReady) {
    // You could show a splash screen here
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ConvexProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </AuthProvider>
      </ConvexProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: Colors.text.primary,
    fontSize: 18,
  },
});
