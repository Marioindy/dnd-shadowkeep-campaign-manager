import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Register a new user (DM/Admin only should call this)
 */
export const register = mutation({
  args: {
    username: v.string(),
    password: v.string(),
    role: v.union(v.literal('player'), v.literal('dm'), v.literal('admin')),
    campaignId: v.optional(v.id('campaigns')),
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

    // In production, use proper password hashing (bcrypt, argon2, etc.)
    // This is a simplified version for demonstration
    const passwordHash = Buffer.from(args.password).toString('base64');

    const userId = await ctx.db.insert('users', {
      username: args.username,
      passwordHash,
      role: args.role,
      campaignId: args.campaignId,
      createdAt: Date.now(),
    });

    return userId;
  },
});

/**
 * Authenticate a user
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
      throw new Error('Invalid username or password');
    }

    // In production, use proper password verification
    const passwordHash = Buffer.from(args.password).toString('base64');

    if (user.passwordHash !== passwordHash) {
      throw new Error('Invalid username or password');
    }

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
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

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});
