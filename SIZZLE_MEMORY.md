# Sizzle Server-Side Memory

## Purpose

Sizzle Memory transforms Sizzle from a temporary chatbot into a long-term nutrition and wellbeing coach. The system stores conversations server-side, extracts durable user facts, and injects relevant memories into future prompts so Sizzle can respond with continuity across sessions and devices.

The mission is not to make Sizzle creepy or overconfident. The mission is to help it remember useful, user-controlled context such as goals, preferences, recurring challenges, motivation triggers, nutrition constraints, and food habits.

## What Changed

Sizzle now has:

- Server-side chat history.
- Typed long-term memories.
- Memory prompt injection.
- Automatic memory extraction after conversations.
- Settings UI for memory visibility and control.
- Privacy controls to disable, delete, and export memories.

## Database Schema

### `chat_messages`

Stores durable Sizzle conversation history.

```sql
CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Fields:

- `user_id`: owner of the message.
- `role`: `user` or `assistant`.
- `content`: message text.
- `timestamp`: server-side creation time.

### `ai_memories`

Stores long-term facts Sizzle can use for coaching.

```sql
CREATE TABLE IF NOT EXISTS ai_memories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  memory_type TEXT NOT NULL,
  memory_text TEXT NOT NULL,
  confidence_score REAL DEFAULT 0.7,
  source TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Fields:

- `memory_type`: category of memory.
- `memory_text`: concise natural language memory.
- `confidence_score`: extraction confidence from `0` to `1`.
- `source`: where the memory came from, currently `chat`.
- `created_at`: first stored time.
- `updated_at`: last updated time.

### `user_privacy_settings`

Stores user control over AI memory.

```sql
CREATE TABLE IF NOT EXISTS user_privacy_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  ai_memory_enabled INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Default:

- Memory is enabled unless the user turns it off.

## Memory Types

Allowed memory types:

- `goal`
- `preference`
- `dislike`
- `craving`
- `challenge`
- `motivation_trigger`
- `athlete_profile`
- `nutrition_constraint`
- `food_preference`
- `food_avoidance`

Examples:

```text
User: I struggle with late-night cravings.
Type: challenge
Memory: User struggles with late-night cravings.
```

```text
User: My goal is 15% body fat.
Type: goal
Memory: User is aiming for 15% body fat.
```

```text
User: I hate oats but I like poha.
Type: dislike
Memory: User dislikes oats.

