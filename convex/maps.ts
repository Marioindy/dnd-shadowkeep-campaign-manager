import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Get all maps for a campaign
 */
export const byCampaign = query({
  args: { campaignId: v.id('campaigns') },
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
  args: { id: v.id('maps') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get markers for a map
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
 * Get fog of war layers for a map
 */
export const getFogOfWar = query({
  args: { mapId: v.id('maps') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('fogOfWar')
      .withIndex('by_map', (q) => q.eq('mapId', args.mapId))
      .collect();
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
    const mapId = await ctx.db.insert('maps', {
      campaignId: args.campaignId,
      name: args.name,
      imageUrl: args.imageUrl,
      createdAt: now,
      updatedAt: now,
    });
    return mapId;
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
    const { mapId, ...markerData } = args;
    const markerId = await ctx.db.insert('mapMarkers', {
      mapId,
      ...markerData,
    });
    return markerId;
  },
});

/**
 * Update a marker
 */
export const updateMarker = mutation({
  args: {
    id: v.id('mapMarkers'),
    x: v.optional(v.number()),
    y: v.optional(v.number()),
    label: v.optional(v.string()),
    color: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
    visible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

/**
 * Remove a marker
 */
export const removeMarker = mutation({
  args: { id: v.id('mapMarkers') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

/**
 * Add fog of war layer
 */
export const addFogOfWar = mutation({
  args: {
    mapId: v.id('maps'),
    points: v.array(v.object({ x: v.number(), y: v.number() })),
    revealed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const fogId = await ctx.db.insert('fogOfWar', {
      mapId: args.mapId,
      points: args.points,
      revealed: args.revealed,
    });
    return fogId;
  },
});

/**
 * Update fog of war layer
 */
export const updateFogOfWar = mutation({
  args: {
    id: v.id('fogOfWar'),
    points: v.optional(v.array(v.object({ x: v.number(), y: v.number() }))),
    revealed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

/**
 * Remove fog of war layer
 */
export const removeFogOfWar = mutation({
  args: { id: v.id('fogOfWar') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

/**
 * Delete a map and all its markers/fog of war
 */
export const remove = mutation({
  args: { id: v.id('maps') },
  handler: async (ctx, args) => {
    // Delete all markers
    const markers = await ctx.db
      .query('mapMarkers')
      .withIndex('by_map', (q) => q.eq('mapId', args.id))
      .collect();
    for (const marker of markers) {
      await ctx.db.delete(marker._id);
    }

    // Delete all fog of war
    const fogLayers = await ctx.db
      .query('fogOfWar')
      .withIndex('by_map', (q) => q.eq('mapId', args.id))
      .collect();
    for (const fog of fogLayers) {
      await ctx.db.delete(fog._id);
    }

    // Delete the map
    await ctx.db.delete(args.id);
    return args.id;
  },
});
