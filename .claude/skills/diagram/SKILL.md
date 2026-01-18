---
name: diagram
description: Generate architecture diagrams from natural language descriptions. Use when the user wants to create a diagram, visualize architecture, show data flow, or draw system relationships. Triggers on words like "diagram", "architecture", "visualize", "flow", "draw".
allowed-tools: Read, Write, Glob
---

# Diagram Generator

Generate professional architecture diagrams from natural language descriptions.

## Theme Integration

The DiagramRenderer automatically extracts colors and fonts from your project's CSS variables:

| CSS Variable | Usage |
|--------------|-------|
| `--color-primary` | Highlight borders, primary arrows |
| `--color-secondary` | Secondary accents |
| `--color-background` | Canvas background |
| `--color-surface` | Node fill |
| `--color-border` | Node borders |
| `--color-text` | Primary text |
| `--color-text-muted` | Secondary text, labels |
| `--font-title` | Titles and headers |
| `--font-content` | Body text |
| `--font-mono` | Code-style labels |

No hardcoded colors - diagrams match your design system.

## How to Use

The user provides a description like:
- "Create a diagram showing app connecting to Redis and Postgres"
- "Diagram: User authenticates via Auth0, queries Postgres"
- "Visualize the data flow from API to ClickHouse"

You parse this and generate a JSON schema file.

## Arguments

`$ARGUMENTS` contains the diagram description. Parse it to extract:
1. Optional name (if provided as first word before description)
2. The architecture description

---

## STEP 1: Parse the Description

Extract from the natural language:

### Nodes (Systems/Services)
- **Applications**: "app", "frontend", "backend", "service", "API" → `type: box`
- **Databases/Storage**: "database", "Postgres", "Redis", "S3" → `type: container` with `variant: highlight`
- **Infrastructure**: "server", "NVMe", "disk", "node", "instance" → `type: pill`
- **External Services**: "Auth0", "Stripe", "Twilio" → `type: box` with icon
- **AWS/Cloud Services**: "EC2", "Lambda", "S3", "EKS" → `type: container` with icon

### Connections (Relationships)
| Phrase | Arrow Direction | Style |
|--------|-----------------|-------|
| "sends to", "writes to", "pushes to" | source → target | primary |
| "reads from", "fetches from", "queries" | source → target | primary |
| "authenticates via/with", "connects to" | source → target | primary |
| "replicates to", "syncs to", "backs up to" | source → target | secondary |
| "caches", "stores" | source → target | primary |
| "via", "through" | creates intermediate node | primary then secondary |

### Icons (Technology Detection)

Icons are sourced from react-icons (Si = Simple Icons, Fa = Font Awesome).

| Keyword(s) | Icon ID |
|------------|---------|
| **Databases** | |
| postgres, postgresql, pg | postgresql |
| mysql, mariadb | mysql |
| mongodb, mongo | mongodb |
| redis | redis |
| clickhouse | clickhouse |
| elasticsearch, elastic | elasticsearch |
| dynamodb | dynamodb |
| rds | rds |
| cassandra | cassandra |
| snowflake | snowflake |
| **Cloud Providers** | |
| aws, amazon | aws |
| gcp, google cloud | gcp |
| azure | azure |
| **AWS Services** | |
| ec2 | ec2 |
| s3 | s3 |
| eks | eks |
| lambda | lambda |
| **Container/Orchestration** | |
| docker | docker |
| kubernetes, k8s | kubernetes |
| **Platforms** | |
| vercel | vercel |
| netlify | netlify |
| cloudflare | cloudflare |
| supabase | supabase |
| firebase | firebase |
| **Auth/Payments** | |
| auth0 | auth0 |
| stripe | stripe |
| **Frameworks** | |
| nextjs, next.js | nextjs |
| react | react |
| vue | vue |
| **Languages** | |
| node, nodejs | nodejs |
| python | python |
| go, golang | go |
| rust | rust |
| **Infrastructure** | |
| nginx | nginx |
| terraform | terraform |
| ansible | ansible |
| **CI/CD** | |
| jenkins | jenkins |
| circleci | circleci |
| **Monitoring** | |
| datadog | datadog |
| grafana | grafana |
| prometheus | prometheus |
| **Message Queues** | |
| kafka | kafka |
| rabbitmq | rabbitmq |
| **APIs/ORMs** | |
| graphql | graphql |
| prisma | prisma |
| **Generic** | |
| server | server |
| database | database |
| cloud | cloud |
| network | network |
| security | security |
| iam | iam |
| storage | storage |

---

## STEP 2: Generate JSON Schema

Create a JSON file at `src/diagrams/<name>.json` following this schema:

