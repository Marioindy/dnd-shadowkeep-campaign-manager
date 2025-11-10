'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export interface User {
  _id: Id<'users'>;
  username: string;
  role: 'player' | 'dm' | 'admin';
  campaignId?: Id<'campaigns'>;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, password: string, role: 'player' | 'dm') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Query current user session
  const currentUser = useQuery(
    api.auth.getCurrentUser,
    sessionToken ? { sessionToken } : 'skip'
  );

  // Auth mutations
  const loginMutation = useMutation(api.auth.login);
  const logoutMutation = useMutation(api.auth.logout);
  const registerMutation = useMutation(api.auth.register);

  // Load session token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    if (token) {
      setSessionToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Update user when currentUser changes
  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser);
      setIsLoading(false);
    }
  }, [currentUser]);

  const login = async (username: string, password: string) => {
    try {
      const result = await loginMutation({ username, password });
      if (result.success && result.sessionToken) {
        setSessionToken(result.sessionToken);
        localStorage.setItem('sessionToken', result.sessionToken);
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (sessionToken) {
        await logoutMutation({ sessionToken });
      }
      setSessionToken(null);
      setUser(null);
      localStorage.removeItem('sessionToken');
    } catch (error) {
      // Clear local state even if server request fails
      setSessionToken(null);
      setUser(null);
      localStorage.removeItem('sessionToken');
    }
  };

  const register = async (username: string, password: string, role: 'player' | 'dm') => {
    try {
      const result = await registerMutation({ username, password, role });
      if (result.success && result.sessionToken) {
        setSessionToken(result.sessionToken);
        localStorage.setItem('sessionToken', result.sessionToken);
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
