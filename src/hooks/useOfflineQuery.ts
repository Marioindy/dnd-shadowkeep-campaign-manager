/**
 * Offline-Aware Query Hook
 *
 * A wrapper around Convex queries that provides offline support.
 * Falls back to IndexedDB when offline, syncs when online.
 */

'use client';

import { useState, useEffect } from 'react';
import { useOffline } from '../contexts/OfflineContext';
import type { StoreName } from '../lib/offline/storage';

export interface OfflineQueryOptions<T> {
  storeName: StoreName;
  indexName?: string;
  indexValue?: string | number;
  enabled?: boolean;
  refetchOnReconnect?: boolean;
}

export interface OfflineQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isOfflineData: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook for querying data with offline support
 *
 * Usage:
 * ```tsx
 * const { data, isLoading } = useOfflineQuery({
 *   storeName: 'characters',
 *   convexQuery: api.characters.list,
 *   convexArgs: { userId: currentUser.id },
 * });
 * ```
 */
export function useOfflineQuery<T>(
  convexQuery: (() => Promise<T>) | null,
  options: OfflineQueryOptions<T>
): OfflineQueryResult<T> {
  const { isOnline, getCachedData, cacheData, offlineModeEnabled } = useOffline();

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineData, setIsOfflineData] = useState(false);

  const {
    storeName,
    indexName,
    indexValue,
    enabled = true,
    refetchOnReconnect = true,
  } = options;

  const fetchData = async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      if (isOnline && convexQuery) {
        // Fetch from Convex when online
        const result = await convexQuery();
        setData(result);
        setIsOfflineData(false);

        // Cache the data if offline mode is enabled
        if (offlineModeEnabled && Array.isArray(result)) {
          await cacheData(storeName, result as any);
        }
      } else {
        // Fetch from IndexedDB when offline
        let cachedData: any;

        if (indexName && indexValue !== undefined) {
          // Use index query
          const { getByIndex } = await import('../lib/offline/storage');
          cachedData = await getByIndex(storeName, indexName, indexValue);
        } else {
          // Get all data
          cachedData = await getCachedData(storeName);
        }

        setData(cachedData as T);
        setIsOfflineData(true);
      }
    } catch (err) {
      console.error('Query error:', err);
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Unknown error'));

      // Try to load from cache as fallback
      try {
        const cachedData = await getCachedData(storeName);
        if (cachedData && (cachedData as any).length > 0) {
          setData(cachedData as T);
          setIsOfflineData(true);
          setIsError(false); // Clear error if we found cached data
        }
      } catch {
        // Ignore cache errors
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [isOnline, enabled, storeName, indexName, indexValue]);

  // Refetch when connection is restored
  useEffect(() => {
    if (isOnline && refetchOnReconnect && isOfflineData) {
      fetchData();
    }
  }, [isOnline, refetchOnReconnect, isOfflineData]);

  return {
    data,
    isLoading,
    isError,
    error,
    isOfflineData,
    refetch: fetchData,
  };
}
