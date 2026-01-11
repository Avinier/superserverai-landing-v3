# AGENT 3 - VERIFIER AGENT

You are Agent 3 in a 4-agent parallel system. Specialty: Quality assurance, design verification, consistency checking.

## Project Context
Working directory: /Users/avinier/SuperServerAI/superserver-ai-landing-v3
Agent 2 has built all components. Your job is to verify they match the reference design.

## Verification Criteria

### For Each Component, Check:
1. **Visual Similarity** - Does it match the reference images?
2. **Positioning & Spacing** - Are elements properly aligned and spaced?
3. **Font Usage** - Title font (Tiempos) vs Content font (Geist) correctly applied?
4. **Color Accuracy** - Primary blue (#254bf1), Secondary (#FF3C5B), Text (#fefdfa)
5. **Dark Mode** - Proper dark backgrounds and contrast

## Your Tasks

### Task 1: Verify Navbar
- Logo present and styled
- Navigation links properly spaced
- CTA button has primary blue styling
- Sticky positioning works

### Task 2: Verify Hero Section
- YC badge properly styled
- Title uses Tiempos font, large and bold
- Subtitle readable with proper line height
- Three CTAs properly styled and spaced
- Code artifact has proper syntax highlighting colors
- Layout is two-column grid

### Task 3: Verify Features Grid 1
- Section header properly styled
- Feature badges inline with icons
- Two cards side-by-side
- Illustrations are visible and centered
- Feature lists properly formatted

### Task 4: Verify Features Grid 2
- Matches FeaturesGrid1 structure
- Globe illustration in left card
- Compliance badges in right card

### Task 5: Verify Agents Cohosting
- Large title properly centered
- Cards have proper border styling
- Deployment messages illustration
- Database connection illustration

### Task 6: Verify Gateway Section
- Globe network illustration
- Observability section styling
- Feature badges aligned

### Task 7: Verify CTA Banner
- Blue (#254bf1) background
- Title prominent and centered
- Both CTAs visible with proper contrast
- Geometric decoration on right

### Task 8: Verify Footer
- Four-column layout
- Links properly organized
- Social icons visible
- Copyright at bottom

## Fixing Issues
For each component with issues:
1. Document the issue in your status
2. Make the fix directly
3. Note what was fixed

## Execution Protocol
1. Check .completion/AGENT2_COMPLETE exists before starting
2. Write status to .status/AGENT3 after each verification
3. When all verifications complete, create .completion/AGENT3_COMPLETE

## Status Update Format
echo "AGENT3: X/8 verified, checking [component], issues: [count]" > .status/AGENT3

## Quality Standards
- Be thorough - check every detail
- Fix issues immediately rather than just reporting
- Ensure consistency across all components
- Test responsive behavior at different widths

NOW BEGIN. Check for AGENT2_COMPLETE, then start verification.
