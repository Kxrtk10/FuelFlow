# FuelFlow Future Features Analysis

## Purpose

This document analyzes the current FuelFlow codebase as a foundation for an AI-powered nutrition and wellbeing platform. It focuses on latent functionality, expansion opportunities, architectural bottlenecks, current data assets, immediately available insights, recommended database additions, and a ranked feature roadmap.

## 1. Features Already Partially Implemented But Not Fully Exposed In The UI

### 1. Server-Saved Meal Plans

Current state:

- Backend has a `meal_plans` table.
- Frontend calls `POST /api/plan/save` after plan generation.
- Meal plans are stored in SQLite as JSON.

Missing exposure:

- No `GET /api/plan/get`.
- No plan history UI.
- No ability to restore a saved plan on another device.
- No delete/update endpoint.

Why it matters:

- This is already 50 percent of a “saved plans” feature.
- The database table exists, but product behavior still depends mostly on `localStorage`.

Potential feature:

- “My Plans” history.
- Favorite a plan.
- Restore last generated plan after login.
- Compare old plan vs current plan.

### 2. Weight History

Current state:

- `fuelflow_weight_history` is stored in `localStorage`.
- Plan view has weight update and recalculation.
- Profile weight can be updated from the meal plan screen.

Missing exposure:

- No graph.
- No server sync.
- No weekly check-in flow.
- No trend insights.

Potential feature:

- Weight progress chart.
- “Your body is responding” weekly report.
- Adaptive calorie recalculation.
- Plateau detection.

### 3. Daily Mood Check-In

Current state:

- Home view asks “How are you feeling today?”
- Selected daily mood is stored in `localStorage`.
- If logs exist for today, daily mood can be attached to logs.

Missing exposure:

- No mood history view.
- No weekly mood trends.
- No correlation analysis with meals, alcohol, timing, or energy.

Potential feature:

- Mood calendar.
- Emotional eating pattern detection.
- “You tend to feel better on days when...” insights.

### 4. Sizzle Chat History

Current state:

- Current chat is stored in `fuelflow_sizzle_history`.
- Previous chat sessions are stored in `fuelflow_chat_sessions`.
- UI can show previous sessions.

Missing exposure:

- No server-side Sizzle memory.
- No long-term preference extraction.
- No “things Sizzle remembers about me” UI.
- No persistent cross-device chat memory.

Potential feature:

- Sizzle memory.
- Personal preference learning.
- “Remember this” and “Forget this” controls.
- Personalized coaching context.

### 5. Food Insight After Logging

Current state:

- After logging a meal, frontend calls `/api/food-insight`.
- Response includes:
  - what the food does
  - whether it fits the goal
  - next suggestion
- A motivational nudge is shown.

Missing exposure:

- Insights are temporary and disappear.
- Not saved to logs.
- No history of AI food insights.
- No “recommended next meal” workflow.

Potential feature:

- Save food insight per log.
- “Next best meal” card.
- Daily nutrition coaching timeline.

### 6. Alcohol Tracking

Current state:

- Log form captures whether alcohol was involved.
- Captures number of drinks.
- Today card shows a hydration/kindness note.
- Meal plan includes alcohol frequency and alcohol guidance.

Missing exposure:

- No weekly alcohol summary.
- No energy/sleep/mood relationship insights.
- No recovery plan beyond a simple note.

Potential feature:

- Alcohol impact dashboard.
- “Morning after” recovery guidance.
- Alcohol vs energy/mood trend.

### 7. Meal Timing

Current state:

- Every log has a timestamp.
- Meal plan meals have planned times.
- Food facts mention timing.

Missing exposure:

- No meal timing analysis.
- No consistency score.
- No late-night eating detection.
- No time-between-meals insights.

Potential feature:

- Meal rhythm dashboard.
- “Your energy dips when lunch is late” insight.
- Food timing coaching.

### 8. Streak Tracking

Current state:

- Consecutive meal logging streak is calculated from logs.
- Stored in `fuelflow_streak`.
- Displayed on Home.

Missing exposure:

- No streak history.
- No streak recovery mechanic.
- No habit calendar.
- No streak-based achievements.

Potential feature:

- Habit calendar.
- Streak milestones.
- “Restart with compassion” recovery UX.

### 9. Theme System

Current state:

- Fiery and Ocean themes exist.
- Theme persists to `localStorage`.

Missing exposure:

- No system theme support.
- No accessibility themes.
- No premium theme potential.

Potential feature:

