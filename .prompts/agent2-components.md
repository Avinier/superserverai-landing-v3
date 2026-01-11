# AGENT 2 - COMPONENT BUILDER

You are Agent 2 in a 4-agent parallel system. Specialty: Component development, UI structure, layout.

## Project Context
Working directory: /Users/avinier/SuperServerAI/superserver-ai-landing-v3
This is a React + Vite + Tailwind 4 project. Agent 1 has completed setup.

## Design Reference
You have access to 6 reference images showing the Blaxel.ai landing page. Your job is to replicate this design with our custom styling:

### Color Mapping (Blaxel -> SuperServer)
- Blaxel Orange (#FF6B35) -> Our Blue (#254bf1)
- Accent colors -> Our Secondary (#FF3C5B)
- Background: Dark mode similar to Blaxel
- Text: Off-white (#fefdfa)

### Font Mapping
- Titles: Use font-title (Tiempos)
- Content/Body: Use font-content (Geist)

## Your Tasks (Create Each Component)

### Task 1: Navbar Component
Create src/components/Navbar.tsx:
- Logo on left
- Navigation links: Platform, Docs, Blog, Pricing
- Contact link and "Get started" CTA button on right
- Sticky positioning with dark background
- "Get started" button should be primary blue with subtle animation

### Task 2: Hero Section
Create src/components/Hero.tsx:
- "Backed by Y Combinator" badge at top
- Large title: "The perpetual sandbox platform" (use Tiempos font)
- Subtitle paragraph explaining the product
- Three CTAs: "Try SuperServer" (primary), "Get a demo" (secondary), "npm install @superserver/core" (code style)
- Code artifact on the right side showing TypeScript/Python tabs and code example
- Proper grid layout with text on left, code on right

### Task 3: Features Grid 1 - Sandboxes Section
Create src/components/FeaturesGrid1.tsx:
Section title: "Sandboxes for your AI agents"
Subtitle: "Equip your codegen agents with secure & flexible VMs..."
Feature badges: Sub-25ms latency, Run AI-generated code, Stateful, Air-tight isolation

Two cards side by side:
1. Left Card - "Compute resources, made for both humans and agents"
   - Illustration showing sandbox instances (8F7D6C5E, 4B3A2D1C style)
   - Features: Ultra-low latency, Scale down to zero, Accessible via API or MCP

2. Right Card - "Background tasks for reliable AI products"
   - Timer/countdown illustration
   - Features: Cron-based scheduling, Real-time monitoring, Automatic retries

### Task 4: Features Grid 2 - Gateway & Compliance
Create src/components/FeaturesGrid2.tsx:
Two cards:
1. Left Card - "Highly customizable gateway for your apps"
   - Network/connection illustration
   - Features: Custom processor, Model routing and fallback, Private connect

2. Right Card - "Enterprise-grade security & compliance"
   - SOC 2 and HIPAA badge illustrations
   - Features: SOC 2 Type II compliant, HIPAA compliant, Region support

### Task 5: Agents Cohosting Section
Create src/components/AgentsCohosting.tsx:
- Large section title: "SuperServer Agents Cohosting"
- Subtitle about co-locating agent APIs, MCP servers, batch tasks

Two cards:
1. Left - "Iterate. Evaluate. Deploy."
   - Deployment success messages illustration
   - Features: Framework-agnostic, Python or TypeScript, GitHub sync, No config

2. Right - "MCP servers that just work"
   - Database connection illustration
   - Features: Pre-built servers, Custom servers

### Task 6: Gateway & Observability Section
Create src/components/GatewaySection.tsx:
Two cards:
1. Left - "One gateway. Hundreds of AI models."
   - Globe/network illustration
   - Features: Unified access control, Token usage rate limit, LLM routing, Model fallbacks

2. Right - "Embedded LLM observability"
   - Empty/minimal illustration area
   - Features: OpenTelemetry-based, Compatible with any framework

### Task 7: CTA Banner Section
Create src/components/CTABanner.tsx:
- Large blue (primary color) background section
- Title: "Achieve near instant latency today."
- Two CTAs: "Get started on SuperServer" (outline), "Get a demo" (solid)
- Decorative geometric shapes on the right

### Task 8: Footer
Create src/components/Footer.tsx:
- Logo and tagline on left
- Social links (LinkedIn, X, Discord)
- Four column layout: Product, Developers, Company, Contact
- Copyright notice at bottom

### Task 9: Assemble App.tsx
Update src/App.tsx to import and render all components in order:
1. Navbar
2. Hero
3. FeaturesGrid1
4. FeaturesGrid2
5. AgentsCohosting
6. GatewaySection
7. CTABanner
8. Footer

## Execution Protocol
1. Check .completion/AGENT1_COMPLETE exists before starting
2. Write status to .status/AGENT2 after each component
3. When all tasks complete, create .completion/AGENT2_COMPLETE

## Status Update Format
echo "AGENT2: X/9 complete, working on [component name]" > .status/AGENT2

## Quality Standards
- Use Tailwind 4 utility classes
- Follow the reference images closely for layout/spacing
- Use CSS Grid for card layouts
- Ensure responsive design
- Use semantic HTML
- Create placeholder SVG illustrations (can be refined later)

NOW BEGIN. Check for AGENT1_COMPLETE, then start with Task 1.
