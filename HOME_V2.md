# FuelFlow Home V2

## Purpose

Home V2 turns FuelFlow from a tracker-style landing screen into a daily nutrition and wellbeing hub. The page is designed to feel like opening a supportive coach every morning: clear, calm, personal, and action-oriented.

FuelFlow is not positioned as a calorie tracker here. It is an AI-powered nutrition and wellbeing companion that helps the user notice patterns, stay accountable, learn something useful, and take one small next step.

Home answers four questions:

1. How am I doing today?
2. What should I focus on today?
3. What can I learn today?
4. What is one small action I can take right now?

## Data Used

Home V2 uses existing data only:

- User profile
- Goal
- Activity level
- Food relationship answer
- Meal logs
- Mood before meals
- Mood after meals
- Energy scores
- Alcohol flags
- Meal timestamps
- Daily mood check-in
- Streak calculation
- Former Explore content

No new tracking flows were added.

## Section 1: Daily Pulse

Purpose:

Daily Pulse is the new hero section. It gives the user a quick emotional and behavioral snapshot without making the page feel like a spreadsheet.

Displayed:

- Greeting
- Current streak
- Today's mood
- Average energy today
- Today's focus
- Quick Sizzle check-in button

How it supports the mission:

- Makes the app feel personal immediately.
- Reinforces food, mood, and energy as connected signals.
- Encourages a small daily check-in instead of perfection.
- Gives Sizzle a clear role as the user's active companion.

Calculation logic:

- Today's logs are filtered by local date.
- Energy is averaged from today's meal logs.
- Mood comes from the daily mood check-in first, then latest mood-after value.
- Streak is calculated from consecutive days with at least one meal log.
- Daily focus is selected from existing signals:
  - No meals yet: log one honest meal.
  - Alcohol today: hydrate and steady the next meal.
  - Low average energy: choose steady energy.
  - Muscle gain goal: consistent protein intake.
  - Weight loss goal: simple meals, steady rhythm.
  - Improve energy goal: protect meal timing.
  - Recent late-night logs: plan evening snack.

## Section 2: Today's Insight

Purpose:

Today's Insight gives one concise observation from existing analytics-style signals. It is not a long report and does not require an API call.

Possible insight types:

- Mood
- Energy
- Timing
- Recovery
- Consistency
- First-step guidance

How it supports the mission:

- Makes FuelFlow feel intelligent immediately.
- Uses the user's real patterns rather than generic advice.
- Keeps the tone supportive and practical.
- Helps the user choose one useful adjustment.

Current deterministic signals:

- Recent mood shifts
- Recent average energy
- Alcohol logs
- Late-night logs
- Number of recent logged days

## Section 3: Motivation

Purpose:

This replaces generic quote behavior with contextual encouragement based on the user and recent behavior.

Inputs:

- User name
- Goal
- Streak
- Today's logs
- Recent log count

How it supports the mission:

- Motivation is tied to actual user behavior.
- The tone stays disciplined but kind.
- The user is reminded that consistency is built through small honest actions.
- Avoids guilt-based language or generic gym slogans.

Example logic:

- No logs today: start with one meal, one mood check, one honest note.
- Seven-day streak: protect the rhythm.
- Thirty-day streak: reinforce identity and consistency.
- Several recent logs: remind the user they are building useful evidence.

## Section 4: Learn Something New

Purpose:

This section brings former Explore content into Home as a swipeable learning strip.

Displayed:

- Today's Article
- Nutrition Education cards
- Short research-backed or practical food lessons

How it supports the mission:

- Keeps learning lightweight and non-intrusive.
- Makes Home feel fresh without requiring new backend data.
- Preserves the value of Explore without needing a separate tab.
- Encourages curiosity about food instead of fear or rigid rules.

Interaction:

- Horizontal swipe/scroll card strip.
- Cards use existing Explore item descriptions, details, and benefits.

## Section 5: Global Cuisine Spotlight

Purpose:

Global Cuisine Spotlight turns former cuisine cards into a concise daily food culture lesson.

Displayed:

- Cuisine name
- Short description
- Three meal examples
- Nutrition or mood lesson

How it supports the mission:

- Frames food as cultural, enjoyable, and flexible.
- Shows users that different cuisines can support wellbeing.
- Avoids narrow "fitness food only" thinking.
- Makes the app feel inclusive across food backgrounds.

Current content source:

- Indian vegetarian
- Mediterranean
- Japanese

## Section 6: Community Story

Purpose:

Community Story brings the "Feeling Low? Read This" content into Home as a supportive narrative.

Displayed:

- One story per day
- Warm transformation language
- Small note that stories are illustrative

How it supports the mission:

- Helps users feel less alone.
- Supports food relationship healing.
- Avoids weight-loss obsession by focusing on habits, energy, awareness, and relationship with food.
- Reinforces that progress can include culture, comfort, and imperfection.

## Section 7: Quick Actions

Purpose:

Quick Actions answers: "What is one small action I can take right now?"

Buttons:

- Log Meal
- Ask Sizzle
- View Plan
- View Weekly Report

How it supports the mission:

- Turns reflection into movement.
- Keeps the most important product loops one tap away.
- Makes Sizzle feel central without overwhelming the Home screen.
- Helps users choose a path based on what they need in the moment.

## Why Explore Lives In Home Now

Explore is no longer a separate navigation destination. Its content now supports Home as:

- Learning cards
- Cuisine spotlight
- Community story

This makes the bottom navigation more focused and gives Sizzle a first-class role.

Current nav hierarchy:

```text
Home / Log / Today / Insights / Sizzle / Plan / Settings
```

Product meaning:

- Home: daily wellbeing hub
- Log: capture food and feelings
- Today: review today's entries
- Insights: reports and analytics
- Sizzle: active AI companion
- Plan: AI meal planning
- Settings: account and preferences

## Design Principles

Home V2 follows these principles:

- Mobile-first
- Fast loading
- No extra API dependency for first render
- Fiery dark theme
- Compact but warm cards
- Large tappable actions
- Supportive, disciplined tone
- No shame-based language
- Minimal scrolling compared with the previous Home + Explore stack

## Current Limitations

- Today's Insight is deterministic and local-only.
- Learn and spotlight content is still hardcoded in `app.js`.
- No saved "article read" state yet.
- No carousel pagination indicators yet.
- Daily focus is rule-based, not AI-generated.

## Future Improvements

Good next steps:

1. Add server-backed daily check-ins.
2. Pull latest analytics report into Home.
3. Add a true "Today's focus" endpoint powered by deterministic metrics plus Sizzle interpretation.
4. Add saved learning articles.
5. Add coach-friendly daily readiness score.
6. Add Home widgets for sleep and recovery once those trackers exist.
