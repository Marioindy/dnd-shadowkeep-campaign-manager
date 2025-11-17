# Campaign Templates Library

A comprehensive template system that allows DMs to quickly create campaigns from pre-built templates or share their own custom campaigns with the community.

## Overview

The Campaign Templates Library provides:

- **Pre-built Templates**: 6+ official campaign templates covering various genres
- **One-Click Creation**: Instantly create a complete campaign with characters, NPCs, maps, encounters, and items
- **Community Marketplace**: Share and discover community-created templates
- **Genre Diversity**: Fantasy, Sci-Fi, Horror, Steampunk, Cyberpunk, Post-Apocalyptic, and more
- **Difficulty Levels**: Beginner, Intermediate, Advanced, and Expert templates

## Features

### 1. Template Browser

Browse and filter templates by:
- **Genre**: Fantasy, Sci-Fi, Horror, Modern, Steampunk, Cyberpunk, Post-Apocalyptic, Custom
- **Difficulty**: Beginner, Intermediate, Advanced, Expert
- **Official vs Community**: Filter official templates or see all public templates

Access via: `/dm/templates`

### 2. One-Click Campaign Creation

Each template includes:
- ✓ Pre-made character templates with stats and backstories
- ✓ NPCs with roles and descriptions
- ✓ Maps with pre-placed markers
- ✓ Ready-to-run encounters with balanced enemies
- ✓ Starter items and equipment
- ✓ Rich lore and world-building

Click "Create Campaign" from any template detail page to instantly set up a complete campaign.

### 3. Community Template Creator

Create and share your own templates:
- Define basic campaign info (name, description, genre, difficulty)
- Add lore and world-building
- Set recommended player count
- Tag for discoverability
- Choose public or private visibility

Access via: `/dm/templates/create`

## Official Templates

### 1. Lost Mines of Phandelver (Fantasy - Beginner)
A classic fantasy adventure for new adventurers. Explore ancient ruins, battle goblins, and uncover the secrets of Wave Echo Cave.

**Includes:**
- 4 pre-made characters (Fighter, Wizard, Rogue, Cleric)
- 4 key NPCs (Sildar, Gundren, Toblen, Sister Garaele)
- 2 maps (Phandalin Town, Cragmaw Hideout)
- 2 encounters (Goblin Ambush, Redbrand Ruffians)
- Essential starter items

### 2. Curse of Strahd (Horror - Intermediate)
A gothic horror campaign in the mist-shrouded land of Barovia, ruled by the vampire Count Strahd von Zarovich.

**Includes:**
- 2 experienced characters (Van Richten, Ezmerelda)
- 4 NPCs including Strahd and Ireena
- 2 atmospheric maps (Village of Barovia, Castle Ravenloft)
- Undead encounters
- Holy symbols and vampire-hunting equipment

### 3. Cyberpunk: Night City Chronicles (Cyberpunk - Advanced)
Navigate the neon-lit streets of Night City where mega-corporations rule and cybernetic enhancement is a way of life.

**Includes:**
- Netrunner and Solo characters with augmentations
- Fixers, legendary NPCs, and corporate enforcers
- Urban locations (Afterlife Club, Arasaka Tower)
- Corporate security encounters
- Cybernetic weapons and hacking tools

### 4. Steampunk Skies: The Brass Horizon (Steampunk - Intermediate)
Sail the skies in steam-powered airships, exploring floating cities and uncovering ancient technology.

**Includes:**
- Artificer captain and dwarven engineer
- Empire leaders and mysterious informants
- Floating bazaar and sky locations
- Sky pirate encounters
- Steam-powered gadgets and brass goggles

### 5. The Last Stand: Zombie Apocalypse (Post-Apocalyptic - Intermediate)
Survive in a world overrun by the undead. Scavenge resources, build defenses, and search for a cure.

**Includes:**
- Doctor and ranger survivor characters
- Community leaders and marauder antagonists
- Safe zone and scavenging locations
- Walker hordes and human threats
- Survival equipment and medical supplies

### 6. Starbound Odyssey (Sci-Fi - Advanced)
Explore the galaxy aboard your starship, encountering alien civilizations, ancient mysteries, and cosmic threats.

**Includes:**
- Commander and alien psychic characters
- Concordance officials and AI antagonists
- Space stations and alien ruins
- Space combat encounters
- Plasma rifles and shield generators

## Architecture

### Database Schema

```typescript
campaignTemplates: {
  // Basic Info
  name: string
  description: string
  genre: 'fantasy' | 'sci-fi' | 'horror' | ...
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  recommendedPlayers: { min: number, max: number }
  imageUrl?: string
  lore: string

  // Template Data
  characterTemplates: Array<CharacterTemplate>
  npcTemplates: Array<NPCTemplate>
  mapTemplates: Array<MapTemplate>
  encounterTemplates: Array<EncounterTemplate>
  starterItems: Array<ItemTemplate>

  // Metadata
  authorId?: Id<'users'>
  isOfficial: boolean
  isPublic: boolean
  downloads: number
  rating: number
  tags: string[]
  createdAt: number
  updatedAt: number
}
```

### Convex Functions

#### Queries
- `list()` - Get all public templates
- `listOfficial()` - Get official templates only
- `listByGenre(genre)` - Filter by genre
- `get(templateId)` - Get a specific template
- `listByAuthor(userId)` - Get user's templates
- `searchByTags(tags)` - Search by tags

