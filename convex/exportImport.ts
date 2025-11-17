import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const EXPORT_VERSION = '1.0.0';

// ============== CHARACTER EXPORT/IMPORT ==============

// Export character with inventory
export const exportCharacter = query({
  args: { characterId: v.id('characters') },
  handler: async (ctx, args) => {
    const character = await ctx.db.get(args.characterId);
    if (!character) {
      throw new Error('Character not found');
    }

    // Get character's inventory
    const inventory = await ctx.db
      .query('inventory')
      .withIndex('by_character', (q) => q.eq('characterId', args.characterId))
      .collect();

    const exportData = {
      character,
      inventory,
      exportedAt: Date.now(),
      version: EXPORT_VERSION,
    };

    return exportData;
  },
});

// Import character (creates new character)
export const importCharacter = mutation({
  args: {
    userId: v.id('users'),
    campaignId: v.id('campaigns'),
    exportData: v.string(), // JSON string
  },
  handler: async (ctx, args) => {
    let data;
    try {
      data = JSON.parse(args.exportData);
    } catch (e) {
      throw new Error('Invalid export data');
    }

    if (!data.character || !data.version) {
      throw new Error('Invalid export format');
    }

    // Create new character
    const { _id, _creationTime, userId: _userId, campaignId: _campaignId, ...characterData } = data.character;

    const newCharacterId = await ctx.db.insert('characters', {
      ...characterData,
      userId: args.userId,
      campaignId: args.campaignId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Import inventory items
    if (data.inventory && Array.isArray(data.inventory)) {
      for (const item of data.inventory) {
        const { _id, _creationTime, characterId: _characterId, ...itemData } = item;
        await ctx.db.insert('inventory', {
          ...itemData,
          characterId: newCharacterId,
        });
      }
    }

    return { characterId: newCharacterId };
  },
});

// ============== CAMPAIGN EXPORT/IMPORT ==============

// Export campaign with sessions and maps
export const exportCampaign = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // Get sessions with encounters
    const sessions = await ctx.db
      .query('sessions')
      .withIndex('by_campaign', (q) => q.eq('campaignId', args.campaignId))
      .collect();

    const sessionsWithEncounters = await Promise.all(
      sessions.map(async (session) => {
        const encounters = await ctx.db
          .query('encounters')
          .withIndex('by_session', (q) => q.eq('sessionId', session._id))
          .collect();

        return {
          ...session,
          encounters,
        };
      })
    );

    // Get maps with markers
    const maps = await ctx.db
      .query('maps')
      .withIndex('by_campaign', (q) => q.eq('campaignId', args.campaignId))
      .collect();

    const mapsWithMarkers = await Promise.all(
      maps.map(async (map) => {
        const markers = await ctx.db
          .query('mapMarkers')
          .withIndex('by_map', (q) => q.eq('mapId', map._id))
          .collect();

        return {
          ...map,
          markers,
        };
      })
    );

    const exportData = {
      campaign,
      sessions: sessionsWithEncounters,
      maps: mapsWithMarkers,
      exportedAt: Date.now(),
      version: EXPORT_VERSION,
    };

    return exportData;
  },
});

// Import campaign (creates new campaign)
export const importCampaign = mutation({
  args: {
    dmId: v.id('users'),
    exportData: v.string(), // JSON string
    importSessions: v.optional(v.boolean()),
    importMaps: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let data;
    try {
      data = JSON.parse(args.exportData);
    } catch (e) {
      throw new Error('Invalid export data');
    }

    if (!data.campaign || !data.version) {
      throw new Error('Invalid export format');
    }

    // Create new campaign
    const {
      _id,
      _creationTime,
      dmId: _dmId,
      players: _players,
      currentSession: _currentSession,
      ...campaignData
    } = data.campaign;

    const newCampaignId = await ctx.db.insert('campaigns', {
      ...campaignData,
      dmId: args.dmId,
      players: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Import sessions if requested
    if (args.importSessions && data.sessions && Array.isArray(data.sessions)) {
      for (const sessionData of data.sessions) {
        const {
          _id,
          _creationTime,
          campaignId: _campaignId,
          encounters: sessionEncounters,
          ...session
        } = sessionData;

        const newSessionId = await ctx.db.insert('sessions', {
          ...session,
          campaignId: newCampaignId,
        });

        // Import encounters
        if (sessionEncounters && Array.isArray(sessionEncounters)) {
          for (const encounter of sessionEncounters) {
            const { _id, _creationTime, sessionId: _sessionId, ...encounterData } = encounter;
            await ctx.db.insert('encounters', {
              ...encounterData,
              sessionId: newSessionId,
            });
          }
        }
      }
    }

    // Import maps if requested
    if (args.importMaps && data.maps && Array.isArray(data.maps)) {
      for (const mapData of data.maps) {
        const {
          _id,
          _creationTime,
          campaignId: _campaignId,
          markers: mapMarkers,
          ...map
        } = mapData;

        const newMapId = await ctx.db.insert('maps', {
          ...map,
          campaignId: newCampaignId,
        });

        // Import markers
        if (mapMarkers && Array.isArray(mapMarkers)) {
          for (const marker of mapMarkers) {
            const { _id, _creationTime, mapId: _mapId, ...markerData } = marker;
            await ctx.db.insert('mapMarkers', {
              ...markerData,
              mapId: newMapId,
            });
          }
        }
      }
    }

    return { campaignId: newCampaignId };
  },
});

// ============== HELPER FUNCTIONS ==============

// Generate shareable link data
export const generateShareableLink = query({
  args: {
    contentType: v.union(
      v.literal('campaign'),
      v.literal('character'),
      v.literal('map')
    ),
    contentId: v.string(),
  },
  handler: async (ctx, args) => {
    const content = await ctx.db.get(args.contentId as any);
    if (!content) {
      throw new Error('Content not found');
    }

    // Generate a simple hash for the shareable link
    const linkId = `${args.contentType}-${args.contentId}-${Date.now()}`;

    return {
      linkId,
      contentType: args.contentType,
      contentId: args.contentId,
      createdAt: Date.now(),
    };
  },
});

// Validate import data
export const validateImportData = query({
  args: {
    exportData: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const data = JSON.parse(args.exportData);

      if (!data.version) {
        return {
          valid: false,
          error: 'Missing version information',
        };
      }

      if (data.version !== EXPORT_VERSION) {
        return {
          valid: false,
          error: `Unsupported version: ${data.version}`,
        };
      }

      if (data.character) {
        return {
          valid: true,
          type: 'character',
          preview: {
            name: data.character.name,
            class: data.character.class,
            level: data.character.level,
            itemCount: data.inventory?.length || 0,
          },
        };
      }

      if (data.campaign) {
        return {
          valid: true,
          type: 'campaign',
          preview: {
            name: data.campaign.name,
            description: data.campaign.description,
            sessionCount: data.sessions?.length || 0,
            mapCount: data.maps?.length || 0,
          },
        };
      }

      return {
        valid: false,
        error: 'Unknown export type',
      };
    } catch (e) {
      return {
        valid: false,
        error: 'Invalid JSON format',
      };
    }
  },
});
