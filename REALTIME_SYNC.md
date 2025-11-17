# Real-Time Data Synchronization Implementation

## Overview

This document describes the real-time data synchronization system implemented for the D&D Shadowkeep Campaign Manager. The system ensures that all connected clients receive instant updates when data changes, providing a seamless collaborative experience for players and DMs.

## Architecture

### Core Components

1. **Convex Backend** - Provides real-time database with automatic subscriptions
2. **React Hooks** - Custom hooks that subscribe to real-time data
3. **Offline Queue System** - Handles network disconnections gracefully
4. **Authentication Context** - Manages user sessions and permissions

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 2. Initialize Convex

```bash
# Install dependencies (already in package.json)
npm install

# Initialize Convex (first time setup)
npx convex dev

# This will:
# - Create a new Convex project
# - Generate API code in convex/_generated/
# - Start the Convex dev server
# - Watch for changes to convex/*.ts files
```

### 3. Run the Application

```bash
# Terminal 1: Run Convex dev server
npx convex dev

# Terminal 2: Run Next.js dev server
npm run dev
```

## Features Implemented

### ✅ Real-Time Data Sync

All data tables have real-time subscriptions:
- **Characters** - Stats, HP, level changes sync instantly
- **Inventory** - Item changes, equip/unequip actions
- **Maps** - Map uploads and updates
- **Map Markers** - Fog of war, player positions
- **Sessions** - Active session state, notes
- **Campaigns** - Player roster, settings

### ✅ Offline Support

- **Network Detection** - Automatically detects online/offline state
- **Mutation Queue** - Stores mutations when offline
- **Auto-Sync** - Retries queued mutations when connection restored
- **Visual Indicator** - Shows offline status to users

### ✅ Authentication

- Session-based authentication
- Role-based access (Player, DM, Admin)
- Secure password hashing (placeholder - needs production-grade implementation)
- Protected routes (to be implemented in middleware)

## File Structure

### Backend (Convex Functions)

```
convex/
├── schema.ts              # Database schema definition
├── auth.ts                # Authentication mutations & queries
├── characters.ts          # Character CRUD operations
├── campaigns.ts           # Campaign management
├── inventory.ts           # Inventory management
├── maps.ts                # Map CRUD operations
├── mapMarkers.ts          # Fog of war & markers
└── sessions.ts            # Session tracking
```

### Frontend Hooks

```
src/hooks/
├── useCharacters.ts       # Character subscription hooks
├── useInventory.ts        # Inventory subscription hooks
├── useMaps.ts             # Map subscription hooks
├── useMapMarkers.ts       # Map marker subscription hooks
├── useCampaigns.ts        # Campaign subscription hooks
└── useSessions.ts         # Session subscription hooks
```

### Context Providers

```
src/contexts/
├── AuthContext.tsx        # User authentication state
└── OfflineContext.tsx     # Offline queue management

src/providers/
└── ConvexClientProvider.tsx  # Convex client wrapper
```

## Usage Examples

### Querying Real-Time Data

```typescript
'use client';

import { useCharactersByUser } from '@/hooks/useCharacters';
import { useAuth } from '@/contexts/AuthContext';

export function MyComponent() {
  const { user } = useAuth();
  const { characters, isLoading } = useCharactersByUser(user?._id);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {characters?.map(char => (
        <div key={char._id}>{char.name}</div>
      ))}
    </div>
  );
}
```

### Mutating Data

```typescript
'use client';

import { useCharacterMutations } from '@/hooks/useCharacters';

export function UpdateHPButton({ characterId, newHP }: Props) {
  const { updateHP } = useCharacterMutations();

  const handleClick = async () => {
    try {
      await updateHP({ id: characterId, hp: newHP });
      // All connected clients will see the update automatically!
    } catch (error) {
      console.error('Failed to update HP:', error);
    }
  };

  return <button onClick={handleClick}>Update HP</button>;
}
```

### Using Offline Queue

The offline queue is automatically integrated. Mutations will be queued when offline:

