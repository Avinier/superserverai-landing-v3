# SuperServer.AI Main App Style Guide

> **Purpose:** Comprehensive reference for aligning the landing page styling with the main app (superserverai-frontend-v1) design system.

> **Note:** The landing page is dark mode and the main app is light mode - this is intentional and should remain different. This guide focuses on all other styling elements that should be consistent.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Border Radius System](#4-border-radius-system)
5. [Shadows & Elevation](#5-shadows--elevation)
6. [Button Components](#6-button-components)
7. [Input Components](#7-input-components)
8. [Animation System](#8-animation-system)
9. [Component Patterns](#9-component-patterns)
10. [Spacing & Layout](#10-spacing--layout)
11. [Icon System](#11-icon-system)
12. [Implementation Checklist](#12-implementation-checklist)

---

## 1. Design Philosophy

### Main App Core Principles

The aesthetic is **modern, clean, and professional** with a touch of **playfulness** through pastel accents and subtle animations.

| Principle | Description |
|-----------|-------------|
| **Core** | Minimalist layouts with generous whitespace |
| **Typography** | Distinct pairing of Serif (`Tiempos`) for headings and Sans-Serif (`Geist`) for UI/Body text creates a sophisticated editorial feel |
| **Interactivity** | Heavy use of "micro-interactions" - spring animations, glows, and scaling on hover to make the UI feel alive |
| **Depth** | Subtle shadows and borders separate layers; glassmorphism is used sparingly but effectively |

### Landing Page vs Main App

| Aspect | Landing Page (Current) | Main App | Alignment Status |
|--------|------------------------|----------|------------------|
| Mode | Dark (`#0a0a0a`) | Light (`#fefdfa`) | Intentionally different |
| Typography | Tiempos + Geist | Tiempos + Geist | Aligned |
| Border Radius | `rounded-lg` buttons | `rounded-md` / `rounded-lg` buttons | Needs alignment |
| Animations | Glow + Scale | Spring + Glow + Lift | Partially aligned |
| Shadows | Border effects | `shadow-sm` / `shadow-md` | Needs alignment |

---

## 2. Color Palette

### Core Colors (Main App)

| Name | CSS Variable | Hex Value | RGB | Usage |
|------|--------------|-----------|-----|-------|
| **Primary** | `--primary` | `#254bf1` | `37 75 241` | Main actions, links, active states, branding |
| **Secondary** | `--secondary` | `#ff3153` | `255 49 83` | Accents, "Join Waitlist", alerts, notifications |
| **Background** | `--background` | `#fffefc` | `255 254 252` | Main page background (Warm off-white) |
| **Card** | `--card` | `#ffffff` | `255 255 255` | Component backgrounds |
| **Card Hover** | `--card-hover` | `#f9fafb` | `249 250 251` | Interactive states for list items/cards |

### Neutrals

| Name | CSS Variable | Hex Value | Usage |
|------|--------------|-----------|-------|
| **Dark Grey** | `--darkgrey` | `#171717` | High contrast text, strong borders |
| **Grey** | `--grey` | `#1f2937` | Primary text content |
| **Muted** | `--muted` | `#f3f4f6` | Backgrounds for secondary elements, hover states |
| **Muted FG** | `--muted-foreground` | `#737373` | Secondary text, placeholders, subtitles |
| **Border** | `--border` | `#e5e7eb` | Subtle dividers and card outlines |
| **Icon** | `--icon` | `#1e293b` | Icon color |

### Extended Pastel Palette (Glows & Accents)

Used for tags, charts, badges, and glow animations:

```
lilac: #E98AF0      portage: #8A8FF0    sulu: #8AF096
khaki: #ECF08A      tacao: #F0B28A      spray: #8AE4F0
rosewater: #F0B8C4  wisteria: #D9B8F0   pistachio: #B8F0C4
cornflower: #B8C4F0 turquoise: #B8F0E6  bubblegum: #F08AB8
sage: #C4F0B8       salmon: #F0A18A     powder: #8AB8F0
macaroon: #E6D9B8   bluebell: #8A96F0   honeydew: #D9F0B8
flamingo: #F08AB8   cerulean: #8AD9F0   sherbet: #F0D98A
purple: #8A2BE2
```

### Chart Colors

For data visualization:

| Token | Hex | Description |
|-------|-----|-------------|
| `chart-1` | `#ff8243` | Orange |
| `chart-2` | `#26a69a` | Teal |
| `chart-3` | `#2d4f73` | Dark Blue |
| `chart-4` | `#f6d365` | Yellow |
| `chart-5` | `#ffc857` | Gold |

### Glow Effect Colors

```css
--glow-yellow: #f6d365;
--glow-green: #22c55e;
--glow-red: #ef4444;
--glow-pink: #ffc0cb;
--glow-orange: #ffa500;
--glow-turquoise: #00ffff;
--glow-primary: #254bf1;
--glow-secondary: #ff3153;
--glow-lilac: #E98AF0;
--glow-portage: #8A8FF0;
--glow-sulu: #8AF096;
--glow-khaki: #ECF08A;
--glow-tacao: #F0B28A;
--glow-spray: #8AE4F0;
--glow-purple: #8A2BE2;
```

---

## 3. Typography

### Font Families

| Font | Class | Usage |
|------|-------|-------|
| **Tiempos** | `font-tiempos` | Headings (`h1`-`h6`), prominent labels, dialog titles |
| **Geist** | `font-geist` | Body text, UI elements, inputs, buttons |
| **Gotham** | `font-gotham` | Brand elements (selective) |
| **Montserrat** | `font-montserrat` | Alternative sans-serif |

### Font Declarations

```css
@font-face {
  font-family: 'Tiempos';
  src: url('/fonts/test-tiempos-text-regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Geist';
  src: url("/fonts/Geist-VariableFont_wght.ttf") format('truetype');
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
}
```

### Base Typography Rules

```css
body {
  font-family: 'Geist', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Tiempos', serif;
}

p {
  font-family: 'Geist', sans-serif;
}
```

### Font Sizes

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `xs` | 0.75rem | 1rem | Captions, badges |
| `sm` | 0.875rem | 1.25rem | Secondary text, buttons |
| `base` | 1rem | 1.5rem | Body text |
| `lg` | 1.125rem | 1.75rem | Emphasized text |
| `xl` | 1.25rem | 1.75rem | Subheadings |
| `2xl` | 1.5rem | 2rem | Section titles |
| `3xl` | 1.875rem | 2.25rem | Major headings |
| `4xl` | 2.25rem | 2.5rem | Hero titles |

---

## 4. Border Radius System

### Radius Tokens

| Token | Value | Class | Usage |
|-------|-------|-------|-------|
| `--radius-sm` | 0.375rem (6px) | `rounded-sm` | Small elements, badges |
| `--radius-md` | 0.5rem (8px) | `rounded-md` | Buttons, inputs |
| `--radius-lg` | 0.75rem (12px) | `rounded-lg` | Cards, dropdowns |
| `--radius-xl` | 1rem (16px) | `rounded-xl` | Large cards, modals |
| `--radius-2xl` | 1.5rem (24px) | `rounded-2xl` | Hero sections, chat bubbles |
| `--radius-full` | 9999px | `rounded-full` | Avatars, pills, badges |

### Component-Specific Radius

| Component | Main App | Landing Page (Current) | Recommendation |
|-----------|----------|------------------------|----------------|
| **Buttons** | `rounded-md` | `rounded-lg` | Change to `rounded-md` |
| **Inputs** | `rounded-lg` | N/A | Use `rounded-lg` |
| **Cards** | `rounded-xl` / `rounded-2xl` | `rounded-2xl` | Aligned |
| **Avatars** | `rounded-full` | `rounded-full` | Aligned |
| **Chat Bubbles** | `rounded-2xl` with `rounded-br-sm` (speech effect) | N/A | Use this pattern |
| **Badges/Pills** | `rounded-full` | `rounded-full` | Aligned |

---

## 5. Shadows & Elevation

### Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Navbars, small elements |
| `shadow` | `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)` | Cards, default elevation |
| `shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` | Hover states |
| `shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` | Dropdowns, modals |
| `shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` | Large modals |

### Hover Elevation Pattern

The main app uses a "lift on hover" pattern:

```tsx
className="hover:shadow-md hover:translate-y-[-2px] active:translate-y-[1px]"
```

### Landing Page Adaptation (Dark Mode)

For dark mode, use glow effects instead of traditional shadows:

```css
/* Primary glow for dark mode */
box-shadow: 0 0 15px 2px rgba(37, 75, 241, 0.3);

/* Hover state */
box-shadow: 0 0 25px 5px rgba(37, 75, 241, 0.4);
```

---

## 6. Button Components

### Button Variants (Main App)

| Variant | Classes | Description |
|---------|---------|-------------|
| **default/primary** | `bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md` | Main CTA |
| **secondary** | `bg-secondary text-secondary-foreground hover:bg-secondary/90` | Accent actions |
| **destructive** | `bg-destructive text-destructive-foreground hover:bg-destructive/90` | Dangerous actions |
| **outline** | `border-2 border-input bg-background text-foreground hover:bg-muted` | Secondary actions |
| **ghost** | `text-foreground hover:bg-muted` | Tertiary actions |
| **link** | `text-primary underline-offset-4 hover:underline` | Text links |

### Button Sizes

| Size | Classes |
|------|---------|
| `sm` | `h-9 px-3 text-sm` |
| `md` | `h-10 px-4 py-2` |
| `lg` | `h-11 px-8 text-lg` |
| `icon` | `h-10 w-10` |

### Button Glow Animations

```tsx
// Available glow options
glow: 'none' | 'primary' | 'primary-sm' | 'secondary' | 'secondary-sm' |
      'sulu' | 'sulu-sm' | 'red' | 'red-sm' | 'green'
```

### Button Implementation Example

```tsx
// Base button styles (CVA)
const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-2',
    'rounded-md font-medium font-geist',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'whitespace-nowrap'
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90',
          'shadow-sm hover:shadow-md'
        ),
        outline: cn(
          'border-2 border-input bg-background text-foreground',
          'hover:bg-muted hover:text-foreground',
          'shadow-sm'
        ),
        ghost: cn(
          'text-foreground',
          'hover:bg-muted'
        ),
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
```

### Landing Page Button Recommendations

```tsx
// Current landing page
<Button variant="primary" className="rounded-lg">...</Button>

// Recommended (align with main app)
<Button variant="primary" className="rounded-md">...</Button>
```

---

## 7. Input Components

### Input Variants

| Variant | Description | Classes |
|---------|-------------|---------|
| **default** | White background with subtle border | `bg-background border border-input rounded-lg` |
| **filled** | Muted background that changes on focus | `bg-muted border border-transparent rounded-lg` |
| **outline** | Transparent with thicker border | `bg-transparent border-2 border-input rounded-lg` |

### Input Sizes

| Size | Classes |
|------|---------|
| `sm` | `h-8 px-2.5 text-sm` |
| `md` | `h-10 px-3 text-base` |
| `lg` | `h-12 px-4 text-lg` |

### Input Focus States

```css
/* Default variant focus */
focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1

/* Outline variant focus */
focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20

/* Error state */
border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive
```

### Input Implementation Pattern

```tsx
<Input
  value={search}
  onChange={setSearch}
  leftIcon={<Search />}
  placeholder="Search..."
  variant="filled"
  fullWidth
/>
```

---

## 8. Animation System

### Core Animations

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| `spring-in` | 0.5s | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Entering elements |
| `spring-out` | 0.4s | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Exiting elements |
| `fade-in` | 0.3s | `ease-in-out` | Opacity transitions |
| `fade-in-up` | 0.5s | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Content appearance |
| `slide-in-*` | 0.4s | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Directional slides |

### Glow Animations

```tsx
// Large glow (2s duration)
animate-primary-glow
animate-secondary-glow
animate-sulu-glow
animate-lilac-glow
// ... etc

// Small glow (1s duration)
animate-primary-glow-sm
animate-secondary-glow-sm
animate-sulu-glow-sm
// ... etc
```

### Glow Keyframe Example

```css
@keyframes primary-glow {
  0%, 100% { box-shadow: 0 0 15px 2px var(--glow-primary); }
  50% { box-shadow: 0 0 25px 5px var(--glow-primary); }
}

@keyframes primary-glow-sm {
  0%, 100% { box-shadow: 0 0 7px 1px var(--glow-primary); }
  50% { box-shadow: 0 0 14px 3px var(--glow-primary); }
}
```

### Transition Timing Functions

| Name | Value | Usage |
|------|-------|-------|
| `bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful bounces |
| `spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Spring-like motion |
| `out-spring` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Reverse spring |
| `ease-out-back` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Overshoot ease |

### Transition Durations

```tsx
75ms   // Micro interactions
150ms  // Quick state changes
200ms  // Standard transitions
300ms  // Emphasis transitions
400ms  // Complex animations
500ms  // Large element animations
750ms  // Full-screen transitions
```

### Hover Patterns

```tsx
// Standard button hover
className="hover:scale-105 active:translate-y-[1px]"

// Card lift
className="hover:shadow-lg hover:translate-y-[-2px]"

// Subtle scale
className="hover:scale-[1.02]"
```

---

## 9. Component Patterns

### Card Component

```tsx
// Main app card pattern
<div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
  <h3 className="font-tiempos text-xl">Title</h3>
  <p className="font-geist text-muted-foreground">Content</p>
</div>
```

### Badge/Pill Component

```tsx
// Status badges
<span className="px-2 py-1 rounded-full bg-sulu/20 text-sulu-foreground text-sm">
  Active
</span>

// Technology badges
<span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-spray/20 to-spray/5 border border-spray/30 text-sm">
  React
</span>
```

### Avatar Component

```tsx
// User avatar
<div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-gray-400 to-gray-100 flex items-center justify-center shadow-sm">
  <span className="text-gray-700 font-semibold font-tiempos">
    {username.charAt(0).toUpperCase()}
  </span>
</div>
```

### Status Dot

```tsx
// Status indicator
<div className={cn(
  "w-2 h-2 rounded-full",
  status === 'running' && "bg-sulu animate-pulse",
  status === 'error' && "bg-destructive",
  status === 'idle' && "bg-muted-foreground"
)} />
```

### Chat Bubble (User)

```tsx
// Speech-bubble style
<div className="bg-white rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
  {message}
</div>
```

### Modal/Dialog

```tsx
// Modal backdrop
<div className="bg-black/50 backdrop-blur-sm animate-fade-in" />

// Modal content
<div className="bg-background rounded-xl shadow-xl animate-spring-in">
  <h2 className="font-tiempos">Title</h2>
  <p className="font-geist">Content</p>
</div>
```

### Navbar Pattern

```tsx
<nav className="min-h-[53px] flex items-center justify-between px-3 bg-white border-b border-slate-200">
  {/* Logo */}
  <div className="flex items-center">
    <Link to="/" className="font-tiempos font-semibold">
      SuperServer.AI
    </Link>
  </div>

  {/* Actions */}
  <div className="flex items-center gap-3">
    <Button variant="outline">Login</Button>
    <Button variant="primary">Sign up</Button>
  </div>
</nav>
```

### Icon Button

```tsx
<button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors duration-200">
  <Bell className="w-[18px] h-[18px] text-icon" />
</button>
```

### Tooltip

```tsx
<Tooltip content="Helpful information" side="top">
  <button>Hover me</button>
</Tooltip>
```

---

## 10. Spacing & Layout

### Breakpoints

| Token | Value | Description |
|-------|-------|-------------|
| `xs` | 375px | Mobile small |
| `sm` | 640px | Mobile large |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop large |
| `2xl` | 1536px | Desktop XL |

### Container

```tsx
// Responsive container
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {children}
</div>
```

### Common Spacing Patterns

| Context | Desktop | Mobile |
|---------|---------|--------|
| Section padding | `py-20 md:py-28` | `py-12` |
| Card padding | `p-6 md:p-8` | `p-4` |
| Gap between items | `gap-6` | `gap-4` |
| Button gap | `gap-3` | `gap-2` |

---

## 11. Icon System

### Icon Library

- **Primary:** `lucide-react` (outlined, 1.5px/2px stroke)
- **Brand icons:** `@fortawesome` (GitHub, X/Twitter)

### Icon Sizes

| Context | Size | Class |
|---------|------|-------|
| Button icon | 16px | `w-4 h-4` |
| Inline icon | 18px | `w-[18px] h-[18px]` |
| Card icon | 20px | `w-5 h-5` |
| Feature icon | 24px | `w-6 h-6` |
| Hero icon | 32px | `w-8 h-8` |

### Icon Styling

```tsx
// Default icon
<Icon className="w-5 h-5 text-icon" />

// With hover
<Icon className="w-5 h-5 text-icon group-hover:text-primary transition-colors" />

// Muted icon
<Icon className="w-5 h-5 text-muted-foreground" />
```

---

## 12. Implementation Checklist

### High Priority Changes

- [ ] **Button border-radius:** Change from `rounded-lg` to `rounded-md`
- [ ] **Button font:** Add `font-geist` to button base styles
- [ ] **Button hover:** Add `hover:shadow-md hover:translate-y-[-2px]` pattern
- [ ] **Add outline button variant:** Border-only, no background fill
- [ ] **Navbar font:** Ensure logo uses `font-tiempos`

### Medium Priority Changes

- [ ] **Add subtle grid background:** Light grid pattern for sections
- [ ] **Logo text branding:** Add "SuperServer.AI" text next to icon in navbar
- [ ] **Card shadows:** Use `shadow-sm` base, `shadow-md` on hover
- [ ] **Input components:** Match main app's `rounded-lg` with focus ring

### Low Priority (Optional)

- [ ] **Floating social links:** Match app's floating element pattern
- [ ] **Add pastel accent colors:** For badges and highlights
- [ ] **Implement glow button variant:** `animate-*-glow` on special CTAs

### CSS Variables to Add

```css
@theme {
  /* Radius tokens */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

  /* Additional semantic colors */
  --color-muted: #f3f4f6;
  --color-muted-foreground: #737373;
  --color-card: #ffffff;
  --color-card-hover: #f9fafb;
  --color-destructive: #e63946;
  --color-icon: #1e293b;

  /* Glow effects (for dark mode) */
  --glow-primary: rgba(37, 75, 241, 0.4);
  --glow-secondary: rgba(255, 49, 83, 0.4);
}
```

---

## Quick Reference

### Import Pattern (Main App)

```tsx
import { Button, Input, Tooltip, Dialog } from '~/components/primitives';
import { cn } from '~/lib/utils';
```

### Class Merge Utility

```tsx
import { cn } from '~/lib/utils';

// Usage
<div className={cn(
  'base-class',
  condition && 'conditional-class',
  props.className
)} />
```

### Component with Variants

```tsx
const Component = ({ variant = 'default', size = 'md', className }) => (
  <div className={cn(
    componentVariants({ variant, size }),
    className
  )}>
    {children}
  </div>
);
```

---

## Related Documentation

- **Main App Style Guide:** `superserverai-frontend-v1/app/docs/style_guide.md`
- **Base UI Quick Reference:** `superserverai-frontend-v1/app/docs/base_ui_quick_reference.md`
- **Design System Summary:** `superserverai-frontend-v1/DESIGN_SYSTEM_REFACTOR_SUMMARY.md`
- **Tailwind Config:** `superserverai-frontend-v1/tailwind.config.ts`
- **CSS Variables:** `superserverai-frontend-v1/app/tailwind.css`

---

**Last Updated:** January 2025
**Source:** superserverai-frontend-v1 (sister repo)
