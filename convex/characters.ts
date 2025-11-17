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
 * Get all characters
 */
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('characters').collect();
  },
});

/**
 * Get a single character by ID
 */
export const get = query({
  args: { id: v.id('characters') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get characters by user
 */
export const byUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('characters')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
  },
});

/**
 * Get characters by campaign
 */
export const byCampaign = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('characters')
      .withIndex('by_campaign', (q) => q.eq('campaignId', args.campaignId))
      .collect();
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
    const characterId = await ctx.db.insert('characters', {
      userId: args.userId,
      campaignId: args.campaignId,
      name: args.name,
      race: args.race,
      class: args.class,
      level: args.level,
      stats: args.stats,
      portraitUrl: args.portraitUrl,
      backstory: args.backstory,
      createdAt: now,
      updatedAt: now,
    });
    return characterId;
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
 * Update character stats (commonly used for HP, AC changes)
 */
export const updateStats = mutation({
  args: {
    id: v.id('characters'),
    stats: statsValidator,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      stats: args.stats,
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

/**
 * Update character HP (quick update for combat)
 */
export const updateHP = mutation({
  args: {
    id: v.id('characters'),
    hp: v.number(),
  },
  handler: async (ctx, args) => {
    const character = await ctx.db.get(args.id);
    if (!character) throw new Error('Character not found');

    await ctx.db.patch(args.id, {
      stats: {
        ...character.stats,
        hp: args.hp,
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
  args: { id: v.id('characters') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