```typescript
'use client';

import { useOffline } from '@/contexts/OfflineContext';

export function MyComponent() {
  const { isOnline, pendingMutations } = useOffline();

  return (
    <div>
      {!isOnline && <p>You're offline. {pendingMutations} changes pending.</p>}
    </div>
  );
}
```

## Real-Time Updates Across Components

### Example: HP Updates During Combat

1. **DM Updates Character HP** in Initiative Tracker
   ```typescript
   await updateHP({ id: characterId, hp: 35 });
   ```

2. **Player's Character Sheet** auto-updates via subscription
   ```typescript
   // This hook automatically re-renders when HP changes
   const { character } = useCharacter(characterId);
   ```

3. **Party Overview** in DM panel updates instantly
   ```typescript
   // All characters in the campaign re-render
   const { characters } = useCharactersByCampaign(campaignId);
   ```

### Example: Map Marker Movement

1. **Player Moves Token** on the map
   ```typescript
   await updatePosition({ id: markerId, x: newX, y: newY });
   ```

2. **All Connected Clients** see the token move in real-time
   ```typescript
   // Subscribes to all markers for the map
   const { markers } = useMapMarkers(mapId);
   ```

3. **DM Controls Fog of War**
   ```typescript
   await updateVisibility({ id: markerId, visible: true });
   // Players instantly see revealed areas
   ```

## Components Updated

### Dashboard Components (Player View)

- ✅ `LoginForm.tsx` - Uses `useAuth()` for authentication
- ✅ `CharacterList.tsx` - Real-time character list with `useCharactersByUser()`
- ✅ `InventoryGrid.tsx` - Real-time inventory with `useInventory()`
- ⚠️ `MapList.tsx` - Needs update to use `useMapsByCampaign()`
- ⚠️ `InitiativeTracker.tsx` - Needs update to use `useCharacterMutations()` for HP

### DM Panel Components

- ✅ `PartyOverview.tsx` - Real-time party HP with `useCharactersByCampaign()`
- ⚠️ `PlayerList.tsx` - Needs update to use `useCampaign()`
- ⚠️ `MapControl.tsx` - Needs update to use `useMapMarkerMutations()`
- ⚠️ `ActiveSession.tsx` - Needs update to use `useActiveSession()`

### Shared Components

- ✅ `OfflineIndicator.tsx` - Shows offline status
- ✅ `LoadingSpinner.tsx` - Used during data loading

## Data Flow

```
User Action (e.g., Update HP)
    ↓
Component calls mutation hook
    ↓
useMutation sends request to Convex
    ↓
Convex updates database
    ↓
Database triggers real-time update
    ↓
ALL subscribed useQuery hooks receive new data
    ↓
React re-renders components automatically
    ↓
All connected clients see the change
```

## Offline Queue Flow

```
User performs action while offline
    ↓
Mutation queued in OfflineContext
    ↓
Network connection restored
    ↓
OfflineContext detects online event
    ↓
Queued mutations executed in order
    ↓
Retry with exponential backoff on failure
    ↓
Remove from queue after success (or max retries)
```

## Security Considerations

### ⚠️ TODO: Production Implementation

1. **Password Hashing**
   - Current: Simple base64 encoding (INSECURE)
   - Required: bcrypt, argon2, or similar
   ```typescript
   // In convex/auth.ts, replace:
   function hashPassword(password: string): string {
     return bcrypt.hash(password, 10);
   }
   ```

2. **Session Management**
   - Current: In-memory Map (lost on server restart)
   - Required: Database-backed sessions or JWT tokens

3. **Input Validation**
   - Add validation in Convex mutations
   - Sanitize user inputs
   - Validate user permissions

4. **Rate Limiting**
   - Implement rate limiting on mutations
   - Prevent abuse of real-time subscriptions

## Testing Real-Time Sync

### Manual Testing Steps

1. **Open Two Browser Windows**
   ```bash
   # Window 1: Login as DM
   # Window 2: Login as Player
   ```

