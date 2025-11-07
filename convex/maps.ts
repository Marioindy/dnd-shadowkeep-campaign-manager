import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Get all maps for a campaign
 */
export const getByCampaign = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('maps')
      .withIndex('by_campaign', (q) => q.eq('campaignId', args.campaignId))
      .collect();
  },
});

/**
 * Get a map by ID
 */
export const get = query({
  args: { mapId: v.id('maps') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.mapId);
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
    const mapId = await ctx.db.insert('maps', {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return mapId;
  },
});

/**
 * Update map details
 */
export const update = mutation({
  args: {
    mapId: v.id('maps'),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { mapId, ...updates } = args;
    await ctx.db.patch(mapId, {
      ...updates,
      updatedAt: Date.now(),
    });
    return mapId;
  },
});

/**
 * Delete a map
 */
export const remove = mutation({
  args: { mapId: v.id('maps') },
  handler: async (ctx, args) => {
    // Also delete all markers for this map
    const markers = await ctx.db
      .query('mapMarkers')
      .withIndex('by_map', (q) => q.eq('mapId', args.mapId))
      .collect();

    for (const marker of markers) {
      await ctx.db.delete(marker._id);
    }

    await ctx.db.delete(args.mapId);
    return args.mapId;
  },
});

/**
 * Get all markers for a map
 */
export const getMarkers = query({
  args: { mapId: v.id('maps') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('mapMarkers')
      .withIndex('by_map', (q) => q.eq('mapId', args.mapId))
      .collect();
  },
});

/**
 * Add a marker to a map
 */
export const addMarker = mutation({
  args: {
    mapId: v.id('maps'),
    type: v.union(
      v.literal('player'),
      v.literal('npc'),
      v.literal('enemy'),
      v.literal('poi')
    ),
    x: v.number(),
    y: v.number(),
    label: v.optional(v.string()),
    color: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
    visible: v.boolean(),
  },
  handler: async (ctx, args) => {
    const markerId = await ctx.db.insert('mapMarkers', args);
    return markerId;
  },
});

/**
 * Update marker position
 */
export const updateMarkerPosition = mutation({
  args: {
    markerId: v.id('mapMarkers'),
    x: v.number(),
    y: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.markerId, {
      x: args.x,
      y: args.y,
    });
    return args.markerId;
  },
});

/**
 * Toggle marker visibility
 */
export const toggleMarkerVisibility = mutation({
  args: {
    markerId: v.id('mapMarkers'),
    visible: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.markerId, {
      visible: args.visible,
    });
    return args.markerId;
  },
});

/**
 * Remove a marker
 */
export const removeMarker = mutation({
  args: { markerId: v.id('mapMarkers') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.markerId);
    return args.markerId;
  },
});
