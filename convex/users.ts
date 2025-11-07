import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Get all users
 */
export const list = query({
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    // Remove password hashes from response
    return users.map(({ passwordHash: _, ...user }) => user);
  },
});

/**
 * Get a user by ID
 */
export const get = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});

/**
 * Get users by campaign
 */
export const getByCampaign = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, args) => {
    const users = await ctx.db.query('users').collect();
    const campaignUsers = users.filter((u) => u.campaignId === args.campaignId);
    return campaignUsers.map(({ passwordHash: _, ...user }) => user);
  },
});

/**
 * Update user role
 */
export const updateRole = mutation({
  args: {
    userId: v.id('users'),
    role: v.union(v.literal('player'), v.literal('dm'), v.literal('admin')),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      role: args.role,
    });
    return args.userId;
  },
});

/**
 * Assign user to campaign
 */
export const assignToCampaign = mutation({
  args: {
    userId: v.id('users'),
    campaignId: v.id('campaigns'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      campaignId: args.campaignId,
    });
    return args.userId;
  },
});

/**
 * Delete a user
 */
export const remove = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userId);
    return args.userId;
  },
});
