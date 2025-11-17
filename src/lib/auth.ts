/**
 * Authentication utility functions and helpers
 * Provides role-based access control and permission checking
 */

import { User } from '@/providers/AuthProvider';

/**
 * Check if a user has a specific role
 * Admin has all permissions, DM has player permissions
 */
export function hasRole(user: User | null, role: 'player' | 'dm' | 'admin'): boolean {
  if (!user) return false;

  // Admin has all permissions
  if (user.role === 'admin') return true;

  // DM has player permissions
  if (role === 'player' && user.role === 'dm') return true;

  return user.role === role;
}

/**
 * Check if user can access DM features
 */
export function canAccessDM(user: User | null): boolean {
  return hasRole(user, 'dm') || hasRole(user, 'admin');
}

/**
 * Check if user can access admin features
 */
export function canAccessAdmin(user: User | null): boolean {
  return hasRole(user, 'admin');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(user: User | null): boolean {
  return !!user;
}

/**
 * Get user display name
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Guest';
  return user.username;
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: 'player' | 'dm' | 'admin'): string {
  const roleNames = {
    player: 'Player',
    dm: 'Dungeon Master',
    admin: 'Administrator',
  };
  return roleNames[role];
}

/**
 * Protected route paths that require authentication
 */
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/dashboard/characters',
  '/dashboard/inventory',
  '/dashboard/maps',
  '/dashboard/campaign',
  '/dashboard/session-tools',
];

/**
 * DM-only routes that require DM or Admin role
 */
export const DM_ROUTES = [
  '/dm',
  '/dm/overview',
  '/dm/party-management',
  '/dm/map-control',
  '/dm/documents',
];

/**
 * Admin-only routes that require Admin role
 */
export const ADMIN_ROUTES = [
  '/admin',
  '/admin/users',
  '/admin/campaigns',
];

/**
 * Check if a path requires authentication
 */
export function isProtectedRoute(path: string): boolean {
  return PROTECTED_ROUTES.some(route => path.startsWith(route)) ||
         DM_ROUTES.some(route => path.startsWith(route)) ||
         ADMIN_ROUTES.some(route => path.startsWith(route));
}

/**
 * Check if a path requires DM role
 */
export function isDMRoute(path: string): boolean {
  return DM_ROUTES.some(route => path.startsWith(route));
}

/**
 * Check if a path requires Admin role
 */
export function isAdminRoute(path: string): boolean {
  return ADMIN_ROUTES.some(route => path.startsWith(route));
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate username
 */
export function validateUsername(username: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (username.length > 32) {
    errors.push('Username must be less than 32 characters');
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, hyphens, and underscores');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
