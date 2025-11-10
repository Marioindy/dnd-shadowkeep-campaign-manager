import { mutation } from './_generated/server';
import { defaultTemplates } from './seedTemplates';

/**
 * Seed the database with default campaign templates
 *
 * This mutation should be run once to populate the database with the official templates.
 * It can be called from the Convex dashboard or via a setup script.
 *
 * Usage:
 * - In Convex dashboard, go to Functions > seedDefaultTemplates > Run
 * - Or call it programmatically when initializing the app
 */
export const seedDefaultTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const createdIds = [];

    // Check if templates already exist
    const existingTemplates = await ctx.db.query('campaignTemplates').collect();

    if (existingTemplates.length > 0) {
      return {
        success: false,
        message: 'Templates already exist. Skipping seed.',
        existingCount: existingTemplates.length,
      };
    }

    // Insert each default template
    for (const template of defaultTemplates) {
      const templateId = await ctx.db.insert('campaignTemplates', {
        ...template,
        downloads: 0,
        rating: 0,
        createdAt: now,
        updatedAt: now,
      });
      createdIds.push(templateId);
    }

    return {
      success: true,
      message: `Successfully seeded ${createdIds.length} default templates`,
      templateIds: createdIds,
      templates: defaultTemplates.map((t) => t.name),
    };
  },
});

/**
 * Clear all templates (USE WITH CAUTION)
 *
 * This mutation removes all templates from the database.
 * Should only be used in development/testing.
 */
export const clearAllTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    const allTemplates = await ctx.db.query('campaignTemplates').collect();

    for (const template of allTemplates) {
      await ctx.db.delete(template._id);
    }

    return {
      success: true,
      message: `Deleted ${allTemplates.length} templates`,
      count: allTemplates.length,
    };
  },
});

/**
 * Reset templates: clear all and re-seed
 *
 * Convenient function for development to reset to default state
 */
export const resetTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing
    const allTemplates = await ctx.db.query('campaignTemplates').collect();
    for (const template of allTemplates) {
      await ctx.db.delete(template._id);
    }

    // Re-seed
    const now = Date.now();
    const createdIds = [];

    for (const template of defaultTemplates) {
      const templateId = await ctx.db.insert('campaignTemplates', {
        ...template,
        downloads: 0,
        rating: 0,
        createdAt: now,
        updatedAt: now,
      });
      createdIds.push(templateId);
    }

    return {
      success: true,
      message: `Reset complete: deleted ${allTemplates.length}, created ${createdIds.length}`,
      deletedCount: allTemplates.length,
      createdCount: createdIds.length,
      templates: defaultTemplates.map((t) => t.name),
    };
  },
});
