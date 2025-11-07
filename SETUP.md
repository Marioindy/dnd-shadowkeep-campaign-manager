# Setup Guide

This guide will help you set up the D&D Shadowkeep Campaign Manager for development.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- A Convex account (free at [convex.dev](https://convex.dev))

## Installation Steps

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/yourusername/dnd-shadowkeep-campaign-manager.git
cd dnd-shadowkeep-campaign-manager
npm install
```

### 2. Initialize Convex

Convex provides the real-time backend for this application. Initialize it with:

```bash
npx convex dev
```

This command will:
- Prompt you to create a Convex account or log in
- Create a new Convex project
- Generate the necessary API files in `convex/_generated/`
- Start watching your Convex functions for changes

**Important**: Keep this terminal window open while developing. It watches for changes to your Convex functions and automatically updates your backend.

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

The `npx convex dev` command should have automatically populated your Convex URL. Verify that `.env.local` contains:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud
CONVEX_DEPLOYMENT=your-deployment-name
```

### 4. Start the Development Server

In a new terminal window:

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000)

## Project Architecture

### Real-time Data Sync

This project uses Convex for:
- **Real-time updates**: Changes sync instantly across all connected clients
- **Serverless backend**: No server management required
- **Type-safe queries**: Full TypeScript support with generated types

### Authentication

The authentication system:
- Uses Convex for user management
- Implements a closed-door system (no public registration)
- DM/Admin creates player accounts
- Session data stored in localStorage (will be enhanced in future phases)

### Available Convex Functions

All backend functions are in the `convex/` directory:

- `auth.ts` - Authentication (login, register)
- `users.ts` - User management
- `campaigns.ts` - Campaign CRUD operations
- `characters.ts` - Character management
- `inventory.ts` - Inventory system
- `maps.ts` - Map and marker management
- `sessions.ts` - Session tracking

## Using Convex in Components

### Queries (Read Data)

```tsx
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

function MyComponent() {
  const characters = useQuery(api.characters.list);

  if (characters === undefined) return <div>Loading...</div>;

  return (
    <div>
      {characters.map(char => (
        <div key={char._id}>{char.name}</div>
      ))}
    </div>
  );
}
```

### Mutations (Write Data)

```tsx
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

function CreateCharacter() {
  const createCharacter = useMutation(api.characters.create);

  const handleCreate = async () => {
    await createCharacter({
      userId: 'user_id',
      campaignId: 'campaign_id',
      name: 'Gandalf',
      race: 'Maia',
      class: 'Wizard',
      level: 20,
      stats: {
        strength: 10,
        dexterity: 12,
        constitution: 14,
        intelligence: 20,
        wisdom: 18,
        charisma: 16,
        hp: 100,
        maxHp: 100,
        ac: 15,
        speed: 30,
      }
    });
  };

  return <button onClick={handleCreate}>Create Character</button>;
}
```

## Authentication Usage

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { useAuthActions } from '@/hooks/useAuthActions';

function LoginComponent() {
  const { user, isLoading } = useAuth();
  const { login, logout } = useAuthActions();

  const handleLogin = async () => {
    const result = await login('username', 'password');
    if (result.success) {
      console.log('Logged in:', result.user);
    } else {
      console.error('Login failed:', result.error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (user) return <div>Welcome, {user.username}!</div>;

  return <button onClick={handleLogin}>Login</button>;
}
```

## Development Workflow

1. **Start Convex Dev**: `npx convex dev` (keep running)
2. **Start Next.js**: `npm run dev` (in another terminal)
3. **Make changes**: Both Convex and Next.js have hot reload
4. **Check Convex Dashboard**: Visit the URL shown in the Convex dev terminal to view your data

## Troubleshooting

### Convex Connection Issues

If you see "Convex client not connected":
1. Ensure `npx convex dev` is running
2. Check that `NEXT_PUBLIC_CONVEX_URL` is set in `.env.local`
3. Verify the URL doesn't have trailing slashes

### Type Errors with Convex

If you get TypeScript errors for `api.*`:
1. Make sure `npx convex dev` is running (it generates types)
2. Check that `convex/_generated/` exists
3. Restart your IDE/editor

### Authentication Not Working

1. Ensure both Convex and Next.js dev servers are running
2. Check browser console for errors
3. Verify that the Convex functions are deployed (check Convex dashboard)

## Next Steps

- Create your first campaign
- Add players and characters
- Upload maps
- Start a session!

For more information, see the [Convex documentation](https://docs.convex.dev).
