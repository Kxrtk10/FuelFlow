# FuelFlow Project Context

## 1. Complete Architecture Overview

FuelFlow is a Python/FastAPI + vanilla HTML/CSS/JavaScript web app for food, mood, nutrition, and AI-assisted meal planning.

The app has two browser-facing surfaces:

- `GET /` serves `static/landing.html`, a marketing landing page.
- `GET /app` serves `static/index.html`, the authenticated single-page app.

The backend lives in `main.py` and handles:

- SQLite persistence.
- JWT authentication.
- Profile storage.
- Meal log storage.
- AI weekly insights, food insights, Sizzle chat, and meal plan generation through Anthropic Claude via `httpx`.
- Static file serving from `static/`.

The frontend is a single vanilla JS application in `static/app.js`. It controls auth views, onboarding, app navigation, meal logging, local state, server sync, AI interactions, meal plan display, and settings. Styling is centralized in `static/style.css`.

High-level runtime flow:

1. User opens `/`.
2. Landing page links to `/app`.
3. `/app` loads `index.html`, `style.css`, and `app.js`.
4. `app.js` checks `localStorage.fuelflow_token`.
5. If absent or invalid, login is shown.
6. If valid, `/api/auth/me` verifies the JWT and loads profile/log data.
7. The SPA renders Home, Log, Today, Insights, Explore, Plan, and Settings views.
8. Authenticated API calls use `Authorization: Bearer <token>`.
9. AI features call Anthropic from the backend.

## 2. Folder Structure Explanation

```text
meal-plan-app/
  main.py
  requirements.txt
  README.md
  PROJECT_CONTEXT.md
  .env
  .gitignore
  fuelflow.db
  static/
    index.html
    landing.html
    style.css
    app.js
  __pycache__/
```

### Root Files

- `main.py`: FastAPI backend, SQLite setup, auth, API routes, AI integration, static routing.
- `requirements.txt`: Python dependencies.
- `README.md`: currently stale. It describes an older Gemini/localStorage/no-auth version and does not match the current code.
- `.env`: local secrets/config. Expected keys include `ANTHROPIC_API_KEY` and `JWT_SECRET`.
- `.gitignore`: ignores `.env`, `fuelflow.db`, and `__pycache__/`.
- `fuelflow.db`: local SQLite database, intentionally ignored.
- `PROJECT_CONTEXT.md`: this generated repository handoff document.

### `static/`

- `landing.html`: standalone marketing page with embedded CSS/JS.
- `index.html`: authenticated app shell and all SPA view markup.
- `style.css`: global app styling, auth split screen, dark theme, onboarding, cards, nav, responsive behavior.
- `app.js`: all frontend state, routing, event handling, API calls, rendering, onboarding, meal plans, Sizzle chat.

## 3. Database Schema

Database file:

```text
fuelflow.db
```

Created on FastAPI startup in `init_db()`.

### `users`

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Purpose:

- Stores account credentials.
- Passwords are hashed with `bcrypt`.
- Email is normalized to lowercase before insert/login.

### `user_profiles`

```sql
CREATE TABLE IF NOT EXISTS user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  profile_data TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Purpose:

- Stores onboarding/profile JSON as text.
- One profile per user.
- Updated with `ON CONFLICT(user_id) DO UPDATE`.

Typical profile fields from frontend:

- `name`
- `age`
- `weight_kg`
- `height_cm`
- `sex`
- `goal`
- `activity_level`
- `food_relationship`
- `body_type`
- `body_fat_range`
- `body_fat_mid`
- `target_body_fat_range`
- `target_body_fat_mid`
- `daily_calories`

### `meal_logs`

```sql
CREATE TABLE IF NOT EXISTS meal_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  log_data TEXT,
  logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Purpose:

- Stores each meal log as JSON text.
- Current save behavior deletes all logs for the user, then reinserts the full frontend logs array.

Typical log fields:

- `id`
- `timestamp`
- `mealName`
- `mealType`
- `portionFeel`
- `moodBefore`
- `moodAfter`
- `energy`
- `notes`
- `dailyMood`
- `alcohol`
- `drinks`
- `eaten`

### `meal_plans`

