import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';
import { hashPassword, verifyPassword, generateSessionToken } from './lib/crypto';

// In-memory session storage
// TODO: In production, store sessions in a database table with expiration
const sessions = new Map<string, { userId: Id<'users'>; createdAt: number }>();

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

    // Hash password
    const passwordHash = await hashPassword(args.password);

    // Create user
    const userId = await ctx.db.insert('users', {
      username: args.username,
      passwordHash,
      role: args.role,
      createdAt: Date.now(),
    });

    // Generate session token
    const sessionToken = generateSessionToken();
    sessions.set(sessionToken, { userId, createdAt: Date.now() });

    return { success: true, sessionToken, userId };
  },
});

/**
 * Login mutation - Authenticates a user and returns a session token
 */
export const login = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by username
    const user = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .first();

    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Verify password
    const isValid = await verifyPassword(args.password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Generate session token
    const sessionToken = generateSessionToken();
    sessions.set(sessionToken, { userId: user._id, createdAt: Date.now() });

    // Return user data (without password hash) and session token
    return {
      success: true,
      sessionToken,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        campaignId: user.campaignId,
        createdAt: user.createdAt,
      },
    };
  },
});

/**
 * Logout mutation - Invalidates a session
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
 * Get current user by session token
 */
export const getCurrentUser = query({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Get session
    const session = sessions.get(args.sessionToken);
    if (!session) {
      return null;
    }

    // Check if session is expired (24 hours)
    const sessionAge = Date.now() - session.createdAt;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    if (sessionAge > maxAge) {
      sessions.delete(args.sessionToken);
      return null;
    }

    // Get user
    const user = await ctx.db.get(session.userId);
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
      createdAt: user.createdAt,
    };
  },
});

/**
 * Verify session and get user
 * This is a query that client components can use to check authentication status
 */
export const verifySession = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      return null;
    }

    return {
      _id: user._id,
      username: user.username,
      role: user.role,
      campaignId: user.campaignId,
      createdAt: user.createdAt,
    };
  },
});
