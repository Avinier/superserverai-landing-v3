# SuperServer AI Landing Page - Claude Code Instructions

## Project Overview

This is a React + Vite + Tailwind CSS 4 landing page for SuperServer AI, an AI sandbox infrastructure platform. The project uses Bun as the runtime and package manager.

## Technology Stack

- React 19 with TypeScript
- Vite 6 (build tool)
- Tailwind CSS 4 (using @theme syntax)
- Bun (runtime/package manager)

## Color Palette

Use these Tailwind color classes. All are defined via CSS variables in `src/index.css`:

| Class | Hex | Usage |
|-------|-----|-------|
| `bg-primary` / `text-primary` | `#254bf1` | Primary brand color - buttons, links, accents |
| `bg-secondary` / `text-secondary` | `#FF3C5B` | Secondary accent - highlights, alerts, CTAs |
| `bg-background` | `#0a0a0a` | Main page background (dark) |
| `bg-surface` | `#141414` | Card/section backgrounds |
| `bg-surface-elevated` | `#1a1a1a` | Hover states, modals, elevated elements |
| `text-text` | `#fefdfa` | Primary text color (light) |
| `text-text-muted` | `#a0a0a0` | Secondary/muted text |
| `bg-grey` / `text-grey` | `#34322d` | Subtle elements, dividers |
| `border-border` | `#2a2a2a` | Borders, outlines, dividers |

## Typography

Two custom fonts are configured:

1. **Tiempos** (`font-title`) - Use for headlines and display text
   - Source: `/fonts/test-tiempos-text-regular.woff2`
   - Usage: `className="font-title"`

2. **Geist** (`font-content`) - Use for body text and UI elements
   - Source: `/fonts/Geist-VariableFont_wght.ttf`
   - Usage: Default body font (no class needed)

3. **Montserrat** (`font-mono`) - Backup/alternative font
   - Source: `/fonts/Montserrat-VariableFont_wght.ttf`
   - Usage: `className="font-mono"`

## Component Structure

Components should be placed in `src/components/` and follow these patterns:

- Component naming: PascalCase
- File naming: PascalCase.tsx

Example structure:
```
src/
  components/
    Navbar.tsx
    Hero.tsx
    FeaturesGrid1.tsx
    FeaturesGrid2.tsx
    AgentsCohosting.tsx
    GatewaySection.tsx
    CTABanner.tsx
    Footer.tsx
```

## Styling Guidelines

1. **Dark mode is default** - No toggle needed. Background is always dark.
2. **Use Tailwind utilities** - Prefer Tailwind classes over custom CSS.
3. **Consistent spacing** - Use Tailwind spacing scale (p-4, gap-6, etc.)
4. **Animations** - Use Tailwind built-in transitions: `className="transition-colors hover:bg-primary/90"`
5. **Container patterns**: `className="mx-auto max-w-7xl px-6"`

## Commands

```bash
bun dev      # Start development server
bun build    # Build for production
bun preview  # Preview production build
bun lint     # Run ESLint
```

## File Locations

- Entry point: `src/main.tsx`
- Main component: `src/App.tsx`
- Global styles: `src/index.css`
- Static assets: `public/`
- Fonts: `public/fonts/`

## Best Practices

1. Keep components small and focused
2. Use semantic HTML elements
3. Ensure accessibility (ARIA labels, keyboard navigation)
4. Optimize images and assets
5. Follow React 19 best practices
