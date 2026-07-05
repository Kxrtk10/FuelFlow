# FuelFlow Food Timing Coach

## Purpose

Food Timing Coach uses existing meal log timestamps to help users understand their daily eating rhythm. It does not add a new tracking flow. Every metric comes from meals the user already logs.

The goal is practical coaching:

- When do meals usually happen?
- Are gaps between meals supporting or draining energy?
- Are late-night patterns showing up?
- Do earlier or steadier meals relate to better mood and energy?

FuelFlow calculates patterns deterministically first, then uses AI only to interpret the already-calculated results in a warm, supportive tone.

## Data Used

Food Timing Coach uses existing `meal_logs.log_data` JSON fields:

- `timestamp`
- `mealType`
- `energy`
- `moodBefore`
- `moodAfter`

It also reads profile context:

- `name`
- `goal`
- `activity_level`
- `daily_calories`

No new user input is required.

## Backend Architecture

Main deterministic function:

```python
build_food_timing_metrics(logs, profile, days=7)
```

Supporting helpers:

- `minutes_to_label(minutes)`
- `average_numbers(values)`
- `standard_deviation(values)`
- `average_time_metric(values)`
- `build_timing_fallback(metrics, profile)`
- `format_timing_context_for_prompt(metrics)`

AI interpretation endpoint:

```text
POST /api/timing/report
```

Report history endpoint:

```text
GET /api/timing/reports
```

Reports are saved in the existing `insight_reports` table with:

```text
report_type = "food_timing"
```

## Metrics And Calculations

### Average Breakfast Time

Filters logs where `mealType` is `Breakfast`, converts each timestamp to minutes since midnight, and averages the minutes.

Output:

```json
{
  "minutes": 515,
  "label": "8:35 AM",
  "count": 4
}
```

### Average Lunch Time

Same method as breakfast, using `mealType = Lunch`.

### Average Dinner Time

Same method as breakfast, using `mealType = Dinner`.

### Average First Meal Time

Groups logs by date, sorts each day by timestamp, takes the first meal from each day, and averages those times.

### Average Last Meal Time

Groups logs by date, sorts each day by timestamp, takes the last meal from each day, and averages those times.

### Longest Gap Between Meals

For each logged day:

1. Sort meals by timestamp.
2. Compare consecutive meals.
3. Calculate gap in hours.
4. Keep the largest gap.

Stored fields:

- gap hours
- date
- weekday or weekend
- starting meal type
- ending meal type

### Average Gap Between Meals

Averages all same-day gaps between consecutive meals.

Also splits into:

- weekday average gap
- weekend average gap

### Meal Timing Consistency Score

Score range:

```text
0 to 100
```

The score combines:

- Logging coverage across the analyzed period.
- Variability of first meal time.
- Variability of last meal time.
- Breakfast/lunch/dinner regularity.
- Late-night eating penalty.

Formula:

```text
coverage_score = days_logged / days_analyzed * 100
variability_score = 100 - average(first_meal_sd, last_meal_sd) / 3
core_meal_score = breakfast_lunch_dinner_days / possible_core_meals * 100
late_penalty = min(20, late_night_frequency * 0.25)

consistency_score =
  coverage_score * 0.30
  + variability_score * 0.45
  + core_meal_score * 0.25
  - late_penalty
```

The final score is clamped between `0` and `100`.

### Late-Night Eating Frequency

Counts logs between:

```text
10 PM and 4 AM
```

Output:

- count
- percentage of total logs
- threshold label

### Breakfast Consistency

Calculates:

- days with breakfast
- percent of logged days containing breakfast
- count of breakfasts before 9 AM
- percent of breakfast logs before 9 AM

### Weekend vs Weekday Timing

Compares:

- average weekday first meal
- average weekend first meal
- average weekday last meal
- average weekend last meal
- weekday average gap
- weekend average gap

### Meal Timing Impact On Energy

Compares average energy for:

- days where first meal is at or before 10 AM
- days where first meal is after 10 AM
- days without late-night logs
- days with late-night logs

### Meal Timing Impact On Mood

Mood labels are converted using the existing `mood_score()` mapping.

The engine compares average mood delta for:

- steady-gap days
- long-gap days
- no late-night days
- late-night days

Mood delta means:

```text
moodAfter - moodBefore
```

## AI Interpretation

The timing endpoint sends Claude:

- user profile summary
- deterministic timing metrics JSON

Claude is explicitly instructed:

- do not invent new numbers
- do not recalculate
- interpret only the provided metrics
- return valid JSON only

Expected response:

```json
{
  "summary": "warm timing interpretation",
  "suggestions": ["action 1", "action 2", "action 3"]
}
```

If AI fails, FuelFlow uses `build_timing_fallback()`.

## Frontend Dashboard

The Food Timing Coach appears inside the Insights view.

It displays:

- Timing consistency score
- First meal rhythm
- Last meal rhythm
- Meal gaps
- Late-night eating
- Weekday vs weekend timing
- Timing impact on energy and mood
- Breakfast consistency
- AI timing summary
- Three timing suggestions
- Previous timing reports

Main frontend functions:

- `renderTimingReport(report)`
- `loadTimingReportHistory()`
- `generateTimingReport()`
- `renderTimingImpactRows(metrics)`

## API Reference

### Generate Timing Report

```text
POST /api/timing/report
Authorization: Bearer <token>
```

Request:

```json
{
  "days": 7
}
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

### Load Timing Reports

```text
GET /api/timing/reports
Authorization: Bearer <token>
```

Response:

```json
{
  "reports": []
}
```

## Sizzle Integration

Sizzle receives a compact timing context in `/api/chat`:

```text
Recent food timing patterns:
- Timing consistency score: 78/100.
- Average first meal: 8:45 AM.
- Average last meal: 8:30 PM.
- Longest gap: 6.2 hours, usually on a weekday.
- Average gap: 4.1 hours.
- Late-night logs: 2 (12%).
- Energy after earlier first meals: 7.4/10 vs later first meals: 5.8/10.
```

This allows Sizzle to say things like:

```text
I noticed your highest-energy days usually start with an earlier first meal.
```

without guessing from raw logs.

## Storage

Food Timing Coach reuses:

```text
insight_reports
```

Stored values:

- `report_type = "food_timing"`
- `metrics_data = deterministic timing metrics JSON`
- `insight_text = AI or fallback summary`
- `facts_data = suggestions JSON`

## Future Expansion

### Circadian Rhythm Coaching

The engine already separates:

- first meal timing
- last meal timing
- late-night logs
- weekday vs weekend rhythm

Future work can add:

- ideal eating window suggestions
- chrono-nutrition coaching
- caffeine timing
- training-day meal windows

### Sleep Correlation

When sleep tracking exists, timing metrics can correlate with:

- sleep duration
- sleep quality
- bedtime
- wake time
- late meals before sleep

The current report structure is ready for this because metrics are date-based.

### Recovery And Training

Future recovery metrics can compare timing against:

- soreness
- readiness
- workout days
- late dinners after training
- long gaps before workouts

### Sizzle Memory

Future timing patterns can be saved into `ai_memories`, for example:

```text
User has better energy when their first meal is before 9 AM.
```

This is not automatic yet. Sizzle currently receives timing context directly from deterministic analytics.

## Limitations

- Meal times depend on when the user logs meals, which may not always match when they ate.
- There is no timezone preference yet.
- No sleep data is available yet.
- No normalized meal timestamp column exists in SQLite; timestamps are parsed from JSON.
- Report generation is user-triggered, not scheduled.
