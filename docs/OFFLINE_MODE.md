# Offline Mode Documentation

## Overview

The Shadowkeep Campaign Manager implements a comprehensive offline-first architecture that allows users to continue using the application even when network connectivity is unavailable. All data is cached locally, changes are queued, and automatic synchronization occurs when the connection is restored.

## Features

### 1. Local Data Storage
- **IndexedDB**: All campaign data is stored locally using IndexedDB
- **Automatic Caching**: Data fetched from Convex is automatically cached for offline access
- **Persistent Storage**: Data persists across browser sessions

### 2. Offline Mutation Queue
- **Queue System**: Mutations made while offline are queued for later sync
- **Optimistic Updates**: UI updates immediately with local changes
- **Automatic Retry**: Failed syncs are retried with exponential backoff
- **Ordered Execution**: Mutations are synced in the order they were created

### 3. Conflict Resolution
- **Automatic Detection**: Conflicts between local and server data are detected
- **Smart Resolution**: Different strategies for different entity types:
  - **Characters**: Merge strategy (combines changes)
  - **Inventory**: Client wins (player knows best)
  - **Maps/Sessions**: Server wins (DM controls)
- **Manual Resolution**: Complex conflicts can be resolved manually

### 4. Service Worker
- **Asset Caching**: Static assets cached for offline use
- **Network Strategies**:
  - Images: Cache-first
  - Static Assets: Cache-first
  - Dynamic Content: Network-first with cache fallback
- **Background Sync**: Automatic sync when connection is restored

### 5. Progressive Web App (PWA)
- **Installable**: Can be installed as a standalone app
- **App Shortcuts**: Quick access to Dashboard, Characters, and Session Tools
- **Offline Page**: Custom offline fallback page

## Architecture

```
┌─────────────────────────────────────────┐
│           React Components              │
│  (useOfflineQuery, useOfflineMutation)  │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│        Offline Context                  │
│   - Connection monitoring               │
│   - Sync orchestration                  │
│   - State management                    │
└─────────────┬───────────────────────────┘
              │
      ┌───────┴───────┐
      │               │
┌─────▼─────┐   ┌────▼──────┐
│ IndexedDB │   │ SyncQueue │
│  Storage  │   │  System   │
└───────────┘   └────┬──────┘
                     │
              ┌──────▼────────┐
              │   Convex      │
              │   Backend     │
              └───────────────┘
```

## Usage

### Enabling Offline Mode

Offline mode is integrated into the application automatically. To enable it:

```typescript
import { useOffline } from '@/contexts/OfflineContext';

function MyComponent() {
  const { enableOfflineMode, offlineModeEnabled } = useOffline();

  const handleEnable = async () => {
    await enableOfflineMode();
  };

  return (
    <button onClick={handleEnable}>
      {offlineModeEnabled ? 'Offline Mode Active' : 'Enable Offline Mode'}
    </button>
  );
}
```

### Using Offline Queries

Replace standard Convex queries with offline-aware queries:

```typescript
import { useOfflineQuery } from '@/hooks/useOfflineQuery';
import { api } from '../../../convex/_generated/api';

function CharacterList() {
  const { data, isLoading, isOfflineData } = useOfflineQuery(
    () => convex.query(api.characters.list, { userId }),
    {
      storeName: 'characters',
      refetchOnReconnect: true,
    }
  );

  return (
    <div>
      {isOfflineData && <Badge>Offline Data</Badge>}
      {data?.map(character => <CharacterCard key={character._id} {...character} />)}
    </div>
  );
}
```

### Using Offline Mutations

Replace standard Convex mutations with offline-aware mutations:

```typescript
import { useOfflineMutation } from '@/hooks/useOfflineMutation';
import { api } from '../../../convex/_generated/api';

function UpdateCharacter() {
  const { mutate, isQueued } = useOfflineMutation(
    (args) => convex.mutation(api.characters.update, args),
    {
      storeName: 'characters',
      mutationType: 'update',
      functionName: 'characters:update',
      optimisticUpdate: true,
    }
  );

  const handleUpdate = async () => {
    await mutate({ id: characterId, hp: newHp });
    if (isQueued) {
      toast.info('Change queued for sync');
    }
  };

  return <button onClick={handleUpdate}>Update HP</button>;
}
```

### Manual Sync

Trigger sync manually:

```typescript
import { useOffline } from '@/contexts/OfflineContext';

function SyncButton() {
  const { syncNow, isSyncing, pendingMutations } = useOffline();

  return (
    <button onClick={syncNow} disabled={isSyncing}>
      {isSyncing ? 'Syncing...' : `Sync ${pendingMutations} changes`}
    </button>
  );
}
```

## API Reference

### OfflineContext

```typescript
interface OfflineContextValue {
  // State
  isOnline: boolean;
  isInitialized: boolean;
  isSyncing: boolean;
  lastSyncTime: number | null;
  pendingMutations: number;
  syncProgress: { completed: number; total: number } | null;
  offlineModeEnabled: boolean;
  autoSyncEnabled: boolean;

  // Actions
  syncNow: () => Promise<SyncResult>;
  enableOfflineMode: () => Promise<void>;
  disableOfflineMode: () => Promise<void>;
  addMutation: (storeName, mutationType, functionName, args) => Promise<string>;
  cacheData: <T>(storeName: StoreName, items: T[]) => Promise<void>;
  getCachedData: <T>(storeName: StoreName) => Promise<T[]>;
  setAutoSyncEnabled: (enabled: boolean) => void;
}
```

