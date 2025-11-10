# Campaign Templates Setup Guide

## Prerequisites

- Node.js 18+ installed
- Convex account and project set up
- Project dependencies installed (`npm install`)

## Initial Setup

### 1. Start Convex Development Server

```bash
npx convex dev
```

This will:
- Generate TypeScript types in `convex/_generated/`
- Push schema changes to Convex backend
- Start watching for schema/function changes

### 2. Seed Default Templates

Once the Convex dev server is running:

**Option A: Via Convex Dashboard**
1. Open the Convex dashboard (URL shown in terminal)
2. Navigate to **Functions**
3. Find `seedDefaultTemplates`
4. Click **Run** on the `seedDefaultTemplates` mutation
5. Verify success message shows 6 templates created

**Option B: Via Code (Future)**
```typescript
// In your app initialization or admin panel
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const seedTemplates = useMutation(api.seedDefaultTemplates.seedDefaultTemplates);
await seedTemplates({});
```

### 3. Start Next.js Development Server

In a separate terminal:

```bash
npm run dev
```

Navigate to: `http://localhost:3000/dm/templates`

## Verification

### Check Templates Are Loaded

1. Navigate to `/dm/templates`
2. You should see 6 official templates:
   - Lost Mines of Phandelver (Fantasy - Beginner)
   - Curse of Strahd (Horror - Intermediate)
   - Cyberpunk: Night City Chronicles (Cyberpunk - Advanced)
   - Steampunk Skies: The Brass Horizon (Steampunk - Intermediate)
   - The Last Stand: Zombie Apocalypse (Post-Apocalyptic - Intermediate)
   - Starbound Odyssey (Sci-Fi - Advanced)

### Test Template Filters

1. Filter by **Genre**: Select "Fantasy" - should show only Lost Mines
2. Filter by **Difficulty**: Select "Beginner" - should show only Lost Mines
3. Toggle **Official templates only** - all 6 should remain visible

### Test Template Detail View

1. Click on "Lost Mines of Phandelver"
2. Verify modal shows:
   - Complete lore section
   - 4 character templates (Thalia, Eldric, Bramble, Sister Mira)
   - 4 NPCs (Sildar, Gundren, Toblen, Sister Garaele)
   - 2 maps (Phandalin Town, Cragmaw Hideout)
   - 2 encounters (Goblin Ambush, Redbrand Ruffians)
   - Starter items
   - Tags

### Test One-Click Campaign Creation

⚠️ **Note**: Full campaign creation requires authentication implementation.

Current behavior:
1. Click "Create Campaign" in template detail
2. Enter campaign name
3. Click "Create Campaign" button
4. **Expected**: Error about placeholder user ID (this is normal)
5. **Future**: Will create complete campaign with all template data

## Troubleshooting

### Build Errors: "Can't resolve '@/convex/_generated/api'"

**Cause**: Convex hasn't generated TypeScript types yet

**Solution**:
1. Run `npx convex dev` to generate types
2. Wait for "Convex functions ready" message
3. Rebuild: `npm run build`

### Templates Not Showing

**Cause**: Database not seeded

**Solution**:
1. Run `seedDefaultTemplates` mutation in Convex dashboard
2. Refresh the templates page

### "Template not found" Error

**Cause**: Template may have been deleted

**Solution**:
1. Run `resetTemplates` mutation to restore defaults
2. This clears and re-seeds all templates

## Development Workflow

### Adding New Official Templates

1. Edit `convex/seedTemplates.ts`
2. Add new template object to `defaultTemplates` array
3. Include all required fields:
   ```typescript
   {
     name: string
     description: string
     genre: Genre
     difficulty: Difficulty
     recommendedPlayers: { min: number, max: number }
     lore: string
     characterTemplates: [...] // At least 1
     npcTemplates: [...] // At least 1
     mapTemplates: [...] // At least 1
     encounterTemplates: [...] // At least 1
     starterItems: [...] // At least 1
     isOfficial: true
     isPublic: true
     tags: [...]
   }
   ```
4. Run `resetTemplates` mutation in Convex dashboard
5. Verify new template appears in gallery

### Testing Template Creation

1. Navigate to `/dm/templates/create`
2. Fill in template form:
   - Name: "Test Campaign"
   - Description: "A test campaign"
   - Genre: Fantasy
   - Difficulty: Beginner
   - Player count: 3-5
   - Lore: "Test lore content"
   - Tags: "test, development"
3. Click "Create Template"
4. Verify success message
5. Return to gallery - template should appear (if public)

### Database Management

**Clear All Templates** (Development only):
```typescript
// In Convex dashboard: clearAllTemplates mutation
```

**Reset to Defaults**:
```typescript
// In Convex dashboard: resetTemplates mutation
```

## Production Deployment

### Environment Variables

Ensure these are set in your deployment environment:
- `CONVEX_DEPLOYMENT` - Your Convex deployment URL
- `NEXT_PUBLIC_CONVEX_URL` - Public Convex URL for client

### Pre-Deployment Checklist

- [ ] Convex schema deployed to production
- [ ] Default templates seeded in production database
- [ ] Authentication implemented for campaign creation
- [ ] User ID properly passed to mutations
- [ ] Error handling tested
- [ ] Template images uploaded (if using)

### Seeding Production

⚠️ **Important**: Only seed once in production

1. Deploy Convex functions to production
2. Run `seedDefaultTemplates` mutation once
3. Verify templates appear in production app
4. Do NOT run `clearAllTemplates` in production

## Known Limitations

### Current Version (1.0.0)

1. **Authentication**: User ID uses placeholder
   - Campaign creation will fail until auth is implemented
   - Template creation requires manual user ID input

2. **Template Creator**: Basic version only
   - Cannot add characters, NPCs, maps, encounters in UI
   - Must edit seed file for full templates

3. **Community Features**: Not yet implemented
   - No ratings/reviews
   - No template forking
   - No template marketplace search

### Planned Improvements

- Visual character builder
- Map uploader with marker placement
- Encounter balance calculator
- Community ratings and reviews
- Template import/export

## Support

For issues or questions:
1. Check the main documentation: `docs/CAMPAIGN_TEMPLATES.md`
2. Review troubleshooting section above
3. Check Convex dashboard for error logs
4. Verify Convex dev server is running

---

**Last Updated**: 2025-11-09
