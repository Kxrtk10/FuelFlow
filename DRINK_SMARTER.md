# Drink Smarter & Social Eating Assistant

## Purpose

Drink Smarter helps FuelFlow users enjoy social events while staying aligned with their goals. It is not an abstinence feature and it does not shame drinking, eating out, weddings, vacations, parties, or celebrations.

The system turns alcohol, social context, sleep, recovery, habit, and meal timing data into practical guidance:

- What to eat before going out.
- How to choose drinks with awareness.
- How to hydrate and pace the night.
- How to recover the next day.
- How social events fit into long-term consistency.

## Design Principles

- No shame.
- No guilt-based language.
- Real-world flexibility.
- Education first.
- Sustainable habits over perfect decisions.
- Deterministic calculations first, AI interpretation second.

## Backend Architecture

The implementation lives in `main.py` and reuses existing platform primitives:

- `habit_events` for alcohol history.
- `meal_logs` for alcohol-involved meal logs.
- `daily_checkins`, `sleep_logs`, and `recovery_logs` for next-day impact.
- `insight_reports` for saved weekly social balance reports.
- Sizzle prompt context for conversational guidance.

No new database table was required for the first version. Drink reference data is stored as an in-code dictionary because it is small, stable, and versionable with the app.

## Drink Reference Model

`DRINK_REFERENCE` supports:

- beer
- wine
- whiskey
- vodka
- gin
- rum
- cocktails

Each drink includes:

- `label`
- `serving`
- `estimated_calories`
- `alcohol_content`
- `goal_compatibility_score`
- `lower_calorie_alternatives`
- `goal_friendly_alternatives`
- `hydration_recommendation`

The estimates are intentionally approximate. They are used for planning and education, not precision tracking.

## Social Event Planner

Endpoint:

```http
POST /api/social/plan
```

Auth:

- Requires Bearer token.

Request:

```json
{
  "event_type": "drinks with friends",
  "drink_type": "beer",
  "planned_drinks": 2,
  "event_date": "2026-06-22",
  "context": "dinner and drinks",
  "user_profile": {}
}
```

Response:

```json
{
  "event_type": "drinks with friends",
  "planned_drinks": 2,
  "estimated_calorie_impact": 300,
  "selected_drink": {},
  "before_event": [],
  "during_event": [],
  "after_event": [],
  "smart_meal_adjustments": [],
  "alternatives": {
    "lower_calorie": [],
    "goal_friendly": []
  },
  "supportive_note": "",
  "recent_pattern": {}
}
```

The planner is deterministic and fast. It combines:

- Selected event type.
- Selected drink type.
- Planned drink quantity.
- User goal.
- Recent alcohol signals.
- Sleep and recovery data.
- Meal timing consistency.
- Habit intelligence signals.

## Planner Workflow

### Before Event

Guidance includes:

- Protein-forward meal.
- Hydration before leaving.
- Avoiding very long meal gaps before social decisions.
- Goal-aware adjustment for fat loss, muscle gain, energy, or maintenance.

### During Event

Guidance includes:

- Estimated calories per serving.
- Hydration and pacing.
- Food choices that still allow enjoyment.
- Low-sugar mixer or simpler drink alternatives when useful.

### After Event

Guidance includes:

- Next-day hydration.
- Protein-rich recovery meal.
- Sleep support.
- A supportive reset message.

## Weekly Social Balance Report

Endpoint:

```http
POST /api/social/report
```

Auth:

- Requires Bearer token.

Request:

```json
{
  "days": 7
}
```

The report is stored in `insight_reports` with:

```text
report_type = "social_balance"
```

History endpoint:

```http
GET /api/social/reports
```

## Deterministic Metrics

### Drinking Frequency

Counts unique days in the analysis period with alcohol signals from:

- `habit_events.event_type = alcohol`
- Meal logs where `alcohol = true`

Output:

- `drinking_frequency_days`
- `drinking_frequency_label`

