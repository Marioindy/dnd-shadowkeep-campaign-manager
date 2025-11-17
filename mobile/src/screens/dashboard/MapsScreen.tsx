/**
 * Maps Screen
 * Displays campaign maps
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ScreenContainer } from '../../components/shared/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Colors, Spacing, FontSizes } from '../../config/theme';

export function MapsScreen() {
  // Mock maps data
  const maps = [
    { id: '1', name: 'Shadow Keep - Entrance', markers: 5 },
    { id: '2', name: 'Dungeon Level 1', markers: 12 },
    { id: '3', name: 'Throne Room', markers: 3 },
    { id: '4', name: 'Town of Millhaven', markers: 8 },
  ];

  const renderItem = ({ item }: any) => (
    <Card style={styles.mapCard}>
      <Text style={styles.mapName}>{item.name}</Text>
      <Text style={styles.mapMarkers}>{item.markers} markers</Text>
    </Card>
  );

  return (
    <ScreenContainer scrollable={false} padding={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Maps</Text>
        <Text style={styles.subtitle}>Tap a map to view details</Text>
      </View>
      <FlatList
        data={maps}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  list: {
    padding: Spacing.md,
  },
  mapCard: {
    marginBottom: Spacing.md,
  },
  mapName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  mapMarkers: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
});