```sql
CREATE TABLE IF NOT EXISTS meal_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  plan_data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Purpose:

- Stores generated meal plans as JSON text.
- Current endpoint only inserts new plans.
- There is no API endpoint to retrieve saved plans from the server.

## 4. Authentication Flow

Auth is implemented with:

- `bcrypt` for password hashing.
- `PyJWT` for JWT tokens.
- `JWT_SECRET` from `.env`, defaulting to `fuelflow_secret_key_2024` if not set.
- 30-day token expiry.

### Signup

Frontend:

- User fills signup form.
- `signupUser()` sends `POST /api/auth/signup`.

Backend:

1. `validate_auth()` checks email format and password length.
2. Password is hashed with `bcrypt.hashpw()`.
3. User is inserted into `users`.
4. JWT is returned.

Response:

```json
{
  "token": "jwt",
  "user_id": 1
}
```

Note: signup response does not include `has_profile`, so frontend treats new users as needing onboarding.

### Login

Frontend:

- `loginUser()` sends `POST /api/auth/login`.

Backend:

1. Email and password are validated.
2. User is loaded by email.
3. Password is verified with `bcrypt.checkpw()`.
4. JWT and profile existence are returned.

Response:

```json
{
  "token": "jwt",
  "user_id": 1,
  "has_profile": true
}
```

### Session Verification

On app initialization:

1. `verifyExistingSession()` checks `localStorage.fuelflow_token`.
2. If missing, login view is shown.
3. If present, frontend calls `GET /api/auth/me`.
4. Backend validates `Authorization: Bearer <token>`.
5. If valid, profile is loaded and the main app renders.
6. If invalid/expired, local auth data is cleared and login is shown.

### Frontend Auth Storage

Local storage keys:

- `fuelflow_token`
- `fuelflow_user_id`
- `fuelflow_email`
- `fuelflow_user`
- `fuelflow_sizzle_history`
- plus feature-specific local keys listed later.

### Auth Caveats

- JWT invalidation/logout is client-side only.
- No refresh tokens.
- No password reset.
- No email verification.
- No rate limiting or brute-force protection.
- Default `JWT_SECRET` fallback is unsafe for production.

## 5. Frontend Architecture

The frontend is a vanilla JavaScript SPA.

### Main Files

- `static/index.html`: app DOM shell.
- `static/app.js`: state, rendering, events, API calls.
- `static/style.css`: visual system and responsive styles.

### App Views

Views are controlled by `data-view` and `switchView(viewName)`:

- `home`
- `log`
- `today`
- `insights`
- `explore`
- `plan`
- `settings`

Bottom nav buttons use `data-nav-target`.

### Auth Views

Auth is outside the main app shell:

- `#authView`
- `#loginView`
- `#signupView`

`showAuth(mode)` toggles login/signup and hides the app/nav.

### Onboarding

Onboarding is a modal overlay:

- `#onboardingOverlay`
- `#onboardingTrack`
- Six steps:
  - name
  - body basics
  - goal/activity/food relationship
  - body type
  - current body fat
  - target body fat

Body type/body fat cards are generated dynamically in `app.js`:

- `renderBodyTypeCards()`
- `renderBodyFatCards()`
- `renderTargetBodyFatCards()`

The onboarding profile is saved to:

- `localStorage.fuelflow_user`
- `POST /api/profile/save`

### Local Storage State

Important keys:

- `fuelflow_user`
- `fuelflow_token`
- `fuelflow_user_id`
- `fuelflow_email`
- `fuelflow_theme`
- `fuelflow_sizzle_history`
- `fuelflow_chat_sessions`
- `fuelflow_streak`
- `fuelflow_daily_mood`
- `fuelflow_daily_mood_dismissed`
- `fuelflow_meal_plan`
- `fuelflow_plan_selections`
- `fuelflow_grocery_checks`
- `fuelflow_weight_history`

### Rendering Pattern

The app uses manual DOM rendering:

- Reads state from localStorage/global variables.
- Builds HTML strings.
- Assigns `innerHTML`.
- Uses event delegation for many interactions.

Key render functions:

- `renderHomePersonalization()`
- `renderToday()`
- `renderEntryCard()`
- `renderSettings()`
- `renderHomeProgress()`
- `renderSizzleMessages()`
- `renderExplore()`
- `renderMealPlanView()`
- `renderMealPlan()`
- `renderPlanMealCard()`

### API Wrapper

`apiFetch(path, options)` adds:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Some unauthenticated calls still use raw `fetch`, such as login, signup, and food insight.

## 6. Backend Architecture

Backend is one file: `main.py`.

### Responsibilities