- Calm mode.
- High contrast mode.
- Coach-branded themes.

### 10. Export Logs

Current state:

- Settings has “Export My Logs”.
- Downloads current frontend logs as JSON.

Missing exposure:

- No backend export.
- No CSV export.
- No coach-friendly report.
- No PDF weekly report.

Potential feature:

- Shareable coach report.
- PDF weekly summary.
- CSV data export.

## 2. Existing Components That Can Become Major Features With Minimal Engineering Effort

### Sizzle Chat -> Personal AI Coach

Why it is close:

- Chat UI exists.
- Backend endpoint exists.
- User profile is already passed into the prompt.
- Chat history exists locally.

Minimal expansion:

- Add server-side memory table.
- Add memory extraction after chat.
- Add “Sizzle remembers” settings panel.

Major feature unlocked:

- Long-term AI nutrition and wellbeing coach.

### Meal Logs -> Behavioral Insights Engine

Why it is close:

- Logs already include meal, mood before/after, energy, timestamp, alcohol, notes, and eaten status.
- Weekly insight endpoint already summarizes logs.

Minimal expansion:

- Add deterministic analytics before AI call.
- Generate structured metrics:
  - average energy by meal type
  - alcohol days vs non-alcohol days
  - meal timing consistency
  - mood uplift rate

Major feature unlocked:

- Personalized behavior dashboard.

### Daily Mood Check-In -> Wellbeing Tracker

Why it is close:

- Daily mood input exists.
- Mood storage exists.
- Home already has a check-in pattern.

Minimal expansion:

- Store daily mood on backend.
- Render mood history chart.
- Include mood in weekly insight prompt.

Major feature unlocked:

- Mental wellbeing layer.

### Meal Plan Generator -> Adaptive Nutrition Plan

Why it is close:

- Plan generation exists.
- Weight update and recalculation exist.
- Grocery checklist exists.
- “Log this meal” exists.

Minimal expansion:

- Add plan retrieval.
- Add adherence tracking.
- Compare planned vs logged meals.

Major feature unlocked:

- Adaptive meal planning subscription feature.

### Weight Check-In -> Progress Coaching

Why it is close:

- Weight update UI exists.
- Weight history is stored locally.
- Daily calories can be recalculated.

Minimal expansion:

- Move weight history to backend.
- Add chart.
- Add weekly AI interpretation.

Major feature unlocked:

- Transformation tracking.

### Explore Cards -> Educational Content Library

Why it is close:

- Expandable card system exists.
- Tone and content model exist.

Minimal expansion:

- Move content into JSON.
- Add categories.
- Add “save article” or “ask Sizzle about this”.

Major feature unlocked:

- Nutrition education hub.

### Settings/Profile -> User Control Center

Why it is close:

- Settings view exists.
- Profile edit and goal edit exist.
- Theme/account/data sections exist.

Minimal expansion:

- Add preferences:
  - dietary restrictions
  - sleep goals
  - smoking status
  - recovery priorities
  - coaching style

Major feature unlocked:

- Personalization hub.

## 3. Architecture Bottlenecks For Planned Expansion

### Current Bottleneck Summary

FuelFlow can support small feature additions quickly, but the current architecture will strain as the app becomes a broader wellbeing platform. The biggest constraints are:

- Single-file backend.
- Single-file frontend.
- JSON blobs instead of typed schemas.
- Heavy reliance on `localStorage`.
- Limited database normalization.
- No migrations.
- No analytics layer.
- No server-side event model.
- No test suite.

### Sleep Tracking Bottlenecks

Likely issues:

- No `daily_checkins` or `sleep_logs` table.
- Daily mood is local-only.
- Sleep should be tied to dates, not meal logs.
- No time-series abstraction.

Needed architecture:

- `sleep_logs` table.
- Daily date-based records.
- Sleep duration, quality, bedtime, wake time, interruptions.
- Correlation engine with meals, alcohol, energy, mood.

### Smoking Tracking Bottlenecks

Likely issues:

- No habit/event tracking model.
- Meal logs are the only repeated event type.
- Smoking events need timestamp, quantity, craving, trigger, context.

Needed architecture:

- Generic `habit_events` table or `smoking_logs` table.
- Trigger tags.
- Craving intensity.
- Mood before/after.
- Daily rollups.

### Recovery Tracking Bottlenecks

Likely issues:

- Current app has no recovery data model.
- Training/sport exists only in meal plan preferences.
- No soreness, rest, HRV, sleep, stress, hydration, or workout data.

