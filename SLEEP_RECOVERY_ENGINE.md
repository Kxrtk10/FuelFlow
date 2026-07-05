# FuelFlow Sleep & Recovery Engine

## Purpose

The Sleep & Recovery Check-In system expands FuelFlow from nutrition tracking into a broader nutrition and wellbeing companion.

The daily check-in is intentionally low friction. It is designed to take under 30 seconds and collect just enough signal to connect:

- sleep
- energy
- stress
- cravings
- readiness
- soreness
- fatigue
- hydration
- meal timing
- food choices

FuelFlow calculates deterministic metrics first, then uses AI only to interpret those metrics in a supportive tone.

## Design Principles

- Simple enough to use every day.
- Supportive, not clinical.
- No diagnostic claims.
- Date-based records for future intelligence.
- Ready for circadian rhythm coaching, smoking tracking, and wearable integrations.

## Database Schema

### `daily_checkins`

Stores one daily wellbeing snapshot per user per date.

```sql
CREATE TABLE IF NOT EXISTS daily_checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  checkin_date DATE NOT NULL,
  mood TEXT,
  energy INTEGER,
  stress INTEGER,
  cravings INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, checkin_date),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### `sleep_logs`

Stores one sleep record per user per sleep date.

```sql
CREATE TABLE IF NOT EXISTS sleep_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  sleep_date DATE NOT NULL,
  bedtime TEXT,
  wake_time TEXT,
  duration_minutes INTEGER,
  quality INTEGER,
  interruptions INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, sleep_date),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### `recovery_logs`

Stores one recovery record per user per date.

```sql
CREATE TABLE IF NOT EXISTS recovery_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  log_date DATE NOT NULL,
  soreness INTEGER,
  fatigue INTEGER,
  readiness INTEGER,
  hydration INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, log_date),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Frontend UX

The daily check-in lives on the Home dashboard.

Questions:

- How did you sleep?
- How is your energy today?
- How stressed are you?
- Any cravings today?
- How recovered do you feel?

Inputs:

- Sleep hours
- Sleep quality
- Optional bedtime and wake time
- Optional wake-ups
- Mood emoji
- Energy slider
- Stress slider
- Cravings slider
- Recovery/readiness slider
- Optional soreness, fatigue, hydration
- Optional note

The form saves to:

```text
POST /api/wellbeing/checkin
```

The app loads recent check-ins from:

```text
GET /api/wellbeing/checkins?days=30
```

## API Endpoints

### Save Daily Check-In

```text
POST /api/wellbeing/checkin
Authorization: Bearer <token>
```

Request:

```json
{
  "checkin_date": "2026-06-18",
  "mood": "🙂",
  "energy": 7,
  "stress": 4,
  "cravings": 5,
  "notes": "Felt okay today.",
  "sleep_date": "2026-06-18",
  "bedtime": "23:15",
  "wake_time": "07:00",
  "duration_minutes": 465,
  "sleep_quality": 8,
  "interruptions": 1,
  "sleep_notes": "Woke once.",
  "soreness": 3,
  "fatigue": 4,
  "readiness": 7,
  "hydration": 8,
  "recovery_notes": "Light soreness."
}
```

Behavior:

- Upserts `daily_checkins`.
- Upserts `sleep_logs`.
- Upserts `recovery_logs`.
- Returns recent wellbeing records.

### Load Check-Ins

```text
GET /api/wellbeing/checkins?days=30
Authorization: Bearer <token>
```

Response:

```json
{
  "daily_checkins": [],
  "sleep_logs": [],
  "recovery_logs": [],
  "period_start": "2026-05-20",
  "period_end": "2026-06-18"
}
```

### Generate Weekly Recovery Report

```text
POST /api/recovery/report
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
  "period_start": "2026-06-12",
  "period_end": "2026-06-18",
  "metrics": {},
  "summary": "string",
  "suggestions": ["string", "string", "string"]
}
```

### Load Recovery Reports

```text
GET /api/recovery/reports
Authorization: Bearer <token>
```

Returns the latest 12 reports where:

```text
report_type = "sleep_recovery"
```

## Analytics Engine

Main function:

```python
build_sleep_recovery_metrics(logs, wellbeing, profile, days=7)
```

### Average Sleep Duration

Uses:

```text
sleep_logs.duration_minutes / 60
```

Output:

```json
"average_duration_hours": 7.4
```

### Average Sleep Quality

Uses:

```text
mean(sleep_logs.quality)
```

Scale:

```text
1 to 10
```

### Sleep Consistency Score

Score range:

```text
0 to 100
```

Components:

- check-in coverage
- bedtime variability
- wake-time variability
- sleep duration relative to 7.5 hours

Formula:

```text
coverage_score = sleep_logs / days_analyzed * 100
variability_score = 100 - average(bedtime_sd, wake_sd) / 3
duration_score = average_sleep_hours / 7.5 * 100