2. **Test Character HP Sync**
   ```
   DM: Update character HP in PartyOverview
   Player: Character sheet should update instantly
   ```

3. **Test Inventory Sync**
   ```
   Player: Add/remove item from inventory
   DM: Party overview should show updated weight
   ```

4. **Test Offline Mode**
   ```
   Player: Open DevTools → Network → Set to "Offline"
   Player: Make changes (e.g., equip item)
   Player: Set back to "Online"
   Expected: Changes sync automatically
   ```

### Automated Testing (TODO)

- Add integration tests with Convex test environment
- Test mutation queue with network mocking
- Test concurrent updates from multiple clients

## Performance Considerations

### Subscription Efficiency

- ✅ Hooks only subscribe when arguments are provided
- ✅ Use `'skip'` parameter to prevent unnecessary queries
- ✅ Components only re-render when their data changes

### Optimization Tips

1. **Paginate Large Lists**
   ```typescript
   // TODO: Add pagination to inventory, session logs
   export const listInventoryPaginated = query({
     args: { characterId: v.id('characters'), page: v.number() },
     handler: async (ctx, args) => {
       return await ctx.db
         .query('inventory')
         .withIndex('by_character', (q) => q.eq('characterId', args.characterId))
         .order('desc')
         .paginate(args.page);
     },
   });
   ```

2. **Debounce Frequent Updates**
   ```typescript
   // For real-time position updates
   const debouncedUpdatePosition = useMemo(
     () => debounce(updatePosition, 100),
     [updatePosition]
   );
   ```

3. **Memoize Expensive Computations**
   ```typescript
   const totalWeight = useMemo(
     () => items?.reduce((sum, item) => sum + item.weight * item.quantity, 0) || 0,
     [items]
   );
   ```

## Troubleshooting

### Issue: "NEXT_PUBLIC_CONVEX_URL must be set"

**Solution:** Create `.env.local` with your Convex URL:
```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### Issue: Data not updating in real-time

**Checks:**
1. Is `npx convex dev` running?
2. Are you using `useQuery` instead of regular fetch?
3. Is the component wrapped in providers?
4. Check browser console for errors

### Issue: "Cannot read property '_id' of undefined"

**Solution:** Add conditional rendering:
```typescript
const { user } = useAuth();
const { characters } = useCharactersByUser(user?._id); // Use optional chaining

if (!characters) return <LoadingSpinner />;
```

### Issue: Offline queue not syncing

**Checks:**
1. Is OfflineProvider in app layout?
2. Check browser console for network errors
3. Verify mutations are wrapped in try/catch
4. Check mutation queue in React DevTools

## Next Steps

### Remaining Components to Update

1. **Maps System**
   - Update MapList to use `useMapsByCampaign()`
   - Update MapViewer to use `useMapMarkers()`
   - Add real-time marker dragging

2. **Initiative Tracker**
   - Use `useCharacterMutations()` for HP updates
   - Sync turn order across clients
   - Add real-time initiative rolls

3. **Session Management**
   - Use `useActiveSession()` for current session
   - Sync session notes in real-time
   - Add collaborative note editing

4. **Campaign Management**
   - Use `useCampaignMutations()` for player management
   - Sync campaign settings
   - Add DM broadcast messages

### Future Enhancements

- [ ] Presence detection (show who's online)
- [ ] Collaborative cursors on maps
- [ ] Real-time dice roll sharing
- [ ] Voice/video integration
- [ ] Notification system for important events
- [ ] Conflict resolution for concurrent edits
- [ ] Undo/redo functionality
- [ ] Audit log for all changes

## Resources

- [Convex Documentation](https://docs.convex.dev/)
- [Convex React Hooks](https://docs.convex.dev/client/react)
- [Next.js with Convex](https://docs.convex.dev/quickstart/nextjs)

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Convex logs in the dev dashboard
3. Check browser console for errors
4. Review this documentation

---

**Implementation Date:** November 2025
**Version:** 1.0.0
**Status:** ✅ Core Features Complete, ⚠️ Production Hardening Required