Needed architecture:

- `recovery_logs`.
- Optional integrations later.
- Recovery score calculation.
- Link recovery to nutrition and sleep.

### Food Timing Tracking Bottlenecks

Likely issues:

- Logs have timestamps, but no backend query layer.
- Server stores logs as JSON text.
- Time-based analytics require parsing every JSON blob.

Needed architecture:

- Normalize `meal_logs` with columns:
  - `logged_at`
  - `meal_type`
  - `meal_name`
  - `energy`
  - `alcohol`
  - `drinks`
- Add indexes on `user_id, logged_at`.

### Sizzle Memory Bottlenecks

Likely issues:

- Chat history is local-only.
- Backend does not store chat messages or extracted memories.
- No memory privacy controls.
- No distinction between short-term chat history and durable facts.

Needed architecture:

- `chat_messages`.
- `ai_memories`.
- Memory types:
  - preference
  - goal
  - constraint
  - pattern
  - dislike
  - medical caution
- Memory review/delete UI.

### Behavioral Insights Bottlenecks

Likely issues:

- No analytics tables.
- No scheduled jobs.
- No materialized weekly summaries.
- AI prompts currently summarize raw logs directly.

Needed architecture:

- `daily_summaries`.
- `weekly_insights`.
- Deterministic metrics before AI.
- Insight storage and history.

### Community Features Bottlenecks

Likely issues:

- No public profile model.
- No privacy/privacy-level system.
- No moderation.
- No social graph.
- No content tables.

Needed architecture:

- `user_public_profiles`.
- `community_posts`.
- `comments`.
- `reactions`.
- `groups`.
- `reporting/moderation`.
- Strong privacy settings.

## 4. User Data Currently Being Collected

### Account Data

- Email.
- Password hash.
- Account creation timestamp.

### Profile / Onboarding Data

- Name.
- Age.
- Weight in kg.
- Height in cm.
- Biological sex.
- Goal.
- Activity level.
- Food relationship status.
- Body type.
- Current body fat range.
- Current body fat midpoint.
- Target body fat range.
- Target body fat midpoint.
- Daily calorie target.

### Meal Log Data

- Meal ID.
- Timestamp.
- Meal name.
- Meal type.
- Portion feel.
- Mood before eating.
- Mood after eating.
- Energy after eating.
- Notes.
- Daily mood if available.
- Alcohol involved.
- Number of drinks.
- Eaten checkbox status.

### Daily Mood Data

Stored locally:

- Date.
- Selected mood emoji.
- Timestamp.
- Dismissed date.

### Meal Plan Data

Stored locally and inserted server-side:

- Plan summary.
- Daily calories.
- Protein/carbs/fat targets.
- Plan type.
- Weekly goal.
- Seven day meal plan.
- Meal descriptions.
- Meal macros.
- Grocery list.
- Weekly tips.
- Alcohol guidance.
- Adjustment note.

### Sizzle Chat Data

Stored locally:

- Current chat history, last 20 messages.
- Previous chat sessions, last 5 sessions.
- Message role.
- Message content.
- Session timestamp.
- First user message preview.

### Preference / Settings Data

- Theme preference.
- Plan selections:
  - plan type
  - food preference
  - cuisine
  - budget
  - sport
  - alcohol frequency
- Grocery checklist state.

### Progress Data

Stored locally:

- Weight history.
- Streak value.

## 5. Valuable Insights Already Possible Without Collecting New Data

### Mood vs Meals

Available data:

- Meal name.
- Meal type.
- Mood before.
- Mood after.
- Timestamp.

Possible insights:

- Which meals most often improve mood.
- Which meal types produce neutral or negative shifts.
- Mood uplift rate by meal type.
- Emotional eating signals from notes and mood-before labels.

Example:

> Lunches with rice/dal are associated with improved mood 70 percent of the time, while late-night snacks are more often followed by low energy.

### Energy vs Alcohol

Available data:

- Alcohol boolean.
- Drink count.
- Energy score.
- Timestamp.

Possible insights:

- Average energy after alcohol-involved logs vs non-alcohol logs.
- Next-day logging behavior after alcohol.
- Drink count vs energy trend.

Example:

> On days with alcohol logged, your average energy is 2 points lower than your usual meal logs.

### Meal Consistency

Available data:

- Meal timestamps.
- Meal types.
- Log dates.

Possible insights:

- Number of meals logged per day.
- Most consistent meal.
- Skipped breakfast pattern.
- Late dinner pattern.
- Average first meal time.

