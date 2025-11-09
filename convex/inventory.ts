import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Get all inventory items for a character
 */
export const byCharacter = query({
  args: { characterId: v.id('characters') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('inventory')
      .withIndex('by_character', (q) => q.eq('characterId', args.characterId))
      .collect();
  },
});

/**
 * Get equipped items for a character
 */
export const equipped = query({
  args: { characterId: v.id('characters') },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('inventory')
      .withIndex('by_character', (q) => q.eq('characterId', args.characterId))
      .collect();
    return items.filter((item) => item.equipped === true);
  },
});

/**
 * Get a single inventory item by ID
 */
export const get = query({
  args: { id: v.id('inventory') },
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
      characterId: args.characterId,
      name: args.name,
      type: args.type,
      quantity: args.quantity,
      weight: args.weight,
      description: args.description,
      properties: args.properties,
      equipped: false,
    });
    return itemId;
  },
});

/**
 * Update an inventory item
 */
export const update = mutation({
  args: {
    id: v.id('inventory'),
    name: v.optional(v.string()),
    quantity: v.optional(v.number()),
    weight: v.optional(v.number()),
    description: v.optional(v.string()),
    properties: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

/**
 * Equip or unequip an item
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
 * Update item quantity (for stackable items)
 */
export const updateQuantity = mutation({
  args: {
    id: v.id('inventory'),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      quantity: args.quantity,
    });
    return args.id;
  },
});

/**
 * Remove an item from inventory
 */
export const remove = mutation({
  args: { id: v.id('inventory') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
