/**
 * Conflict Resolution for Concurrent Edits
 *
 * Handles conflicts when offline changes collide with server updates.
 * Uses Last-Write-Wins (LWW) strategy with version tracking.
 */

export type ConflictStrategy = 'server-wins' | 'client-wins' | 'merge' | 'prompt';

export interface ConflictData<T = any> {
  field: string;
  serverValue: T;
  clientValue: T;
  lastSyncTime: number;
  serverUpdateTime: number;
}

export interface ConflictResolutionResult<T = any> {
  resolved: boolean;
  data: T;
  conflicts: ConflictData[];
  strategy: ConflictStrategy;
}

/**
 * Detect conflicts between local and server data
 */
export function detectConflicts<T extends Record<string, any>>(
  localData: T,
  serverData: T,
  lastSyncTime: number
): ConflictData[] {
  const conflicts: ConflictData[] = [];

  // Compare each field
  Object.keys(localData).forEach((field) => {
    // Skip metadata fields
    if (field === '_id' || field === '_creationTime') {
      return;
    }

    const localValue = localData[field];
    const serverValue = serverData[field];

    // Check if values differ
    if (JSON.stringify(localValue) !== JSON.stringify(serverValue)) {
      conflicts.push({
        field,
        serverValue,
        clientValue: localValue,
        lastSyncTime,
        serverUpdateTime: serverData.updatedAt || Date.now(),
      });
    }
  });

  return conflicts;
}

/**
 * Resolve conflicts using the specified strategy
 */
export function resolveConflicts<T extends Record<string, any>>(
  localData: T,
  serverData: T,
  conflicts: ConflictData[],
  strategy: ConflictStrategy = 'server-wins'
): ConflictResolutionResult<T> {
  if (conflicts.length === 0) {
    return {
      resolved: true,
      data: serverData,
      conflicts: [],
      strategy,
    };
  }

  switch (strategy) {
    case 'server-wins':
      return {
        resolved: true,
        data: serverData,
        conflicts,
        strategy: 'server-wins',
      };

    case 'client-wins':
      return {
        resolved: true,
        data: localData,
        conflicts,
        strategy: 'client-wins',
      };

    case 'merge':
      return mergeConflicts(localData, serverData, conflicts);

    case 'prompt':
      // Return unresolved - UI should prompt user
      return {
        resolved: false,
        data: serverData,
        conflicts,
        strategy: 'prompt',
      };

    default:
      // Default to server wins
      return {
        resolved: true,
        data: serverData,
        conflicts,
        strategy: 'server-wins',
      };
  }
}

/**
 * Merge conflicts using field-level Last-Write-Wins
 */
function mergeConflicts<T extends Record<string, any>>(
  localData: T,
  serverData: T,
  conflicts: ConflictData[]
): ConflictResolutionResult<T> {
  const mergedData = { ...serverData };

  conflicts.forEach((conflict) => {
    // Use the most recent change (Last-Write-Wins)
    if (conflict.serverUpdateTime > conflict.lastSyncTime) {
      // Server has newer data
      mergedData[conflict.field] = conflict.serverValue;
    } else {
      // Client has newer data
      mergedData[conflict.field] = conflict.clientValue;
    }
  });

  return {
    resolved: true,
    data: mergedData,
    conflicts,
    strategy: 'merge',
  };
}

/**
 * Auto-resolve conflicts for specific data types
 */
export function autoResolveConflicts<T extends Record<string, any>>(
  localData: T,
  serverData: T,
  lastSyncTime: number,
  entityType: string
): ConflictResolutionResult<T> {
  const conflicts = detectConflicts(localData, serverData, lastSyncTime);

  if (conflicts.length === 0) {
    return {
      resolved: true,
      data: serverData,
      conflicts: [],
      strategy: 'server-wins',
    };
  }

  // Define auto-resolution strategies per entity type
  const strategies: Record<string, ConflictStrategy> = {
    // Characters: merge stats, server wins for narrative fields
    characters: 'merge',

    // Inventory: client wins (player knows best what they have)
    inventory: 'client-wins',

    // Maps/Markers: server wins (DM controls)
    maps: 'server-wins',
    mapMarkers: 'server-wins',

    // Sessions/Encounters: server wins (DM controls)
    sessions: 'server-wins',
    encounters: 'server-wins',

    // Campaigns: server wins
    campaigns: 'server-wins',

    // Users: server wins
    users: 'server-wins',
  };

  const strategy = strategies[entityType] || 'server-wins';

  return resolveConflicts(localData, serverData, conflicts, strategy);
}

/**
 * Check if data needs conflict resolution
 */
export function needsConflictResolution<T extends Record<string, any>>(
  localData: T,
  serverData: T,
  lastSyncTime: number
): boolean {
  const conflicts = detectConflicts(localData, serverData, lastSyncTime);
  return conflicts.length > 0;
}

/**
 * Create a conflict report for UI display
 */
export interface ConflictReport {
  entityType: string;
  entityId: string;
  conflictCount: number;
  conflicts: Array<{
    field: string;
    localValue: any;
    serverValue: any;
    recommendation: 'use-server' | 'use-client' | 'manual-review';
  }>;
}

export function createConflictReport(
  entityType: string,
  entityId: string,
  conflicts: ConflictData[]
): ConflictReport {
  return {
    entityType,
    entityId,
    conflictCount: conflicts.length,
    conflicts: conflicts.map((conflict) => ({
      field: conflict.field,
      localValue: conflict.clientValue,
      serverValue: conflict.serverValue,
      recommendation:
        conflict.serverUpdateTime > conflict.lastSyncTime
          ? 'use-server'
          : 'use-client',
    })),
  };
}

/**
 * Merge arrays with conflict detection
 */
export function mergeArrays<T>(
  localArray: T[],
  serverArray: T[],
  getId: (item: T) => string
): T[] {
  const merged = new Map<string, T>();

  // Add all server items
  serverArray.forEach((item) => {
    merged.set(getId(item), item);
  });

  // Add or update with local items
  localArray.forEach((item) => {
    const id = getId(item);
    if (!merged.has(id)) {
      merged.set(id, item);
    }
    // If both have it, server version wins by default
  });

  return Array.from(merged.values());
}

/**
 * Deep merge two objects with conflict tracking
 */
export function deepMerge<T extends Record<string, any>>(
  local: T,
  server: T,
  preferServer: boolean = true
): T {
  const result: any = { ...server };

  Object.keys(local).forEach((key) => {
    if (!(key in server)) {
      // Key only in local, use it
      result[key] = local[key];
    } else if (typeof local[key] === 'object' && typeof server[key] === 'object') {
      if (Array.isArray(local[key]) && Array.isArray(server[key])) {
        // Arrays: prefer server by default
        result[key] = preferServer ? server[key] : local[key];
      } else {
        // Objects: recursive merge
        result[key] = deepMerge(local[key], server[key], preferServer);
      }
    } else {
      // Primitives: use strategy
      result[key] = preferServer ? server[key] : local[key];
    }
  });

  return result;
}