Example:

> Your highest-energy days tend to have a first meal before 10 AM and at least three logged meals.

### Streak Behavior

Available data:

- Log timestamps.
- Streak calculation.

Possible insights:

- Current streak.
- Longest streak if historical streak tracking is added.
- Days when streaks usually break.
- Relationship between streak and average energy.

Example:

> When you log at least one meal, your average energy score is higher than on days you skip tracking.

### Emotional Eating Patterns

Available data:

- Mood before eating.
- Notes.
- Meal type.
- Time.
- Alcohol.

Possible insights:

- Stressed/tired meals by time of day.
- Foods commonly logged when mood before is stressed.
- Whether mood improves after eating.
- Late-night emotional eating patterns.

Example:

> Your stressed meals cluster in the evening, but mood often improves afterward. A planned evening snack may support you better than waiting until cravings spike.

### Energy by Meal Type

Available data:

- Meal type.
- Energy after eating.

Possible insights:

- Breakfast/lunch/dinner/snack average energy.
- Meal types that drag energy down.
- Drinks vs meals energy comparison.

### Portion Feel vs Energy

Available data:

- Portion feel.
- Energy.

Possible insights:

- “More than usual” and post-meal energy correlation.
- “Just right” as a positive consistency marker.

### Daily Mood vs Logging Behavior

Available data:

- Daily mood.
- Log count by date.

Possible insights:

- Whether low-mood days have fewer logs.
- Whether logging itself is associated with better daily mood.

### Goal Alignment

Available data:

- User goal.
- Meal type/log frequency.
- Energy.
- Body profile.

Possible insights:

- “Your current tracking rhythm supports maintenance but may be too inconsistent for fat loss.”
- “You are logging enough meal data for Sizzle to start spotting patterns.”

### Meal Plan Adherence

Available data:

- Generated plan.
- Logged meals.
- “Log this meal” button source notes.

Possible insights:

- Planned meals logged vs skipped.
- Most followed meal types.
- Plan adherence by day.

Limitation:

- Current logged meal does not store a formal `planned_meal_id`; it only adds text in notes.

## 6. Database Tables To Add Now To Avoid Future Migrations

These tables create a future-proof wellbeing platform foundation.

### `daily_checkins`

Purpose:

- Central daily record for mood, energy, sleep, stress, cravings, recovery.

Suggested schema:

```sql
CREATE TABLE daily_checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  checkin_date DATE NOT NULL,
  mood TEXT,
  energy INTEGER,
  stress INTEGER,
  hunger INTEGER,
  cravings INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, checkin_date),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### `sleep_logs`

Purpose:

- Sleep tracking and sleep-food-energy correlations.

Suggested schema:

```sql
CREATE TABLE sleep_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  sleep_date DATE NOT NULL,
  bedtime TIMESTAMP,
  wake_time TIMESTAMP,
  duration_minutes INTEGER,
  quality INTEGER,
  interruptions INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### `habit_events`

Purpose:

- Generic foundation for smoking, cravings, caffeine, supplements, hydration, alcohol, workouts.

Suggested schema:

```sql
CREATE TABLE habit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  event_time TIMESTAMP NOT NULL,
  quantity REAL,
  unit TEXT,
  intensity INTEGER,
  trigger TEXT,
  context TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Examples:

- `smoking`
- `caffeine`
- `alcohol`
- `water`
- `craving`
- `workout`
- `medication`

### `recovery_logs`

Purpose:

- Recovery, soreness, readiness, hydration, rest day tracking.

Suggested schema:

```sql
CREATE TABLE recovery_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  log_date DATE NOT NULL,
  soreness INTEGER,
  fatigue INTEGER,
  readiness INTEGER,
  hydration INTEGER,
  resting_heart_rate INTEGER,
  hrv REAL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### `chat_messages`

Purpose:

- Server-side Sizzle chat history.

Suggested schema:

```sql
CREATE TABLE chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### `ai_memories`

Purpose:

- Long-term Sizzle memory with user control.

Suggested schema:

```sql
CREATE TABLE ai_memories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  memory_type TEXT NOT NULL,
  memory_text TEXT NOT NULL,
  confidence REAL DEFAULT 1.0,
  source TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### `insight_reports`

Purpose:

- Store weekly insights and analytics snapshots.

Suggested schema:

```sql
CREATE TABLE insight_reports (
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

### `meal_plan_versions`

Purpose:

- Replace write-only `meal_plans` behavior with versioning.

Suggested schema:

```sql
CREATE TABLE meal_plan_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan_data TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### `planned_meal_logs`

