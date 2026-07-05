# FuelFlow Habit Intelligence

## Purpose

Habit Intelligence helps users make better decisions, not perfect decisions.

The system tracks habit events gently and turns them into awareness:

- What tends to trigger cravings?
- When are smoking urges strongest?
- Does alcohol affect next-day energy?
- Do cravings rise after poor sleep?
- Do events cluster after long meal gaps?

FuelFlow treats every event as data, not a verdict.

## Design Principles

- No guilt-based messaging.
- No moral labels.
- Fast quick-log flow under 15 seconds.
- Deterministic calculations first.
- AI interpretation second.
- Generic event architecture for future habit products.

## Database Schema

### `habit_events`

```sql
CREATE TABLE IF NOT EXISTS habit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  quantity REAL,
  intensity INTEGER,
  trigger TEXT,
  context TEXT,
  mood TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Supported initial event types:

- `smoking`
- `craving`
- `alcohol`

Future event types:

- `caffeine`
- `social_eating`
- `hydration`
- `supplement`
- `workout`
- `stress_event`

## Quick Log Experience

The quick log appears on Home.

It supports:

### Smoking Event

Fields:

- amount
- craving intensity
- trigger
- context
- mood
- notes

Example triggers:

- Stress
- After meal
- Social
- Bored
- Alcohol
- Work break

### Craving Event

Fields:

- craving type
- intensity
- trigger
- context
- mood
- notes

Example triggers:

- Stress
- Low sleep
- Long gap
- Evening
- Social
- Emotion

### Alcohol Event

Fields:

- drink quantity
- drink type
- intensity
- trigger
- mood
- notes

Example triggers:

- Social
- Weekend
- Stress
- Celebration
- Dinner out
- Bored

## API Endpoints

### Save Habit Event

```text
POST /api/habits/event
Authorization: Bearer <token>
```

Request:

```json
{
  "event_type": "craving",
  "timestamp": "2026-06-22T20:15:00",
  "quantity": 1,
  "intensity": 8,
  "trigger": "Stress",
  "context": "Sweet craving",
  "mood": "😐",
  "notes": "Wanted chocolate after studying."
}
```

### Load Habit Events

```text
GET /api/habits/events?days=30
Authorization: Bearer <token>
```

Response:

```json
{
  "events": []
}
```

### Generate Habit Report

```text
POST /api/habits/report
Authorization: Bearer <token>
```

Request:

```json
{ "days": 7 }
```

Response:

```json
{
  "report_id": 1,
  "period_start": "2026-06-16",
  "period_end": "2026-06-22",
  "metrics": {},
  "summary": "string",
  "suggestions": ["string", "string", "string"]
}
```

### Load Habit Reports

```text
GET /api/habits/reports
Authorization: Bearer <token>
```

Returns the latest 12 reports where:

```text
report_type = "habit_intelligence"
```

## Analytics Engine

Main function:

```python
build_habit_metrics(events, logs, wellbeing, profile, days=7)
```

Inputs:

- `habit_events`
- meal logs
- daily check-ins
- sleep logs
- user profile

### Most Common Triggers

Counts `habit_events.trigger`.

Output:

```json
[
  { "label": "Stress", "count": 4 },
  { "label": "Evening", "count": 2 }
]
```

### Strongest Craving Windows

Each event timestamp is grouped into:

- morning
- midday
- afternoon
- evening
- late night

For events with intensity:

```text
average_intensity_by_window =
  sum(intensity in window) / count(events in window)
