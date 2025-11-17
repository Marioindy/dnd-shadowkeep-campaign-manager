import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Get a single session by ID with its encounters composed
 */
export const getSession = query({
  args: { sessionId: v.id('sessions') },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) return null;

    // Fetch all encounters for this session if encounters table exists
    try {
      const encounters = await ctx.db
        .query('encounters')
        .withIndex('by_session', (q) => q.eq('sessionId', args.sessionId))
        .collect();

      // Compose session with encounters
      return {
        ...session,
        encounters: encounters.map((enc) => ({
          id: enc._id,
          name: enc.name,
          enemies: enc.enemies,
          initiative: enc.initiative,
        })),
      };
    } catch (e) {
      // If encounters table doesn't exist yet, just return session
      return session;
    }
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

    // Try to fetch encounters for each session
    try {
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
    } catch (e) {
      // If encounters table doesn't exist, return sessions without encounters
      return sessions;
    }
  },
});

/**
 * List all sessions for a campaign (simple list without encounters)
 */
export const listByCampaign = query({
  args: {
    campaignId: v.id('campaigns'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('sessions')
      .withIndex('by_campaign', (q) => q.eq('campaignId', args.campaignId))
      .order('desc')
      .collect();
  },
});

/**
 * Get active session for a campaign
 */
export const getActive = query({
  args: {
    campaignId: v.id('campaigns'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('sessions')
      .withIndex('by_campaign', (q) => q.eq('campaignId', args.campaignId))
      .filter((q) => q.eq(q.field('active'), true))
      .first();
  },
});

/**
 * Get a single session (simple, without encounters)
 */
export const get = query({
  args: {
    id: v.id('sessions'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
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
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert('sessions', {
      campaignId: args.campaignId,
      name: args.name,
      date: args.date,
      notes: args.notes,
      active: args.active ?? false,
    });
    return sessionId;
  },
});

/**
 * Alias for compatibility
 */
export const create = createSession;

/**
 * Start a session (set as active)
 */
export const start = mutation({
  args: {
    id: v.id('sessions'),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.id);
    if (!session) {
      throw new Error('Session not found');
    }

    // Deactivate all other sessions for this campaign
    const allSessions = await ctx.db
      .query('sessions')
      .withIndex('by_campaign', (q) => q.eq('campaignId', session.campaignId))
      .collect();

    for (const s of allSessions) {
      if (s.active) {
        await ctx.db.patch(s._id, { active: false });
      }
    }

    // Activate this session
    await ctx.db.patch(args.id, { active: true });

    // Update campaign's currentSession if it exists
    try {
      await ctx.db.patch(session.campaignId, {
        currentSession: args.id,
        updatedAt: Date.now(),
      });
    } catch (e) {
      // Campaign might not have currentSession field
    }

    return args.id;
  },
});

/**
 * End a session (deactivate)
 */
export const end = mutation({
  args: {
    id: v.id('sessions'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { active: false });
    return args.id;
  },
});

/**
 * Update session notes
 */
export const updateNotes = mutation({
  args: {
    id: v.id('sessions'),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      notes: args.notes,
    });
    return args.id;
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
 * Alias for compatibility
 */
export const update = mutation({
  args: {
    id: v.id('sessions'),
    name: v.optional(v.string()),
    date: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

/**
 * Delete a session
 */
export const remove = mutation({
  args: {
    id: v.id('sessions'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
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