- Loads env vars with `python-dotenv`.
- Configures FastAPI.
- Adds permissive CORS.
- Initializes SQLite tables.
- Handles auth and user lookup.
- Handles profile/log/plan persistence.
- Calls Anthropic AI APIs.
- Serves static app and landing page.

### Important Backend Helpers

- `get_db()`: opens SQLite connection with row factory.
- `init_db()`: creates tables.
- `validate_auth()`: email/password validation.
- `create_token()`: creates JWT with 30-day expiry.
- `get_current_user()`: validates Bearer token and loads user.
- `get_profile()`: loads/de-serializes profile JSON.
- `summarize_logs()`: compresses logs for AI insight prompt.
- `calculate_plan_macros()`: bodyweight-based macro calculation.
- `parse_claude_json()`: strips markdown fences and extracts JSON object.

### AI Provider

Current provider:

- Anthropic Claude Messages API via `httpx`.

Model used:

```text
claude-haiku-4-5-20251001
```

Environment variable:

```text
ANTHROPIC_API_KEY
```

AI features:

- Weekly insights.
- Food insight after logging.
- Sizzle chat assistant.
- Meal plan generation.

## 7. API Endpoints

### `POST /api/auth/signup`

Auth required: no.

Request:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Response:

```json
{
  "token": "jwt",
  "user_id": 1
}
```

Notes:

- Validates email format.
- Requires password length >= 6.
- Hashes password with bcrypt.

### `POST /api/auth/login`

Auth required: no.

Request:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Response:

```json
{
  "token": "jwt",
  "user_id": 1,
  "has_profile": true
}
```

### `GET /api/auth/me`

Auth required: yes.

