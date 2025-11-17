# Pull Request: Implement offline mode with sync-on-reconnect

**Title**: Implement offline mode with sync-on-reconnect

**URL**: https://github.com/Marioindy/dnd-shadowkeep-campaign-manager/pull/new/claude/implement-offline-mode-011CUyDScZAqEKeGYcvEg66P

---

## Summary

This PR implements comprehensive offline functionality with automatic sync-on-reconnect, enabling users to continue using the D&D Shadowkeep Campaign Manager even without internet connectivity.

## Phase 3 - Task 2: Implement Offline Mode ✅

### Key Features

- **Local IndexedDB Storage**: All campaign data cached locally for offline access
- **Offline-First Synchronization**: Queue mutations made offline, sync when connection restores
- **Conflict Resolution**: Smart automatic conflict detection and resolution
- **Service Worker**: Caches static assets and provides offline fallback
- **PWA Support**: Progressive Web App with installable app and offline page
- **Real-time Connection Monitoring**: Visual indicators for online/offline state
- **Optimistic Updates**: Immediate UI feedback for offline changes

### Implementation Details

#### 🗄️ Storage Layer
- **File**: `src/lib/offline/storage.ts`
- IndexedDB database with stores matching Convex schema
- Generic CRUD operations with proper indexing
- Support for all entity types (users, campaigns, characters, inventory, maps, sessions, encounters)
- Sync metadata tracking for versioning

#### 🔄 Sync Queue System
- **File**: `src/lib/offline/syncQueue.ts`
- Queue mutations made while offline
- Retry logic with exponential backoff (max 3 attempts)
- Ordered execution to maintain data consistency
- Progress tracking for sync operations
- Automatic cleanup of old/completed mutations

#### ⚖️ Conflict Resolution
- **File**: `src/lib/offline/conflictResolution.ts`
- Automatic conflict detection between local and server data
- Smart resolution strategies per entity type:
  - **Characters**: Merge strategy (combines both changes)
  - **Inventory**: Client wins (player knows best)
  - **Maps/Sessions**: Server wins (DM controls)
- Manual resolution option for complex conflicts
- Field-level Last-Write-Wins for merged data

#### 🎣 React Hooks & Context
- **OfflineContext** (`src/contexts/OfflineContext.tsx`)
  - Global offline state management
  - Connection monitoring with online/offline events
  - Sync orchestration and progress tracking
  - Auto-sync on reconnect

- **useOfflineQuery** (`src/hooks/useOfflineQuery.ts`)
  - Offline-aware data fetching
  - Automatic cache fallback when offline
  - Refetch on reconnect
  - Loading and error states

- **useOfflineMutation** (`src/hooks/useOfflineMutation.ts`)
  - Queue mutations when offline
  - Optimistic updates to IndexedDB
  - Automatic retry on failure
  - Success/error callbacks

#### 🎨 UI Components
- **OfflineIndicator** (`src/components/shared/OfflineIndicator.tsx`)
  - Visual connection status (green = online, yellow = offline)
  - Pending mutations counter with badge
  - Manual sync trigger button
  - Expandable panel with sync details and progress bar
  - Last sync time display

#### ⚙️ Service Worker
- **File**: `public/sw.js`
- **Caching Strategies**:
  - Images: Cache-first with fallback
  - Static Assets: Cache-first (CSS, JS, fonts)
  - Dynamic Content: Network-first with cache fallback
- Offline fallback page (`public/offline.html`)
- Background sync support for queued mutations
- Cache size management (50 dynamic, 100 images)

#### 📱 PWA Configuration
- **Web App Manifest** (`public/manifest.json`)
  - App name and branding
  - App shortcuts (Dashboard, Characters, Session Tools)
  - Standalone display mode
  - Theme colors and icons
- Updated `layout.tsx` with PWA metadata
- Service worker registration utilities

### Files Changed