### Estimated Calorie Impact

For each alcohol signal:

```text
estimated calories = drink reference calories * quantity
```

When drink type is unclear, beer is used as a conservative default.

Output:

- `estimated_calorie_impact`
- `drink_breakdown`
- `top_drink`

### Recovery Quality

Looks at the day after logged alcohol signals and calculates:

- Average next-day energy.
- Average next-day recovery score.
- Average next-day sleep quality.
- Energy on alcohol-free check-in days.

Output:

- `recovery_quality.average_next_day_energy`
- `recovery_quality.average_next_day_recovery`
- `recovery_quality.average_next_day_sleep_quality`
- `recovery_quality.alcohol_free_energy`

### Goal Alignment Score

Starts from 100 and adjusts based on:

- Drinking frequency.
- Estimated calorie impact.
- Drink compatibility score.
- Next-day energy impact.

Output:

- `goal_alignment_score`

The score is not a moral grade. It is a planning signal.

### Improvement Opportunities

Generated deterministically from:

- Drinking frequency.
- Calorie impact.
- Next-day energy.
- Recovery signals.

Examples:

- Eat a protein-forward meal before social events.
- Use low-sugar mixers or alternate with water.
- Plan a next-day recovery breakfast before the night starts.

## AI Interpretation

The weekly report uses Claude only after deterministic metrics are calculated.

The AI prompt instructs Sizzle/FuelFlow to:

- Interpret calculated metrics.
- Not invent numbers.
- Avoid shame, moralizing, or guilt-based wording.
- Give before, during, and after actions.
- Keep the tone practical and supportive.

If the AI call fails, FuelFlow returns a deterministic fallback summary and suggestions.

## Sizzle Integration

Sizzle now receives a compact social balance context:

- Social drinking frequency.
- Estimated calorie impact.
- Most common drink signal.
- Goal alignment score.
- Next-day energy after alcohol.
- Alcohol-free energy.

This allows Sizzle to answer:

- “What should I eat before drinking?”
- “What is the lowest-calorie drink?”
- “How do I recover tomorrow?”
- “How do I stay aligned with my goals tonight?”

Sizzle is also instructed to handle parties, weddings, vacations, dinner outings, and social eating with flexible, non-shaming guidance.

## Frontend UI

### Home Planner

Home includes a new Drink Smarter & Social Eating card.

Users can choose:

- Event type.
- Drink type.
- Planned drinks.
- Context.

The result shows:

- Estimated calorie impact.
- Alcohol content and compatibility score.
- Before, during, and after guidance.
- Smart meal adjustments.
- Lower-calorie swaps.
- Goal-friendly options.

### Insights Report

Insights includes a Social Balance dashboard with:

- Goal alignment score.
- Drinking frequency.
- Estimated calorie impact.
- Drink breakdown.
- Next-day energy.
- Recovery quality.
- Improvement opportunities.
- Saved report history.

## Future Opportunities

### Drink Smarter

- Personalized drink limits by goal and recovery trend.
- Saved favorite drinks.
- Venue-specific ordering guidance.
- Better calorie database.

### Social Eating Guidance

- Restaurant meal strategy.
- Wedding buffet strategy.
- Vacation meal rhythm.
- Late-night food recovery planning.

### Alcohol Recovery Planning

- Next-day hydration protocol.
- Sleep protection suggestions.
- Workout adjustment suggestions.
- Craving-aware meal planning.

### Meal Plan Integration

- Automatically adjust the weekly meal plan around a planned social night.
- Add a “social night” marker to meal plans.
- Suggest lighter meals before and recovery meals after.

### Habit Intelligence Integration

- Detect whether drinking clusters around stress, low sleep, social triggers, or long meal gaps.
- Recommend replacement strategies only when the user wants them.

### Coach / Premium Features

- Weekly social balance report export.
- Coach-facing social event notes.
- Adaptive planning for athletes, students, and busy professionals.
