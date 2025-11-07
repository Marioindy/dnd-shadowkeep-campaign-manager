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
 * Get a campaign by ID
 */
export const get = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.campaignId);
  },
});

/**
 * Get campaigns by DM
 */
export const getByDm = query({
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
    const campaignId = await ctx.db.insert('campaigns', {
      name: args.name,
      description: args.description,
      dmId: args.dmId,
      players: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return campaignId;
  },
});

/**
 * Update campaign details
 */
export const update = mutation({
  args: {
    campaignId: v.id('campaigns'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { campaignId, ...updates } = args;
    await ctx.db.patch(campaignId, {
      ...updates,
      updatedAt: Date.now(),
    });
    return campaignId;
  },
});

/**
 * Add player to campaign
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
 * Remove player from campaign
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
      players: campaign.players.filter((p) => p !== args.playerId),
      updatedAt: Date.now(),
    });

    return args.campaignId;
  },
});

/**
 * Set current session
 */
export const setCurrentSession = mutation({
  args: {
    campaignId: v.id('campaigns'),
    sessionId: v.optional(v.id('sessions')),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.campaignId, {
      currentSession: args.sessionId,
      updatedAt: Date.now(),
    });
    return args.campaignId;
  },
});

/**
 * Delete a campaign
 */
export const remove = mutation({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.campaignId);
    return args.campaignId;
  },
});