#### Mutations
- `createTemplate(...)` - Create a new template
- `updateTemplate(templateId, ...)` - Update a template
- `deleteTemplate(templateId)` - Delete a template
- `createCampaignFromTemplate(templateId, dmId, campaignName)` - **One-click creation**
- `incrementDownloads(templateId)` - Track downloads
- `rateTemplate(templateId, rating)` - Rate a template

### Key Implementation: One-Click Campaign Creation

The `createCampaignFromTemplate` mutation handles the entire campaign setup:

1. **Create Campaign**: Insert campaign with template data
2. **Create Maps**: Generate maps with pre-placed markers
3. **Create Sessions**: Set up starter session with encounters
4. **Create Encounters**: Populate with template enemies
5. **Track Downloads**: Increment template usage counter

Players can then use character templates to quickly create their characters.

## File Structure

```
convex/
├── schema.ts                        # Database schema with campaignTemplates table
├── templates.ts                     # Template queries and mutations
├── seedTemplates.ts                 # 6 default template definitions
└── seedDefaultTemplates.ts          # Seeding functions

src/app/(dm)/dm/templates/
├── page.tsx                         # Main templates browser
├── create/
│   ├── page.tsx                     # Template creator page
│   └── components/
│       └── TemplateCreator.tsx      # Template creation form
└── components/
    ├── TemplateGallery.tsx          # Grid of template cards
    ├── TemplateCard.tsx             # Individual template preview
    ├── TemplateFilters.tsx          # Genre/difficulty filters
    └── TemplateDetailModal.tsx      # Full template details + create button
```

## Usage Guide

### For DMs: Using Templates

1. Navigate to **DM Panel > Templates**
2. Browse or filter templates by genre and difficulty
3. Click on a template to view full details
4. Click "Create Campaign" and enter a campaign name
5. Your campaign is instantly created with:
   - All NPCs
   - All maps with markers
   - A starter session with encounters
   - Character templates available for players

### For DMs: Creating Templates

1. Navigate to **DM Panel > Templates**
2. Click "Create Template" button
3. Fill in basic information:
   - Name and description
   - Genre and difficulty
   - Player count range
   - Lore and setting
   - Tags for discoverability
4. Choose visibility (public or private)
5. Submit to create

**Note**: The current version creates a basic template framework. Future updates will include:
- Character template builder
- NPC creator with stats
- Map uploader with marker placement
- Encounter designer
- Item library

### For Developers: Seeding Default Templates

To populate the database with official templates:

1. Open the Convex dashboard
2. Go to **Functions > seedDefaultTemplates**
3. Click "Run" on the `seedDefaultTemplates` mutation
4. Confirm success message

**Development Commands:**
- `seedDefaultTemplates` - Add default templates (only if none exist)
- `clearAllTemplates` - Remove all templates (development only)
- `resetTemplates` - Clear and re-seed (development only)

## API Reference

### Creating a Campaign from a Template

```typescript
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const createCampaign = useMutation(api.templates.createCampaignFromTemplate);

// Usage
const result = await createCampaign({
  templateId: template._id,
  dmId: currentUserId,
  campaignName: 'My Epic Campaign'
});

// Returns:
{
  campaignId: Id<'campaigns'>
  templateName: string
  characterTemplates: CharacterTemplate[]
  npcTemplates: NPCTemplate[]
  starterItems: ItemTemplate[]
  mapCount: number
  encounterCount: number
}
```

### Creating a Custom Template

```typescript
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const createTemplate = useMutation(api.templates.createTemplate);

await createTemplate({
  name: 'My Campaign',
  description: 'An epic adventure',
  genre: 'fantasy',
  difficulty: 'intermediate',
  recommendedPlayers: { min: 3, max: 5 },
  lore: 'Long ago...',
  characterTemplates: [...],
  npcTemplates: [...],
  mapTemplates: [...],
  encounterTemplates: [...],
  starterItems: [...],
  authorId: userId,
  isOfficial: false,
  isPublic: true,
  tags: ['adventure', 'magic']
});
```

## Future Enhancements

### Planned Features

1. **Advanced Template Creator**
   - Visual character builder with stat allocation
   - NPC creator with stat blocks
   - Map uploader with drag-and-drop marker placement
   - Encounter balancer using CR calculations
   - Item library browser

2. **Community Features**
   - Template ratings and reviews
   - Featured templates
   - Template collections/bundles
   - Author profiles
   - Template version history

3. **Import/Export**
   - Export templates as JSON
   - Import community templates from files
   - Share via template codes

4. **Template Variants**
   - Fork existing templates
   - Create variants of official templates
   - Difficulty scaling (auto-adjust for different levels)

## Troubleshooting

### Templates Not Showing

1. Ensure default templates are seeded: Run `seedDefaultTemplates` in Convex dashboard
2. Check filter settings: Set genre and difficulty to "All"
3. Verify database connection: Check Convex dev server status

### Campaign Creation Fails

1. **Error: "Template not found"**
   - Template may have been deleted
   - Refresh the page and try again

2. **Error: User ID placeholder**
   - Authentication not fully implemented
   - This is expected in the current development phase
   - Future: Will use actual authenticated user ID

3. **Maps or Encounters Missing**
   - Some templates may have minimal content
   - This is normal for community templates
   - Official templates include full content

## Contributing

To add new official templates:

1. Edit `convex/seedTemplates.ts`
2. Add a new template object to the `defaultTemplates` array
3. Include all required fields (characters, NPCs, maps, encounters, items)
4. Run `resetTemplates` mutation to update the database

## License

This feature is part of the D&D Shadowkeep Campaign Manager and follows the project's license.

---

**Version**: 1.0.0
**Last Updated**: 2025-11-09
**Maintainer**: Claude AI
