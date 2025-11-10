import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';

// Simple session storage (in production, use proper session management)
const sessions = new Map<string, Id<'users'>>();

/**
 * Simple password hashing (in production, use bcrypt or similar)
 */
function hashPassword(password: string): string {
  // TODO: Replace with proper hashing (bcrypt, argon2, etc.)
  // This is a placeholder - DO NOT use in production
  return Buffer.from(password).toString('base64');
}

/**
 * Generate a random session token
 */
function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Register a new user
 */
export const register = mutation({
  args: {
    username: v.string(),
    password: v.string(),
    role: v.union(v.literal('player'), v.literal('dm')),
  },
  handler: async (ctx, args) => {
    // Check if username already exists
    const existing = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .first();

    if (existing) {
      return { success: false, error: 'Username already exists' };
    }

    // Create user
    const userId = await ctx.db.insert('users', {
      username: args.username,
      passwordHash: hashPassword(args.password),
      role: args.role,
      createdAt: Date.now(),
    });

    // Create session
    const sessionToken = generateSessionToken();
    sessions.set(sessionToken, userId);

    return { success: true, sessionToken, userId };
  },
});

/**
 * Login user
 */
export const login = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .first();

    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    const passwordHash = hashPassword(args.password);
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Create session
    const sessionToken = generateSessionToken();
    sessions.set(sessionToken, user._id);

    return { success: true, sessionToken, userId: user._id };
  },
});

/**
 * Logout user
 */
export const logout = mutation({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    sessions.delete(args.sessionToken);
    return { success: true };
  },
});

/**
 * Get current user from session token
 */
export const getCurrentUser = query({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = sessions.get(args.sessionToken);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      sessions.delete(args.sessionToken);
      return null;
    }

    // Return user without password hash
    return {
      _id: user._id,
      username: user.username,
      role: user.role,
      campaignId: user.campaignId,
    };
  },
});
