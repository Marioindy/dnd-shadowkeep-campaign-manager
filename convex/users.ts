import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Get all users
 */
export const list = query({
  handler: async (ctx) => {
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
 * Get users by role
 */
export const byRole = query({
  args: { role: v.union(v.literal('player'), v.literal('dm'), v.literal('admin')) },
  handler: async (ctx, args) => {
    const users = await ctx.db.query('users').collect();
    const filtered = users.filter((user) => user.role === args.role);
    return filtered.map((user) => ({
      _id: user._id,
      username: user.username,
      role: user.role,
      campaignId: user.campaignId,
      createdAt: user.createdAt,
    }));
  },
});

/**
 * Get users by campaign
 */
export const byCampaign = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, args) => {
    const users = await ctx.db.query('users').collect();
    const filtered = users.filter((user) => user.campaignId === args.campaignId);
    return filtered.map((user) => ({
      _id: user._id,
      username: user.username,
      role: user.role,
      campaignId: user.campaignId,
      createdAt: user.createdAt,
    }));
  },
});

/**
 * Get a single user by ID
 */
export const get = query({
  args: { id: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
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

/**
 * Update user's campaign
 */
export const updateCampaign = mutation({
  args: {
    userId: v.id('users'),
    campaignId: v.optional(v.id('campaigns')),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      campaignId: args.campaignId,
    });
    return args.userId;
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
 * Delete a user
 */
export const remove = mutation({
  args: { id: v.id('users') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
