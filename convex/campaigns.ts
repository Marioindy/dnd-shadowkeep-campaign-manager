import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Get all campaigns
 */
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('campaigns').collect();
  },
});

/**
 * Get a single campaign by ID
 */
export const get = query({
  args: { id: v.id('campaigns') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get campaigns by DM
 */
export const byDM = query({
  args: { dmId: v.id('users') },
  handler: async (ctx, args) => {
    const campaigns = await ctx.db.query('campaigns').collect();
    return campaigns.filter((c) => c.dmId === args.dmId);
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
    const campaignId = await ctx.db.insert('campaigns', {
      name: args.name,
      description: args.description,
      dmId: args.dmId,
      players: [],
      createdAt: now,
      updatedAt: now,
    });
    return campaignId;
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
    if (!campaign) throw new Error('Campaign not found');

    if (!campaign.players.includes(args.playerId)) {
      await ctx.db.patch(args.campaignId, {
        players: [...campaign.players, args.playerId],
        updatedAt: Date.now(),
      });
    }
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
    if (!campaign) throw new Error('Campaign not found');

    await ctx.db.patch(args.campaignId, {
      players: campaign.players.filter((id) => id !== args.playerId),
      updatedAt: Date.now(),
    });
    return args.campaignId;
  },
});

/**
 * Delete a campaign
 */
export const remove = mutation({
  args: { id: v.id('campaigns') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