Response:

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "timestamp"
  },
  "profile": {}
}
```

### `POST /api/profile/save`

Auth required: yes.

Request:

```json
{
  "profile_data": {}
}
```

Response:

```json
{ "ok": true }
```

### `GET /api/profile/get`

Auth required: yes.

Response:

```json
{
  "profile_data": {}
}
```

### `POST /api/logs/save`

Auth required: yes.

Request:

```json
{
  "logs": []
}
```

Response:

```json
{ "ok": true }
```

Notes:

- Deletes all user logs and reinserts the submitted array.

### `GET /api/logs/get`

Auth required: yes.

Response:

```json
{
  "logs": []
}
```

### `POST /api/get-insights`

Auth required: no in backend, although frontend usually calls it after login.

Request:

```json
{
  "logs": [],
  "user_profile": {}
}
```

Response:

```json
{
  "insight": "string",
  "facts": ["string", "string", "string"]
}
```

Notes:

- Calls Anthropic.
- Has fallback only for JSON decode failures.
- Other AI/network exceptions are not caught with a fallback.

### `POST /api/food-insight`

Auth required: no.

Request:

```json
{
  "food_name": "dal chawal",
  "goal": "Lose weight",
  "activity_level": "Moderate"
}
```

Response:

```json
{
  "what_it_does": "string",
  "good_for_goal": true,
  "next_suggestion": "string"
}
```

Notes:

- Calls Anthropic.
- Frontend calls this after meal logging.

### `POST /api/chat`

Auth required: yes.

Request:

```json
{
  "message": "What should I eat after training?",
  "history": [{ "role": "user", "content": "..." }],
  "user_profile": {}
}
```

Response:

```json
{
  "reply": "string"
}
```

Notes:

- Powers Sizzle AI assistant.
- Uses last 6 history messages in prompt.
- Returns fallback reply on any exception.

### `POST /api/generate-meal-plan`

Auth required: yes.

Request:

```json
{
  "user_profile": {}
}
```

Response:

```json
{
  "plan_summary": {},
  "days": [],
  "grocery_list": [],
  "weekly_tips": [],
  "alcohol_guidance": "string",
  "adjustment_note": "string"
}
```

Notes:

- Calculates macros before AI call.
- Generates seven days through seven sequential Anthropic calls.
- Makes an eighth Anthropic call for summary/grocery/tips/guidance.
- Uses `max_tokens: 1500` per AI call.
- Has traceback logging in wrapper.

### `POST /api/plan/save`

Auth required: yes.

Request:

```json
{
  "plan_data": {}
}
```

Response:

```json
{ "ok": true }
```

Notes:

- Inserts a new row every time.
- No retrieval endpoint exists.

### `GET /`

Serves:

```text
static/landing.html
```

### `GET /app`

Serves:

```text
static/index.html
```

### Static Mount

```python
app.mount("/", StaticFiles(directory="static", html=True), name="static")
```

This serves static assets such as `/style.css`, `/app.js`, and embedded page files.

## 8. Features Already Implemented

### Marketing / Landing

- Full landing page at `/`.
- Fixed nav.
- Transformation-themed hero.
- Feature cards.
- How-it-works section.
- Sizzle preview section.
- CTA sections.

### Authentication

- Signup.
- Login.
- JWT session verification.
- Logout from settings.
- Auth-gated app shell.

### Onboarding

- First-time profile setup.
- Name, age, weight, height, biological sex.
- Goal and activity level.
- Food relationship question.
- Body type selector.
- Current body fat selector.
- Target body selector.
- Daily calorie target calculation.
- Profile save to backend.

### Home

- Personalized greeting.
- Time-of-day message.
- Daily mood check-in.
- Streak display.
- Daily quote.
- Journey card from current to target body fat.
- Estimated macro/calorie progress.
- Profile summary.

### Meal Logging

- Meal name, type, portion feel.
- Mood before/after.
- Energy slider.
- Notes.
- Alcohol toggle and drinks count.
- Local state plus server sync.
- AI food insight card after logging.
- Motivational nudge after logging.

### Today View

- Today's logs.
- Summary metrics.
- Mood trend.
- Energy visualization.
- Eaten checkbox.
- Edit meal.
- Delete meal.
- Quick-add food.

### Insights

- Weekly insight generation.
- Requires at least 3 logs on frontend.
- Displays insight and three facts.
- Sizzle AI chat.
- Markdown-ish rendering for Sizzle replies.
- Previous chat sessions stored locally.

### Explore

- Expandable educational cards.
- Food relationship support card.
- Cuisine and lifestyle cards.

### Meal Plan

- Plan setup form:
  - plan type
  - food preference
  - cuisine
  - budget
  - sport/activity
  - meals per day
  - alcohol frequency
- AI-generated seven-day plan.
- One-day-per-AI-call generation to reduce truncation.
- Day tabs.
- Meal cards with description, macros, why text.
- Log-this-meal button.
- Ask Sizzle for recipe button.
- Grocery list checklist.
- Copy grocery list.
- Weekly tips.
- Weight update and recalculation.
- Local plan persistence.
- Server-side plan save.

### Settings

- Profile details.
- Edit profile.
- Edit goals.
- Theme toggle:
  - Fiery
  - Ocean
- Logout with confirm.
- Reset all data.
- Export logs JSON.

### Styling / UX

- Dark fiery theme.
- Ocean alternative theme.
- Split-screen auth.
- Bottom navigation.
- Hidden scrollbars globally while preserving scroll behavior.
- Responsive layout.

## 9. Missing Features

Important missing or incomplete areas:

- Password reset.
- Email verification.
- Account deletion endpoint.
- Server-side logout/token revocation.
- Refresh tokens.
- CSRF/session hardening.
- Rate limiting.
- Production-grade secret management.
- Server-side validation for profile/log/meal-plan JSON shapes.
- Saved meal plan retrieval endpoint.
- Meal plan update/delete endpoints.
- Proper database migrations.
- Tests.
- Deployment configuration.
- Observability/logging beyond `print()` and tracebacks.
- Error reporting in frontend beyond toasts.
- Admin tooling.
- Nutrition database integration.
- Real calorie/macro estimation for arbitrary logged foods.
- Payment/subscription system.
- Coach/client multi-user model.
- Accessibility audit.
- Internationalization/localization.
- Data export from backend.
- Data deletion from backend beyond local reset/logout behavior.

## 10. Technical Debt

### Stale Documentation

`README.md` does not match the current app. It still describes:

- Gemini API.
- No auth.
- No database.
- localStorage-only data.

Current reality:

- Anthropic Claude API.
- JWT auth.
- SQLite database.
- Server persistence for profiles/logs/plans.

### Single Large Files

- `main.py` contains all backend concerns.
- `static/app.js` contains all frontend concerns.
- `static/style.css` contains all styling.

This makes feature work easy at first but increasingly risky.

### Unreachable Backend Code

`_generate_meal_plan_impl()` returns after the newer one-day-per-call implementation, but old meal-plan generation code remains below the return. It is unreachable and should be removed.

### Inconsistent Auth Requirements

Some AI endpoints are unauthenticated:

- `/api/get-insights`
- `/api/food-insight`

But chat and meal-plan generation require auth. This should be intentional and documented or made consistent.

### Weak API Validation

Most complex payloads are typed as `dict[str, Any]` or `list[dict[str, Any]]`.

Impact:

- Bad frontend data can be stored directly.
- AI prompts can receive inconsistent fields.
- Future migrations become harder.

### SQLite Persistence Model

Logs are saved by deleting all logs for a user and reinserting the submitted array.

Risks:

- Race conditions.
- Loss of historical `logged_at` accuracy.
- Poor scalability.
- Hard to sync multiple devices.

### Meal Plans Are Write-Only on Server

Frontend saves plans to `/api/plan/save`, but there is no `/api/plan/get`.

Impact:

- Plan persistence depends primarily on localStorage.
- A user changing devices will not recover their latest plan.

### AI Error Handling Is Inconsistent

- Sizzle catches all exceptions.
- Weekly insights only has a JSON decode fallback.
- Meal plan endpoint raises 500 on most failures.
- Food insight only catches JSON decode errors on backend, but frontend has a fallback.

### Hardcoded AI Model

The Anthropic model is hardcoded in multiple endpoints:

```text
claude-haiku-4-5-20251001
```

This should be centralized in config.

### No Automated Tests

There are no visible unit, integration, or frontend tests.

### Security Gaps

- Permissive CORS: `allow_origins=["*"]` with credentials enabled.
- Default JWT secret fallback.
- No rate limiting.
- No account lockout.
- No input size limits for AI endpoints.
- No prompt injection controls beyond system prompts.

### Encoding Issues

Several files display mojibake in terminal output for emoji and special characters. The browser may render correctly if files are UTF-8, but CLI readability is degraded.

### Generated Files Dirty Locally

`__pycache__/main.cpython-312.pyc` appears modified frequently after Python checks. It is ignored, but it can distract during local status checks.

## 11. Recommended Next Steps

### Immediate Cleanup

1. Update `README.md` to reflect the current app.
2. Remove unreachable old meal-plan code from `main.py`.
3. Add `/api/plan/get` and optionally `/api/plan/delete`.
4. Centralize config:
   - `ANTHROPIC_API_KEY`
   - `JWT_SECRET`
   - Claude model
   - DB path
   - token expiry
5. Make auth requirements consistent across AI endpoints.

### Backend Refactor

Split `main.py` into modules:

```text
app/
  main.py
  db.py
  auth.py
  models.py
  routes/
    auth.py
    profiles.py
    logs.py
    insights.py
    chat.py
    meal_plans.py
  services/
    anthropic.py
    nutrition.py
