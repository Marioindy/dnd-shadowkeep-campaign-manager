/**
 * Character Screen
 * Displays character sheet information
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../components/shared/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Colors, Spacing, FontSizes } from '../../config/theme';
import { calculateModifier, formatModifier } from '../../utils/dnd';

export function CharacterScreen() {
  // Mock character data
  const character = {
    name: 'Thorin Ironforge',
    race: 'Dwarf',
    class: 'Fighter',
    level: 8,
    stats: {
      strength: 18,
      dexterity: 14,
      constitution: 16,
      intelligence: 10,
      wisdom: 12,
      charisma: 8,
      hp: 72,
      maxHp: 80,
      ac: 18,
      speed: 25,
    },
  };

  const renderStatBlock = (label: string, value: number, code: string) => {
    const modifier = calculateModifier(value);
    return (
      <View style={styles.statBlock} key={code}>
        <Text style={styles.statLabel}>{code}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statModifier}>{formatModifier(modifier)}</Text>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <Card style={styles.headerCard}>
        <Text style={styles.characterName}>{character.name}</Text>
        <Text style={styles.characterInfo}>
          Level {character.level} {character.race} {character.class}
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Combat Stats</Text>
        <View style={styles.combatStats}>
          <View style={styles.combatStat}>
            <Text style={styles.combatLabel}>HP</Text>
            <Text style={styles.combatValue}>
              {character.stats.hp}/{character.stats.maxHp}
            </Text>
          </View>
          <View style={styles.combatStat}>
            <Text style={styles.combatLabel}>AC</Text>
            <Text style={styles.combatValue}>{character.stats.ac}</Text>
          </View>
          <View style={styles.combatStat}>
            <Text style={styles.combatLabel}>Speed</Text>
            <Text style={styles.combatValue}>{character.stats.speed} ft</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Ability Scores</Text>
        <View style={styles.statsGrid}>
          {renderStatBlock('STR', character.stats.strength, 'STR')}
          {renderStatBlock('DEX', character.stats.dexterity, 'DEX')}
          {renderStatBlock('CON', character.stats.constitution, 'CON')}
          {renderStatBlock('INT', character.stats.intelligence, 'INT')}
          {renderStatBlock('WIS', character.stats.wisdom, 'WIS')}
          {renderStatBlock('CHA', character.stats.charisma, 'CHA')}
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  characterName: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  characterInfo: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
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
  combatStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  combatStat: {
    alignItems: 'center',
  },
  combatLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  combatValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBlock: {
    width: '30%',
    backgroundColor: Colors.background.tertiary,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.text.muted,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  statModifier: {
    fontSize: FontSizes.md,
    color: Colors.primary.pink,
    fontWeight: '600',
  },
});