sleep_consistency_score =
  coverage_score * 0.25
  + variability_score * 0.45
  + duration_score * 0.30
```

The final score is clamped between `0` and `100`.

### Sleep Debt Trends

Target sleep:

```text
7.5 hours = 450 minutes
```

Per-night sleep debt:

```text
max(0, 450 - duration_minutes) / 60
```

Trend compares the earlier half of the period with the later half:

- `improving`
- `steady`
- `declining`

### Weekday vs Weekend Sleep

The engine separates sleep logs by date:

- weekday: Monday-Friday
- weekend: Saturday-Sunday

Calculated:

- weekday average hours
- weekend average hours
- weekday quality
- weekend quality

### Recovery Score

Each recovery row becomes a 0-100 score.

Inputs:

- readiness
- hydration
- soreness
- fatigue

Formula:

```text
recovery_score =
  average(
    readiness,
    hydration,
    11 - soreness,
    11 - fatigue
  ) * 10
```

Higher soreness and fatigue reduce the score.

### Readiness, Soreness, Fatigue Trends

Trend compares earlier vs later values in the report period.

Returned fields:

```json
{
  "direction": "improving",
  "delta": 1.2
}
```

### Stress And Cravings

Calculated from `daily_checkins`:

- average energy
- average stress
- average cravings
- cravings after poor sleep
- cravings after better sleep

Poor sleep means:

```text
sleep duration < 6.5 hours OR quality <= 5
```

### Sleep And Energy Association

The engine joins sleep logs and meal logs by date.

Calculated:

- average meal energy after 7+ hours of sleep
- average meal energy after shorter sleep

This supports insights like:

```text
Your highest-energy days follow nights with 7+ hours of sleep.
```

### Sleep And Meal Timing Association

The engine compares first meal timing after:

- consistent bedtime days
- inconsistent bedtime days

This prepares the system for circadian rhythm coaching.

## AI Interpretation

Claude receives:

- profile summary
- deterministic sleep/recovery metrics

Claude is instructed:

- do not invent numbers
- do not recalculate
- do not diagnose
- keep tone warm and practical
- return JSON only

Expected output:

```json
{
  "summary": "weekly interpretation",
  "suggestions": ["action 1", "action 2", "action 3"]
}
```

Fallback:

If AI fails, `build_sleep_recovery_fallback()` returns a deterministic summary and suggestions.

## Sizzle Integration

Sizzle receives this compact block in `/api/chat`:

```text
Recent sleep and recovery patterns:
- Average sleep: 7.1 hours; quality: 7.5/10.
- Sleep consistency: 72/100; average bedtime: 11:20 PM.
- Sleep debt: 0.4 hours per logged night.
- Recovery score: 68/100; readiness: 6.8/10.
- Stress: 5.1/10; cravings: 4.7/10.
- Energy after 7+ hour sleep: 7.4/10 vs short sleep: 5.9/10.
```

This allows responses like:

```text
I noticed your cravings tend to rise after shorter sleep.
```

without requiring users to explain their week manually.

## Frontend Report UI

The Sleep & Recovery dashboard appears in Insights.

Cards:

- Sleep consistency
- Sleep quality
- Weekday vs weekend
- Recovery score
- Soreness and fatigue
- Stress and cravings
- Sleep impact
- Check-ins logged

History:

- Previous reports are loaded from `/api/recovery/reports`.
- Clicking a report re-renders that saved report.

## Future Compatibility

### Circadian Rhythm Coaching

Already supported by:

- bedtime
- wake time
- sleep consistency
- first meal timing association
- weekday/weekend split

Future additions:

- eating window recommendations
- caffeine timing
- light exposure check-ins
- bedtime routine coaching

### Smoking Tracking

The date-based wellbeing layer can be joined with future habit events:

- cravings
- stress
- sleep quality
- smoking triggers
- meal timing

Recommended future table:

```text
habit_events
```

### Wearable Integrations

The schema can accept future imported data:

- sleep duration
- sleep stages
- resting heart rate
- HRV
- readiness
- recovery score

Future migration may add columns or metadata fields, but the date-based structure is already compatible.

## Limitations

- Sleep duration is user-entered, not wearable-measured.
- Bedtime and wake time are optional.
- Current associations are correlations, not causation.
- No timezone preference exists yet.
- No clinical advice or diagnosis is provided.
- Reports are generated manually, not scheduled.
