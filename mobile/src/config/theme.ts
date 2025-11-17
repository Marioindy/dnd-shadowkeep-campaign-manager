/**
 * Theme Configuration
 * Matches the web app's dark purple/pink gradient theme
 */

export const Colors = {
  // Primary colors (dark purple to pink gradient)
  primary: {
    dark: '#1a0a2e',
    purple: '#2d1b69',
    purpleLight: '#3d2d7d',
    pink: '#d946ef',
    pinkLight: '#f0abfc',
  },

  // Background colors
  background: {
    primary: '#0f0a19',
    secondary: '#1a0a2e',
    tertiary: '#2d1b69',
    card: '#1f1333',
  },

  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#c4b5fd',
    muted: '#a78bfa',
    disabled: '#7c3aed',
  },

  // UI colors
  border: '#3d2d7d',
  divider: '#2d1b69',

  // Status colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',

  // Transparent overlays
  overlay: 'rgba(15, 10, 25, 0.9)',
  overlayLight: 'rgba(15, 10, 25, 0.7)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};
