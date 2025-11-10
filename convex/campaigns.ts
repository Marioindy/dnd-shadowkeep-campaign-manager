import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Get a campaign by ID
 */
export const get = query({
  args: {
    id: v.id('campaigns'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * List all campaigns for a DM
 */
export const listByDM = query({
  args: {
    dmId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('campaigns')
      .filter((q) => q.eq(q.field('dmId'), args.dmId))
      .collect();
  },
});

/**
 * Get campaign for a player
 */
export const getByPlayer = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user || !user.campaignId) {
      return null;
    }
    return await ctx.db.get(user.campaignId);
  },
});

/**
 * Create a new campaign
 */
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    dmId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('campaigns', {
      ...args,
      players: [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update a campaign
 */
export const update = mutation({
  args: {
    id: v.id('campaigns'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    currentSession: v.optional(v.id('sessions')),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    return id;
  },
});

/**
 * Add a player to a campaign
 */
export const addPlayer = mutation({
  args: {
    campaignId: v.id('campaigns'),
    playerId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.players.includes(args.playerId)) {
      return args.campaignId; // Already added
    }

    await ctx.db.patch(args.campaignId, {
      players: [...campaign.players, args.playerId],
      updatedAt: Date.now(),
    });

    // Update user's campaignId
    await ctx.db.patch(args.playerId, {
      campaignId: args.campaignId,
    });

    return args.campaignId;
  },
});

/**
 * Remove a player from a campaign
 */
export const removePlayer = mutation({
  args: {
    campaignId: v.id('campaigns'),
    playerId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    await ctx.db.patch(args.campaignId, {
      players: campaign.players.filter((id) => id !== args.playerId),
      updatedAt: Date.now(),
    });

    // Remove campaignId from user
    await ctx.db.patch(args.playerId, {
      campaignId: undefined,
    });

    return args.campaignId;
  },
});

/**
 * Delete a campaign
 */
export const remove = mutation({
  args: {
    id: v.id('campaigns'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
