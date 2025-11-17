/**
 * Session Tools Screen
 * Dice roller, initiative tracker, and other session tools
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../components/shared/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Colors, Spacing, FontSizes } from '../../config/theme';
import { rollDice } from '../../utils/dnd';

export function SessionToolsScreen() {
  const [lastRoll, setLastRoll] = useState<{ dice: string; result: number } | null>(null);

  const handleDiceRoll = (sides: number) => {
    const result = rollDice(sides);
    setLastRoll({ dice: `d${sides}`, result });
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Session Tools</Text>

      {lastRoll && (
        <Card style={styles.resultCard}>
          <Text style={styles.resultLabel}>Last Roll: {lastRoll.dice}</Text>
          <Text style={styles.resultValue}>{lastRoll.result}</Text>
        </Card>
      )}

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Dice Roller</Text>
        <View style={styles.diceGrid}>
          <Button
            variant="secondary"
            style={styles.diceButton}
            onPress={() => handleDiceRoll(4)}
          >
            d4
          </Button>
          <Button
            variant="secondary"
            style={styles.diceButton}
            onPress={() => handleDiceRoll(6)}
          >
            d6
          </Button>
          <Button
            variant="secondary"
            style={styles.diceButton}
            onPress={() => handleDiceRoll(8)}
          >
            d8
          </Button>
          <Button
            variant="secondary"
            style={styles.diceButton}
            onPress={() => handleDiceRoll(10)}
          >
            d10
          </Button>
          <Button
            variant="secondary"
            style={styles.diceButton}
            onPress={() => handleDiceRoll(12)}
          >
            d12
          </Button>
          <Button
            variant="primary"
            style={styles.diceButton}
            onPress={() => handleDiceRoll(20)}
          >
            d20
          </Button>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Quick Tools</Text>
        <Button variant="ghost" fullWidth style={styles.toolButton}>
          Initiative Tracker
        </Button>
        <Button variant="ghost" fullWidth style={styles.toolButton}>
          Spell Slots
        </Button>
        <Button variant="ghost" fullWidth style={styles.toolButton}>
          Notes
        </Button>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  resultCard: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    backgroundColor: Colors.primary.purpleLight,
  },
  resultLabel: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  resultValue: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.primary.pink,
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
  diceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  diceButton: {
    width: '30%',
    marginBottom: Spacing.sm,
  },
  toolButton: {
    marginBottom: Spacing.sm,
  },
});
