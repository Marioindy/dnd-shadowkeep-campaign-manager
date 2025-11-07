# D&D Shadowkeep Campaign Manager

A real-time, collaborative tabletop RPG management platform for Dungeons & Dragons and Shadowkeep campaigns. Built with Next.js 14+, React 18+, TypeScript, and Convex for seamless character sheets, interactive maps, and persistent campaign state.

## Features

### For Players
- **Character Management**: Create and manage detailed character sheets with stats, abilities, and progression tracking
- **Inventory System**: Real-time inventory tracking with item properties, quantities, and equipment slots
- **Interactive Maps**: View campaign maps with markers and fog of war controlled by the DM
- **Session Tools**: Built-in dice roller and initiative tracker
- **Campaign Notes**: Access shared campaign lore, quest objectives, and session history

### For Dungeon Masters
- **Party Overview**: Monitor all player characters, inventories, and stats at a glance
- **Map Control**: Upload PNG maps, place markers, and manage fog of war in real-time
- **Document Library**: Upload and organize campaign documents, NPCs, and encounter notes
- **Session Management**: Track active sessions with real-time updates to all players
- **Player Management**: Create and manage player accounts and permissions

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI**: React 18+ with functional components and hooks
- **Styling**: Tailwind CSS
- **Backend**: Convex (serverless with real-time sync)
- **Animation**: GSAP (planned for map interactions)
- **Hosting**: Cloudflare Pages or AWS Amplify

## Project Structure

```
dnd-shadowkeep-campaign-manager/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (auth)/                   # Authentication route group
│   │   │   └── login/
│   │   │       ├── components/       # Login-specific components
│   │   │       │   └── LoginForm.tsx
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/              # Player dashboard route group
│   │   │   ├── dashboard/
│   │   │   │   ├── components/       # Dashboard-specific components
│   │   │   │   │   ├── DashboardHeader.tsx
│   │   │   │   │   ├── QuickActions.tsx
│   │   │   │   │   ├── RecentActivity.tsx
│   │   │   │   │   └── CharacterOverview.tsx
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── characters/
│   │   │   │   ├── components/       # Character page components
│   │   │   │   │   ├── CharacterList.tsx
│   │   │   │   │   ├── CharacterCard.tsx
│   │   │   │   │   └── StatBlock.tsx
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── inventory/
│   │   │   │   ├── components/       # Inventory page components
│   │   │   │   │   ├── InventoryGrid.tsx
│   │   │   │   │   ├── InventoryItem.tsx
│   │   │   │   │   └── EquipmentSlots.tsx
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── maps/
│   │   │   │   ├── components/       # Map page components
│   │   │   │   │   ├── MapViewer.tsx
│   │   │   │   │   ├── MapMarker.tsx
│   │   │   │   │   └── MapList.tsx
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── campaign/
│   │   │   │   ├── components/       # Campaign page components
│   │   │   │   │   ├── CampaignInfo.tsx
│   │   │   │   │   ├── SessionLog.tsx
│   │   │   │   │   └── CampaignNotes.tsx
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── session-tools/
│   │   │       ├── components/       # Session tools components
│   │   │       │   ├── DiceRoller.tsx
│   │   │       │   └── InitiativeTracker.tsx
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dm)/                     # DM panel route group
│   │   │   └── dm/
│   │   │       ├── components/       # Shared DM components
│   │   │       │   └── DMHeader.tsx
│   │   │       │
│   │   │       ├── overview/
│   │   │       │   ├── components/
│   │   │       │   │   ├── PartyOverview.tsx
│   │   │       │   │   ├── QuickStats.tsx
│   │   │       │   │   └── ActiveSession.tsx
│   │   │       │   └── page.tsx
│   │   │       │
│   │   │       ├── party-management/
│   │   │       │   ├── components/
│   │   │       │   │   ├── PlayerList.tsx
│   │   │       │   │   └── CharacterDetails.tsx
│   │   │       │   └── page.tsx
│   │   │       │
│   │   │       ├── map-control/
│   │   │       │   ├── components/
│   │   │       │   │   ├── DMMapViewer.tsx
│   │   │       │   │   ├── MapUploader.tsx
│   │   │       │   │   └── FogOfWarControl.tsx
│   │   │       │   └── page.tsx
│   │   │       │
│   │   │       └── documents/
│   │   │           ├── components/
│   │   │           │   ├── DocumentList.tsx
│   │   │           │   └── DocumentUploader.tsx
│   │   │           └── page.tsx
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   │
│   ├── components/                   # Shared components
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   │
│   │   ├── shared/                   # Shared feature components
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorMessage.tsx
│   │   │
│   │   └── layout/                   # Layout components
│   │
│   ├── lib/                          # Utility functions
│   │   ├── utils.ts                  # General utilities
│   │   └── convex.ts                 # Convex client setup
│   │
│   ├── types/                        # TypeScript type definitions
│   │   └── index.ts
│   │
│   └── styles/                       # Global styles
│       └── globals.css
│
├── convex/                           # Convex backend
│   ├── schema.ts                     # Database schema
│   └── tsconfig.json
│
├── public/                           # Static assets
│
├── .env.example                      # Environment variables template
├── next.config.js                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # Tailwind CSS configuration
└── package.json                      # Dependencies
```

## Modular Architecture

This project follows a **highly modular approach** with **compartmentalized components**:

### Route Groups
- `(auth)` - Authentication pages
- `(dashboard)` - Player-facing pages
- `(dm)` - DM-only pages

### Component Organization
Each page has its own `components/` folder containing page-specific components. This ensures:
- **Clear separation of concerns**
- **Easy maintenance** - find all related components in one place
- **Reusability** - shared components live in `src/components/`
- **Scalability** - add new pages without affecting existing ones

### Example: Adding a New Page
```bash
# Create new page with compartmentalized components
src/app/(dashboard)/new-feature/
├── components/
│   ├── FeatureComponent1.tsx
│   ├── FeatureComponent2.tsx
│   └── FeatureComponent3.tsx
└── page.tsx
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/dnd-shadowkeep-campaign-manager.git
cd dnd-shadowkeep-campaign-manager
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Initialize Convex (first time only)
```bash
npx convex dev
```
Follow the prompts to create a Convex account and project.

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Development Workflow

### Adding New Features
1. Create a new page folder in the appropriate route group
2. Add a `page.tsx` file
3. Create a `components/` folder for page-specific components
4. Add shared components to `src/components/ui/` or `src/components/shared/`

### Database Schema
All database schemas are defined in `convex/schema.ts`. To add new tables:
1. Edit `convex/schema.ts`
2. The schema will automatically sync with Convex

### Type Definitions
Global TypeScript types are in `src/types/index.ts`. Update this file when adding new data structures.

## Authentication

Currently implements a **closed-door system**:
- No public registration
- DM/Admin manually creates user accounts
- Session-based authentication (to be implemented with Convex auth)

## Roadmap

### Phase 1 (Current)
- ✅ Project structure setup
- ✅ Core page layouts
- ✅ Component architecture
- ⬜ Convex integration
- ⬜ Authentication system
- ⬜ Real-time data sync

### Phase 2
- ⬜ GSAP animations for maps
- ⬜ Drag-and-drop inventory
- ⬜ Advanced dice rolling with physics
- ⬜ Audio/ambient sound integration

### Phase 3
- ⬜ Mobile app version
- ⬜ Offline mode
- ⬜ Campaign templates
- ⬜ Community features

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

[MIT License](LICENSE)

## Acknowledgments

Built for adventurers who want their campaigns to last beyond a single session.
