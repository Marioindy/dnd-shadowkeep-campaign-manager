import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Get a single session by ID with its encounters composed
 */
export const getSession = query({
  args: { sessionId: v.id('sessions') },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) return null;

    // Fetch all encounters for this session
    const encounters = await ctx.db
      .query('encounters')
      .withIndex('by_session', (q) => q.eq('sessionId', args.sessionId))
      .collect();

    // Compose session with encounters, mapping DB format to view format
    return {
      ...session,
      encounters: encounters.map((enc) => ({
        id: enc._id,
        name: enc.name,
        enemies: enc.enemies,
        initiative: enc.initiative,
      })),
    };
  },
});

/**
 * Get all sessions for a campaign with their encounters composed
 */
export const getSessionsByCampaign = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, args) => {
    // Fetch all sessions for this campaign
    const sessions = await ctx.db
      .query('sessions')
      .withIndex('by_campaign', (q) => q.eq('campaignId', args.campaignId))
      .collect();

    // Fetch all encounters for these sessions
    const composedSessions = await Promise.all(
      sessions.map(async (session) => {
        const encounters = await ctx.db
          .query('encounters')
          .withIndex('by_session', (q) => q.eq('sessionId', session._id))
          .collect();

        return {
          ...session,
          encounters: encounters.map((enc) => ({
            id: enc._id,
            name: enc.name,
            enemies: enc.enemies,
            initiative: enc.initiative,
          })),
        };
      })
    );

    return composedSessions;
  },
});

/**
 * Create a new session
 */
export const createSession = mutation({
  args: {
    campaignId: v.id('campaigns'),
    name: v.string(),
    date: v.number(),
    notes: v.string(),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert('sessions', {
      campaignId: args.campaignId,
      name: args.name,
      date: args.date,
      notes: args.notes,
      active: args.active,
    });
    return sessionId;
  },
});

/**
 * Update a session (excluding encounters)
 */
export const updateSession = mutation({
  args: {
    sessionId: v.id('sessions'),
    name: v.optional(v.string()),
    date: v.optional(v.number()),
    notes: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { sessionId, ...updates } = args;
    await ctx.db.patch(sessionId, updates);
  },
});

/**
 * Create a new encounter for a session
 */
export const createEncounter = mutation({
  args: {
    sessionId: v.id('sessions'),
    name: v.string(),
    enemies: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        hp: v.number(),
        maxHp: v.number(),
        ac: v.number(),
        initiativeBonus: v.number(),
      })
    ),
    initiative: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        initiative: v.number(),
        type: v.union(v.literal('player'), v.literal('enemy'), v.literal('npc')),
      })
    ),
  },
  handler: async (ctx, args) => {
    const encounterId = await ctx.db.insert('encounters', {
      sessionId: args.sessionId,
      name: args.name,
      enemies: args.enemies,
      initiative: args.initiative,
    });
    return encounterId;
  },
});

/**
 * Update an encounter
 */
export const updateEncounter = mutation({
  args: {
    encounterId: v.id('encounters'),
    name: v.optional(v.string()),
    enemies: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          hp: v.number(),
          maxHp: v.number(),
          ac: v.number(),
          initiativeBonus: v.number(),
        })
      )
    ),
    initiative: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          initiative: v.number(),
          type: v.union(v.literal('player'), v.literal('enemy'), v.literal('npc')),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const { encounterId, ...updates } = args;
    await ctx.db.patch(encounterId, updates);
  },
});

/**
 * Delete an encounter
 */
export const deleteEncounter = mutation({
  args: { encounterId: v.id('encounters') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.encounterId);
  },
});
