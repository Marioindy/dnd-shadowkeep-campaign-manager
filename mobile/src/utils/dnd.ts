/**
 * D&D Utility Functions
 * Shared utilities for D&D calculations and formatting
 */

/**
 * Convert an ability or attribute score into its modifier.
 *
 * @param stat - The ability or attribute score to convert
 * @returns The integer modifier calculated as floor((stat - 10) / 2)
 */
export function calculateModifier(stat: number): number {
  return Math.floor((stat - 10) / 2);
}

/**
 * Format a numeric modifier as a signed string suitable for display.
 *
 * @param modifier - The numeric modifier to format
 * @returns The modifier as a string with a leading `+` when the value is greater than or equal to 0, otherwise the negative value (e.g., `+3`, `-1`, `+0`)
 */
export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

/**
 * Generate a random die roll from 1 up to the given number of sides.
 *
 * @param sides - The number of sides on the die (expected to be an integer ≥ 1)
 * @returns A random integer between 1 and `sides`, inclusive
 */
export function rollDice(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Rolls a die with the specified number of sides and applies a numeric modifier.
 *
 * @param sides - Number of faces on the die (must be >= 1)
 * @param modifier - Value to add to the rolled result (may be negative)
 * @returns The total: a random integer between 1 and `sides` plus `modifier`
 */
export function rollDiceWithModifier(sides: number, modifier: number): number {
  return rollDice(sides) + modifier;
}

/**
 * Formats a numeric timestamp as a short date string using the en-US locale.
 *
 * @param timestamp - Milliseconds since the Unix epoch
 * @returns A date string with numeric year, short month, and numeric day (e.g., "Nov 7, 2025")
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a millisecond timestamp as a short en-US date and time string.
 *
 * @param timestamp - Milliseconds since the Unix epoch
 * @returns The formatted date and time using en-US locale with short month, numeric year and day, and 2-digit hour and minute (e.g., "Nov 7, 2025, 03:04 PM")
 */
export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get ability score name from short code
 */
export function getAbilityName(code: string): string {
  const abilities: Record<string, string> = {
    STR: 'Strength',
    DEX: 'Dexterity',
    CON: 'Constitution',
    INT: 'Intelligence',
    WIS: 'Wisdom',
    CHA: 'Charisma',
  };
  return abilities[code.toUpperCase()] || code;
}
