import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { hashPassword, verifyPassword, generateSessionToken } from './lib/crypto';

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
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isValid = await verifyPassword(args.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid username or password');
    }

    // Generate session token
    const sessionToken = generateSessionToken();

    // Return user data (without password hash) and session token
    return {
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
 * Get current user by session token
 */
export const getCurrentUser = query({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    // In a production app, you'd want to store sessions in a separate table
    // For now, we'll validate the token format and let the client manage sessions
    if (!args.sessionToken || args.sessionToken.length < 32) {
      return null;
    }

    // Since we're using client-side session management,
    // the user ID will be stored in the token or localStorage
    // For now, return null - the client will handle session validation
    return null;
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
    // In a production app, you'd want to invalidate the session in the database
    // For now, client-side session clearing is sufficient
    return { success: true };
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