Type: food_preference
Memory: User likes poha.
```

## Backend Flow

Endpoint:

```text
POST /api/chat
```

Flow:

1. Authenticated user sends a Sizzle message.
2. Backend saves the user message to `chat_messages`.
3. Backend loads recent server-side chat history.
4. Backend checks whether memory is enabled.
5. If enabled, backend loads recent `ai_memories`.
6. Memories are formatted into a compact prompt block.
7. Claude generates the Sizzle reply using profile, recent chat, and relevant memories.
8. Backend saves the assistant reply to `chat_messages`.
9. Backend runs memory extraction on the user message and assistant reply.
10. Extracted memories are deduplicated and stored in `ai_memories`.
11. Response returns the reply plus server chat history.

## Prompt Injection Strategy

Sizzle receives three layers of context:

1. User profile summary:
   - name
   - goal
   - activity level
   - daily calorie target
   - body type
   - current body fat
   - target body fat

2. Recent chat:
   - latest server-side messages from `chat_messages`

3. Relevant long-term memories:
   - up to 16 recent memories from `ai_memories`

Memory prompt block example:

```text
Relevant long-term memories:
- challenge: User struggles with late-night cravings.
- goal: User is aiming for 15% body fat.
- food_preference: User prefers Indian vegetarian meals.
```

Instruction:

Sizzle may naturally say:

```text
I remember you mentioned late-night cravings before.
```

But it must not expose database details or memory IDs.

## Memory Extraction Strategy

After each Sizzle response, the backend sends a compact extraction prompt to Claude.

Extraction rules:

- Extract only durable coaching context.
- Ignore temporary questions.
- Ignore generic statements.
- Return JSON only.
- Return `{"memories": []}` if there is nothing useful.

Extraction output schema:

```json
{
  "memories": [
    {
      "memory_type": "challenge",
      "memory_text": "User struggles with late-night cravings.",
      "confidence_score": 0.8,
      "source": "chat"
    }
  ]
}
```

Deduplication:

- Before inserting, backend checks recent memories with the same type.
- If one memory text contains the other, it updates the existing row instead of inserting a duplicate.

Failure behavior:

- Memory extraction is non-blocking.
- If extraction fails, Sizzle still replies normally.
- Backend logs: `SIZZLE MEMORY EXTRACTION SKIPPED`.

## API Endpoints

### `GET /api/chat/history`

Returns recent server-side Sizzle messages.

Response:

```json
{
  "history": [
    {
      "id": 1,
      "role": "user",
      "content": "I struggle with late-night cravings.",
      "timestamp": "2026-06-18 10:00:00"
    }
  ]
}
```

### `GET /api/memories`

Returns memory setting and stored memories.

Response:

```json
{
  "memory_enabled": true,
  "memories": []
}
```

### `POST /api/memories/settings`

Toggles memory on or off.

Request:

```json
{ "enabled": false }
```

### `DELETE /api/memories/{memory_id}`

Deletes one memory owned by the authenticated user.

### `DELETE /api/memories`

Deletes all memories owned by the authenticated user.

## Frontend Behavior

### Sizzle Tab

When the Sizzle tab opens:

1. Frontend calls `GET /api/chat/history`.
2. Server history is written into local chat cache.
3. Chat UI renders from the refreshed cache.

When the user sends a message:

1. Message is optimistically written locally.
2. Frontend calls `POST /api/chat`.
3. Backend stores both user and assistant messages.
4. Backend returns updated server history.
5. Frontend replaces local chat cache with server history.

LocalStorage still exists as a fallback cache, but server history is now the source of truth for authenticated users.

### Settings: What Sizzle Remembers

New Settings section:

```text
What Sizzle Remembers
```

Users can:

- View memories.
- See memory type.
- See confidence score.
- See source.
- Delete individual memories.
- Delete all memories.
- Export memories as JSON.
- Turn memory on/off.

## Privacy Behavior

When memory is enabled:

- Sizzle loads memories into future prompts.
- New durable facts can be extracted after chats.

When memory is disabled:

- Existing memories remain visible in Settings.
- Existing memories are not injected into Sizzle prompts.
- New memories are not extracted.

Users can delete:

- One memory.
- All memories.

Users can export:

- All visible memories as `fuelflow_sizzle_memories.json`.

## Future Compatibility

The memory system is designed so future features can write into `ai_memories` using the same schema.

Future sources:

- `sleep_tracking`
- `smoking_tracking`
- `recovery_tracking`
- `behavioral_insights`
- `meal_plan_adherence`
- `coach_notes`
- `daily_checkins`

Examples:

```text
Source: sleep_tracking
Type: challenge
Memory: User feels hungrier after sleeping less than 6 hours.
```

```text
Source: meal_plan_adherence
Type: preference
Memory: User follows plans better when breakfast is savory.
```

```text
Source: recovery_tracking
Type: athlete_profile
Memory: User trains legs on Mondays and reports higher hunger afterward.
```

## Current Limitations

- Memory relevance is currently based on recency, not semantic search.
- No embeddings/vector search yet.
- No manual "add memory" button yet.
- Chat deletion is local-only through the current clear-chat button.
- Memories are global to Sizzle, not scoped per feature.
- Medical/safety memory rules are basic and should be hardened before production.

## Recommended Next Steps

1. Add semantic ranking for memories.
2. Add a manual "Remember this" action.
3. Add server-side chat deletion controls.
4. Add source filters in Settings.
5. Add memory review prompts after extraction.
6. Add stricter privacy copy before enabling community or coach features.
7. Add tests for memory extraction fallback, delete, toggle, and prompt injection.
