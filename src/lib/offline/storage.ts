/**
 * IndexedDB Storage Manager for Offline Mode
 *
 * Provides a local storage layer for all Convex data to enable offline functionality.
 * Uses IndexedDB for structured data storage with proper indexing.
 */

import type { Id } from '../../../convex/_generated/dataModel';

const DB_NAME = 'shadowkeep_offline_db';
const DB_VERSION = 1;

// Store names matching Convex tables
export const STORES = {
  users: 'users',
  campaigns: 'campaigns',
  characters: 'characters',
  inventory: 'inventory',
  maps: 'maps',
  mapMarkers: 'mapMarkers',
  sessions: 'sessions',
  encounters: 'encounters',
  metadata: 'metadata', // For tracking sync state
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

export interface SyncMetadata {
  storeName: StoreName;
  lastSyncTime: number;
  version: number;
}

/**
 * Initialize IndexedDB database with all required object stores
 */
export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores with indexes
      if (!db.objectStoreNames.contains(STORES.users)) {
        const userStore = db.createObjectStore(STORES.users, { keyPath: '_id' });
        userStore.createIndex('by_username', 'username', { unique: true });
        userStore.createIndex('by_role', 'role', { unique: false });
        userStore.createIndex('by_campaign', 'campaignId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.campaigns)) {
        const campaignStore = db.createObjectStore(STORES.campaigns, { keyPath: '_id' });
        campaignStore.createIndex('by_dm', 'dmId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.characters)) {
        const characterStore = db.createObjectStore(STORES.characters, { keyPath: '_id' });
        characterStore.createIndex('by_user', 'userId', { unique: false });
        characterStore.createIndex('by_campaign', 'campaignId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.inventory)) {
        const inventoryStore = db.createObjectStore(STORES.inventory, { keyPath: '_id' });
        inventoryStore.createIndex('by_character', 'characterId', { unique: false });
        inventoryStore.createIndex('by_type', 'type', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.maps)) {
        const mapStore = db.createObjectStore(STORES.maps, { keyPath: '_id' });
        mapStore.createIndex('by_campaign', 'campaignId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.mapMarkers)) {
        const markerStore = db.createObjectStore(STORES.mapMarkers, { keyPath: '_id' });
        markerStore.createIndex('by_map', 'mapId', { unique: false });
        markerStore.createIndex('by_type', 'type', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.sessions)) {
        const sessionStore = db.createObjectStore(STORES.sessions, { keyPath: '_id' });
        sessionStore.createIndex('by_campaign', 'campaignId', { unique: false });
        sessionStore.createIndex('by_active', 'active', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.encounters)) {
        const encounterStore = db.createObjectStore(STORES.encounters, { keyPath: '_id' });
        encounterStore.createIndex('by_session', 'sessionId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.metadata)) {
        db.createObjectStore(STORES.metadata, { keyPath: 'storeName' });
      }
    };
  });
}

/**
 * Generic get operation from IndexedDB
 */
export async function getFromStore<T>(
  storeName: StoreName,
  key: string
): Promise<T | undefined> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Generic get all operation from IndexedDB
 */
export async function getAllFromStore<T>(storeName: StoreName): Promise<T[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Generic get by index operation
 */
export async function getByIndex<T>(
  storeName: StoreName,
  indexName: string,
  value: string | number
): Promise<T[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Generic put operation to IndexedDB
 */
export async function putToStore<T extends { _id: string }>(
  storeName: StoreName,
  data: T
): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Generic bulk put operation to IndexedDB
 */
export async function bulkPutToStore<T extends { _id: string }>(
  storeName: StoreName,
  items: T[]
): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    items.forEach((item) => {
      store.put(item);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Generic delete operation from IndexedDB
 */
export async function deleteFromStore(
  storeName: StoreName,
  key: string
): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear all data from a store
 */
export async function clearStore(storeName: StoreName): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get sync metadata for a store
 */
export async function getSyncMetadata(
  storeName: StoreName
): Promise<SyncMetadata | undefined> {
  return getFromStore<SyncMetadata>(STORES.metadata, storeName);
}

/**
 * Update sync metadata for a store
 */
export async function updateSyncMetadata(
  storeName: StoreName,
  lastSyncTime: number,
  version: number
): Promise<void> {
  const metadata: SyncMetadata = {
    storeName,
    lastSyncTime,
    version,
  };
  return putToStore(STORES.metadata, metadata as any);
}

/**
 * Clear all offline data (useful for logout)
 */
export async function clearAllData(): Promise<void> {
  const db = await initDB();
  const storeNames = Object.values(STORES);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeNames, 'readwrite');

    storeNames.forEach((storeName) => {
      transaction.objectStore(storeName).clear();
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Check if IndexedDB is available
 */
export function isIndexedDBAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined';
  } catch {
    return false;
  }
}
