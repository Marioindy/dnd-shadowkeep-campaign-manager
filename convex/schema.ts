import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    username: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal('player'), v.literal('dm'), v.literal('admin')),
    campaignId: v.optional(v.id('campaigns')),
    createdAt: v.number(),
  }).index('by_username', ['username']),

  campaigns: defineTable({
    name: v.string(),
    description: v.string(),
    dmId: v.id('users'),
    players: v.array(v.id('users')),
    currentSession: v.optional(v.id('sessions')),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  characters: defineTable({
    userId: v.id('users'),
    campaignId: v.id('campaigns'),
    name: v.string(),
    race: v.string(),
    class: v.string(),
    level: v.number(),
    stats: v.object({
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
    }),
    portraitUrl: v.optional(v.string()),
    backstory: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_campaign', ['campaignId']),

  inventory: defineTable({
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
    equipped: v.optional(v.boolean()),
    equipSlot: v.optional(v.string()),
  }).index('by_character', ['characterId']),

  maps: defineTable({
    campaignId: v.id('campaigns'),
    name: v.string(),
    imageUrl: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_campaign', ['campaignId']),

  mapMarkers: defineTable({
    mapId: v.id('maps'),
    type: v.union(
      v.literal('player'),
      v.literal('npc'),
      v.literal('enemy'),
      v.literal('poi')
    ),
    x: v.number(),
    y: v.number(),
    label: v.optional(v.string()),
    color: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
    visible: v.boolean(),
  }).index('by_map', ['mapId']),

  sessions: defineTable({
    campaignId: v.id('campaigns'),
    name: v.string(),
    date: v.number(),
    notes: v.string(),
    active: v.boolean(),
  }).index('by_campaign', ['campaignId']),

  encounters: defineTable({
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
  }).index('by_session', ['sessionId']),

  campaignTemplates: defineTable({
    name: v.string(),
    description: v.string(),
    genre: v.union(
      v.literal('fantasy'),
      v.literal('sci-fi'),
      v.literal('horror'),
      v.literal('modern'),
      v.literal('steampunk'),
      v.literal('cyberpunk'),
      v.literal('post-apocalyptic'),
      v.literal('custom')
    ),
    difficulty: v.union(
      v.literal('beginner'),
      v.literal('intermediate'),
      v.literal('advanced'),
      v.literal('expert')
    ),
    recommendedPlayers: v.object({
      min: v.number(),
      max: v.number(),
    }),
    imageUrl: v.optional(v.string()),
    lore: v.string(),

    // Template data for creating campaigns
    characterTemplates: v.array(
      v.object({
        name: v.string(),
        race: v.string(),
        class: v.string(),
        level: v.number(),
        stats: v.object({
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
        }),
        backstory: v.string(),
        portraitUrl: v.optional(v.string()),
      })
    ),

    npcTemplates: v.array(
      v.object({
        name: v.string(),
        role: v.string(),
        description: v.string(),
        stats: v.optional(
          v.object({
            hp: v.number(),
            maxHp: v.number(),
            ac: v.number(),
            initiativeBonus: v.number(),
          })
        ),
      })
    ),

    mapTemplates: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        imageUrl: v.optional(v.string()),
        markers: v.array(
          v.object({
            type: v.union(
              v.literal('player'),
              v.literal('npc'),
              v.literal('enemy'),
              v.literal('poi')
            ),
            x: v.number(),
            y: v.number(),
            label: v.optional(v.string()),
            color: v.optional(v.string()),
          })
        ),
      })
    ),

    encounterTemplates: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        enemies: v.array(
          v.object({
            name: v.string(),
            hp: v.number(),
            maxHp: v.number(),
            ac: v.number(),
            initiativeBonus: v.number(),
          })
        ),
      })
    ),

    starterItems: v.array(
      v.object({
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
        description: v.string(),
        properties: v.optional(v.any()),
      })
    ),

    // Metadata
    authorId: v.optional(v.id('users')),
    isOfficial: v.boolean(),
    isPublic: v.boolean(),
    downloads: v.number(),
    rating: v.number(),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_genre', ['genre'])
    .index('by_author', ['authorId'])
    .index('by_public', ['isPublic'])
    .index('by_official', ['isOfficial']),
});
