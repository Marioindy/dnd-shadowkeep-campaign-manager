import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * List all maps for a campaign
 */
export const listByCampaign = query({
  args: {
    campaignId: v.id('campaigns'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('maps')
      .withIndex('by_campaign', (q) => q.eq('campaignId', args.campaignId))
      .collect();
  },
});

/**
 * Get a single map by ID
 */
export const get = query({
  args: {
    id: v.id('maps'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Create a new map
 */
export const create = mutation({
  args: {
    campaignId: v.id('campaigns'),
    name: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('maps', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update a map
 */
export const update = mutation({
  args: {
    id: v.id('maps'),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
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
 * Delete a map
 */
export const remove = mutation({
  args: {
    id: v.id('maps'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