Purpose:

- Connect generated plan meals to logged meals.

Suggested schema:

```sql
CREATE TABLE planned_meal_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan_id INTEGER,
  planned_day TEXT,
  planned_meal_type TEXT,
  planned_meal_name TEXT,
  logged_meal_id INTEGER,
  status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### `community_posts`

Purpose:

- Foundation for community features.

Suggested schema:

```sql
CREATE TABLE community_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  post_type TEXT NOT NULL,
  content TEXT NOT NULL,
  visibility TEXT DEFAULT 'public',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### `user_privacy_settings`

Purpose:

- Required before community, memory, coach dashboards, or sensitive tracking.

Suggested schema:

```sql
CREATE TABLE user_privacy_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  share_progress INTEGER DEFAULT 0,
  share_logs INTEGER DEFAULT 0,
  ai_memory_enabled INTEGER DEFAULT 1,
  community_profile_enabled INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 7. Top 10 Highest-Impact Features Ranked By ROI

ROI ranking considers:

- How much user value the feature creates.
- How much of the implementation already exists.
- Monetization potential.
- Technical risk.
- Dependencies.

## Ranked Feature Roadmap

### 1. Behavioral Insights Dashboard

Summary:

Turn existing meal, mood, energy, alcohol, and timing data into a dashboard of patterns before asking AI to summarize them.

Development effort:

- Medium.

User impact:

- Very high.

Monetization potential:

- High. This can be a premium “advanced insights” feature.

Technical complexity:

- Medium.

Dependencies:

- Existing meal logs.
- Existing profile data.
- Basic deterministic analytics functions.
- Optional `insight_reports` table.

Why high ROI:

- Uses data already collected.
- Makes FuelFlow feel intelligent without needing new tracking flows.
- Improves the quality of Sizzle and weekly insights.

Suggested MVP:

- Mood uplift percentage.
- Average energy by meal type.
- Alcohol vs energy.
- Meal consistency.
- Late-night logging count.
- AI summary of these metrics.

### 2. Saved Meal Plan History And Restore

Summary:

Expose already-saved meal plans in the UI and allow users to restore previous plans.

Development effort:

- Low.

User impact:

- High.

Monetization potential:

- High. Meal planning is one of the strongest premium candidates.

Technical complexity:

- Low to medium.

Dependencies:

- Existing `meal_plans` table.
- Add `GET /api/plan/get`.
- Add active/latest plan logic.

Why high ROI:

- Backend storage already exists.
- Current missing retrieval is a clear product gap.

Suggested MVP:

- Load latest plan on login.
- “Previous Plans” list.
- “Make Active” button.
- Delete old plan.

### 3. Sizzle Memory

Summary:

Give Sizzle persistent memory of user preferences, patterns, goals, and constraints.

Development effort:

- Medium.

User impact:

- Very high.

Monetization potential:

- Very high. Persistent AI coaching is a premium platform feature.

Technical complexity:

- Medium to high.

Dependencies:

- `chat_messages` table.
- `ai_memories` table.
- Memory review/delete UI.
- Privacy setting for AI memory.

Why high ROI:

- Sizzle already exists and is a major differentiator.
- Memory makes the assistant feel dramatically more personal.

Suggested MVP:

- Store chat messages.
- Extract memories after conversations.
- Inject top active memories into `/api/chat`.
- Settings panel: “What Sizzle remembers”.

### 4. Weekly AI Progress Report

Summary:

Generate a weekly report combining meals, mood, alcohol, streak, energy, weight, and meal plan adherence.

Development effort:

- Medium.

User impact:

- High.

Monetization potential:

- High. Weekly reports can be premium or coach-facing.

Technical complexity:

- Medium.

Dependencies:

- Existing logs.
- Existing insights endpoint.
- Optional `insight_reports` table.

Why high ROI:

- Extends current weekly insight into a more complete product loop.

Suggested MVP:

- “Your Week” page.
- 5 metrics.
- AI explanation.
- 3 next-week actions.
- Save report history.

### 5. Food Timing Coach

Summary:

Analyze when the user eats and how timing relates to energy and mood.

Development effort:

- Low to medium.

User impact:

- High.

Monetization potential:

- Medium to high.

Technical complexity:

- Low to medium.

Dependencies:

- Existing meal timestamps.
- Existing energy/mood data.
- Better normalized logs later.

Why high ROI:

- No new data needed.
- Timing insights are understandable and actionable.

Suggested MVP:

- First meal time.
- Dinner time.
- Long gaps between meals.
- Late-night logs.
- Energy correlation.

### 6. Weight Progress And Adaptive Calories

Summary:

Turn the existing weight update into a proper progress system with charts and adaptive calorie recommendations.

Development effort:

- Medium.

User impact:

- High.

Monetization potential:

- High.

Technical complexity:

- Medium.

Dependencies:

- Move `fuelflow_weight_history` to backend.
- Add chart UI.
- Add recalculation logic.

Why high ROI:

- Weight tracking already exists locally.
- Ties directly to transformation outcomes.

Suggested MVP:

- Weekly weight check-in.
- Weight trend chart.
- “Adjust calories?” recommendation.
- Plateau detection.

### 7. Sleep And Recovery Check-In

Summary:

Add daily sleep and recovery tracking to connect food with readiness, energy, cravings, and mood.

Development effort:

- Medium.

User impact:

- High.

Monetization potential:

- Medium to high.

Technical complexity:

- Medium.

Dependencies:

- `daily_checkins`.
- `sleep_logs`.
- `recovery_logs`.
- New Home check-in widgets.

Why high ROI:

- Expands FuelFlow from nutrition app to wellbeing platform.
- Sleep is strongly tied to cravings, energy, and food choices.

Suggested MVP:

- Sleep duration.
- Sleep quality.
- Recovery/readiness 1-10.
- “How sleep affected your food today” insight.

### 8. Plan Adherence Tracking

Summary:

Connect generated meal plans to actual meal logs so the app can show how closely users followed their plan.

Development effort:

- Medium.

User impact:

- Medium to high.

Monetization potential:

- High.

Technical complexity:

- Medium.

Dependencies:

- Saved plans retrieval.
- Planned meal identifiers.
- `planned_meal_logs`.

Why high ROI:

- Makes meal plans more than static AI output.
- Enables accountability and coach features.

Suggested MVP:

- “Log this meal” stores planned meal metadata.
- Daily adherence percentage.
- Weekly adherence summary.
- Sizzle adjustment suggestions.

### 9. Smoking / Craving Tracker

Summary:

Add habit event tracking for smoking, cravings, and triggers.

Development effort:

- Medium.

User impact:

- Medium to high for the right audience.

Monetization potential:

- Medium.

Technical complexity:

- Medium.

Dependencies:

- `habit_events`.
- Trigger taxonomy.
- Sensitive-data privacy wording.

Why ROI is lower than nutrition-first features:

- It broadens the product category.
- It may require more careful UX and privacy handling.

Suggested MVP:

- Quick log craving/smoking event.
- Trigger tag.
- Mood before/after.
- Weekly trigger insight.

### 10. Community Stories And Accountability

Summary:

Add opt-in community posts, progress stories, and supportive accountability.

Development effort:

- High.

User impact:

- Potentially high.

Monetization potential:

- Medium to high.

Technical complexity:

- High.

Dependencies:

- Public profile model.
- Privacy settings.
- Moderation.
- Reporting.
- Community tables.

Why lower ROI initially:

- Community can create strong retention, but moderation and privacy are non-trivial.

Suggested MVP:

- Read-only curated community stories.
- Later: opt-in anonymous wins.
- Then: groups and comments.

## Shortest Path Platform Strategy

Recommended build order:

1. Saved meal plan retrieval.
2. Behavioral insights dashboard.
3. Weekly AI progress report.
4. Sizzle memory.
5. Weight progress and adaptive calories.
6. Food timing coach.
7. Sleep and recovery check-in.
8. Plan adherence tracking.
9. Habit/smoking/craving tracker.
10. Community features.

## Key Architectural Recommendation

Before adding sleep, smoking, recovery, Sizzle memory, behavioral insights, or community, add three platform primitives:

1. `daily_checkins`
2. `habit_events`
3. `ai_memories`

These tables will prevent the app from forcing every new wellbeing feature into meal-log JSON blobs or localStorage.

## Highest Priority Engineering Work Before New Features

1. Remove unreachable meal-plan code in `main.py`.
2. Add server retrieval for meal plans.
3. Move weight history and daily mood from localStorage to backend.
4. Add typed Pydantic models for profile, logs, and plans.
5. Add tests for auth, profile, logs, and meal plan generation.
6. Centralize Anthropic model/config.
7. Make AI endpoint authentication consistent.
8. Update stale `README.md`.

