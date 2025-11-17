'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface QueuedMutation {
  id: string;
  mutation: () => Promise<any>;
  retries: number;
  timestamp: number;
}

interface OfflineContextType {
  isOnline: boolean;
  queueMutation: (mutation: () => Promise<any>) => Promise<void>;
  pendingMutations: number;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [mutationQueue, setMutationQueue] = useState<QueuedMutation[]>([]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('[Offline] Connection restored');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('[Offline] Connection lost');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Process queue when coming back online
  useEffect(() => {
    if (isOnline && mutationQueue.length > 0) {
      console.log(`[Offline] Processing ${mutationQueue.length} queued mutations`);
      processMutationQueue();
    }
  }, [isOnline, mutationQueue.length]);

  const processMutationQueue = async () => {
    const queue = [...mutationQueue];

    for (const item of queue) {
      try {
        console.log(`[Offline] Executing queued mutation ${item.id}`);
        await item.mutation();

        // Remove successful mutation from queue
        setMutationQueue((prev) => prev.filter((m) => m.id !== item.id));
        console.log(`[Offline] Successfully executed mutation ${item.id}`);
      } catch (error) {
        console.error(`[Offline] Failed to execute mutation ${item.id}:`, error);

        if (item.retries < MAX_RETRIES) {
          // Retry with exponential backoff
          setTimeout(() => {
            setMutationQueue((prev) =>
              prev.map((m) =>
                m.id === item.id ? { ...m, retries: m.retries + 1 } : m
              )
            );
          }, RETRY_DELAY * Math.pow(2, item.retries));
        } else {
          // Max retries reached, remove from queue
          console.error(`[Offline] Max retries reached for mutation ${item.id}, removing from queue`);
          setMutationQueue((prev) => prev.filter((m) => m.id !== item.id));
        }
      }
    }
  };

  const queueMutation = async (mutation: () => Promise<any>) => {
    if (isOnline) {
      // If online, execute immediately
      try {
        await mutation();
      } catch (error) {
        console.error('[Offline] Mutation failed while online:', error);
        // Queue for retry
        const queuedMutation: QueuedMutation = {
          id: Math.random().toString(36).substring(7),
          mutation,
          retries: 0,
          timestamp: Date.now(),
        };
        setMutationQueue((prev) => [...prev, queuedMutation]);
        throw error;
      }
    } else {
      // If offline, add to queue
      console.log('[Offline] Queueing mutation for later execution');
      const queuedMutation: QueuedMutation = {
        id: Math.random().toString(36).substring(7),
        mutation,
        retries: 0,
        timestamp: Date.now(),
      };
      setMutationQueue((prev) => [...prev, queuedMutation]);
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        queueMutation,
        pendingMutations: mutationQueue.length,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