### useOfflineQuery

```typescript
function useOfflineQuery<T>(
  convexQuery: (() => Promise<T>) | null,
  options: {
    storeName: StoreName;
    indexName?: string;
    indexValue?: string | number;
    enabled?: boolean;
    refetchOnReconnect?: boolean;
  }
): {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isOfflineData: boolean;
  refetch: () => Promise<void>;
}
```

### useOfflineMutation

```typescript
function useOfflineMutation<TArgs, TResult>(
  convexMutation: ((args: TArgs) => Promise<TResult>) | null,
  options: {
    storeName: StoreName;
    mutationType: 'create' | 'update' | 'delete';
    functionName: string;
    optimisticUpdate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
  }
): {
  mutate: (args: TArgs) => Promise<TResult | null>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isQueued: boolean;
  reset: () => void;
}
```

## Conflict Resolution Strategies

### Server Wins (Default)
Used for DM-controlled data (maps, sessions, encounters)
```typescript
// Server data takes precedence
const resolved = resolveConflicts(localData, serverData, conflicts, 'server-wins');
```

### Client Wins
Used for player-controlled data (inventory)
```typescript
// Client data takes precedence
const resolved = resolveConflicts(localData, serverData, conflicts, 'client-wins');
```

### Merge
Used for character stats (combines both changes)
```typescript
// Merge both changes using Last-Write-Wins per field
const resolved = resolveConflicts(localData, serverData, conflicts, 'merge');
```

### Manual (Prompt User)
For complex conflicts
```typescript
// Return unresolved for UI to handle
const resolved = resolveConflicts(localData, serverData, conflicts, 'prompt');
if (!resolved.resolved) {
  // Show conflict resolution UI
}
```

## Best Practices

### 1. Always Use Offline Hooks
```typescript
// ✅ Good - Offline support
const { data } = useOfflineQuery(query, { storeName: 'characters' });

// ❌ Bad - No offline support
const data = useQuery(api.characters.list);
```

### 2. Enable Optimistic Updates
```typescript
// ✅ Good - Immediate UI feedback
const { mutate } = useOfflineMutation(mutation, {
  storeName: 'characters',
  mutationType: 'update',
  functionName: 'characters:update',
  optimisticUpdate: true, // ← Enable this
});
```

### 3. Handle Offline State in UI
```typescript
// ✅ Good - Clear offline indication
{isOfflineData && (
  <div className="offline-badge">
    📡 Offline Data - Will sync when online
  </div>
)}
```

### 4. Provide Sync Feedback
```typescript
// ✅ Good - User knows what's happening
{pendingMutations > 0 && (
  <div className="sync-status">
    {pendingMutations} changes pending sync
  </div>
)}
```

## Troubleshooting

### Service Worker Not Registering
```javascript
// Check browser console for errors
// Ensure /sw.js is accessible
// Verify HTTPS (required for service workers)

// Manual registration
import { registerServiceWorker } from '@/lib/offline';
await registerServiceWorker({
  onSuccess: () => console.log('SW registered'),
  onError: (error) => console.error('SW error:', error),
});
```

### Data Not Syncing
```javascript
// Check pending mutations
const { pendingMutations } = useOffline();
console.log('Pending:', pendingMutations);

// Manually trigger sync
const { syncNow } = useOffline();
await syncNow();

// Check sync queue
import { getAllMutations } from '@/lib/offline';
const mutations = await getAllMutations();
console.log('Queue:', mutations);
```

### IndexedDB Quota Exceeded
```javascript
// Clear old data
import { clearAllData } from '@/lib/offline';
await clearAllData();

// Or clear specific stores
import { clearStore } from '@/lib/offline';
await clearStore('characters');
```

## Limitations

1. **Storage Quota**: Browser-dependent (typically 50-100MB)
2. **Large Files**: Images/documents may exceed quota
3. **Real-time Sync**: Convex real-time subscriptions don't work offline
4. **Conflict Complexity**: Some conflicts require manual resolution
5. **Background Sync**: Limited support in Safari/iOS

## Future Enhancements

- [ ] Selective sync (choose what to cache)
- [ ] Compression for large datasets
- [ ] Offline image optimization
- [ ] Peer-to-peer sync for local networks
- [ ] Export/import offline data
- [ ] Advanced conflict resolution UI

## Testing Offline Mode

### Chrome DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Select "Offline" from throttling dropdown
4. Test application functionality

### Service Worker Testing
1. Open DevTools → Application → Service Workers
2. Check registration status
3. Update/unregister as needed
4. View cached resources in Cache Storage

### IndexedDB Inspection
1. Open DevTools → Application → IndexedDB
2. Expand shadowkeep_offline_db
3. View stored data
4. Manually modify/delete for testing

## Support

For issues or questions about offline mode:
- Check the [GitHub Issues](https://github.com/Marioindy/dnd-shadowkeep-campaign-manager/issues)
- Review the source code in `src/lib/offline/`
- Contact the development team
