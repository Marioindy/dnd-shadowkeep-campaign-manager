/**
 * SyncQueue System for Offline Mutations
 *
 * Queues mutations made while offline and syncs them when connection is restored.
 * Handles retry logic, conflict detection, and persistence.
 */

import { initDB } from './storage';

const SYNC_QUEUE_STORE = 'syncQueue';
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

export type MutationType = 'create' | 'update' | 'delete';

export interface QueuedMutation {
  id: string; // Unique ID for this queued mutation
  timestamp: number; // When the mutation was queued
  storeName: string; // Which Convex table this targets
  mutationType: MutationType;
  functionName: string; // Convex mutation function name
  args: Record<string, any>; // Arguments to pass to the mutation
  retryCount: number; // How many times we've tried to sync this
  status: 'pending' | 'syncing' | 'failed' | 'completed';
  error?: string; // Error message if sync failed
  localId?: string; // Temporary local ID for optimistic updates
  serverId?: string; // ID from server after successful sync
}

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors: Array<{ mutation: QueuedMutation; error: string }>;
}

/**
 * Initialize the sync queue store in IndexedDB
 */
async function initSyncQueueStore(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('shadowkeep_sync_queue', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
        const store = db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id' });
        store.createIndex('by_status', 'status', { unique: false });
        store.createIndex('by_timestamp', 'timestamp', { unique: false });
        store.createIndex('by_storeName', 'storeName', { unique: false });
      }
    };
  });
}

/**
 * Generate a unique ID for a queued mutation
 */
function generateMutationId(): string {
  return `mutation_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Add a mutation to the sync queue
 */
export async function queueMutation(
  storeName: string,
  mutationType: MutationType,
  functionName: string,
  args: Record<string, any>,
  localId?: string
): Promise<string> {
  const db = await initSyncQueueStore();

  const mutation: QueuedMutation = {
    id: generateMutationId(),
    timestamp: Date.now(),
    storeName,
    mutationType,
    functionName,
    args,
    retryCount: 0,
    status: 'pending',
    localId,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const request = store.add(mutation);

    request.onsuccess = () => resolve(mutation.id);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all pending mutations from the queue
 */
export async function getPendingMutations(): Promise<QueuedMutation[]> {
  const db = await initSyncQueueStore();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_QUEUE_STORE, 'readonly');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const index = store.index('by_status');
    const request = index.getAll('pending');

    request.onsuccess = () => {
      // Sort by timestamp to ensure correct order
      const mutations = request.result.sort((a, b) => a.timestamp - b.timestamp);
      resolve(mutations);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all mutations in the queue
 */
export async function getAllMutations(): Promise<QueuedMutation[]> {
  const db = await initSyncQueueStore();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_QUEUE_STORE, 'readonly');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const mutations = request.result.sort((a, b) => a.timestamp - b.timestamp);
      resolve(mutations);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Update a mutation's status in the queue
 */
export async function updateMutationStatus(
  mutationId: string,
  status: QueuedMutation['status'],
  error?: string,
  serverId?: string
): Promise<void> {
  const db = await initSyncQueueStore();

  return new Promise(async (resolve, reject) => {
    const transaction = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const getRequest = store.get(mutationId);

    getRequest.onsuccess = () => {
      const mutation = getRequest.result;
      if (!mutation) {
        reject(new Error(`Mutation ${mutationId} not found`));
        return;
      }

      mutation.status = status;
      if (error) mutation.error = error;
      if (serverId) mutation.serverId = serverId;
      if (status === 'failed') mutation.retryCount++;

      const putRequest = store.put(mutation);
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}

/**
 * Remove a mutation from the queue
 */
export async function removeMutation(mutationId: string): Promise<void> {
  const db = await initSyncQueueStore();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const request = store.delete(mutationId);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear completed and old failed mutations from the queue
 */
export async function cleanupQueue(): Promise<void> {
  const db = await initSyncQueueStore();
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const mutations = request.result;

      mutations.forEach((mutation) => {
        // Remove completed mutations or old failed mutations
        if (
          mutation.status === 'completed' ||
          (mutation.status === 'failed' && mutation.timestamp < oneDayAgo)
        ) {
          store.delete(mutation.id);
        }
      });

      transaction.oncomplete = () => resolve();
    };

    request.onerror = () => reject(request.error);
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Sync a single mutation with retry logic
 */
async function syncMutation(
  mutation: QueuedMutation,
  convexMutate: (functionName: string, args: any) => Promise<any>
): Promise<{ success: boolean; error?: string; serverId?: string }> {
  try {
    // Update status to syncing
    await updateMutationStatus(mutation.id, 'syncing');

    // Execute the Convex mutation
    const result = await convexMutate(mutation.functionName, mutation.args);

    // Update status to completed
    await updateMutationStatus(mutation.id, 'completed', undefined, result?._id);

    return { success: true, serverId: result?._id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check if we should retry
    if (mutation.retryCount < MAX_RETRY_ATTEMPTS) {
      // Wait before retrying
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY_MS * (mutation.retryCount + 1))
      );

      // Update status back to pending for retry
      await updateMutationStatus(mutation.id, 'pending', errorMessage);

      return { success: false, error: errorMessage };
    } else {
      // Max retries reached, mark as failed
      await updateMutationStatus(mutation.id, 'failed', errorMessage);

      return { success: false, error: errorMessage };
    }
  }
}

/**
 * Sync all pending mutations in the queue
 */
export async function syncAllMutations(
  convexMutate: (functionName: string, args: any) => Promise<any>,
  onProgress?: (completed: number, total: number) => void
): Promise<SyncResult> {
  const pendingMutations = await getPendingMutations();

  if (pendingMutations.length === 0) {
    return {
      success: true,
      syncedCount: 0,
      failedCount: 0,
      errors: [],
    };
  }

  let syncedCount = 0;
  let failedCount = 0;
  const errors: Array<{ mutation: QueuedMutation; error: string }> = [];

  for (let i = 0; i < pendingMutations.length; i++) {
    const mutation = pendingMutations[i];
    const result = await syncMutation(mutation, convexMutate);

    if (result.success) {
      syncedCount++;
    } else {
      failedCount++;
      errors.push({ mutation, error: result.error || 'Unknown error' });
    }

    // Call progress callback
    if (onProgress) {
      onProgress(i + 1, pendingMutations.length);
    }
  }

  // Cleanup old mutations
  await cleanupQueue();

  return {
    success: failedCount === 0,
    syncedCount,
    failedCount,
    errors,
  };
}

/**
 * Get the count of pending mutations
 */
export async function getPendingMutationCount(): Promise<number> {
  const mutations = await getPendingMutations();
  return mutations.length;
}

/**
 * Clear all mutations from the queue (use with caution)
 */
export async function clearQueue(): Promise<void> {
  const db = await initSyncQueueStore();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
