/**
 * Inventory Screen
 * Displays character inventory and equipment
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ScreenContainer } from '../../components/shared/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Colors, Spacing, FontSizes } from '../../config/theme';

export function InventoryScreen() {
  // Mock inventory data
  const inventory = [
    { id: '1', name: '+1 Longsword', type: 'weapon', quantity: 1, equipped: true },
    { id: '2', name: 'Plate Armor', type: 'armor', quantity: 1, equipped: true },
    { id: '3', name: 'Healing Potion', type: 'potion', quantity: 3, equipped: false },
    { id: '4', name: "Rope (50 ft)", type: 'tool', quantity: 1, equipped: false },
    { id: '5', name: 'Rations', type: 'misc', quantity: 7, equipped: false },
  ];

  const renderItem = ({ item }: any) => (
    <Card style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.equipped && <View style={styles.equippedBadge}><Text style={styles.equippedText}>E</Text></View>}
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemType}>{item.type}</Text>
        <Text style={styles.itemQuantity}>x{item.quantity}</Text>
      </View>
    </Card>
  );

  return (
    <ScreenContainer scrollable={false} padding={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventory</Text>
      </View>
      <FlatList
        data={inventory}
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
  list: {
    padding: Spacing.md,
  },
  itemCard: {
    marginBottom: Spacing.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  itemName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  equippedBadge: {
    backgroundColor: Colors.primary.pink,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equippedText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemType: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    textTransform: 'capitalize',
  },
  itemQuantity: {
    fontSize: FontSizes.sm,
    color: Colors.text.muted,
  },
});
