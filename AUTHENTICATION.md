# Authentication System Documentation

## Overview

The D&D Shadowkeep Campaign Manager now includes a complete authentication system with:

- User login/logout functionality
- Session management with localStorage persistence
- Role-based access control (Player, DM, Admin)
- Protected routes
- Password hashing and security
- Convex backend integration

## Setup Instructions

### 1. Environment Configuration

First, ensure your `.env.local` file has the Convex URL configured:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

### 2. Initialize Convex

If you haven't already, initialize Convex:

```bash
npx convex dev
```

This will:
- Create a Convex deployment
- Generate the necessary API files
- Start the Convex development server

### 3. Seed Initial Admin User

To create the initial admin user, run the seed function from the Convex dashboard or CLI:

**Using Convex Dashboard:**
1. Go to your Convex dashboard
2. Navigate to "Functions"
3. Find and run `seed:seedAdminUser`

**Using Convex CLI:**
```bash
npx convex run seed:seedAdminUser
```

This creates an admin user with:
- **Username:** `admin`
- **Password:** `admin123`

**IMPORTANT:** Change the admin password immediately after first login!

### 4. Optional: Seed Demo Data

To create a demo campaign with sample players:

```bash
npx convex run seed:seedDemoCampaign
```

This creates:
- A demo campaign called "The Shadowkeep Chronicles"
- Two player accounts (player1, player2) with password: `player123`

## User Roles

### Player (Default)
- Access to dashboard
- Can view characters, inventory, maps
- Can participate in sessions

### Dungeon Master (DM)
- All Player permissions
- Access to DM panel (`/dm/*`)
- Can manage party and campaign
- Can control maps and sessions

### Administrator
- All DM permissions
- Access to admin panel (`/admin/*`)
- Can create/delete users
- Can manage user roles

## Authentication Flow

### Login Process

1. User enters username and password at `/login`
2. Credentials are validated against Convex database
3. Password is hashed and compared with stored hash
4. On success:
   - Session token is generated
   - User data is stored in localStorage
   - User is redirected to `/dashboard`
5. On failure:
   - Error message is displayed
   - User can retry

### Session Management

Sessions are stored in localStorage with two keys:
- `dnd_session_token`: Random session token
- `dnd_user_id`: Convex user ID

On page load, the app:
1. Checks for session token in localStorage
2. Verifies user still exists in Convex
3. Restores user session if valid
4. Redirects to login if invalid

### Logout Process

1. User clicks logout button
2. Session data is cleared from localStorage
3. User state is reset
4. User is redirected to `/login`

## Protected Routes

All routes are automatically protected based on role requirements:

### Public Routes
- `/` - Landing page
- `/login` - Login page

### Player Routes (Require login)
- `/dashboard` - Main dashboard
- `/dashboard/characters` - Character management
- `/dashboard/inventory` - Inventory
- `/dashboard/maps` - Maps view
- `/dashboard/campaign` - Campaign info
- `/dashboard/session-tools` - Session tools

### DM Routes (Require DM or Admin role)
- `/dm` - DM panel
- `/dm/overview` - Campaign overview
- `/dm/party-management` - Party management
- `/dm/map-control` - Map controls
- `/dm/documents` - Campaign documents

### Admin Routes (Require Admin role)
- `/admin/users` - User management

## Components

### Authentication Components

#### `<ProtectedRoute>`
Wraps pages to ensure authentication and role requirements:

```tsx
<ProtectedRoute requiredRole="dm">
  <DMContent />
</ProtectedRoute>
```

#### `<RoleGuard>`
Conditionally renders content based on user role:

```tsx
<RoleGuard requiredRole="admin" fallback={<p>Access denied</p>}>
  <AdminControls />
</RoleGuard>
```

#### `<AuthGuard>`
Shows/hides content based on authentication status:

```tsx
<AuthGuard requireAuth={true}>
  <LoggedInContent />
</AuthGuard>
```

#### `<UserProfile>`
Displays current user info and logout button:

```tsx
<UserProfile />
```

#### `<LogoutButton>`
Standalone logout button:

```tsx
<LogoutButton variant="danger" />
```

### Using Authentication in Components

