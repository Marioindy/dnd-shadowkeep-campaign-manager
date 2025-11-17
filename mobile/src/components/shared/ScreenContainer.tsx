/**
 * Screen Container
 * Responsive container for screens with safe area support
 */

import React, { ReactNode } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../config/theme';

interface ScreenContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  padding?: boolean;
}

export function ScreenContainer({
  children,
  scrollable = true,
  style,
  padding = true,
}: ScreenContainerProps) {
  const containerStyle = [
    styles.container,
    padding && styles.padding,
    style,
  ];

  const content = scrollable ? (
    <ScrollView
      style={containerStyle}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={containerStyle}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  padding: {
    padding: Spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
