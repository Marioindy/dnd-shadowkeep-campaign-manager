import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const markerTypeValidator = v.union(
  v.literal('player'),
  v.literal('npc'),
  v.literal('enemy'),
  v.literal('poi')
);

/**
 * List all markers for a map
 */
export const listByMap = query({
  args: {
    mapId: v.id('maps'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('mapMarkers')
      .withIndex('by_map', (q) => q.eq('mapId', args.mapId))
      .collect();
  },
});

/**
 * List visible markers for a map (for players)
 */
export const listVisibleByMap = query({
  args: {
    mapId: v.id('maps'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('mapMarkers')
      .withIndex('by_map', (q) => q.eq('mapId', args.mapId))
      .filter((q) => q.eq(q.field('visible'), true))
      .collect();
  },
});

/**
 * Get a single marker
 */
export const get = query({
  args: {
    id: v.id('mapMarkers'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Create a new marker
 */
export const create = mutation({
  args: {
    mapId: v.id('maps'),
    type: markerTypeValidator,
    x: v.number(),
    y: v.number(),
    label: v.optional(v.string()),
    color: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
    visible: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('mapMarkers', args);
  },
});

/**
 * Update a marker position
 */
export const updatePosition = mutation({
  args: {
    id: v.id('mapMarkers'),
    x: v.number(),
    y: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      x: args.x,
      y: args.y,
    });
    return args.id;
  },
});

/**
 * Update marker visibility (for fog of war)
 */
export const updateVisibility = mutation({
  args: {
    id: v.id('mapMarkers'),
    visible: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      visible: args.visible,
    });
    return args.id;
  },
});

/**
 * Update a marker
 */
export const update = mutation({
  args: {
    id: v.id('mapMarkers'),
    type: v.optional(markerTypeValidator),
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
 * Delete a marker
 */
export const remove = mutation({
  args: {
    id: v.id('mapMarkers'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * Batch update marker visibility (for revealing/hiding areas)
 */
export const batchUpdateVisibility = mutation({
  args: {
    markerIds: v.array(v.id('mapMarkers')),
    visible: v.boolean(),
  },
  handler: async (ctx, args) => {
    for (const id of args.markerIds) {
      await ctx.db.patch(id, { visible: args.visible });
    }
  },
});