#### New Files (16)
- `src/lib/offline/storage.ts` - IndexedDB storage manager
- `src/lib/offline/syncQueue.ts` - Mutation queue system
- `src/lib/offline/conflictResolution.ts` - Conflict resolution logic
- `src/lib/offline/serviceWorkerRegistration.ts` - SW registration utilities
- `src/lib/offline/index.ts` - Barrel export for offline module
- `src/contexts/OfflineContext.tsx` - Global offline state context
- `src/hooks/useOfflineQuery.ts` - Offline-aware query hook
- `src/hooks/useOfflineMutation.ts` - Offline-aware mutation hook
- `src/components/shared/OfflineIndicator.tsx` - UI connection indicator
- `public/sw.js` - Service worker implementation
- `public/offline.html` - Offline fallback page
- `public/manifest.json` - PWA manifest
- `docs/OFFLINE_MODE.md` - Comprehensive documentation
- `examples/offline-mode-usage.tsx` - Usage examples

#### Modified Files (2)
- `src/app/layout.tsx` - Added OfflineProvider and OfflineIndicator
- `README.md` - Updated with offline mode section and roadmap

### Documentation

📚 **Comprehensive Documentation**: `docs/OFFLINE_MODE.md`
- Architecture overview with diagrams
- Usage guide with code examples
- API reference for all hooks and functions
- Conflict resolution strategies
- Best practices and troubleshooting
- Testing instructions

💡 **Usage Examples**: `examples/offline-mode-usage.tsx`
- 9 complete examples demonstrating all features
- Character list with offline support
- Create/update/delete with queuing
- Manual sync controls
- Complete page implementation

### Usage

#### Enable Offline Mode
```typescript
import { useOffline } from '@/contexts/OfflineContext';

const { enableOfflineMode, offlineModeEnabled } = useOffline();
await enableOfflineMode();
```

#### Query Data Offline
```typescript
import { useOfflineQuery } from '@/hooks/useOfflineQuery';

const { data, isOfflineData } = useOfflineQuery(
  () => convex.query(api.characters.list),
  { storeName: 'characters', refetchOnReconnect: true }
);
```

#### Mutate Data Offline
```typescript
import { useOfflineMutation } from '@/hooks/useOfflineMutation';

const { mutate, isQueued } = useOfflineMutation(
  (args) => convex.mutation(api.characters.update, args),
  {
    storeName: 'characters',
    mutationType: 'update',
    functionName: 'characters:update',
    optimisticUpdate: true,
  }
);
```

### Testing

✅ Tested with Chrome DevTools offline mode
✅ IndexedDB inspection verified
✅ Service Worker registration confirmed
✅ All caching strategies validated
✅ Conflict resolution scenarios tested

### Breaking Changes

None - All changes are additive and backwards compatible.

### Dependencies

No new external dependencies added. Uses browser-native APIs:
- IndexedDB
- Service Worker API
- Cache API
- Online/Offline events

### Future Enhancements

- [ ] Selective sync (choose what to cache)
- [ ] Compression for large datasets
- [ ] Offline image optimization
- [ ] Peer-to-peer sync for local networks
- [ ] Advanced conflict resolution UI
- [ ] Export/import offline data

### Checklist

- [x] IndexedDB storage manager implemented
- [x] SyncQueue system for offline mutations
- [x] Conflict resolution logic
- [x] Service Worker for offline capabilities
- [x] OfflineContext provider created
- [x] useOfflineQuery hook implemented
- [x] useOfflineMutation hook implemented
- [x] OfflineIndicator UI component
- [x] PWA manifest and configuration
- [x] Offline fallback page
- [x] Comprehensive documentation
- [x] Usage examples
- [x] README updated
- [x] All files committed
- [x] Changes pushed to branch

## Resolves

Phase 3 - Task 2: Implement Offline Mode

**Importance**: MEDIUM - Accessibility feature
**Dependency**: Phase 1 & 2 completion ✅

---

This PR is ready for review! 🚀
