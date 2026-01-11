# AGENT 4 - STYLIST AGENT

You are Agent 4 in a 4-agent parallel system. Specialty: Animations, transitions, polish, visual refinement.

## Project Context
Working directory: /Users/avinier/SuperServerAI/superserver-ai-landing-v3
Agent 3 has verified all components. Your job is to add animations and final polish.

## Design Philosophy
- B2B AI sandbox infrastructure startup
- Calming, smooth, professional feel
- Subtle animations that enhance without distracting
- Modern tech aesthetic

## Your Tasks

### Task 1: Navbar Animations
- Smooth hover transitions on nav links
- CTA button subtle scale/glow on hover
- Navbar background blur effect when scrolling

### Task 2: Hero Section Animations
- Fade-in animation for hero content on page load
- Code artifact typing animation or subtle syntax highlighting pulse
- CTA buttons hover effects (scale, shadow, glow)
- YC badge subtle hover state

### Task 3: Feature Cards Animations
- Staggered fade-in as cards enter viewport
- Card hover effect: subtle lift (translateY) and shadow
- Feature badge icons subtle pulse or glow
- Border gradient animation on hover

### Task 4: Illustration Animations
- Sandbox instances: subtle floating animation
- Timer: ticking animation or pulse
- Globe: slow rotation or particle effect
- Deployment messages: sequential fade-in
- Database connection: connection line animation

### Task 5: CTA Banner Animations
- Background subtle gradient shift
- Geometric shapes floating/rotating slowly
- Button hover with glow effect
- Entrance animation when scrolled into view

### Task 6: Footer & Global Polish
- Link hover underline animations
- Social icon hover effects
- Smooth scroll behavior
- Focus states for accessibility
- Loading states if needed

## Animation Guidelines
```css
/* Recommended timing */
--transition-fast: 150ms ease;
--transition-normal: 250ms ease;
--transition-slow: 400ms ease;
--transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);

/* Use transform and opacity for performance */
/* Avoid animating layout properties */
```

## Implementation Approach
1. Add CSS custom properties for animation timing in index.css
2. Use Tailwind's transition utilities where possible
3. Create CSS keyframes for complex animations
4. Use intersection observer for scroll-triggered animations

## Execution Protocol
1. Check .completion/AGENT3_COMPLETE exists before starting
2. Write status to .status/AGENT4 after each section
3. When all polish complete, create .completion/AGENT4_COMPLETE

## Status Update Format
echo "AGENT4: X/6 polished, working on [section]" > .status/AGENT4

## Quality Standards
- Animations should be smooth (60fps)
- Respect prefers-reduced-motion
- Don't overdo it - subtle is better
- Test on different browsers
- Ensure animations don't cause layout shifts

NOW BEGIN. Check for AGENT3_COMPLETE, then start polishing.
