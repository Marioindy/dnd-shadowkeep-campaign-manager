import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Get all inventory items for a character
 */
export const getByCharacter = query({
  args: { characterId: v.id('characters') },
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
  args: { itemId: v.id('inventory') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.itemId);
  },
});

/**
 * Add an item to character inventory
 */
export const addItem = mutation({
  args: {
    characterId: v.id('characters'),
    name: v.string(),
    type: v.union(
      v.literal('weapon'),
      v.literal('armor'),
      v.literal('potion'),
      v.literal('tool'),
      v.literal('misc')
    ),
    quantity: v.number(),
    weight: v.number(),
    description: v.optional(v.string()),
    properties: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const itemId = await ctx.db.insert('inventory', {
      ...args,
      equipped: false,
    });
    return itemId;
  },
});

/**
 * Update item quantity
 */
export const updateQuantity = mutation({
  args: {
    itemId: v.id('inventory'),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.itemId, {
      quantity: args.quantity,
    });
    return args.itemId;
  },
});

/**
 * Equip or unequip an item
 */
export const toggleEquip = mutation({
  args: {
    itemId: v.id('inventory'),
    equipped: v.boolean(),
    equipSlot: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.itemId, {
      equipped: args.equipped,
      equipSlot: args.equipSlot,
    });
    return args.itemId;
  },
});

/**
 * Update item details
 */
export const update = mutation({
  args: {
    itemId: v.id('inventory'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    weight: v.optional(v.number()),
    properties: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { itemId, ...updates } = args;
    await ctx.db.patch(itemId, updates);
    return itemId;
  },
});

/**
 * Remove an item from inventory
 */
export const removeItem = mutation({
  args: { itemId: v.id('inventory') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.itemId);
    return args.itemId;
  },
});
