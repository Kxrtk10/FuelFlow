# FuelFlow Phase 3.5: Product Consolidation

## Purpose

Phase 3.5 improves clarity, retention, and user experience without adding another major tracking system.

The product already had strong engines:

- Behavioral analytics.
- Food timing.
- Sleep and recovery.
- Habit intelligence.
- Drink Smarter.
- Meal planning.
- Sizzle memory.

The problem was fragmentation. Users had too many separate report buttons, meal plans were saved but not restored, and Sizzle was powerful but not connected enough to decision points.

Phase 3.5 consolidates the product around a simpler loop:

```text
Daily pulse -> one recommended action -> weekly report -> plan adjustment -> Sizzle guidance
```

## 1. Unified Weekly Report

### What Changed

The Insights page now exposes a single primary weekly report experience:

- Overview
- Food & Mood
- Timing
- Recovery
- Habits
- Social Balance

There is one primary generation action:

```text
Generate Weekly Report
```

There is one report history:

```text
Report history
```

The older individual report sections remain in code for compatibility, but they are hidden from the main user-facing flow.

### Backend

New endpoint:

```http
POST /api/weekly-report/generate
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
  "focus": "string",
  "actions": ["string", "string", "string"]
}
```

History endpoint:

```http
GET /api/weekly-report/history
```

Reports are stored in `insight_reports` with:

```text
report_type = unified_weekly
```

### Metric Composition

The unified report aggregates existing deterministic engines:

- `build_behavioral_metrics`
- `build_food_timing_metrics`
- `build_sleep_recovery_metrics`
- `build_habit_metrics`
- `build_social_balance_metrics`
- `build_plan_adherence_metrics`

AI is used only for interpretation after metrics are calculated.

### Sizzle Summary

The unified report produces one Sizzle-style summary plus:

- one next-week focus
- three practical next actions

This replaces the feeling of six separate AI summaries competing for attention.

## 2. Meal Plan Retrieval

### What Changed

Meal plans are no longer localStorage-only.

The app now supports:

- restoring the latest meal plan from the server
- viewing previous saved meal plans
- restoring an older meal plan
- syncing meal plans across devices

### Backend

Existing table reused:

```sql
meal_plans
```

Updated save endpoint:

```http
POST /api/plan/save
```

Now returns:

```json
{
  "ok": true,
  "plan_id": 1,
  "created_at": "timestamp"
}
```

New endpoints:

```http
GET /api/plan/latest
GET /api/plan/history
```

Server plans are returned with metadata:

- `_server_id`
- `_created_at`

### Frontend

On authenticated load:

1. App loads the latest server plan.
2. If found, it writes it into localStorage for fast rendering.
3. It loads plan history.
4. It loads plan adherence state.

LocalStorage remains as a fallback cache, but the server is now the recovery source.

## 3. Plan Adherence System

### Purpose

Meal plans become useful when FuelFlow can see how they are followed.

Phase 3.5 adds lightweight adherence tracking without adding a new logging flow.

Users can mark each planned meal as:

- eaten
- swapped
- skipped

This is supportive, not punitive. Swaps count as follow-through because flexibility is part of sustainability.

### Database

New table:

```sql
CREATE TABLE IF NOT EXISTS plan_adherence (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan_id INTEGER,
  plan_created_at TEXT,
  day TEXT,
  meal_index INTEGER,
  meal_name TEXT,
  meal_type TEXT,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, plan_id, plan_created_at, day, meal_index),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (plan_id) REFERENCES meal_plans(id)
);
```

### API

Save/update status:

```http
POST /api/plan/adherence
```

Request:

```json
{
  "plan_id": 1,
  "plan_created_at": "timestamp",
  "day": "Monday",
  "meal_index": 0,
  "meal_name": "Paneer poha",
  "meal_type": "Breakfast",
  "status": "eaten"
}
```

Load adherence:

```http
GET /api/plan/adherence?plan_id=1&days=90
```

### Metrics

The backend calculates:

- total marked meals
- eaten count
- swapped count
- skipped count
- adherence rate
- swap rate
- skipped rate
- meal-type patterns
- adherence insights

Formula:

```text
adherence_rate = (eaten + swapped) / total_marked * 100
```

Swapped meals count positively because they show adaptation, not failure.

## 4. Sizzle Everywhere

### What Changed

Contextual Sizzle actions are now available from high-value decision points:

- Unified weekly report
- Meal plan summary
- Individual meal plan cards
- Recommended Home action

Prompt actions include:

- Ask Sizzle About This
- Why Does This Matter?
- What Should I Do Next?
- Ask Sizzle to Swap

### Frontend Pattern

Buttons use:

```html
data-sizzle-prompt="..."
```

The shared handler:

1. switches to the Sizzle tab
2. pre-fills the prompt
3. focuses the input

This makes Sizzle feel like the interpretation layer across the app, not just a standalone chat tab.

## 5. Home Simplification

### What Changed

Home now prioritizes:

1. Daily Pulse
2. One recommended action
3. Daily wellbeing check-in
4. Quick actions

Secondary surfaces are collapsed behind:

```text
More FuelFlow tools and learning
```

Collapsed content includes:

- habit quick log
- Drink Smarter planner
- today's insight card
- motivation
- learning cards
- cuisine spotlight
- community story

Nothing was removed; the page is simply less overwhelming by default.

### Recommended Action Logic

Home recommends:

- daily wellbeing check-in if it is missing
- meal logging if no meals are logged today
- Sizzle next-step guidance if the user has already created signals today

This makes Home feel more like a coach opening with one clear suggestion.

## 6. Compatibility Decisions

### Old Reports

Old report endpoints remain available:

- `/api/analytics/report`
- `/api/timing/report`
- `/api/recovery/report`
- `/api/habits/report`
- `/api/social/report`

The UI hides their separate dashboards in the main Insights flow.

Reason:

- Avoid breaking existing code.
- Keep advanced section renderers available for future reuse.
- Reduce user-facing clutter immediately.

### LocalStorage

LocalStorage still caches:

- latest meal plan
- grocery checks
- plan selections

Server retrieval now restores the latest plan when available.

Reason:

- Fast rendering.
- Offline-ish resilience.
- No destructive migration.

## 7. Current Limitations

- Unified report generation still happens on demand, not automatically.
- Old individual report code remains and should be cleaned up later.
- Plan adherence is based on planned meal index/day, not immutable meal IDs.
- Meal plan history has restore but not delete.
- Sizzle prompt buttons pre-fill the message but do not auto-send it.
- Home secondary content is collapsed globally, not yet personalized by user behavior.

## 8. Recommended Next Cleanup

1. Remove hidden legacy report UI after confidence period.
2. Add `/api/plan/delete` or archive support.
3. Give generated meals stable IDs.
4. Add “send now” option for Sizzle contextual prompts.
5. Auto-generate weekly report when enough signals exist.
6. Add unified report comparison: “what changed since last week?”
7. Personalize Home secondary modules:
   - hide Drink Smarter for non-drinkers
   - show Habit Quick Log for habit users
   - show Plan adherence for users with an active plan

## Product Impact

Phase 3.5 makes FuelFlow feel more coherent:

- One weekly report instead of many report generators.
- Meal plans return across devices.
- Meal plans now have follow-through data.
- Sizzle appears where decisions happen.
- Home feels calmer and more actionable.

The product is now closer to a coach than a dashboard collection.
