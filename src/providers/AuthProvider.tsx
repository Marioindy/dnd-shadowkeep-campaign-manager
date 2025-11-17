'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export interface User {
  _id: Id<'users'>;
  username: string;
  role: 'player' | 'dm' | 'admin';
  campaignId?: Id<'campaigns'>;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, sessionToken: string) => void;
  logout: () => void;
  hasRole: (role: 'player' | 'dm' | 'admin') => boolean;
  canAccessDM: () => boolean;
  canAccessAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Session storage keys
 */
const SESSION_TOKEN_KEY = 'dnd_session_token';
const USER_ID_KEY = 'dnd_user_id';

/**
 * AuthProvider manages authentication state and session persistence
 * Uses localStorage for session storage and Convex for user verification
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get stored user ID from localStorage
  const storedUserId = typeof window !== 'undefined'
    ? localStorage.getItem(USER_ID_KEY)
    : null;

  // Verify session on mount by fetching user from Convex
  const verifiedUser = useQuery(
    api.auth.verifySession,
    storedUserId ? { userId: storedUserId as Id<'users'> } : 'skip'
  );

  // Initialize authentication state from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const sessionToken = localStorage.getItem(SESSION_TOKEN_KEY);
    const userId = localStorage.getItem(USER_ID_KEY);

    if (!sessionToken || !userId) {
      setIsLoading(false);
      return;
    }

    // Wait for Convex query to verify user
    if (verifiedUser === undefined) {
      // Still loading
      return;
    }

    if (verifiedUser === null) {
      // Invalid session, clear storage
      localStorage.removeItem(SESSION_TOKEN_KEY);
      localStorage.removeItem(USER_ID_KEY);
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Valid session
    setUser(verifiedUser);
    setIsLoading(false);
  }, [verifiedUser]);

  const login = (userData: User, sessionToken: string) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
      localStorage.setItem(USER_ID_KEY, userData._id);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_TOKEN_KEY);
      localStorage.removeItem(USER_ID_KEY);
    }
  };

  const hasRole = (role: 'player' | 'dm' | 'admin'): boolean => {
    if (!user) return false;

    // Admin has all permissions
    if (user.role === 'admin') return true;

    // DM has player permissions
    if (role === 'player' && user.role === 'dm') return true;

    return user.role === role;
  };

  const canAccessDM = (): boolean => {
    return hasRole('dm') || hasRole('admin');
  };

  const canAccessAdmin = (): boolean => {
    return hasRole('admin');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
    canAccessDM,
    canAccessAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