```

Output:

```json
[
  { "window": "evening", "average_intensity": 7.8, "count": 4 }
]
```

### Smoking Frequency Trend

Filters events where:

```text
event_type = smoking
```

Compares event count in the earlier half of the report window vs later half.

Output:

```json
{
  "direction": "decreasing",
  "delta": -2,
  "earlier_count": 4,
  "later_count": 2
}
```

### Alcohol Frequency Trend

Same trend logic as smoking, using:

```text
event_type = alcohol
```

### Mood Correlations

Counts events by `mood`.

This helps identify states that commonly appear around habit events.

### Stress Correlations

Joins habit events to `daily_checkins` by date.

High stress threshold:

```text
stress >= 7/10
```

Calculated:

- events on high-stress days
- events on lower-stress days

### Sleep Correlations

Joins habit events to `sleep_logs` by date.

Poor sleep definition:

```text
duration < 6.5 hours OR sleep quality <= 5/10
```

Calculated:

- events after poor sleep
- events after better sleep

### Meal Timing Correlations

Joins habit events to meal logs by date and timestamp.

Calculated:

- events after long meal gaps
- late-night habit events

Long gap threshold:

```text
5+ hours since previous meal
```

Late-night threshold:

```text
10 PM to 4 AM
```

### Alcohol And Next-Day Energy

For alcohol events:

1. Find the next calendar day.
2. Read meal log energy scores from that next day.
3. Compare with energy on alcohol-free days.

Calculated:

- next-day energy after alcohol
- energy on alcohol-free days

## Pattern Detection Logic

The deterministic engine produces observations before AI interpretation.

Examples:

```text
Most common trigger: Stress.
Strongest habit window: evening.
Events happened on higher-stress days.
Events happened after shorter or lower-quality sleep.
Events happened after a 5+ hour meal gap.
```

These become the evidence base for AI summaries like:

```text
You tend to experience cravings after stressful evenings.
```

The AI is not allowed to invent new patterns.

## AI Interpretation

Claude receives:

- user profile
- deterministic habit metrics

Claude returns:

```json
{
  "summary": "warm weekly interpretation",
  "suggestions": ["action 1", "action 2", "action 3"]
}
```

System boundaries:

- No guilt-based language.
- No moral judgment.
- No diagnostic claims.
- No invented numbers.
- Focus on replacement, recovery, and gradual improvement.

Fallback:

If AI fails, `build_habit_fallback()` returns a deterministic summary and suggestions.

## Sizzle Integration

Sizzle receives a compact habit context block:

```text
Recent habit patterns:
- Total habit events this week: 6.
- Top trigger: Stress (3 events).
- Strongest window: evening at 8.2/10 average intensity.
- Smoking trend: steady; alcohol trend: decreasing.
- Events on high-stress days: 4.
- Events after poor sleep: 2.
- Events after long meal gaps: 3; late-night events: 1.
- Next-day energy after alcohol: 5.8/10 vs alcohol-free days: 7.0/10.
```

This lets Sizzle say:

```text
I noticed cravings show up more often after high-stress evenings.
```

without asking the user to repeat context.

## Frontend UI

### Home Quick Log

The quick log is designed for under 15 seconds.

Users can:

- choose Smoking, Craving, or Alcohol
- set quantity/type
- set intensity
- tap a trigger
- select mood
- add optional context/notes

### Insights Dashboard

Habit Intelligence appears in Insights.

Cards:

- events logged
- top triggers
- strongest windows
- smoking trend
- alcohol trend
- mood patterns
- stress/sleep/meal timing
- alcohol recovery signal

History:

- previous reports load from `/api/habits/reports`
- clicking a report renders it

## Future Product Paths

### Drink Smarter

Use alcohol events plus sleep, energy, hydration, and meal timing to generate:

- night-out planning
- next-day recovery plans
- lower-impact drinking strategies

### Social Eating Guidance

Use context and triggers like `Social`, `Dinner out`, and `Celebration` to coach:

- restaurant choices
- pre-event meals
- post-event recovery

### Smoking Reduction Coaching

Use smoking events, triggers, mood, and stress to generate:

- trigger maps
- replacement actions
- tapering goals
- streak and reduction trends

### Habit Replacement Strategies

Use top triggers and strongest time windows to suggest:

- planned snacks
- hydration
- breathing breaks
- walk routines
- Sizzle check-ins

### Alcohol Recovery Planning

Use alcohol events plus next-day energy to recommend:

- breakfast/hydration plans
- caffeine timing
- lighter training days
- sleep extension strategies

## Limitations

- Events are self-reported.
- Correlations are not causation.
- No medical advice or diagnosis is provided.
- Current trend logic is simple earlier-half vs later-half comparison.
- Caffeine is backend-ready but not exposed in the first quick-log UI.
- Reports are generated manually, not scheduled.
