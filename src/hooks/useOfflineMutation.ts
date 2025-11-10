/**
 * Offline-Aware Mutation Hook
 *
 * A wrapper around Convex mutations that queues changes when offline.
 * Automatically syncs when connection is restored.
 */

'use client';

import { useState, useCallback } from 'react';
import { useOffline } from '../contexts/OfflineContext';
import type { MutationType } from '../lib/offline/syncQueue';
import type { StoreName } from '../lib/offline/storage';

export interface OfflineMutationOptions {
  storeName: StoreName;
  mutationType: MutationType;
  functionName: string;
  optimisticUpdate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export interface OfflineMutationResult<TArgs = any, TResult = any> {
  mutate: (args: TArgs) => Promise<TResult | null>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isQueued: boolean;
  reset: () => void;
}

/**
 * Hook for mutations with offline support
 *
 * Usage:
 * ```tsx
 * const { mutate } = useOfflineMutation({
 *   storeName: 'characters',
 *   mutationType: 'update',
 *   functionName: 'characters:update',
 *   convexMutation: api.characters.update,
 * });
 * ```
 */
export function useOfflineMutation<TArgs = any, TResult = any>(
  convexMutation: ((args: TArgs) => Promise<TResult>) | null,
  options: OfflineMutationOptions
): OfflineMutationResult<TArgs, TResult> {
  const { isOnline, addMutation, offlineModeEnabled } = useOffline();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isQueued, setIsQueued] = useState(false);

  const {
    storeName,
    mutationType,
    functionName,
    optimisticUpdate = true,
    onSuccess,
    onError,
  } = options;

  const mutate = useCallback(
    async (args: TArgs): Promise<TResult | null> => {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      setIsQueued(false);

      try {
        if (isOnline && convexMutation) {
          // Execute mutation directly when online
          const result = await convexMutation(args);

          // Call success callback
          if (onSuccess) {
            onSuccess(result);
          }

          return result;
        } else if (offlineModeEnabled) {
          // Queue mutation when offline
          const mutationId = await addMutation(
            storeName,
            mutationType,
            functionName,
            args as any
          );

          setIsQueued(true);

          // Perform optimistic update if enabled
          if (optimisticUpdate) {
            // Apply local update to IndexedDB
            const { putToStore } = await import('../lib/offline/storage');

            if (mutationType === 'create' || mutationType === 'update') {
              const dataWithId = {
                ...args,
                _id: (args as any)._id || mutationId,
              };
              await putToStore(storeName, dataWithId as any);
            } else if (mutationType === 'delete') {
              const { deleteFromStore } = await import('../lib/offline/storage');
              await deleteFromStore(storeName, (args as any)._id);
            }
          }

          // Call success callback with queued status
          if (onSuccess) {
            onSuccess({ queued: true, mutationId } as any);
          }

          return null;
        } else {
          throw new Error('Cannot perform mutation: offline and offline mode not enabled');
        }
      } catch (err) {
        console.error('Mutation error:', err);
        setIsError(true);
        const errorObj = err instanceof Error ? err : new Error('Unknown error');
        setError(errorObj);

        // Call error callback
        if (onError) {
          onError(errorObj);
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [
      isOnline,
      convexMutation,
      offlineModeEnabled,
      addMutation,
      storeName,
      mutationType,
      functionName,
      optimisticUpdate,
      onSuccess,
      onError,
    ]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsError(false);
    setError(null);
    setIsQueued(false);
  }, []);

  return {
    mutate,
    isLoading,
    isError,
    error,
    isQueued,
    reset,
  };
}