```json
{
  "diagram": {
    "title": "<Descriptive Title>",
    "nodes": [
      {
        "id": "unique_snake_case_id",
        "label": "Display Label",
        "type": "box | container | pill",
        "icon": "icon_id",
        "variant": "default | highlight",
        "labelStyle": "normal | code",
        "subtitle": "secondary text",
        "bullets": ["Feature one", "Feature two"],
        "children": [
          {
            "id": "child_id",
            "label": "Child Label",
            "type": "box",
            "bullets": ["Child feature"]
          }
        ],
        "repeat": 3,
        "layout": "horizontal | vertical"
      }
    ],
    "connections": [
      {
        "from": "source_node_id",
        "to": "target_node_id",
        "label": "connection label",
        "style": "primary | secondary",
        "exitSide": "top | right | bottom | left",
        "enterSide": "top | right | bottom | left",
        "annotation": {
          "position": "left | right",
          "bullets": ["Note one", "Note two"]
        }
      }
    ]
  }
}
```

---

## STEP 3: Visual Rules

### Node Hierarchy
- **Container (highlight)**: Main databases, core systems - has primary color border
- **Box (default)**: Applications, services, external APIs
- **Pill**: Infrastructure, storage devices, small elements

### Connection Styles
- **Primary**: User-facing data flows, main paths - Uses `--color-primary`, dashed
- **Secondary**: Background processes, replication - Uses `--color-text-muted`, dashed

### Layout Guidelines
1. Flow direction: Left-to-right or top-to-bottom
2. User/App on the LEFT
3. Databases in the CENTER
4. Infrastructure/Storage on the RIGHT or BOTTOM
5. Keep nodes spaced for clean arrow routing

### Arrow Routing
- Minimum segment length: 30px (prevents janky arrows)
- Corner radius: 16px (smooth curves)
- Arrows automatically route around nodes when needed
- Parallel connections are automatically offset horizontally (20px)

### Label & Annotation Positioning
Labels and annotations are automatically **centered** along the connection path:

**Labels** (`label` property):
- Positioned at the **midpoint** of the connection
- For vertical arrows: placed to the LEFT of the line
- For horizontal arrows: placed ABOVE the line

**Annotations** (`annotation.bullets` property):
- Also centered at the **midpoint** of the connection
- Use `position: "right"` to place on the right side (default for vertical)
- Use `position: "left"` to place on the left side

**Best Practices**:
- Keep labels short (1-3 words): "TCP :6379", "Auth", "Writes"
- Use annotations for longer explanations
- Don't use both label and annotation with `position: "left"` on vertical connections (they'll overlap)

---

## STEP 4: Output

1. Create the file at `src/diagrams/<name>.json`
2. Tell the user:

```
Created diagram: src/diagrams/<name>.json

To render it:

import { DiagramRenderer, parseDiagramObject } from '@/components/DiagramRenderer';
import schemaJson from '@/diagrams/<name>.json';

const schema = parseDiagramObject(schemaJson.diagram);

<DiagramRenderer schema={schema} autoSize />
```

---

## Example

**Input:** "redis-ec2: Redis connection to an EC2 instance server with subparts including Application Server, ENI, and EBS Volume"

**Output:** `src/diagrams/redis-ec2.json`

```json
{
  "diagram": {
    "title": "Redis to EC2 Architecture",
    "nodes": [
      {
        "id": "redis",
        "label": "Redis",
        "type": "container",
        "icon": "redis",
        "variant": "highlight",
        "bullets": ["Cache reads", "Session storage"]
      },
      {
        "id": "ec2",
        "label": "EC2 Instance",
        "type": "container",
        "icon": "ec2",
        "variant": "highlight",
        "children": [
          {
            "id": "app_server",
            "label": "Application Server",
            "type": "box",
            "subtitle": "Node.js / Python",
            "bullets": ["Handles requests", "Business logic"]
          },
          {
            "id": "eni",
            "label": "ENI",
            "type": "box",
            "subtitle": "Network Interface"
          },
          {
            "id": "ebs",
            "label": "EBS Volume",
            "type": "box",
            "subtitle": "Storage"
          }
        ]
      },
      {
        "id": "security_group",
        "label": "Security Group",
        "type": "pill"
      },
      {
        "id": "iam_role",
        "label": "IAM Role",
        "type": "pill",
        "icon": "iam"
      }
    ],
    "connections": [
      {
        "from": "ec2",
        "to": "redis",
        "label": "TCP :6379",
        "style": "primary",
        "exitSide": "top",
        "enterSide": "bottom"
      },
      {
        "from": "security_group",
        "to": "ec2",
        "label": "Controls access",
        "style": "secondary"
      },
      {
        "from": "iam_role",
        "to": "ec2",
        "label": "Attached",
        "style": "secondary"
      }
    ]
  }
}
```
