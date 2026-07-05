# FuelFlow Analytics Engine

## Purpose

The Behavioral Insights Dashboard makes FuelFlow feel intelligent by using data the app already collects. The engine calculates objective metrics first, then asks AI only to interpret those metrics in a warm, practical tone.

AI does not calculate the numbers. It receives the completed metric payload and writes a supportive summary plus three next-step recommendations.

## Data Sources

The dashboard currently uses existing user data only:

- Meal log timestamp
- Meal type
- Mood before eating
- Mood after eating
- Energy score after eating
- Alcohol flag
- Number of drinks
- Profile goal
- Activity level
- Body type
- Daily calorie target

No new tracking flows are required.

## Backend Flow

Endpoint:

```text
POST /api/analytics/report
```

Authentication:

- Requires `Authorization: Bearer <token>`.

Process:

1. Load the authenticated user's meal logs from `meal_logs`.
2. Load the user's profile from `user_profiles`.
3. Filter logs to the last 7 days by default.
4. Normalize timestamps and log fields.
5. Calculate deterministic metrics in Python.
6. Send the metric payload and profile summary to Claude for interpretation only.
7. Store the report in `insight_reports`.
8. Return the saved report to the frontend.

History endpoint:

```text
GET /api/analytics/reports
```

This returns the 12 most recent behavioral dashboard reports.

## Database Storage

Reports are stored in:

```sql
CREATE TABLE IF NOT EXISTS insight_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  report_type TEXT NOT NULL,
  metrics_data TEXT,
  insight_text TEXT,
  facts_data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

For Behavioral Insights Dashboard reports:

- `report_type`: `behavioral_dashboard`
- `metrics_data`: full deterministic metric JSON
- `insight_text`: AI-written summary
- `facts_data`: JSON array of AI-written recommendations

## Reporting Window

Default period:

- Last 7 calendar days, including today.

The backend accepts a `days` value, but clamps it between:

- Minimum: 1 day
- Maximum: 30 days

Current frontend sends:

```json
{ "days": 7 }
```

## Metric 1: Mood Uplift Percentage

Purpose:

Shows how often eating is followed by a better reported mood.

Inputs:

- `moodBefore.label`
- `moodAfter.label`

Mood scoring:

```text
Stressed = 1
Angry    = 1
Tired    = 2
Neutral  = 3
Good     = 4
Happy    = 5
```

Formula:

```text
mood_uplift_percentage =
  count(logs where mood_after_score > mood_before_score)
  / count(logs with both mood scores)
  * 100
```

Also calculated:

```text
same_or_better_percentage =
  count(logs where mood_after_score >= mood_before_score)
  / count(logs with both mood scores)
  * 100
```

Limitations:

- Mood labels outside the known set are ignored.
- This is correlation, not proof that the meal caused the mood change.

## Metric 2: Average Energy By Meal Type

Purpose:

Shows which meal types tend to support energy best.

Inputs:

- `mealType`
- `energy`

Formula:

```text
average_energy_for_meal_type =
  sum(energy scores for that meal type)
  / count(logs for that meal type)
```

Output example:

```json
[
  { "meal_type": "Breakfast", "average_energy": 7.2, "count": 4 },
  { "meal_type": "Lunch", "average_energy": 6.8, "count": 5 }
]
```

Limitations:

- Energy is user-reported.
- Meal type accuracy depends on what the user selects.

## Metric 3: Alcohol Impact Analysis

Purpose:

Shows whether alcohol-involved logs are associated with lower or higher energy.

Inputs:

- `alcohol`
- `drinks`
- `energy`

Calculated fields:

```text
alcohol_logs
total_drinks
average_energy_with_alcohol
average_energy_without_alcohol
energy_delta
```

Formula:

```text
energy_delta =
  average_energy_with_alcohol - average_energy_without_alcohol
