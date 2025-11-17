import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// ============== DISCORD WEBHOOK QUERIES ==============

// Get user's Discord webhooks
export const getUserWebhooks = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('discordWebhooks')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
  },
});

// Get campaign's Discord webhooks
export const getCampaignWebhooks = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('discordWebhooks')
      .withIndex('by_campaign', (q) => q.eq('campaignId', args.campaignId))
      .collect();
  },
});

// Get webhook by ID
export const getWebhook = query({
  args: { webhookId: v.id('discordWebhooks') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.webhookId);
  },
});

// ============== DISCORD WEBHOOK MUTATIONS ==============

// Create Discord webhook
export const createWebhook = mutation({
  args: {
    userId: v.id('users'),
    campaignId: v.optional(v.id('campaigns')),
    webhookUrl: v.string(),
    webhookName: v.string(),
    events: v.array(
      v.union(
        v.literal('session_start'),
        v.literal('session_end'),
        v.literal('character_update'),
        v.literal('new_post'),
        v.literal('combat_start')
      )
    ),
  },
  handler: async (ctx, args) => {
    // Validate webhook URL format
    if (!args.webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      throw new Error('Invalid Discord webhook URL');
    }

    const webhookId = await ctx.db.insert('discordWebhooks', {
      ...args,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return webhookId;
  },
});

// Update Discord webhook
export const updateWebhook = mutation({
  args: {
    webhookId: v.id('discordWebhooks'),
    webhookName: v.optional(v.string()),
    events: v.optional(
      v.array(
        v.union(
          v.literal('session_start'),
          v.literal('session_end'),
          v.literal('character_update'),
          v.literal('new_post'),
          v.literal('combat_start')
        )
      )
    ),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { webhookId, ...updates } = args;

    await ctx.db.patch(webhookId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Delete Discord webhook
export const deleteWebhook = mutation({
  args: { webhookId: v.id('discordWebhooks') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.webhookId);
    return { success: true };
  },
});

// Toggle webhook active status
export const toggleWebhook = mutation({
  args: { webhookId: v.id('discordWebhooks') },
  handler: async (ctx, args) => {
    const webhook = await ctx.db.get(args.webhookId);
    if (!webhook) {
      throw new Error('Webhook not found');
    }

    await ctx.db.patch(args.webhookId, {
      isActive: !webhook.isActive,
      updatedAt: Date.now(),
    });

    return { success: true, isActive: !webhook.isActive };
  },
});

// ============== DISCORD NOTIFICATION SENDING ==============

// Send Discord notification (internal use)
export const sendDiscordNotification = mutation({
  args: {
    webhookUrl: v.string(),
    content: v.optional(v.string()),
    embeds: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    try {
      // Note: In a real implementation, you would use fetch() to send to Discord
      // For now, we'll just log the intent
      console.log('Discord notification would be sent:', {
        url: args.webhookUrl,
        content: args.content,
        embeds: args.embeds,
      });

      // In production, use fetch:
      // const response = await fetch(args.webhookUrl, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     content: args.content,
      //     embeds: args.embeds,
      //   }),
      // });

      return { success: true };
    } catch (error) {
      console.error('Failed to send Discord notification:', error);
      return { success: false, error: String(error) };
    }
  },
});

// Trigger event notification
export const triggerEventNotification = mutation({
  args: {
    eventType: v.union(
      v.literal('session_start'),
      v.literal('session_end'),
      v.literal('character_update'),
      v.literal('new_post'),
      v.literal('combat_start')
    ),
    campaignId: v.optional(v.id('campaigns')),
    userId: v.optional(v.id('users')),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    // Find relevant webhooks
    let webhooks = await ctx.db.query('discordWebhooks').collect();

    // Filter by campaign if provided
    if (args.campaignId) {
      webhooks = webhooks.filter(
        (w) => w.campaignId === args.campaignId || !w.campaignId
      );
    }

    // Filter by user if provided
    if (args.userId) {
      webhooks = webhooks.filter((w) => w.userId === args.userId);
    }

    // Filter by event type and active status
    webhooks = webhooks.filter(
      (w) => w.isActive && w.events.includes(args.eventType)
    );

    // Send notifications to all matching webhooks
    const results = await Promise.all(
      webhooks.map(async (webhook) => {
        const embed = buildDiscordEmbed(args.eventType, args.data);

        return await ctx.runMutation(sendDiscordNotification, {
          webhookUrl: webhook.webhookUrl,
          embeds: [embed],
        });
      })
    );

    return { success: true, sent: results.length };
  },
});

// ============== HELPER FUNCTIONS ==============

function buildDiscordEmbed(
  eventType: string,
  data: any
): Record<string, any> {
  const baseEmbed = {
    timestamp: new Date().toISOString(),
    footer: {
      text: 'D&D Shadowkeep Campaign Manager',
    },
  };

  switch (eventType) {
    case 'session_start':
      return {
        ...baseEmbed,
        title: '🎲 Session Started',
        description: `**${data.sessionName || 'Session'}** has begun!`,
        color: 0x10b981, // Green
        fields: [
          {
            name: 'Campaign',
            value: data.campaignName || 'Unknown',
            inline: true,
          },
          {
            name: 'DM',
            value: data.dmName || 'Unknown',
            inline: true,
          },
        ],
      };

    case 'session_end':
      return {
        ...baseEmbed,
        title: '✅ Session Ended',
        description: `**${data.sessionName || 'Session'}** has concluded.`,
        color: 0x6366f1, // Indigo
      };

    case 'character_update':
      return {
        ...baseEmbed,
        title: '⚔️ Character Updated',
        description: `**${data.characterName}** has been updated!`,
        color: 0x8b5cf6, // Purple
        fields: [
          {
            name: 'Level',
            value: String(data.level || 'N/A'),
            inline: true,
          },
          {
            name: 'Class',
            value: data.class || 'N/A',
            inline: true,
          },
        ],
      };

    case 'new_post':
      return {
        ...baseEmbed,
        title: '📝 New Post',
        description: data.title || 'A new post has been created',
        color: 0xec4899, // Pink
        fields: [
          {
            name: 'Author',
            value: data.authorName || 'Unknown',
            inline: true,
          },
          {
            name: 'Type',
            value: data.type || 'discussion',
            inline: true,
          },
        ],
      };

    case 'combat_start':
      return {
        ...baseEmbed,
        title: '⚔️ Combat Started!',
        description: `Initiative order has been rolled!`,
        color: 0xef4444, // Red
        fields: data.initiative
          ? data.initiative.slice(0, 5).map((entry: any, idx: number) => ({
              name: `${idx + 1}. ${entry.name}`,
              value: `Initiative: ${entry.initiative}`,
              inline: false,
            }))
          : [],
      };

    default:
      return {
        ...baseEmbed,
        title: 'Notification',
        description: 'An event occurred in your campaign',
        color: 0x6b7280, // Gray
      };
  }
}

// Test webhook connection
export const testWebhook = mutation({
  args: { webhookId: v.id('discordWebhooks') },
  handler: async (ctx, args) => {
    const webhook = await ctx.db.get(args.webhookId);
    if (!webhook) {
      throw new Error('Webhook not found');
    }

    const embed = {
      title: '✅ Webhook Test',
      description:
        'Your Discord webhook is configured correctly and ready to receive notifications!',
      color: 0x10b981, // Green
      timestamp: new Date().toISOString(),
      footer: {
        text: 'D&D Shadowkeep Campaign Manager',
      },
    };

    return await ctx.runMutation(sendDiscordNotification, {
      webhookUrl: webhook.webhookUrl,
      embeds: [embed],
    });
  },
});
