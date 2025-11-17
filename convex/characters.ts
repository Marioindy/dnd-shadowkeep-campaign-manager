import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const statsValidator = v.object({
  strength: v.number(),
  dexterity: v.number(),
  constitution: v.number(),
  intelligence: v.number(),
  wisdom: v.number(),
  charisma: v.number(),
  hp: v.number(),
  maxHp: v.number(),
  ac: v.number(),
  speed: v.number(),
});

/**
 * List all characters for a campaign
 */
export const listByCampaign = query({
  args: {
    campaignId: v.id('campaigns'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('characters')
      .withIndex('by_campaign', (q) => q.eq('campaignId', args.campaignId))
      .collect();
  },
});

/**
 * List all characters for a user
 */
export const listByUser = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('characters')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
  },
});

/**
 * Get a single character by ID
 */
export const get = query({
  args: {
    id: v.id('characters'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Create a new character
 */
export const create = mutation({
  args: {
    userId: v.id('users'),
    campaignId: v.id('campaigns'),
    name: v.string(),
    race: v.string(),
    class: v.string(),
    level: v.number(),
    stats: statsValidator,
    portraitUrl: v.optional(v.string()),
    backstory: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('characters', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update a character
 */
export const update = mutation({
  args: {
    id: v.id('characters'),
    name: v.optional(v.string()),
    race: v.optional(v.string()),
    class: v.optional(v.string()),
    level: v.optional(v.number()),
    stats: v.optional(statsValidator),
    portraitUrl: v.optional(v.string()),
    backstory: v.optional(v.string()),
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
 * Update character HP (for damage/healing during combat)
 */
export const updateHP = mutation({
  args: {
    id: v.id('characters'),
    hp: v.number(),
  },
  handler: async (ctx, args) => {
    const character = await ctx.db.get(args.id);
    if (!character) {
      throw new Error('Character not found');
    }

    await ctx.db.patch(args.id, {
      stats: {
        ...character.stats,
        hp: Math.max(0, Math.min(args.hp, character.stats.maxHp)),
      },
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

/**
 * Delete a character
 */
export const remove = mutation({
  args: {
    id: v.id('characters'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
