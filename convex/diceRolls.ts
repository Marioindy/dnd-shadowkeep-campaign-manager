import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Create a new dice roll
export const logDiceRoll = mutation({
  args: {
    sessionId: v.optional(v.id('sessions')),
    userId: v.id('users'),
    characterName: v.optional(v.string()),
    diceType: v.string(),
    diceCount: v.number(),
    modifier: v.number(),
    rollType: v.union(
      v.literal('normal'),
      v.literal('advantage'),
      v.literal('disadvantage')
    ),
    results: v.array(v.number()),
    total: v.number(),
    purpose: v.optional(v.string()),
    targetDC: v.optional(v.number()),
    success: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const rollId = await ctx.db.insert('diceRolls', {
      ...args,
      timestamp: Date.now(),
    });
    return rollId;
  },
});

// Get all dice rolls for a session
export const getDiceRollsBySession = query({
  args: { sessionId: v.id('sessions') },
  handler: async (ctx, args) => {
    const rolls = await ctx.db
      .query('diceRolls')
      .withIndex('by_session', (q) => q.eq('sessionId', args.sessionId))
      .order('desc')
      .collect();
    return rolls;
  },
});

// Get all dice rolls for a user
export const getDiceRollsByUser = query({
  args: { userId: v.id('users'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query('diceRolls')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc');

    if (args.limit) {
      query = query.take(args.limit) as any;
    }

    const rolls = await query.collect();
    return rolls;
  },
});

// Get recent dice rolls across all sessions
export const getRecentDiceRolls = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    const rolls = await ctx.db
      .query('diceRolls')
      .withIndex('by_timestamp')
      .order('desc')
      .take(limit);
    return rolls;
  },
});

// Get dice roll statistics for a user
export const getDiceRollStats = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const rolls = await ctx.db
      .query('diceRolls')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    if (rolls.length === 0) {
      return {
        totalRolls: 0,
        totalDice: 0,
        averageRoll: 0,
        highestRoll: 0,
        lowestRoll: 0,
        criticalHits: 0,
        criticalFails: 0,
        rollsByType: {},
      };
    }

    let totalDice = 0;
    let totalValue = 0;
    let highestRoll = 0;
    let lowestRoll = Infinity;
    let criticalHits = 0;
    let criticalFails = 0;
    const rollsByType: Record<string, number> = {};

    rolls.forEach((roll) => {
      totalDice += roll.diceCount;
      totalValue += roll.total;

      if (roll.total > highestRoll) highestRoll = roll.total;
      if (roll.total < lowestRoll) lowestRoll = roll.total;

      // Count natural 20s and 1s for d20 rolls
      if (roll.diceType === 'd20') {
        roll.results.forEach((result: number) => {
          if (result === 20) criticalHits++;
          if (result === 1) criticalFails++;
        });
      }

      // Count rolls by dice type
      rollsByType[roll.diceType] = (rollsByType[roll.diceType] || 0) + 1;
    });

    return {
      totalRolls: rolls.length,
      totalDice,
      averageRoll: totalValue / rolls.length,
      highestRoll,
      lowestRoll: lowestRoll === Infinity ? 0 : lowestRoll,
      criticalHits,
      criticalFails,
      rollsByType,
    };
  },
});

// Delete a dice roll (for cleanup/admin)
export const deleteDiceRoll = mutation({
  args: { rollId: v.id('diceRolls') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.rollId);
  },
});