```tsx
'use client';

import { useAuth } from '@/providers/AuthProvider';

export default function MyComponent() {
  const { user, isAuthenticated, hasRole, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <p>Welcome, {user.username}!</p>
      {hasRole('dm') && <DMControls />}
      {hasRole('admin') && <AdminControls />}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## API Reference

### Convex Mutations

#### `api.auth.login`
Authenticates a user and returns session token.

```typescript
const response = await loginMutation({
  username: 'admin',
  password: 'admin123',
});
// Returns: { sessionToken: string, user: User }
```

#### `api.users.createUser`
Creates a new user (admin only).

```typescript
await createUserMutation({
  username: 'newplayer',
  password: 'password123',
  role: 'player',
  adminUserId: currentUser._id,
});
```

#### `api.users.changePassword`
Changes user password.

```typescript
await changePasswordMutation({
  userId: user._id,
  currentPassword: 'oldpass',
  newPassword: 'newpass',
});
```

### Convex Queries

#### `api.auth.verifySession`
Verifies a user session.

```typescript
const user = useQuery(api.auth.verifySession, { userId: storedUserId });
```

#### `api.users.getUser`
Retrieves user by ID.

```typescript
const user = useQuery(api.users.getUser, { userId: userId });
```

#### `api.users.listUsers`
Lists all users (admin/DM only).

```typescript
const users = useQuery(api.users.listUsers, { requestingUserId: currentUser._id });
```

## Security Features

### Password Security
- Passwords are hashed using SHA-256 before storage
- Plain text passwords are never stored in database
- Minimum password length: 6 characters

### Session Security
- Session tokens are randomly generated (32 bytes)
- Tokens are stored client-side in localStorage
- Sessions are validated on every page load

### Role-Based Access Control
- All protected routes verify user role
- Admin has full access to all features
- DM has access to player features + DM panel
- Player has access to basic dashboard features

### Input Validation
- Username: 3-32 characters, alphanumeric + hyphens/underscores
- Password: 6-128 characters
- Server-side validation on all mutations

## Admin Tasks

### Creating New Users

1. Log in as admin
2. Navigate to `/admin/users`
3. Fill in the user creation form
4. Select appropriate role
5. Click "Create User"

### Changing User Roles

Currently requires direct Convex mutation:

```typescript
await updateUserRoleMutation({
  userId: targetUserId,
  newRole: 'dm',
  adminUserId: currentUser._id,
});
```

### Deleting Users

Currently requires direct Convex mutation:

```typescript
await deleteUserMutation({
  userId: targetUserId,
  adminUserId: currentUser._id,
});
```

## Troubleshooting

### "NEXT_PUBLIC_CONVEX_URL must be set"
- Ensure `.env.local` has `NEXT_PUBLIC_CONVEX_URL` configured
- Restart the dev server after adding environment variables

### "Invalid username or password"
- Verify username and password are correct
- Ensure admin user was seeded correctly
- Check Convex dashboard for user data

### "Unauthorized: Only admins can create users"
- Ensure you're logged in as admin
- Check user role in Convex dashboard

### Session not persisting
- Check browser localStorage for `dnd_session_token` and `dnd_user_id`
- Clear localStorage and log in again
- Ensure Convex is running (`npx convex dev`)

### Routes not protected
- Verify layouts are created in route groups
- Check that ProtectedRoute is wrapping content
- Ensure user has required role

## Next Steps

1. **Change default admin password** after first login
2. **Create DM and player accounts** for your campaign
3. **Configure campaign** in the database
4. **Test authentication flow** with different roles
5. **Customize role permissions** as needed

## Development Notes

### File Structure

```
convex/
├── auth.ts              # Authentication mutations/queries
├── users.ts             # User management
├── seed.ts              # Database seeding
├── lib/
│   └── crypto.ts        # Password hashing utilities
└── schema.ts            # Database schema

src/
├── app/
│   ├── (auth)/
│   │   └── login/       # Login page
│   ├── (dashboard)/     # Protected player routes
│   │   └── layout.tsx   # Dashboard protection
│   ├── (dm)/            # Protected DM routes
│   │   └── layout.tsx   # DM protection
│   └── (admin)/         # Protected admin routes
│       └── layout.tsx   # Admin protection
├── components/
│   └── auth/            # Auth components
├── providers/
│   ├── AuthProvider.tsx # Auth context
│   └── ConvexClientProvider.tsx
└── lib/
    └── auth.ts          # Auth utilities
```

### Adding New Protected Routes

1. Create route in appropriate group:
   - `(dashboard)` for player routes
   - `(dm)` for DM routes
   - `(admin)` for admin routes

2. Layout will automatically protect the route

3. Or manually wrap with `<ProtectedRoute>`:

```tsx
export default function MyPage() {
  return (
    <ProtectedRoute requiredRole="dm">
      <MyContent />
    </ProtectedRoute>
  );
}
```

## Support

For issues or questions:
1. Check this documentation
2. Review Convex dashboard logs
3. Check browser console for errors
4. Verify environment configuration