```

Interpretation:

- Negative delta: alcohol logs are associated with lower energy.
- Positive delta: alcohol logs are associated with higher energy.
- Zero: not enough contrast or no difference.

Limitations:

- Current system compares meal logs, not full next-day recovery.
- Sleep is not tracked yet, so delayed alcohol effects are not captured.

## Metric 4: Meal Consistency Score

Purpose:

Measures whether the user is showing up regularly and logging enough structure to reveal patterns.

Inputs:

- Log dates
- Meal count per active day
- Presence of core meal types

Components:

```text
coverage_score = days_logged / days_analyzed
meal_frequency_score = min(meals_per_active_day / 3, 1)
core_meal_score = days_with_breakfast_lunch_or_dinner / days_analyzed
```

Formula:

```text
meal_consistency_score =
  coverage_score * 50
  + meal_frequency_score * 35
  + core_meal_score * 15
```

Rounded to a 0-100 score.

Why this weighting:

- Showing up across the week matters most.
- Logging enough meals per active day matters second.
- Logging at least one core meal type adds confidence.

Limitations:

- A user can eat consistently but not log consistently.
- This score measures app-observed consistency, not perfect real-world eating.

## Metric 5: Late-Night Eating Detection

Purpose:

Detects late eating patterns that may relate to energy, alcohol, cravings, or inconsistent meal rhythm.

Inputs:

- Meal log timestamp

Definition:

```text
Late-night window = 10 PM to 4 AM
```

Formula:

```text
late_night_percentage =
  late_night_log_count / total_logs * 100
```

Output:

```json
{
  "count": 2,
  "percentage": 18,
  "threshold": "10 PM to 4 AM"
}
```

Limitations:

- Timezone is inferred from the runtime environment/browser-generated timestamps.
- Late-night eating is not framed as wrong. It is treated as a pattern worth noticing.

## Metric 6: Goal Alignment Score

Purpose:

Combines the strongest existing signals into a single goal-support score.

Inputs:

- Average energy
- Mood stability
- Meal consistency
- Alcohol frequency/drinks
- Late-night eating percentage
- User goal

Formula:

```text
energy_points = average_energy * 4
mood_points = same_or_better_mood_percentage * 0.2
consistency_points = meal_consistency_score * 0.35
alcohol_penalty = min(15, alcohol_log_ratio * 20 + total_drinks)
late_penalty = min(15, late_night_percentage * 0.2)

goal_alignment_score =
  energy_points
  + mood_points
  + consistency_points
  - alcohol_penalty
  - late_penalty
```

The result is clamped between 0 and 100.

Goal-specific note:

- Weight loss: emphasizes consistency, alcohol awareness, and late-night patterns.
- Muscle gain: emphasizes regular meals and steady energy.
- Improve energy: emphasizes energy stability and meal rhythm.
- Other goals: emphasizes consistency and awareness.

Limitations:

- This is an early composite score.
- It does not yet include actual calories, macros, sleep, training, or weight trend.
- The score should be treated as directional, not diagnostic.

## Metric 7: Personalized AI Summary

Purpose:

Turns calculated data into a human, supportive interpretation.

AI receives:

- User profile summary
- Deterministic metric JSON

AI returns:

```json
{
  "summary": "warm weekly interpretation",
  "recommendations": ["action 1", "action 2", "action 3"]
}
```

System boundaries:

- AI must not invent numbers.
- AI must not recalculate metrics.
- AI must not shame the user.
- AI must avoid terms like cheat meal, bad food, guilt, failure, punishment, sin, or dirty eating.

Fallback:

If the AI call fails, FuelFlow still returns a deterministic fallback summary and three practical recommendations.

## Frontend UI

The dashboard lives inside the existing Insights tab.

Main UI areas:

- Generate Weekly Report button
- Empty state for fewer than 3 logs
- Loading state
- Metric cards
- Personalized AI summary card
- Recommendation pills
- Previous reports list

The existing weekly reflection and Sizzle chat remain unchanged below the dashboard.

## Current Limitations

- Reports are generated on demand, not scheduled.
- Logs are still stored as JSON blobs in `meal_logs`.
- Daily mood is partly local-only.
- Weight history is local-only.
- No charts yet.
- No server-side trend summaries.
- No plan adherence score yet.

## Future Improvements

Recommended next upgrades:

1. Add charts for mood, energy, and consistency.
2. Normalize meal logs into queryable columns.
3. Add `daily_checkins` for mood, sleep, stress, and recovery.
4. Add planned-meal linkage for meal plan adherence.
5. Store Sizzle memories and use them in report interpretation.
6. Generate weekly reports automatically.
7. Add coach-shareable PDF summaries.
