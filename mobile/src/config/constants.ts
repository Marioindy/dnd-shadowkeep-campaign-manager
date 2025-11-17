/**
 * App Constants
 */

export const APP_NAME = 'Shadowkeep DM';
export const APP_VERSION = '1.0.0';

// Storage keys
export const STORAGE_KEYS = {
  USER: '@shadowkeep/user',
  AUTH_TOKEN: '@shadowkeep/auth_token',
  CAMPAIGN_ID: '@shadowkeep/campaign_id',
  OFFLINE_DATA: '@shadowkeep/offline_data',
  PUSH_TOKEN: '@shadowkeep/push_token',
};

// Convex configuration
export const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL || 'https://your-convex-deployment.convex.cloud';

// API endpoints (if needed for non-Convex integrations)
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Screen names
export const SCREENS = {
  // Auth
  LOGIN: 'Login',

  // Main tabs
  DASHBOARD: 'Dashboard',
  CHARACTER: 'Character',
  INVENTORY: 'Inventory',
  MAPS: 'Maps',
  SESSION_TOOLS: 'SessionTools',

  // DM screens
  DM_OVERVIEW: 'DMOverview',
  PARTY_MANAGEMENT: 'PartyManagement',
  MAP_CONTROL: 'MapControl',

  // Detail screens
  CHARACTER_DETAIL: 'CharacterDetail',
  MAP_DETAIL: 'MapDetail',
  SESSION_DETAIL: 'SessionDetail',
} as const;

// Touch target sizes (following iOS and Android guidelines)
export const TOUCH_TARGET = {
  MIN_SIZE: 44, // Minimum touch target size
  ICON_SIZE: 24,
  BUTTON_HEIGHT: 48,
};

// Animation durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};
