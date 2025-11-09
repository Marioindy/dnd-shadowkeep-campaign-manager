import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Simple password hashing utility
 * Note: In production, use a proper password hashing library like bcrypt
 */
function hashPassword(password: string): string {
  // Simple hash - in production, use bcrypt or similar
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Register a new user
 */
export const register = mutation({
  args: {
    username: v.string(),
    password: v.string(),
    role: v.union(v.literal('player'), v.literal('dm'), v.literal('admin')),
  },
  handler: async (ctx, args) => {
    // Check if username already exists
    const existing = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .first();

    if (existing) {
      throw new Error('Username already exists');
    }

    // Create new user
    const userId = await ctx.db.insert('users', {
      username: args.username,
      passwordHash: hashPassword(args.password),
      role: args.role,
      createdAt: Date.now(),
    });

    return { userId, username: args.username, role: args.role };
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
    // Find user by username
    const user = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .first();

    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const passwordHash = hashPassword(args.password);
    if (user.passwordHash !== passwordHash) {
      throw new Error('Invalid username or password');
    }

    // Return user data (without password hash)
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
 * Get current user by ID
 */
export const getCurrentUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    return {
      _id: user._id,
      username: user.username,
      role: user.role,
      campaignId: user.campaignId,
      createdAt: user.createdAt,
    };
  },
});
