import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { hashPassword } from './lib/crypto';

/**
 * Create a new user (admin only)
 */
export const createUser = mutation({
  args: {
    username: v.string(),
    password: v.string(),
    role: v.union(v.literal('player'), v.literal('dm'), v.literal('admin')),
    campaignId: v.optional(v.id('campaigns')),
    adminUserId: v.id('users'), // User performing the action
  },
  handler: async (ctx, args) => {
    // Verify admin permissions
    const adminUser = await ctx.db.get(args.adminUserId);
    if (!adminUser || adminUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can create users');
    }

    // Check if username already exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .first();

    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Validate username
    if (args.username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }

    // Validate password
    if (args.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Hash password
    const passwordHash = await hashPassword(args.password);

    // Create user
    const userId = await ctx.db.insert('users', {
      username: args.username,
      passwordHash,
      role: args.role,
      campaignId: args.campaignId,
      createdAt: Date.now(),
    });

    return {
      _id: userId,
      username: args.username,
      role: args.role,
      campaignId: args.campaignId,
    };
  },
});

/**
 * Get user by ID
 */
export const getUser = query({
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

/**
 * List all users (admin or DM only)
 */
export const listUsers = query({
  args: {
    requestingUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Verify permissions
    const requestingUser = await ctx.db.get(args.requestingUserId);
    if (!requestingUser || (requestingUser.role !== 'admin' && requestingUser.role !== 'dm')) {
      throw new Error('Unauthorized: Only admins and DMs can list users');
    }

    const users = await ctx.db.query('users').collect();

    return users.map((user) => ({
      _id: user._id,
      username: user.username,
      role: user.role,
      campaignId: user.campaignId,
      createdAt: user.createdAt,
    }));
  },
});

/**
 * Update user role (admin only)
 */
export const updateUserRole = mutation({
  args: {
    userId: v.id('users'),
    newRole: v.union(v.literal('player'), v.literal('dm'), v.literal('admin')),
    adminUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Verify admin permissions
    const adminUser = await ctx.db.get(args.adminUserId);
    if (!adminUser || adminUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can update user roles');
    }

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error('User not found');
    }

    await ctx.db.patch(args.userId, {
      role: args.newRole,
    });

    return {
      _id: args.userId,
      username: user.username,
      role: args.newRole,
    };
  },
});

/**
 * Delete user (admin only)
 */
export const deleteUser = mutation({
  args: {
    userId: v.id('users'),
    adminUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Verify admin permissions
    const adminUser = await ctx.db.get(args.adminUserId);
    if (!adminUser || adminUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can delete users');
    }

    // Prevent deleting yourself
    if (args.userId === args.adminUserId) {
      throw new Error('Cannot delete your own account');
    }

    await ctx.db.delete(args.userId);

    return { success: true };
  },
});

/**
 * Change password
 */
export const changePassword = mutation({
  args: {
    userId: v.id('users'),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const { verifyPassword } = await import('./lib/crypto');
    const isValid = await verifyPassword(args.currentPassword, user.passwordHash);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (args.newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters');
    }

    // Hash new password
    const newPasswordHash = await hashPassword(args.newPassword);

    await ctx.db.patch(args.userId, {
      passwordHash: newPasswordHash,
    });

    return { success: true };
  },
});
