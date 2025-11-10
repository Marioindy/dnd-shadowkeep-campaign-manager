/**
 * Offline Mode - Barrel Export
 *
 * Central export point for all offline mode functionality.
 */

// Storage
export {
  initDB,
  getFromStore,
  getAllFromStore,
  getByIndex,
  putToStore,
  bulkPutToStore,
  deleteFromStore,
  clearStore,
  getSyncMetadata,
  updateSyncMetadata,
  clearAllData,
  isIndexedDBAvailable,
  STORES,
  type StoreName,
  type SyncMetadata,
} from './storage';

// Sync Queue
export {
  queueMutation,
  getPendingMutations,
  getAllMutations,
  updateMutationStatus,
  removeMutation,
  cleanupQueue,
  syncAllMutations,
  getPendingMutationCount,
  clearQueue,
  type MutationType,
  type QueuedMutation,
  type SyncResult,
} from './syncQueue';

// Conflict Resolution
export {
  detectConflicts,
  resolveConflicts,
  autoResolveConflicts,
  needsConflictResolution,
  createConflictReport,
  mergeArrays,
  deepMerge,
  type ConflictStrategy,
  type ConflictData,
  type ConflictResolutionResult,
  type ConflictReport,
} from './conflictResolution';

// Service Worker
export {
  registerServiceWorker,
  unregisterServiceWorker,
  updateServiceWorker,
  skipWaiting,
  clearServiceWorkerCaches,
  isServiceWorkerActive,
  addServiceWorkerMessageListener,
  requestBackgroundSync,
  type ServiceWorkerConfig,
} from './serviceWorkerRegistration';
