/**
 * Dashboard Screen
 * Main overview screen for players
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenContainer } from '../../components/shared/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, FontSizes } from '../../config/theme';

export function DashboardScreen() {
  const { user, logout } = useAuth();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.username}>{user?.username}</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Campaign Status</Text>
        <View style={styles.statusRow}>
          <Text style={styles.label}>Current Session:</Text>
          <Text style={styles.value}>Session 12</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.label}>Active Players:</Text>
          <Text style={styles.value}>5</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.label}>Next Session:</Text>
          <Text style={styles.value}>Nov 15, 2025</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <Button variant="primary" fullWidth style={styles.actionButton}>
          Roll Dice
        </Button>
        <Button variant="secondary" fullWidth style={styles.actionButton}>
          View Character
        </Button>
        <Button variant="secondary" fullWidth style={styles.actionButton}>
          Check Inventory
        </Button>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        <Text style={styles.activityText}>• Level up to Level 8</Text>
        <Text style={styles.activityText}>• Acquired: +1 Longsword</Text>
        <Text style={styles.activityText}>• Completed: The Shadow Keep Quest</Text>
      </Card>

      <Button
        variant="danger"
        onPress={logout}
        fullWidth
        style={styles.logoutButton}
      >
        Logout
      </Button>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.lg,
  },
  welcomeText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  username: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  card: {
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.primary.pink,
    marginBottom: Spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  value: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
  activityText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  logoutButton: {
    marginTop: Spacing.lg,
  },
});
