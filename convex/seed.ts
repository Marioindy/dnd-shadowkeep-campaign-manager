import { mutation } from './_generated/server';
import { hashPassword } from './lib/crypto';

/**
 * Seed the database with an initial admin user
 * This should only be run once during initial setup
 *
 * Default credentials:
 * Username: admin
 * Password: admin123
 *
 * IMPORTANT: Change the admin password after first login!
 */
export const seedAdminUser = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if any users exist
    const existingUsers = await ctx.db.query('users').first();

    if (existingUsers) {
      throw new Error('Database already has users. Cannot seed admin user.');
    }

    // Create admin user with default credentials
    const passwordHash = await hashPassword('admin123');

    const adminId = await ctx.db.insert('users', {
      username: 'admin',
      passwordHash,
      role: 'admin',
      createdAt: Date.now(),
    });

    return {
      _id: adminId,
      username: 'admin',
      role: 'admin',
      message: 'Admin user created successfully. Please change the password after first login!',
    };
  },
});

/**
 * Create a demo campaign with sample data
 */
export const seedDemoCampaign = mutation({
  args: {},
  handler: async (ctx) => {
    // Find admin user
    const admin = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', 'admin'))
      .first();

    if (!admin) {
      throw new Error('Admin user not found. Run seedAdminUser first.');
    }

    // Create a demo campaign
    const campaignId = await ctx.db.insert('campaigns', {
      name: 'The Shadowkeep Chronicles',
      description: 'A dark fantasy campaign set in the mysterious Shadowkeep fortress.',
      dmId: admin._id,
      players: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create demo players
    const player1Hash = await hashPassword('player123');
    const player1Id = await ctx.db.insert('users', {
      username: 'player1',
      passwordHash: player1Hash,
      role: 'player',
      campaignId,
      createdAt: Date.now(),
    });

    const player2Hash = await hashPassword('player123');
    const player2Id = await ctx.db.insert('users', {
      username: 'player2',
      passwordHash: player2Hash,
      role: 'player',
      campaignId,
      createdAt: Date.now(),
    });

    // Update campaign with players
    await ctx.db.patch(campaignId, {
      players: [player1Id, player2Id],
    });

    return {
      campaign: {
        _id: campaignId,
        name: 'The Shadowkeep Chronicles',
      },
      players: [
        { username: 'player1', password: 'player123' },
        { username: 'player2', password: 'player123' },
      ],
      message: 'Demo campaign and players created successfully!',
    };
  },
});
