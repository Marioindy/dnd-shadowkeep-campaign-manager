/**
 * Offline Storage Service
 * Provides persistent storage for offline capabilities
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';
import { User, Character, Session } from '../types';

/**
 * Generic storage operations
 */
export const storage = {
  /**
   * Store a value
   */
  async set(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing value:', error);
      throw error;
    }
  },

  /**
   * Get a value
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving value:', error);
      return null;
    }
  },

  /**
   * Remove a value
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing value:', error);
      throw error;
    }
  },

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};

/**
 * User storage operations
 */
export const userStorage = {
  async saveUser(user: User): Promise<void> {
    await storage.set(STORAGE_KEYS.USER, user);
  },

  async getUser(): Promise<User | null> {
    return storage.get<User>(STORAGE_KEYS.USER);
  },

  async removeUser(): Promise<void> {
    await storage.remove(STORAGE_KEYS.USER);
  },
};

/**
 * Auth token storage
 */
export const authStorage = {
  async saveToken(token: string): Promise<void> {
    await storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  async getToken(): Promise<string | null> {
    return storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  },

  async removeToken(): Promise<void> {
    await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  },
};

/**
 * Offline data cache
 * Stores data for offline access
 */
export const offlineCache = {
  async cacheCharacters(characters: Character[]): Promise<void> {
    await storage.set(`${STORAGE_KEYS.OFFLINE_DATA}:characters`, characters);
  },

  async getCachedCharacters(): Promise<Character[] | null> {
    return storage.get<Character[]>(`${STORAGE_KEYS.OFFLINE_DATA}:characters`);
  },

  async cacheSessions(sessions: Session[]): Promise<void> {
    await storage.set(`${STORAGE_KEYS.OFFLINE_DATA}:sessions`, sessions);
  },

  async getCachedSessions(): Promise<Session[] | null> {
    return storage.get<Session[]>(`${STORAGE_KEYS.OFFLINE_DATA}:sessions`);
  },

  async clearCache(): Promise<void> {
    // Clear all offline data
    const keys = await AsyncStorage.getAllKeys();
    const offlineKeys = keys.filter(key => key.startsWith(STORAGE_KEYS.OFFLINE_DATA));
    await AsyncStorage.multiRemove(offlineKeys);
  },
};