```

Add Pydantic models for:

- Profile data.
- Meal logs.
- Meal plans.
- AI response schemas.

### Database Improvements

1. Add migrations with Alembic or a simple migration table.
2. Store meal logs as normalized columns plus JSON metadata.
3. Add indexes:
   - `meal_logs(user_id, logged_at)`
   - `meal_plans(user_id, created_at)`
4. Add updated timestamps.
5. Decide whether meal plan saves should overwrite or version plans.

### Frontend Refactor

Split `static/app.js` into modules:

```text
static/js/
  state.js
  api.js
  auth.js
  onboarding.js
  views/
    home.js
    log.js
    today.js
    insights.js
    explore.js
    plan.js
    settings.js
```

Even without a framework, modular JS will reduce risk.

### Testing

Add backend tests:

- Auth signup/login/me.
- Profile save/load.
- Logs save/load.
- Meal macro calculation.
- AI JSON parsing fallback.

Add frontend smoke tests:

- Login view appears without token.
- Authenticated route loads Home.
- Onboarding can complete.
- Meal logging adds Today card.
- Plan view renders from saved plan.

### Production Readiness

Before production:

- Replace SQLite or explicitly accept SQLite limitations.
- Use strong `JWT_SECRET`.
- Restrict CORS.
- Add HTTPS-only deployment.
- Add request size limits.
- Add rate limiting.
- Add structured logging.
- Add monitoring/error tracking.
- Add backup strategy.
- Add privacy policy and terms.

### Product Next Steps

High-impact product work:

1. Make meal plans retrievable across devices.
2. Add recipe generation from Sizzle as a first-class flow.
3. Improve meal log nutrition estimation.
4. Add weekly progress reports.
5. Add coach-facing client dashboard if the target remains fitness coaches.
6. Add account deletion and data export from server.
7. Add onboarding skip/edit safeguards.

