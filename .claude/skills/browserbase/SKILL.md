---
name: browserbase
description: Manage headless Chrome browser sessions via Browserbase API. Use when creating, listing, stopping browser sessions, or working with persistent contexts for web automation and scraping.
---

# Browserbase Skill

Manage headless Chrome browser sessions via Browserbase API.

## Invocation

```
/browserbase create                    # Create new session
/browserbase list                      # List running sessions
/browserbase status <session_id>       # Get session details
/browserbase stop <session_id>         # Stop a session
/browserbase logs <session_id>         # Get session logs
/browserbase downloads <session_id>    # Download files from session
/browserbase context create            # Create persistent context
/browserbase context get <context_id>  # Get context details
/browserbase context delete <context_id>
```

## Examples

```
/browserbase create
/browserbase create --proxy --viewport 1920x1080
/browserbase list
/browserbase stop sess_abc123
/browserbase logs sess_abc123
```

---

## Configuration

Environment variables (from `.env`):
- `BROWSERBASE_PROJECT_ID` - Your project ID
- `BROWSERBASE_API_KEY` - Your API key (note: key in env uses `BROWSERBASW_API_KEY` typo)

Base URL: `https://api.browserbase.com/v1`
Auth Header: `X-BB-API-Key: $BROWSERBASE_API_KEY`

---

## STEP 1: Parse Command

| Command | Action |
|---------|--------|
| `create` | Create new browser session |
| `list` | List sessions (filter by status) |
| `status <id>` | Get session details |
| `stop <id>` | Terminate session |
| `logs <id>` | Retrieve session logs |
| `downloads <id>` | Get downloaded files (ZIP) |
| `context create` | Create persistent context |
| `context get <id>` | Get context details |
| `context delete <id>` | Delete context |

### Create Options
| Flag | Description |
|------|-------------|
| `--proxy` | Enable residential proxies |
| `--keep-alive` | Keep session alive after disconnect |
| `--viewport WxH` | Set viewport (e.g., `1920x1080`) |
| `--context <id>` | Reuse existing context |
| `--extension <id>` | Load Chrome extension |

---

## STEP 2: Execute API Call

### Create Session

```bash
curl -X POST https://api.browserbase.com/v1/sessions \
  -H "Content-Type: application/json" \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY" \
  -d '{
    "projectId": "'$BROWSERBASE_PROJECT_ID'",
    "browserSettings": {
      "viewport": { "width": 1920, "height": 1080 }
    },
    "keepAlive": true,
    "proxies": true
  }'
```

**Response:**
```json
{
  "id": "session-abc123",
  "projectId": "proj-xyz",
  "status": "RUNNING",
  "connectUrl": "wss://connect.browserbase.com/...",
  "createdAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2024-01-01T01:00:00Z"
}
```

### List Sessions

Always filter by status to avoid large responses:

```bash
curl "https://api.browserbase.com/v1/sessions?status=RUNNING" \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY"
```

Status options: `RUNNING`, `COMPLETED`, `ERROR`, `TIMED_OUT`

### Get Session Status

```bash
curl "https://api.browserbase.com/v1/sessions/{session_id}" \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY"
```

### Stop Session

**Important:** Must include `/stop` endpoint!

```bash
curl -X POST "https://api.browserbase.com/v1/sessions/{session_id}/stop" \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY"
```

### Get Logs

```bash
curl "https://api.browserbase.com/v1/sessions/{session_id}/logs" \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY"
```

### Get Downloads

```bash
curl "https://api.browserbase.com/v1/sessions/{session_id}/downloads" \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY" \
  --output downloads.zip
```

### Context Operations

```bash
# Create context (persist cookies/storage across sessions)
curl -X POST https://api.browserbase.com/v1/contexts \
  -H "Content-Type: application/json" \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY" \
  -d '{"projectId": "'$BROWSERBASE_PROJECT_ID'"}'

# Get context
curl "https://api.browserbase.com/v1/contexts/{context_id}" \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY"

# Delete context
curl -X DELETE "https://api.browserbase.com/v1/contexts/{context_id}" \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY"
```

---

## STEP 3: Return Results

After executing the API call, provide:

1. **Status**: Success/failure indicator
2. **Session ID**: For reference in future commands
3. **Connect URL**: WebSocket URL for Puppeteer/Playwright connection
4. **Expiration**: When session will auto-terminate

### Success Output Format

```
Session created successfully.

ID:          sess_abc123
Status:      RUNNING
Connect URL: wss://connect.browserbase.com/...
Expires:     2024-01-01T01:00:00Z

Connect with Puppeteer:
  const browser = await puppeteer.connect({
    browserWSEndpoint: 'wss://connect.browserbase.com/...'
  });

Connect with Playwright:
  const browser = await chromium.connectOverCDP('wss://connect.browserbase.com/...');
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sessions` | List sessions (use `?status=RUNNING`) |
| POST | `/sessions` | Create session |
| GET | `/sessions/{id}` | Get session details |
| POST | `/sessions/{id}/stop` | Stop session |
| GET | `/sessions/{id}/downloads` | Get downloads (ZIP) |
| GET | `/sessions/{id}/logs` | Get session logs |
| POST | `/contexts` | Create context |
| GET | `/contexts/{id}` | Get context |
| DELETE | `/contexts/{id}` | Delete context |

---

## Session Response Schema

```json
{
  "id": "session-abc123",
  "projectId": "proj-xyz",
  "status": "RUNNING",
  "createdAt": "2024-01-01T00:00:00Z",
  "startedAt": "2024-01-01T00:00:01Z",
  "endedAt": null,
  "expiresAt": "2024-01-01T01:00:00Z",
  "connectUrl": "wss://connect.browserbase.com/...",
  "proxyBytes": 0,
  "avgCpuUsage": 0,
  "memoryUsage": 0
}
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Stealth Mode** | Anti-bot detection evasion built-in |
| **Residential Proxies** | Use `proxies: true` to enable |
| **Persistent Contexts** | Save cookies/storage across sessions |
| **Session Recording** | Replay sessions for debugging |
| **Chrome Extensions** | Load custom extensions via `extensionId` |
| **Auto-Expiration** | Sessions timeout after 1 hour of inactivity |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Session not stopping | Use POST to `/sessions/{id}/stop` not `/sessions/{id}` |
| Large response on list | Add `?status=RUNNING` query param |
| Session expired | Use `keepAlive: true` when creating |
| Connection refused | Check if session is still `RUNNING` |
| Auth failed | Verify `BROWSERBASE_API_KEY` is correct |

---

## Complete Workflow Example

```bash
# 1. Create a session with proxy
SESSION=$(curl -s -X POST https://api.browserbase.com/v1/sessions \
  -H "Content-Type: application/json" \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY" \
  -d '{"projectId": "'$BROWSERBASE_PROJECT_ID'", "proxies": true}')

SESSION_ID=$(echo $SESSION | jq -r '.id')
CONNECT_URL=$(echo $SESSION | jq -r '.connectUrl')

echo "Session ID: $SESSION_ID"
echo "Connect URL: $CONNECT_URL"

# 2. Use with Playwright (separate script)
# const browser = await chromium.connectOverCDP(process.env.CONNECT_URL);

# 3. Get logs when done
curl "https://api.browserbase.com/v1/sessions/$SESSION_ID/logs" \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY"

# 4. Stop the session
curl -X POST "https://api.browserbase.com/v1/sessions/$SESSION_ID/stop" \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY"
```
