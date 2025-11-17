# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Convex account (sign up at https://convex.dev)

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Convex
```bash
npx convex dev
```

This will:
- Prompt you to log in to Convex
- Create a new Convex deployment
- Generate the `convex/_generated` directory with API types
- Add `NEXT_PUBLIC_CONVEX_URL` to your `.env.local`
- Start the Convex dev server

### 3. Seed Initial Admin User
In a new terminal window, run:
```bash
npx convex run seed:seedAdminUser
```

This creates an admin account:
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change this password after first login!

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access the Application
Open http://localhost:3000 and log in with the admin credentials.

## Next Steps

1. **Change admin password** (see AUTHENTICATION.md)
2. **Create users** at `/admin/users`
3. **Set up your campaign**
4. **Start playing!**

## Common Issues

### Build fails with "Cannot find module 'convex/_generated/api'"
- Run `npx convex dev` first to generate API files
- Ensure Convex dev server is running

### "NEXT_PUBLIC_CONVEX_URL must be set"
- Run `npx convex dev` to auto-configure
- Or manually add to `.env.local`

### Cannot log in
- Verify you've run the seed function
- Check Convex dashboard for user data
- Try resetting the database and re-seeding

## Documentation

- [AUTHENTICATION.md](./AUTHENTICATION.md) - Complete authentication documentation
- [README.md](./README.md) - Project overview

## Running Both Servers

You need **two terminal windows**:

**Terminal 1 - Convex:**
```bash
npx convex dev
```

**Terminal 2 - Next.js:**
```bash
npm run dev
```

Both must be running for the app to work correctly.
