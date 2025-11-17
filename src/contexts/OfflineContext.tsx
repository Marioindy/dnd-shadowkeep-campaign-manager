/**
 * Offline Context Provider
 *
 * Provides offline mode state and sync functionality to the entire application.
 * Manages online/offline detection, automatic sync, and offline data caching.
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  syncAllMutations,
  getPendingMutationCount,
  queueMutation,
  type SyncResult,
  type MutationType,
} from '../lib/offline/syncQueue';
import {
  initDB,
  getAllFromStore,
  putToStore,
  bulkPutToStore,
  getSyncMetadata,
  updateSyncMetadata,
  type StoreName,
} from '../lib/offline/storage';
import { autoResolveConflicts } from '../lib/offline/conflictResolution';

export interface OfflineContextValue {
  // Online/offline state
  isOnline: boolean;
  isInitialized: boolean;

  // Sync state
  isSyncing: boolean;
  lastSyncTime: number | null;
  pendingMutations: number;
  syncProgress: { completed: number; total: number } | null;

  // Sync actions
  syncNow: () => Promise<SyncResult>;
  enableOfflineMode: () => Promise<void>;
  disableOfflineMode: () => Promise<void>;

  // Mutation queue
  addMutation: (
    storeName: string,
    mutationType: MutationType,
    functionName: string,
    args: Record<string, any>,
    localId?: string
  ) => Promise<string>;

  // Cache management
  cacheData: <T extends { _id: string }>(
    storeName: StoreName,
    items: T[]
  ) => Promise<void>;
  getCachedData: <T>(storeName: StoreName) => Promise<T[]>;

  // Settings
  offlineModeEnabled: boolean;
  autoSyncEnabled: boolean;
  setAutoSyncEnabled: (enabled: boolean) => void;
}

const OfflineContext = createContext<OfflineContextValue | undefined>(undefined);

export function useOffline(): OfflineContextValue {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
}

interface OfflineProviderProps {
  children: React.ReactNode;
  convexMutate?: (functionName: string, args: any) => Promise<any>;
}

export function OfflineProvider({ children, convexMutate }: OfflineProviderProps) {
  // State
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [pendingMutations, setPendingMutations] = useState(0);
  const [syncProgress, setSyncProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // Initialize offline mode
  useEffect(() => {
    async function initialize() {
      try {
        // Initialize IndexedDB
        await initDB();

        // Check if offline mode was previously enabled
        const offlineEnabled = localStorage.getItem('offlineModeEnabled') === 'true';
        setOfflineModeEnabled(offlineEnabled);

        // Load last sync time
        const lastSync = localStorage.getItem('lastSyncTime');
        if (lastSync) {
          setLastSyncTime(parseInt(lastSync, 10));
        }

        // Load pending mutation count
        const count = await getPendingMutationCount();
        setPendingMutations(count);

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize offline mode:', error);
      }
    }

    initialize();
  }, []);

  // Online/offline detection
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      console.log('Connection restored');

      // Auto-sync if enabled
      if (autoSyncEnabled && offlineModeEnabled) {
        syncNow();
      }
    }

    function handleOffline() {
      setIsOnline(false);
      console.log('Connection lost - offline mode active');
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoSyncEnabled, offlineModeEnabled]);

  // Periodic pending mutation count update
  useEffect(() => {
    if (!offlineModeEnabled) return;

    const interval = setInterval(async () => {
      const count = await getPendingMutationCount();
      setPendingMutations(count);
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [offlineModeEnabled]);

  // Sync now function
  const syncNow = useCallback(async (): Promise<SyncResult> => {
    if (!convexMutate) {
      console.warn('Convex mutate function not provided');
      return {
        success: false,
        syncedCount: 0,
        failedCount: 0,
        errors: [{ mutation: null as any, error: 'Convex mutate not available' }],
      };
    }

    if (!isOnline) {
      console.warn('Cannot sync while offline');
      return {
        success: false,
        syncedCount: 0,
        failedCount: 0,
        errors: [{ mutation: null as any, error: 'Device is offline' }],
      };
    }

    setIsSyncing(true);
    setSyncProgress({ completed: 0, total: pendingMutations });

    try {
      const result = await syncAllMutations(
        convexMutate,
        (completed, total) => {
          setSyncProgress({ completed, total });
        }
      );

      // Update last sync time
      const now = Date.now();
      setLastSyncTime(now);
      localStorage.setItem('lastSyncTime', now.toString());

      // Update pending count
      const count = await getPendingMutationCount();
      setPendingMutations(count);

      console.log('Sync completed:', result);
      return result;
    } catch (error) {
      console.error('Sync failed:', error);
      return {
        success: false,
        syncedCount: 0,
        failedCount: 0,
        errors: [
          {
            mutation: null as any,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        ],
      };
    } finally {
      setIsSyncing(false);
      setSyncProgress(null);
    }
  }, [convexMutate, isOnline, pendingMutations]);

  // Enable offline mode
  const enableOfflineMode = useCallback(async () => {
    setOfflineModeEnabled(true);
    localStorage.setItem('offlineModeEnabled', 'true');
    console.log('Offline mode enabled');

    // Initialize service worker if available
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }, []);

  // Disable offline mode
  const disableOfflineMode = useCallback(async () => {
    setOfflineModeEnabled(false);
    localStorage.setItem('offlineModeEnabled', 'false');
    console.log('Offline mode disabled');

    // Unregister service worker
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log('Service Worker unregistered');
      }
    }
  }, []);

  // Add mutation to queue
  const addMutation = useCallback(
    async (
      storeName: string,
      mutationType: MutationType,
      functionName: string,
      args: Record<string, any>,
      localId?: string
    ): Promise<string> => {
      const mutationId = await queueMutation(
        storeName,
        mutationType,
        functionName,
        args,
        localId
      );

      // Update pending count
      const count = await getPendingMutationCount();
      setPendingMutations(count);

      return mutationId;
    },
    []
  );

  // Cache data to IndexedDB
  const cacheData = useCallback(
    async <T extends { _id: string }>(storeName: StoreName, items: T[]): Promise<void> => {
      await bulkPutToStore(storeName, items);

      // Update sync metadata
      await updateSyncMetadata(storeName, Date.now(), 1);
    },
    []
  );

  // Get cached data from IndexedDB
  const getCachedData = useCallback(async <T,>(storeName: StoreName): Promise<T[]> => {
    return getAllFromStore<T>(storeName);
  }, []);

  const value: OfflineContextValue = {
    isOnline,
    isInitialized,
    isSyncing,
    lastSyncTime,
    pendingMutations,
    syncProgress,
    syncNow,
    enableOfflineMode,
    disableOfflineMode,
    addMutation,
    cacheData,
    getCachedData,
    offlineModeEnabled,
    autoSyncEnabled,
    setAutoSyncEnabled,
  };

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
}
