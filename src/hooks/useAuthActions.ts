'use client';

import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

/**
 * Custom hook for authentication actions
 */
export function useAuthActions() {
  const { login: setAuthUser, logout: clearAuthUser } = useAuth();
  const loginMutation = useMutation(api.auth.login);
  const registerMutation = useMutation(api.auth.register);

  const login = async (username: string, password: string) => {
    try {
      const user = await loginMutation({ username, password });
      setAuthUser(user as User);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  };

  const logout = () => {
    clearAuthUser();
  };

  const register = async (
    username: string,
    password: string,
    role: 'player' | 'dm' | 'admin',
    campaignId?: string
  ) => {
    try {
      const userId = await registerMutation({
        username,
        password,
        role,
        campaignId: campaignId as any,
      });
      return { success: true, userId };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  };

  return { login, logout, register };
}
