# Convex Backend Integration Guide

This document provides a comprehensive guide to the Convex backend integration for the D&D Shadowkeep Campaign Manager.

> **Note:** This branch merges core Convex integration (campaigns, characters, inventory, maps) with enhanced features from main including:
> - Community features (user follows, shared campaigns, profiles)
> - Robust authentication with AuthProvider and session tokens
> - Separate encounters table (better architecture)
> - Mobile app support
> - Admin panel and role-based access
>
> See `AUTHENTICATION.md` and `COMMUNITY_FEATURES.md` for details on these features.

## Overview

The application uses [Convex](https://convex.dev) as its backend-as-a-service solution, providing:
- **Real-time data synchronization** across all connected clients
- **Type-safe database** with automatic TypeScript generation
- **Serverless functions** for queries and mutations
- **Session-based authentication** with AuthProvider
- **Community features** with social interactions
- **Mobile app support** via React Native

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed in `package.json`:
```bash
npm install
```

### 2. Initialize Convex

If starting fresh or setting up a new deployment:
```bash
npx convex dev
```

This will:
- Create a new Convex project (or connect to existing)
- Generate TypeScript types in `convex/_generated/`
- Start the Convex development server
- Provide your deployment URL

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Optional: Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** The `NEXT_PUBLIC_CONVEX_URL` is provided when you run `npx convex dev`.

### 4. Deploy Schema

The schema is automatically deployed when running `npx convex dev`. To manually push schema changes:

```bash
npx convex dev --once
```

## Database Schema

The Convex backend includes the following tables:

### Users
- `username`: String (indexed)
- `passwordHash`: String
- `role`: 'player' | 'dm' | 'admin'
- `campaignId`: Optional campaign reference
- `createdAt`: Timestamp

### Campaigns
- `name`: String
- `description`: String
- `dmId`: User reference
- `players`: Array of user IDs
- `currentSession`: Optional session reference
- `createdAt`, `updatedAt`: Timestamps

### Characters
- `userId`, `campaignId`: References
- `name`, `race`, `class`: Strings
- `level`: Number
- `stats`: Object (strength, dexterity, etc.)
- `portraitUrl`, `backstory`: Optional strings
- `createdAt`, `updatedAt`: Timestamps
- **Indexes:** by_user, by_campaign

### Inventory
- `characterId`: Character reference
- `name`, `type`: Strings
- `quantity`, `weight`: Numbers
- `description`, `properties`: Optional
- `equipped`, `equipSlot`: Equipment tracking
- **Index:** by_character

### Maps
- `campaignId`: Campaign reference
- `name`, `imageUrl`: Strings
- `createdAt`, `updatedAt`: Timestamps
- **Index:** by_campaign

### Map Markers
- `mapId`: Map reference
- `type`: 'player' | 'npc' | 'enemy' | 'poi'
- `x`, `y`: Coordinates
- `label`, `color`, `iconUrl`: Optional styling
- `visible`: Boolean (for DM fog of war)
- **Index:** by_map

### Sessions
- `campaignId`: Campaign reference
- `name`, `notes`: Strings
- `date`: Timestamp
- `active`: Boolean
- `encounters`: Array of encounter objects
- **Index:** by_campaign

### Fog of War
- `mapId`: Map reference
- `points`: Array of coordinate objects
- `revealed`: Boolean
- **Index:** by_map

## API Functions

All Convex functions are located in the `convex/` directory and organized by domain:

### Authentication (`convex/auth.ts`)
- `login(username, password)` - Authenticate user
- `register(username, password, role)` - Create new user
- `getCurrentUser(userId)` - Get user details

### Users (`convex/users.ts`)
- `list()` - Get all users
- `get(id)` - Get single user
- `byRole(role)` - Filter by role
- `byCampaign(campaignId)` - Users in a campaign
- `updateCampaign(userId, campaignId)` - Assign to campaign
- `updateRole(userId, role)` - Change user role
- `remove(id)` - Delete user

### Campaigns (`convex/campaigns.ts`)
- `list()` - Get all campaigns
- `get(id)` - Get single campaign
- `byDM(dmId)` - Campaigns by DM
- `create(name, description, dmId)` - Create campaign
- `update(id, ...)` - Update campaign details
- `addPlayer(campaignId, playerId)` - Add player
- `removePlayer(campaignId, playerId)` - Remove player
- `remove(id)` - Delete campaign

### Characters (`convex/characters.ts`)
- `list()` - Get all characters
- `get(id)` - Get single character
- `byUser(userId)` - User's characters
- `byCampaign(campaignId)` - Campaign's characters
- `create(...)` - Create new character
- `update(id, ...)` - Update character
- `updateStats(id, stats)` - Update character stats
- `updateHP(id, hp)` - Quick HP update
- `remove(id)` - Delete character

### Inventory (`convex/inventory.ts`)
- `byCharacter(characterId)` - Get all items
- `equipped(characterId)` - Get equipped items
- `get(id)` - Get single item
- `add(...)` - Add item to inventory
- `update(id, ...)` - Update item
- `toggleEquip(id, equipped, equipSlot)` - Equip/unequip
- `updateQuantity(id, quantity)` - Change quantity
- `remove(id)` - Delete item

### Maps (`convex/maps.ts`)
- `byCampaign(campaignId)` - Get campaign maps
- `get(id)` - Get single map
- `getMarkers(mapId)` - Get map markers
- `getFogOfWar(mapId)` - Get fog of war layers
- `create(...)` - Create new map
- `update(id, ...)` - Update map
- `addMarker(...)` - Add marker to map
- `updateMarker(id, ...)` - Update marker
- `removeMarker(id)` - Delete marker
- `addFogOfWar(...)` - Add fog layer
- `updateFogOfWar(id, ...)` - Update fog layer
- `removeFogOfWar(id)` - Delete fog layer
- `remove(id)` - Delete map (cascades to markers/fog)

### Sessions (`convex/sessions.ts`)
- `byCampaign(campaignId)` - Get campaign sessions
- `getActive(campaignId)` - Get active session
- `get(id)` - Get single session
- `create(...)` - Create session
- `update(id, ...)` - Update session
- `setActive(id)` - Activate session (deactivates others)
- `addEncounter(sessionId, encounter)` - Add encounter
- `updateEncounter(sessionId, encounterId, encounter)` - Update encounter
- `removeEncounter(sessionId, encounterId)` - Delete encounter
- `remove(id)` - Delete session

## Using Convex in Components

### Query Example (Read Data)

```tsx
'use client';

import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function CharacterList() {
  // Real-time query - automatically updates when data changes
  const characters = useQuery(api.characters.byUser, {
    userId: currentUserId
  });

  // Handle loading state
  if (characters === undefined) {
    return <div>Loading...</div>;
  }

  // Handle empty state
  if (characters.length === 0) {
    return <div>No characters found</div>;
  }

  // Render data
  return (
    <div>
      {characters.map(char => (
        <div key={char._id}>{char.name}</div>
      ))}
    </div>
  );
}
```

### Mutation Example (Write Data)

```tsx
'use client';

import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function CreateCharacter() {
  const createCharacter = useMutation(api.characters.create);

  const handleCreate = async () => {
    try {
      const characterId = await createCharacter({
        userId: currentUserId,
        campaignId: currentCampaignId,
        name: "Gandalf",
        race: "Human",
        class: "Wizard",
        level: 20,
        stats: {
          strength: 10,
          dexterity: 12,
          constitution: 14,
          intelligence: 20,
          wisdom: 18,
          charisma: 16,
          hp: 80,
          maxHp: 80,
          ac: 15,
          speed: 30
        }
      });

      console.log('Created character:', characterId);
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  return <button onClick={handleCreate}>Create Character</button>;
}
```

### Conditional Queries

Skip queries when parameters are not ready:

```tsx
const characters = useQuery(
  api.characters.byUser,
  userId ? { userId } : 'skip'
);
```

## Real-Time Synchronization

Convex automatically synchronizes data across all connected clients:

1. **Automatic Updates**: When any mutation runs, all queries that depend on that data automatically re-run
2. **Optimistic Updates**: Mutations can return immediately while the server processes
3. **Offline Support**: Queries cache data and sync when connection is restored

### Example Use Cases

**Campaign Management:**
- DM creates a new session → All players see it instantly
- Player updates character HP → DM sees update in real-time
- DM reveals fog of war → Map updates for all players

**Combat Tracking:**
- DM adds enemy to initiative → Players see initiative order update
- Player uses item → Inventory updates across all views
- Character HP changes → Health bars update everywhere

## Authentication Flow

The application uses a robust session-based authentication system:

1. User submits credentials via LoginForm
2. LoginForm calls `auth.login` mutation with username/password
3. Server validates credentials using crypto utilities (`convex/lib/crypto.ts`)
4. Server returns user object and session token
5. AuthProvider (`src/providers/AuthProvider.tsx`) stores session data
6. Components use `useAuth()` hook to access current user and auth state
7. Protected routes use AuthGuard and RoleGuard components

**Key Features:**
- **Password Hashing**: Uses crypto library for secure password storage
- **Session Tokens**: JWT-style tokens with expiration
- **Role-Based Access**: Admin, DM, and Player roles with authorization checks
- **Input Validation**: Username and password validation before submission
- **Auth Guards**: ProtectedRoute and RoleGuard components for route protection

**Authentication Functions** (`convex/auth.ts`):
- `login(username, password)` - Returns user and session token
- `register(...)` - Creates new user account
- `validateSession(token)` - Verifies session token validity

For detailed authentication documentation, see `AUTHENTICATION.md`.

## Development Workflow

### Running the Application

Terminal 1 - Next.js dev server:
```bash
npm run dev
```

Terminal 2 - Convex dev server:
```bash
npm run convex
```

### Testing Real-Time Sync

1. Open application in two browser windows
2. Login as different users (or same user)
3. Make changes in one window
4. Observe real-time updates in the other window

### Viewing Database

Use the Convex Dashboard at https://dashboard.convex.dev to:
- View all tables and data
- Run queries manually
- Monitor function execution
- View logs and errors

## Troubleshooting

### Error: "NEXT_PUBLIC_CONVEX_URL is not set"

**Solution:** Create `.env.local` file with your Convex URL from `npx convex dev`

### Error: "Cannot find module 'convex/_generated/api'"

**Solution:** Run `npx convex dev` to generate TypeScript types

### Data Not Updating in Real-Time

**Check:**
1. Convex dev server is running (`npm run convex`)
2. Browser console for connection errors
3. Component is using `useQuery` (not a one-time fetch)

### Authentication Failing

**Check:**
1. User exists in database (view in Convex Dashboard)
2. Password is correct (passwords are hashed)
3. Network tab shows successful mutation call

## Next Steps

### Recommended Enhancements

1. **Add More Component Integration:**
   - Complete InventoryGrid integration
   - Connect CampaignInfo to Convex queries
   - Add DM Panel real-time features

2. **Authentication Enhancements:** ✅ *Mostly Complete*
   - ✅ Session tokens implemented
   - ✅ Password validation and hashing
   - ✅ Role-based access control
   - ⏳ Add password reset functionality
   - ⏳ Add OAuth providers (Discord, Google)

3. **Validation:** ✅ *Partially Complete*
   - ✅ Server-side authorization checks
   - ✅ Client-side form validation
   - ⏳ Add more comprehensive validation rules
   - ⏳ Type guards for complex objects

4. **Community Features:** ✅ *Implemented*
   - ✅ User follows system
   - ✅ Shared campaigns
   - ✅ Public profiles
   - ✅ Social sharing
   - See `COMMUNITY_FEATURES.md`

5. **Performance Optimization:**
   - Implement pagination for large lists
   - Add caching strategies
   - Optimize query indexes
   - Add optimistic updates

6. **Testing:**
   - Unit tests for mutations
   - Integration tests for real-time sync
   - E2E tests for critical flows

## Resources

- [Convex Documentation](https://docs.convex.dev)
- [Convex React Guide](https://docs.convex.dev/client/react)
- [Next.js Integration](https://docs.convex.dev/client/react/nextjs)
- [Convex Dashboard](https://dashboard.convex.dev)

## Support

For issues or questions:
1. Check Convex documentation
2. Review error messages in browser console
3. Check Convex Dashboard logs
4. Contact the development team
