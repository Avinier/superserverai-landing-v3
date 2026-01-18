---
description: Generate architecture diagrams from natural language descriptions
allowed-tools: Read, Write, Glob, Grep
argument-hint: <name> "<description>"
---

# Diagram Generator

Generate a professional architecture diagram from the user's description.

## Input

$ARGUMENTS

## Instructions

1. **Parse the description** to identify:
   - **Nodes**: Applications, databases, services, infrastructure
   - **Connections**: Data flows, relationships, replication
   - **Icons**: Map mentioned technologies to icon IDs

2. **Determine node types**:
   - `container` + `variant: highlight` → Main databases, core systems (yellow border)
   - `box` → Applications, services, external APIs
   - `pill` → Infrastructure elements (NVMe, servers, small items)

3. **Determine connection styles**:
   - `primary` → User-facing flows, main data paths (yellow dashed)
   - `secondary` → Background processes, replication (grey dashed)

4. **Icon mapping** (use these exact IDs):
   | Technology | Icon ID |
   |------------|---------|
   | Postgres, PostgreSQL | postgresql |
   | MySQL | mysql |
   | MongoDB | mongodb |
   | Redis | redis |
   | ClickHouse | clickhouse |
   | Kafka | apachekafka |
   | Docker | docker |
   | Kubernetes, K8s | kubernetes |
   | AWS | amazonaws |
   | Supabase | supabase |
   | Auth0 | auth0 |
   | Next.js | nextdotjs |
   | React | react |
   | Node.js | nodedotjs |
   | Nginx | nginx |
   | GraphQL | graphql |

5. **Generate JSON** and save to `src/diagrams/<name>.json`:

```json
{
  "diagram": {
    "title": "",
    "nodes": [
      {
        "id": "unique_id",
        "label": "Display Name",
        "type": "box|container|pill",
        "icon": "icon_id",
        "variant": "default|highlight",
        "bullets": ["Feature 1", "Feature 2"],
        "children": [],
        "repeat": 3,
        "subtitle": "Optional subtitle"
      }
    ],
    "connections": [
      {
        "from": "source_id",
        "to": "target_id",
        "label": "Connection Label",
        "style": "primary|secondary",
        "exitSide": "top|right|bottom|left",
        "enterSide": "top|right|bottom|left",
        "annotation": {
          "position": "right",
          "bullets": ["Note 1", "Note 2"]
        }
      }
    ]
  }
}
```

6. **After creating the file**, tell the user:
   ```
   Created: src/diagrams/<name>.json

   View at: http://localhost:5173/#/diagrams
   (Run `bun dev` if server isn't running)
   ```

## Example

Input: `/diagram auth-flow "User authenticates via Auth0, API validates, queries Postgres"`

Output: `src/diagrams/auth-flow.json`
```json
{
  "diagram": {
    "title": "",
    "nodes": [
      { "id": "user", "label": "User", "type": "box" },
      { "id": "api", "label": "API Gateway", "type": "container", "variant": "highlight" },
      { "id": "auth0", "label": "Auth0", "type": "box", "icon": "auth0" },
      { "id": "postgres", "label": "Postgres", "type": "container", "icon": "postgresql", "variant": "highlight" }
    ],
    "connections": [
      { "from": "user", "to": "api", "label": "Login", "style": "primary" },
      { "from": "api", "to": "auth0", "label": "Validate", "style": "primary" },
      { "from": "api", "to": "postgres", "label": "Query", "style": "secondary" }
    ]
  }
}
```
