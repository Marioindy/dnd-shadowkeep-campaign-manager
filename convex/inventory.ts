import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const itemTypeValidator = v.union(
  v.literal('weapon'),
  v.literal('armor'),
  v.literal('potion'),
  v.literal('tool'),
  v.literal('misc')
);

/**
 * List all inventory items for a character
 */
export const listByCharacter = query({
  args: {
    characterId: v.id('characters'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('inventory')
      .withIndex('by_character', (q) => q.eq('characterId', args.characterId))
      .collect();
  },
});

/**
 * Get a single inventory item
 */
export const get = query({
  args: {
    id: v.id('inventory'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Add an item to inventory
 */
export const add = mutation({
  args: {
    characterId: v.id('characters'),
    name: v.string(),
    type: itemTypeValidator,
    quantity: v.number(),
    weight: v.number(),
    description: v.optional(v.string()),
    properties: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('inventory', {
      ...args,
      equipped: false,
    });
  },
});

/**
 * Update an inventory item
 */
export const update = mutation({
  args: {
    id: v.id('inventory'),
    name: v.optional(v.string()),
    type: v.optional(itemTypeValidator),
    quantity: v.optional(v.number()),
    weight: v.optional(v.number()),
    description: v.optional(v.string()),
    properties: v.optional(v.any()),
    equipped: v.optional(v.boolean()),
    equipSlot: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

/**
 * Equip/unequip an item
 */
export const toggleEquip = mutation({
  args: {
    id: v.id('inventory'),
    equipped: v.boolean(),
    equipSlot: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      equipped: args.equipped,
      equipSlot: args.equipSlot,
    });
    return args.id;
  },
});

/**
 * Remove an item from inventory
 */
export const remove = mutation({
  args: {
    id: v.id('inventory'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * Update item quantity (for consumables)
 */
export const updateQuantity = mutation({
  args: {
    id: v.id('inventory'),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      quantity: Math.max(0, args.quantity),
    });
    return args.id;
  },
});
