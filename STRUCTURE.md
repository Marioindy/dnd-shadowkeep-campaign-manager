# Project Structure Documentation

## Overview

This document explains the modular architecture of the D&D Shadowkeep Campaign Manager and provides guidelines for maintaining consistency as the project grows.

## Core Principles

### 1. Modularity
- Each page has its own `components/` folder
- Components are colocated with the pages that use them
- Shared components live in `src/components/`

### 2. Separation of Concerns
- Route groups organize related pages
- Business logic stays in components or utilities
- Data fetching happens via Convex queries/mutations

### 3. Type Safety
- All components use TypeScript
- Global types in `src/types/index.ts`
- Props interfaces defined in component files

## Directory Breakdown

### `/src/app`
Next.js App Router pages. Uses route groups for logical organization:

#### `(auth)` - Authentication
Contains login and registration pages. These pages are publicly accessible.

#### `(dashboard)` - Player Dashboard
Main player-facing interface with:
- **dashboard**: Home dashboard with quick actions and overview
- **characters**: Character management and sheets
- **inventory**: Item and equipment management
- **maps**: Map viewer for players
- **campaign**: Campaign info and session history
- **session-tools**: Dice roller and initiative tracker

#### `(dm)` - DM Panel
Dungeon Master control panel with:
- **overview**: Campaign overview and quick stats
- **party-management**: Player and character management
- **map-control**: Map upload and fog of war control
- **documents**: Document library management

### `/src/components`
Reusable components shared across multiple pages:

#### `/ui`
Pure UI components with no business logic:
- `Button.tsx` - Styled button with variants
- `Card.tsx` - Card layout components
- `Input.tsx` - Form input with label and error handling

#### `/shared`
Feature components used in multiple places:
- `LoadingSpinner.tsx` - Loading indicator
- `ErrorMessage.tsx` - Error display component

#### `/layout`
Layout components for page structure (to be added as needed)

### `/src/lib`
Utility functions and helpers:
- `utils.ts` - General utilities (dice rolling, modifiers, formatting)
- `convex.ts` - Convex client configuration

### `/src/types`
TypeScript type definitions:
- `index.ts` - All global types and interfaces

### `/src/styles`
Global CSS:
- `globals.css` - Tailwind imports and custom CSS variables

### `/convex`
Convex backend:
- `schema.ts` - Database schema definitions
- Future: Query and mutation functions

## Component Patterns

### Page Component
```typescript
// src/app/(dashboard)/example/page.tsx
import Header from './components/Header';
import Content from './components/Content';

export default function ExamplePage() {
  return (
    <div>
      <Header />
      <main>
        <Content />
      </main>
    </div>
  );
}
```

### Page-Specific Component
```typescript
// src/app/(dashboard)/example/components/Content.tsx
'use client';

export default function Content() {
  return (
    <div className="...">
      {/* Component logic */}
    </div>
  );
}
```

### Shared UI Component
```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export default function Button({ variant = 'primary', children }: ButtonProps) {
  return <button className={...}>{children}</button>;
}
```

## Naming Conventions

### Files
- **Pages**: `page.tsx` (Next.js convention)
- **Components**: PascalCase (e.g., `CharacterCard.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Types**: `index.ts` in types folder

### Components
- **Client components**: Add `'use client'` directive
- **Server components**: Default (no directive needed)

### CSS Classes
- Use Tailwind utility classes
- Custom classes in globals.css with CSS variables

## State Management

### Local State
- Use React hooks (`useState`, `useReducer`)
- Keep state close to where it's used

### Server State
- Use Convex queries and mutations
- Automatic real-time sync

### Global State
- Minimal global state
- Use React Context for theme, auth, etc.

## Data Flow

```
Convex Backend
     ↓
  useQuery (Convex React)
     ↓
  Page Component
     ↓
  Page-Specific Components
     ↓
  Shared UI Components
```

## Adding New Pages

### Step-by-Step Guide

1. **Determine Route Group**
   - Auth? → `(auth)`
   - Player? → `(dashboard)`
   - DM? → `(dm)`

2. **Create Page Structure**
   ```bash
   mkdir -p src/app/(group)/page-name/components
   touch src/app/(group)/page-name/page.tsx
   ```

3. **Create Page File**
   ```typescript
   export default function PageName() {
     return <div>...</div>;
   }
   ```

4. **Add Components**
   Create components in the `components/` folder

5. **Add Types**
   Add new types to `src/types/index.ts` if needed

6. **Update Navigation**
   Add links in header components

## Best Practices

### Component Size
- Keep components focused and small
- Break large components into smaller ones
- Extract reusable logic into utilities

### File Organization
- One component per file
- Related components in same folder
- Shared components in `src/components/`

### Type Safety
- Define prop interfaces
- Use TypeScript strict mode
- Avoid `any` types

### Styling
- Use Tailwind utility classes
- Define color schemes in CSS variables
- Keep consistent spacing and sizing

### Performance
- Use `'use client'` only when needed
- Minimize client-side JavaScript
- Optimize images and assets

## Testing Strategy (Future)

### Unit Tests
- Test utility functions
- Test pure components

### Integration Tests
- Test page flows
- Test Convex queries/mutations

### E2E Tests
- Test critical user journeys
- Test real-time sync

## Deployment

### Environment Variables
Required for production:
- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_APP_URL`

### Build Process
```bash
npm run build
```

### Hosting Options
- Cloudflare Pages
- AWS Amplify
- Vercel

## Maintenance

### Regular Tasks
- Keep dependencies updated
- Monitor Convex usage
- Review and refactor components
- Update documentation

### Code Review Checklist
- [ ] TypeScript types defined
- [ ] Components properly organized
- [ ] No console errors
- [ ] Responsive design tested
- [ ] Convex queries optimized

## Questions?

Refer to the main README.md or create an issue in the repository.
