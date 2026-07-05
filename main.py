import json
import os
import re
import sqlite3
import traceback
from datetime import date, datetime, timedelta, timezone
from typing import Any

import bcrypt
import httpx
import jwt
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field


load_dotenv()
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
JWT_SECRET = os.getenv("JWT_SECRET", "fuelflow_secret_key_2024")
DB_PATH = "fuelflow.db"


class InsightsRequest(BaseModel):
    logs: list[dict[str, Any]] = Field(default_factory=list)
    user_profile: dict[str, Any] = Field(default_factory=dict)


class FoodInsightRequest(BaseModel):
    food_name: str
    goal: str = ""
    activity_level: str = ""


class AuthRequest(BaseModel):
    email: str
    password: str


class ProfileSaveRequest(BaseModel):
    profile_data: dict[str, Any]


class LogsSaveRequest(BaseModel):
    logs: list[dict[str, Any]] = Field(default_factory=list)


class ChatRequest(BaseModel):
    message: str
    history: list[dict[str, str]] = Field(default_factory=list)
    user_profile: dict[str, Any] = Field(default_factory=dict)


class MemorySettingsRequest(BaseModel):
    enabled: bool


class MealPlanRequest(BaseModel):
    user_profile: dict[str, Any] = Field(default_factory=dict)


class MealPlanSaveRequest(BaseModel):
    plan_data: dict[str, Any]


class PlanAdherenceRequest(BaseModel):
    plan_id: int | None = None
    plan_created_at: str = ""
    day: str = ""
    meal_index: int = 0
    meal_name: str = ""
    meal_type: str = ""
    status: str = "eaten"
    notes: str = ""


class AnalyticsReportRequest(BaseModel):
    days: int = 7


class WellbeingCheckInRequest(BaseModel):
    checkin_date: str | None = None
    mood: str = ""
    energy: int | None = None
    stress: int | None = None
    cravings: int | None = None
    notes: str = ""
    sleep_date: str | None = None
    bedtime: str = ""
    wake_time: str = ""
    duration_minutes: int | None = None
    sleep_quality: int | None = None
    interruptions: int | None = None
    sleep_notes: str = ""
    soreness: int | None = None
    fatigue: int | None = None
    readiness: int | None = None
    hydration: int | None = None
    recovery_notes: str = ""


class HabitEventRequest(BaseModel):
    event_type: str
    timestamp: str | None = None
    quantity: float | None = None
    intensity: int | None = None
    trigger: str = ""
    context: str = ""
    mood: str = ""
    notes: str = ""


class SocialPlanRequest(BaseModel):
    event_type: str = "drinks with friends"
    drink_type: str = "beer"
    planned_drinks: float = 2
    event_date: str | None = None
    context: str = ""
    user_profile: dict[str, Any] = Field(default_factory=dict)


DRINK_REFERENCE: dict[str, dict[str, Any]] = {
    "beer": {
        "label": "Beer",
        "serving": "330 ml",
        "estimated_calories": 150,
        "alcohol_content": "4-6% ABV",
        "goal_compatibility_score": 62,
        "lower_calorie_alternatives": ["light beer", "small beer", "vodka soda"],
        "goal_friendly_alternatives": ["light beer with water between rounds", "small beer with grilled protein"],
        "hydration_recommendation": "Have 300-500 ml water between beers and before sleep.",
    },
    "wine": {
        "label": "Wine",
        "serving": "150 ml",
        "estimated_calories": 125,
        "alcohol_content": "12-14% ABV",
        "goal_compatibility_score": 70,
        "lower_calorie_alternatives": ["dry wine", "wine spritzer", "vodka soda"],
        "goal_friendly_alternatives": ["dry red or white wine with a protein-forward dinner"],
        "hydration_recommendation": "Match each glass with one full glass of water.",
    },
    "whiskey": {
        "label": "Whiskey",
        "serving": "45 ml",
        "estimated_calories": 105,
        "alcohol_content": "40% ABV",
        "goal_compatibility_score": 76,
        "lower_calorie_alternatives": ["whiskey with soda", "whiskey on ice", "single pour instead of cocktail"],
        "goal_friendly_alternatives": ["single whiskey with soda and a high-protein meal"],
        "hydration_recommendation": "Sip slowly and add 500 ml water before bed.",
    },
    "vodka": {
        "label": "Vodka",
        "serving": "45 ml",
        "estimated_calories": 100,
        "alcohol_content": "40% ABV",
        "goal_compatibility_score": 80,
        "lower_calorie_alternatives": ["vodka soda", "vodka with lime and soda", "single vodka with diet mixer"],
        "goal_friendly_alternatives": ["vodka soda with lime, paced with water"],
        "hydration_recommendation": "Use soda water as your mixer and drink water between rounds.",
    },
    "gin": {
        "label": "Gin",
        "serving": "45 ml",
        "estimated_calories": 100,
        "alcohol_content": "40% ABV",
        "goal_compatibility_score": 79,
        "lower_calorie_alternatives": ["gin soda", "gin with diet tonic", "single gin with lime"],
        "goal_friendly_alternatives": ["gin soda or diet tonic with a protein-rich snack"],
        "hydration_recommendation": "Alternate gin drinks with water and keep the mixer low sugar.",
    },
    "rum": {
        "label": "Rum",
        "serving": "45 ml",
        "estimated_calories": 105,
        "alcohol_content": "40% ABV",
        "goal_compatibility_score": 68,
        "lower_calorie_alternatives": ["rum with diet cola", "rum soda", "single rum on ice"],
        "goal_friendly_alternatives": ["rum with diet mixer, plus dinner with protein and vegetables"],
        "hydration_recommendation": "Keep mixers light and add water between drinks.",
    },
    "cocktails": {
        "label": "Cocktails",
        "serving": "1 glass",
        "estimated_calories": 250,
        "alcohol_content": "varies",
        "goal_compatibility_score": 48,
        "lower_calorie_alternatives": ["vodka soda", "gin soda", "dry wine", "light beer"],
        "goal_friendly_alternatives": ["one cocktail you truly enjoy, then switch to a simpler drink"],
        "hydration_recommendation": "Cocktails can be sugary, so pair each one with water and a protein meal.",
    },
}


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS user_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE,
                profile_data TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS meal_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                log_data TEXT,
                logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS meal_plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                plan_data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
            """
        )
        conn.execute(
            """
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
            )
            """
        )
        conn.execute(
            """
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
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
            """
        )
        conn.execute(
            """
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
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS user_privacy_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                ai_memory_enabled INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
            """
        )
        conn.execute(
            """
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
            )
            """
        )
        conn.execute(
            """
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
            )
            """
        )
        conn.execute(
            """
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
            )
            """
        )
        conn.execute(
            """
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
            )
            """
        )


def validate_auth(email: str, password: str) -> str:
    normalized = email.strip().lower()
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", normalized):
        raise HTTPException(status_code=400, detail="Please enter a valid email.")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    return normalized


def create_token(user_id: int) -> str:
    expires = datetime.now(timezone.utc) + timedelta(days=30)
    return jwt.encode({"sub": str(user_id), "exp": expires}, JWT_SECRET, algorithm="HS256")


def get_current_user(authorization: str = Header(default="")) -> sqlite3.Row:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization token.")
    token = authorization.replace("Bearer ", "", 1).strip()
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = int(payload["sub"])
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token.") from exc

    with get_db() as conn:
        user = conn.execute("SELECT id, email, created_at FROM users WHERE id = ?", (user_id,)).fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="User not found.")
    return user


def get_profile(user_id: int) -> dict[str, Any] | None:
    with get_db() as conn:
        row = conn.execute(
            "SELECT profile_data FROM user_profiles WHERE user_id = ?",
            (user_id,),
        ).fetchone()
    if not row or not row["profile_data"]:
        return None
    return json.loads(row["profile_data"])


def summarize_logs(logs: list[dict[str, Any]]) -> str:
    if not logs:
        return "No meals logged yet."

    entries = []
    for index, log in enumerate(logs, start=1):
        meal_type = log.get("mealType", "Meal")
        meal_name = log.get("mealName", "unknown meal")
        before = (log.get("moodBefore") or {}).get("label", "unknown").lower()
        after = (log.get("moodAfter") or {}).get("label", "unknown").lower()
        energy = log.get("energy", "?")
        entries.append(
            f"Day {index}: {meal_type} - {meal_name} "
            f"(mood: {before}->{after}, energy: {energy}/10)."
        )
    return " ".join(entries)


def load_user_logs(user_id: int) -> list[dict[str, Any]]:
    with get_db() as conn:
        rows = conn.execute(
            "SELECT log_data FROM meal_logs WHERE user_id = ? ORDER BY logged_at ASC, id ASC",
            (user_id,),
        ).fetchall()
    logs = []
    for row in rows:
        try:
            logs.append(json.loads(row["log_data"]))
        except json.JSONDecodeError:
            continue
    return logs


def parse_log_time(log: dict[str, Any]) -> datetime | None:
    timestamp = log.get("timestamp")
    if not timestamp:
        return None
    try:
        cleaned = str(timestamp).replace("Z", "+00:00")
        parsed = datetime.fromisoformat(cleaned)
        if parsed.tzinfo:
            parsed = parsed.astimezone().replace(tzinfo=None)
        return parsed
    except ValueError:
        return None


def mood_score(mood: Any) -> int | None:
    if isinstance(mood, dict):
        label = str(mood.get("label", "")).strip().lower()
    else:
        label = str(mood or "").strip().lower()
    scores = {
        "stressed": 1,
        "angry": 1,
        "tired": 2,
        "neutral": 3,
        "good": 4,
        "happy": 5,
    }
    return scores.get(label)


def clamp_number(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def build_behavioral_metrics(
    logs: list[dict[str, Any]],
    profile: dict[str, Any],
    days: int = 7,
) -> dict[str, Any]:
    today = datetime.now().date()
    safe_days = max(1, min(int(days or 7), 30))
    period_start = today - timedelta(days=safe_days - 1)
    period_end = today

    normalized = []
    for log in logs:
        parsed_time = parse_log_time(log)
        if not parsed_time:
            continue
        log_date = parsed_time.date()
        if period_start <= log_date <= period_end:
            normalized.append({**log, "_parsed_time": parsed_time, "_date": log_date})

    total_logs = len(normalized)
    days_logged = len({log["_date"] for log in normalized})
    active_days = max(days_logged, 1)

    mood_pairs = []
    for log in normalized:
        before = mood_score(log.get("moodBefore"))
        after = mood_score(log.get("moodAfter"))
        if before is not None and after is not None:
            mood_pairs.append((before, after))
    mood_uplifts = [1 for before, after in mood_pairs if after > before]
    mood_same_or_better = [1 for before, after in mood_pairs if after >= before]
    mood_uplift_pct = round((sum(mood_uplifts) / len(mood_pairs)) * 100) if mood_pairs else 0
    mood_stability_pct = round((sum(mood_same_or_better) / len(mood_pairs)) * 100) if mood_pairs else 0

    energy_groups: dict[str, list[float]] = {}
    all_energy = []
    for log in normalized:
        try:
            energy = float(log.get("energy"))
        except (TypeError, ValueError):
            continue
        meal_type = str(log.get("mealType") or "Meal")
        energy_groups.setdefault(meal_type, []).append(energy)
        all_energy.append(energy)
    energy_by_meal_type = [
        {
            "meal_type": meal_type,
            "average_energy": round(sum(values) / len(values), 1),
            "count": len(values),
        }
        for meal_type, values in sorted(energy_groups.items())
    ]
    average_energy = round(sum(all_energy) / len(all_energy), 1) if all_energy else 0

    alcohol_logs = [log for log in normalized if log.get("alcohol")]
    non_alcohol_logs = [log for log in normalized if not log.get("alcohol")]

    def average_energy_for(items: list[dict[str, Any]]) -> float:
        values = []
        for item in items:
            try:
                values.append(float(item.get("energy")))
            except (TypeError, ValueError):
                continue
        return round(sum(values) / len(values), 1) if values else 0

    alcohol_avg = average_energy_for(alcohol_logs)
    non_alcohol_avg = average_energy_for(non_alcohol_logs)
    drinks_total = sum(int(log.get("drinks") or 0) for log in alcohol_logs)
    alcohol_delta = round(alcohol_avg - non_alcohol_avg, 1) if alcohol_logs and non_alcohol_logs else 0

    meals_per_active_day = round(total_logs / active_days, 1) if total_logs else 0
    coverage_score = days_logged / safe_days
    meal_frequency_score = min(meals_per_active_day / 3, 1)
    core_meal_days = 0
    for offset in range(safe_days):
        day = period_start + timedelta(days=offset)
        day_types = {
            str(log.get("mealType") or "").lower()
            for log in normalized
            if log["_date"] == day
        }
        if {"breakfast", "lunch", "dinner"}.intersection(day_types):
            core_meal_days += 1
    core_meal_score = core_meal_days / safe_days
    consistency_score = round((coverage_score * 50) + (meal_frequency_score * 35) + (core_meal_score * 15))

    late_logs = [
        log for log in normalized
        if log["_parsed_time"].hour >= 22 or log["_parsed_time"].hour < 4
    ]
    late_night_pct = round((len(late_logs) / total_logs) * 100) if total_logs else 0

    alcohol_penalty = 0
    if alcohol_logs:
        alcohol_penalty = min(15, (len(alcohol_logs) / max(total_logs, 1)) * 20 + drinks_total)
    late_penalty = min(15, late_night_pct * 0.2)
    energy_points = average_energy * 4
    mood_points = mood_stability_pct * 0.2
    consistency_points = consistency_score * 0.35
    goal_alignment_score = round(clamp_number(
        energy_points + mood_points + consistency_points - alcohol_penalty - late_penalty,
        0,
        100,
    ))

    goal = str(profile.get("goal") or "your goal")
    if goal.lower() in {"lose weight", "weight loss"}:
        goal_note = "Consistent meal timing, alcohol awareness, and late-night patterns matter most for your fat-loss goal."
    elif goal.lower() in {"gain muscle", "muscle gain"}:
        goal_note = "Regular meals and steady energy are strong signals for supporting muscle gain."
    elif goal.lower() == "improve energy":
        goal_note = "Energy stability is the main signal for your current goal, so meal rhythm matters a lot."
    else:
        goal_note = "Your strongest alignment signal is consistency: enough meals, steady energy, and awareness."

    return {
        "period_start": period_start.isoformat(),
        "period_end": period_end.isoformat(),
        "total_logs": total_logs,
        "days_logged": days_logged,
        "mood_uplift": {
            "percentage": mood_uplift_pct,
            "same_or_better_percentage": mood_stability_pct,
            "sample_size": len(mood_pairs),
        },
        "energy_by_meal_type": energy_by_meal_type,
        "average_energy": average_energy,
        "alcohol_impact": {
            "alcohol_logs": len(alcohol_logs),
            "total_drinks": drinks_total,
            "average_energy_with_alcohol": alcohol_avg,
            "average_energy_without_alcohol": non_alcohol_avg,
            "energy_delta": alcohol_delta,
        },
        "meal_consistency": {
            "score": consistency_score,
            "days_logged": days_logged,
            "days_analyzed": safe_days,
            "meals_per_active_day": meals_per_active_day,
        },
        "late_night_eating": {
            "count": len(late_logs),
            "percentage": late_night_pct,
            "threshold": "10 PM to 4 AM",
        },
        "goal_alignment": {
            "score": goal_alignment_score,
            "goal": goal,
            "note": goal_note,
        },
    }


def build_analytics_fallback(metrics: dict[str, Any], profile: dict[str, Any]) -> dict[str, Any]:
    name = profile.get("name") or "there"
    consistency = metrics.get("meal_consistency", {}).get("score", 0)
    mood = metrics.get("mood_uplift", {}).get("percentage", 0)
    energy = metrics.get("average_energy", 0)
    return {
        "summary": (
            f"{name}, your week shows real awareness: your consistency score is {consistency}/100, "
            f"your average energy is {energy}/10, and {mood}% of logged meals lifted your mood. "
            "Keep using these patterns as feedback, not judgment, and choose one small rhythm to strengthen next."
        ),
        "recommendations": [
            "Protect your most consistent meal time this week.",
            "Notice which meal type gives you the steadiest energy.",
            "Use late-night or alcohol patterns as recovery signals, not setbacks.",
        ],
    }


def minutes_to_label(minutes: float | int | None) -> str:
    if minutes is None:
        return "Not enough data"
    safe_minutes = int(round(float(minutes))) % (24 * 60)
    hour_24 = safe_minutes // 60
    minute = safe_minutes % 60
    suffix = "AM" if hour_24 < 12 else "PM"
    hour_12 = hour_24 % 12 or 12
    return f"{hour_12}:{minute:02d} {suffix}"


def average_numbers(values: list[float]) -> float | None:
    if not values:
        return None
    return sum(values) / len(values)


def standard_deviation(values: list[float]) -> float:
    if len(values) < 2:
        return 0
    mean = sum(values) / len(values)
    variance = sum((value - mean) ** 2 for value in values) / len(values)
    return variance ** 0.5


def average_time_metric(values: list[int]) -> dict[str, Any]:
    average = average_numbers([float(value) for value in values])
    return {
        "minutes": round(average) if average is not None else None,
        "label": minutes_to_label(average),
        "count": len(values),
    }


def build_food_timing_metrics(
    logs: list[dict[str, Any]],
    profile: dict[str, Any],
    days: int = 7,
) -> dict[str, Any]:
    today = datetime.now().date()
    safe_days = max(1, min(int(days or 7), 30))
    period_start = today - timedelta(days=safe_days - 1)
    period_end = today

    normalized = []
    for log in logs:
        parsed_time = parse_log_time(log)
        if not parsed_time:
            continue
        log_date = parsed_time.date()
        if period_start <= log_date <= period_end:
            normalized.append({
                **log,
                "_parsed_time": parsed_time,
                "_date": log_date,
                "_minutes": parsed_time.hour * 60 + parsed_time.minute,
                "_meal_type": str(log.get("mealType") or "Meal").strip().lower(),
            })

    normalized.sort(key=lambda item: item["_parsed_time"])
    by_date: dict[Any, list[dict[str, Any]]] = {}
    for log in normalized:
        by_date.setdefault(log["_date"], []).append(log)

    meal_type_minutes = {
        "breakfast": [log["_minutes"] for log in normalized if log["_meal_type"] == "breakfast"],
        "lunch": [log["_minutes"] for log in normalized if log["_meal_type"] == "lunch"],
        "dinner": [log["_minutes"] for log in normalized if log["_meal_type"] == "dinner"],
    }
    first_meal_minutes = []
    last_meal_minutes = []
    day_summaries = []
    all_gaps = []
    weekday_gaps = []
    weekend_gaps = []
    longest_gap = {
        "hours": 0,
        "date": None,
        "day_type": "weekday",
        "from": "",
        "to": "",
    }

    for log_date, day_logs in by_date.items():
        sorted_day_logs = sorted(day_logs, key=lambda item: item["_parsed_time"])
        first = sorted_day_logs[0]
        last = sorted_day_logs[-1]
        first_meal_minutes.append(first["_minutes"])
        last_meal_minutes.append(last["_minutes"])
        is_weekend = log_date.weekday() >= 5
        day_gaps = []
        for earlier, later in zip(sorted_day_logs, sorted_day_logs[1:]):
            gap_hours = round((later["_parsed_time"] - earlier["_parsed_time"]).total_seconds() / 3600, 2)
            if gap_hours < 0:
                continue
            day_gaps.append(gap_hours)
            all_gaps.append(gap_hours)
            if is_weekend:
                weekend_gaps.append(gap_hours)
            else:
                weekday_gaps.append(gap_hours)
            if gap_hours > longest_gap["hours"]:
                longest_gap = {
                    "hours": gap_hours,
                    "date": log_date.isoformat(),
                    "day_type": "weekend" if is_weekend else "weekday",
                    "from": str(earlier.get("mealType") or "Meal"),
                    "to": str(later.get("mealType") or "Meal"),
                }
        energy_values = []
        mood_pairs = []
        for log in sorted_day_logs:
            try:
                energy_values.append(float(log.get("energy")))
            except (TypeError, ValueError):
                pass
            before = mood_score(log.get("moodBefore"))
            after = mood_score(log.get("moodAfter"))
            if before is not None and after is not None:
                mood_pairs.append(after - before)
        day_summaries.append({
            "date": log_date.isoformat(),
            "is_weekend": is_weekend,
            "first_meal_minutes": first["_minutes"],
            "last_meal_minutes": last["_minutes"],
            "meal_count": len(sorted_day_logs),
            "average_gap_hours": round(sum(day_gaps) / len(day_gaps), 1) if day_gaps else 0,
            "average_energy": round(sum(energy_values) / len(energy_values), 1) if energy_values else None,
            "mood_delta": round(sum(mood_pairs) / len(mood_pairs), 2) if mood_pairs else None,
            "has_late_night": any(log["_minutes"] >= 22 * 60 or log["_minutes"] < 4 * 60 for log in sorted_day_logs),
        })

    late_logs = [log for log in normalized if log["_minutes"] >= 22 * 60 or log["_minutes"] < 4 * 60]
    days_logged = len(by_date)
    breakfast_days = len({log["_date"] for log in normalized if log["_meal_type"] == "breakfast"})
    lunch_days = len({log["_date"] for log in normalized if log["_meal_type"] == "lunch"})
    dinner_days = len({log["_date"] for log in normalized if log["_meal_type"] == "dinner"})
    breakfast_before_9 = len([log for log in normalized if log["_meal_type"] == "breakfast" and log["_minutes"] <= 9 * 60])

    first_sd = standard_deviation([float(value) for value in first_meal_minutes])
    last_sd = standard_deviation([float(value) for value in last_meal_minutes])
    variability_score = max(0, 100 - (((first_sd + last_sd) / 2) / 3))
    coverage_score = (days_logged / safe_days) * 100
    core_meal_score = ((breakfast_days + lunch_days + dinner_days) / (safe_days * 3)) * 100
    late_night_frequency = round((len(late_logs) / len(normalized)) * 100) if normalized else 0
    late_penalty = min(20, late_night_frequency * 0.25)
    consistency_score = round(clamp_number(
        coverage_score * 0.3 + variability_score * 0.45 + core_meal_score * 0.25 - late_penalty,
        0,
        100,
    ))

    weekday_days = [day for day in day_summaries if not day["is_weekend"]]
    weekend_days = [day for day in day_summaries if day["is_weekend"]]

    def average_day_field(items: list[dict[str, Any]], field: str) -> float | None:
        values = [float(item[field]) for item in items if item.get(field) is not None]
        return average_numbers(values)

    early_first_days = [day for day in day_summaries if day["first_meal_minutes"] <= 10 * 60]
    late_first_days = [day for day in day_summaries if day["first_meal_minutes"] > 10 * 60]
    no_late_days = [day for day in day_summaries if not day["has_late_night"]]
    late_days = [day for day in day_summaries if day["has_late_night"]]
    long_gap_days = [day for day in day_summaries if day["average_gap_hours"] >= 5]
    steady_gap_days = [day for day in day_summaries if 0 < day["average_gap_hours"] < 5]

    def average_optional(items: list[dict[str, Any]], field: str) -> float:
        values = [float(item[field]) for item in items if item.get(field) is not None]
        return round(sum(values) / len(values), 1) if values else 0

    observations = []
    suggestions = []
    avg_breakfast = average_time_metric(meal_type_minutes["breakfast"])
    if avg_breakfast["count"]:
        observations.append(f"Your average breakfast is around {avg_breakfast['label']}.")
    if late_logs:
        observations.append(f"{len(late_logs)} logs happened late at night, between 10 PM and 4 AM.")
    if longest_gap["hours"]:
        observations.append(
            f"Your longest meal gap was {longest_gap['hours']} hours on a {longest_gap['day_type']}."
        )
    if consistency_score >= 75:
        suggestions.append("Keep protecting the meal rhythm that is already working.")
    else:
        suggestions.append("Pick one anchor meal time this week, such as breakfast or lunch, and keep it steady.")
    if longest_gap["hours"] >= 5:
        suggestions.append("Add a planned snack before your longest gap so energy does not have to crash first.")
    if late_night_frequency:
        suggestions.append("If evenings are your tricky window, plan a satisfying dinner and one calm snack earlier.")

    return {
        "period_start": period_start.isoformat(),
        "period_end": period_end.isoformat(),
        "total_logs": len(normalized),
        "days_logged": days_logged,
        "average_times": {
            "breakfast": avg_breakfast,
            "lunch": average_time_metric(meal_type_minutes["lunch"]),
            "dinner": average_time_metric(meal_type_minutes["dinner"]),
            "first_meal": average_time_metric(first_meal_minutes),
            "last_meal": average_time_metric(last_meal_minutes),
        },
        "gaps": {
            "longest_gap_hours": longest_gap["hours"],
            "longest_gap_date": longest_gap["date"],
            "longest_gap_day_type": longest_gap["day_type"],
            "longest_gap_from": longest_gap["from"],
            "longest_gap_to": longest_gap["to"],
            "average_gap_hours": round(sum(all_gaps) / len(all_gaps), 1) if all_gaps else 0,
            "weekday_average_gap_hours": round(sum(weekday_gaps) / len(weekday_gaps), 1) if weekday_gaps else 0,
            "weekend_average_gap_hours": round(sum(weekend_gaps) / len(weekend_gaps), 1) if weekend_gaps else 0,
        },
        "consistency": {
            "score": consistency_score,
            "first_meal_variability_minutes": round(first_sd),
            "last_meal_variability_minutes": round(last_sd),
            "breakfast_days": breakfast_days,
            "lunch_days": lunch_days,
            "dinner_days": dinner_days,
            "days_analyzed": safe_days,
        },
        "late_night": {
            "count": len(late_logs),
            "frequency_percentage": late_night_frequency,
            "threshold": "10 PM to 4 AM",
        },
        "breakfast_consistency": {
            "days_with_breakfast": breakfast_days,
            "percentage_of_logged_days": round((breakfast_days / days_logged) * 100) if days_logged else 0,
            "before_9am_count": breakfast_before_9,
            "before_9am_percentage": round((breakfast_before_9 / breakfast_days) * 100) if breakfast_days else 0,
        },
        "weekday_vs_weekend": {
            "weekday_first_meal": minutes_to_label(average_day_field(weekday_days, "first_meal_minutes")),
            "weekend_first_meal": minutes_to_label(average_day_field(weekend_days, "first_meal_minutes")),
            "weekday_last_meal": minutes_to_label(average_day_field(weekday_days, "last_meal_minutes")),
            "weekend_last_meal": minutes_to_label(average_day_field(weekend_days, "last_meal_minutes")),
        },
        "energy_impact": {
            "early_first_meal_avg_energy": average_optional(early_first_days, "average_energy"),
            "later_first_meal_avg_energy": average_optional(late_first_days, "average_energy"),
            "no_late_night_avg_energy": average_optional(no_late_days, "average_energy"),
            "late_night_avg_energy": average_optional(late_days, "average_energy"),
        },
        "mood_impact": {
            "steady_gap_avg_mood_delta": average_optional(steady_gap_days, "mood_delta"),
            "long_gap_avg_mood_delta": average_optional(long_gap_days, "mood_delta"),
            "no_late_night_avg_mood_delta": average_optional(no_late_days, "mood_delta"),
            "late_night_avg_mood_delta": average_optional(late_days, "mood_delta"),
        },
        "observations": observations[:4],
        "suggestions": suggestions[:3],
        "future_ready": {
            "circadian_rhythm_coaching": True,
            "sleep_correlation_ready": True,
        },
        "profile_goal": profile.get("goal") or "your goal",
    }


def build_timing_fallback(metrics: dict[str, Any], profile: dict[str, Any]) -> dict[str, Any]:
    name = profile.get("name") or "there"
    score = metrics.get("consistency", {}).get("score", 0)
    first_meal = metrics.get("average_times", {}).get("first_meal", {}).get("label", "not enough data")
    gap = metrics.get("gaps", {}).get("longest_gap_hours", 0)
    return {
        "summary": (
            f"{name}, your timing rhythm is starting to show: your consistency score is {score}/100, "
            f"your average first meal is around {first_meal}, and your longest gap is {gap} hours. "
            "Use this as a calm signal: one steady anchor meal can make the rest of the day feel easier."
        ),
        "suggestions": metrics.get("suggestions") or [
            "Choose one anchor meal time and protect it for the next seven days.",
            "Add a simple planned snack before your longest usual gap.",
            "Notice whether earlier first meals improve your energy.",
        ],
    }


def format_timing_context_for_prompt(metrics: dict[str, Any]) -> str:
    if not metrics.get("total_logs"):
        return "Not enough logged meals yet for reliable food timing patterns."
    avg = metrics.get("average_times", {})
    gaps = metrics.get("gaps", {})
    consistency = metrics.get("consistency", {})
    late = metrics.get("late_night", {})
    energy = metrics.get("energy_impact", {})
    lines = [
        f"- Timing consistency score: {consistency.get('score', 0)}/100.",
        f"- Average first meal: {avg.get('first_meal', {}).get('label', 'Not enough data')}.",
        f"- Average last meal: {avg.get('last_meal', {}).get('label', 'Not enough data')}.",
        f"- Longest gap: {gaps.get('longest_gap_hours', 0)} hours, usually on a {gaps.get('longest_gap_day_type', 'weekday')}.",
        f"- Average gap: {gaps.get('average_gap_hours', 0)} hours.",
        f"- Late-night logs: {late.get('count', 0)} ({late.get('frequency_percentage', 0)}%).",
        f"- Energy after earlier first meals: {energy.get('early_first_meal_avg_energy', 0)}/10 vs later first meals: {energy.get('later_first_meal_avg_energy', 0)}/10.",
    ]
    return "\n".join(lines)


def clamp_int(value: Any, minimum: int = 1, maximum: int = 10) -> int | None:
    try:
        number = int(value)
    except (TypeError, ValueError):
        return None
    return int(clamp_number(number, minimum, maximum))


def today_iso_date() -> str:
    return datetime.now().date().isoformat()


def parse_date_value(value: Any) -> date | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value)).date()
    except ValueError:
        try:
            return datetime.strptime(str(value), "%Y-%m-%d").date()
        except ValueError:
            return None


def parse_time_minutes(value: Any) -> int | None:
    if not value:
        return None
    text = str(value).strip()
    for fmt in ("%H:%M", "%H:%M:%S"):
        try:
            parsed = datetime.strptime(text, fmt)
            return parsed.hour * 60 + parsed.minute
        except ValueError:
            continue
    return None


def row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {key: row[key] for key in row.keys()}


def save_wellbeing_checkin(user_id: int, data: WellbeingCheckInRequest) -> dict[str, Any]:
    checkin_date = data.checkin_date or today_iso_date()
    sleep_date = data.sleep_date or checkin_date
    with get_db() as conn:
        conn.execute(
            """
            INSERT INTO daily_checkins (
                user_id, checkin_date, mood, energy, stress, cravings, notes, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, checkin_date) DO UPDATE SET
                mood = excluded.mood,
                energy = excluded.energy,
                stress = excluded.stress,
                cravings = excluded.cravings,
                notes = excluded.notes,
                updated_at = CURRENT_TIMESTAMP
            """,
            (
                user_id,
                checkin_date,
                data.mood.strip(),
                clamp_int(data.energy),
                clamp_int(data.stress),
                clamp_int(data.cravings),
                data.notes.strip()[:1000],
            ),
        )
        conn.execute(
            """
            INSERT INTO sleep_logs (
                user_id, sleep_date, bedtime, wake_time, duration_minutes, quality, interruptions, notes, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, sleep_date) DO UPDATE SET
                bedtime = excluded.bedtime,
                wake_time = excluded.wake_time,
                duration_minutes = excluded.duration_minutes,
                quality = excluded.quality,
                interruptions = excluded.interruptions,
                notes = excluded.notes,
                updated_at = CURRENT_TIMESTAMP
            """,
            (
                user_id,
                sleep_date,
                data.bedtime.strip(),
                data.wake_time.strip(),
                max(0, int(data.duration_minutes or 0)),
                clamp_int(data.sleep_quality),
                max(0, int(data.interruptions or 0)),
                data.sleep_notes.strip()[:1000],
            ),
        )
        conn.execute(
            """
            INSERT INTO recovery_logs (
                user_id, log_date, soreness, fatigue, readiness, hydration, notes, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, log_date) DO UPDATE SET
                soreness = excluded.soreness,
                fatigue = excluded.fatigue,
                readiness = excluded.readiness,
                hydration = excluded.hydration,
                notes = excluded.notes,
                updated_at = CURRENT_TIMESTAMP
            """,
            (
                user_id,
                checkin_date,
                clamp_int(data.soreness),
                clamp_int(data.fatigue),
                clamp_int(data.readiness),
                clamp_int(data.hydration),
                data.recovery_notes.strip()[:1000],
            ),
        )
    return load_wellbeing_for_period(user_id, days=30)


def load_wellbeing_for_period(user_id: int, days: int = 30) -> dict[str, Any]:
    safe_days = max(1, min(int(days or 30), 90))
    end = datetime.now().date()
    start = end - timedelta(days=safe_days - 1)
    with get_db() as conn:
        daily_rows = conn.execute(
            """
            SELECT *
            FROM daily_checkins
            WHERE user_id = ? AND checkin_date BETWEEN ? AND ?
            ORDER BY checkin_date ASC
            """,
            (user_id, start.isoformat(), end.isoformat()),
        ).fetchall()
        sleep_rows = conn.execute(
            """
            SELECT *
            FROM sleep_logs
            WHERE user_id = ? AND sleep_date BETWEEN ? AND ?
            ORDER BY sleep_date ASC
            """,
            (user_id, start.isoformat(), end.isoformat()),
        ).fetchall()
        recovery_rows = conn.execute(
            """
            SELECT *
            FROM recovery_logs
            WHERE user_id = ? AND log_date BETWEEN ? AND ?
            ORDER BY log_date ASC
            """,
            (user_id, start.isoformat(), end.isoformat()),
        ).fetchall()
    return {
        "daily_checkins": [row_to_dict(row) for row in daily_rows],
        "sleep_logs": [row_to_dict(row) for row in sleep_rows],
        "recovery_logs": [row_to_dict(row) for row in recovery_rows],
        "period_start": start.isoformat(),
        "period_end": end.isoformat(),
    }


def trend_delta(values: list[float]) -> dict[str, Any]:
    if len(values) < 2:
        return {"direction": "steady", "delta": 0}
    midpoint = max(1, len(values) // 2)
    earlier = values[:midpoint]
    later = values[midpoint:]
    if not later:
        return {"direction": "steady", "delta": 0}
    delta = round((sum(later) / len(later)) - (sum(earlier) / len(earlier)), 1)
    if delta > 0.3:
        direction = "improving"
    elif delta < -0.3:
        direction = "declining"
    else:
        direction = "steady"
    return {"direction": direction, "delta": delta}


def average_row_value(rows: list[dict[str, Any]], key: str) -> float:
    values = []
    for row in rows:
        try:
            value = float(row.get(key))
        except (TypeError, ValueError):
            continue
        if value:
            values.append(value)
    return round(sum(values) / len(values), 1) if values else 0


def recovery_score(row: dict[str, Any]) -> float:
    values = []
    for key in ("readiness", "hydration"):
        value = clamp_int(row.get(key))
        if value is not None:
            values.append(value)
    for key in ("soreness", "fatigue"):
        value = clamp_int(row.get(key))
        if value is not None:
            values.append(11 - value)
    return round((sum(values) / len(values)) * 10, 1) if values else 0


def build_sleep_recovery_metrics(
    logs: list[dict[str, Any]],
    wellbeing: dict[str, Any],
    profile: dict[str, Any],
    days: int = 7,
) -> dict[str, Any]:
    today = datetime.now().date()
    safe_days = max(1, min(int(days or 7), 30))
    period_start = today - timedelta(days=safe_days - 1)
    period_end = today
    daily = [
        row for row in wellbeing.get("daily_checkins", [])
        if period_start <= (parse_date_value(row.get("checkin_date")) or today) <= period_end
    ]
    sleep = [
        row for row in wellbeing.get("sleep_logs", [])
        if period_start <= (parse_date_value(row.get("sleep_date")) or today) <= period_end
    ]
    recovery = [
        row for row in wellbeing.get("recovery_logs", [])
        if period_start <= (parse_date_value(row.get("log_date")) or today) <= period_end
    ]

    sleep_durations = [float(row.get("duration_minutes") or 0) for row in sleep if row.get("duration_minutes")]
    sleep_hours = [duration / 60 for duration in sleep_durations]
    sleep_quality_values = [float(row.get("quality") or 0) for row in sleep if row.get("quality")]
    bedtime_values = [parse_time_minutes(row.get("bedtime")) for row in sleep]
    bedtime_values = [value for value in bedtime_values if value is not None]
    wake_values = [parse_time_minutes(row.get("wake_time")) for row in sleep]
    wake_values = [value for value in wake_values if value is not None]
    sleep_debt_values = [max(0, 450 - duration) / 60 for duration in sleep_durations]
    weekday_sleep = [row for row in sleep if (parse_date_value(row.get("sleep_date")) or today).weekday() < 5]
    weekend_sleep = [row for row in sleep if (parse_date_value(row.get("sleep_date")) or today).weekday() >= 5]

    coverage_score = (len(sleep) / safe_days) * 100
    bedtime_variability = standard_deviation([float(value) for value in bedtime_values])
    wake_variability = standard_deviation([float(value) for value in wake_values])
    variability_score = max(0, 100 - (((bedtime_variability + wake_variability) / 2) / 3))
    duration_score = min(100, (average_numbers(sleep_hours) or 0) / 7.5 * 100)
    sleep_consistency_score = round(clamp_number(
        coverage_score * 0.25 + variability_score * 0.45 + duration_score * 0.3,
        0,
        100,
    ))

    recovery_scores = [recovery_score(row) for row in recovery if recovery_score(row)]
    readiness_values = [float(row.get("readiness") or 0) for row in recovery if row.get("readiness")]
    soreness_values = [float(row.get("soreness") or 0) for row in recovery if row.get("soreness")]
    fatigue_values = [float(row.get("fatigue") or 0) for row in recovery if row.get("fatigue")]
    hydration_values = [float(row.get("hydration") or 0) for row in recovery if row.get("hydration")]

    logs_by_date: dict[str, list[dict[str, Any]]] = {}
    for log in logs:
        parsed = parse_log_time(log)
        if not parsed:
            continue
        date_key = parsed.date().isoformat()
        if period_start <= parsed.date() <= period_end:
            logs_by_date.setdefault(date_key, []).append(log)

    daily_energy_by_date = {}
    first_meal_by_date = {}
    for date_key, day_logs in logs_by_date.items():
        energy_values = []
        sorted_logs = sorted(day_logs, key=lambda item: parse_log_time(item) or datetime.now())
        for log in sorted_logs:
            try:
                energy_values.append(float(log.get("energy")))
            except (TypeError, ValueError):
                continue
        if energy_values:
            daily_energy_by_date[date_key] = round(sum(energy_values) / len(energy_values), 1)
        first_time = parse_log_time(sorted_logs[0]) if sorted_logs else None
        if first_time:
            first_meal_by_date[date_key] = first_time.hour * 60 + first_time.minute

    sleep_by_date = {str(row.get("sleep_date")): row for row in sleep}
    daily_by_date = {str(row.get("checkin_date")): row for row in daily}
    seven_plus_energy = []
    short_sleep_energy = []
    poor_sleep_cravings = []
    good_sleep_cravings = []
    consistent_sleep_first_meals = []
    inconsistent_sleep_first_meals = []
    avg_bedtime = average_numbers([float(value) for value in bedtime_values])
    for date_key, sleep_row in sleep_by_date.items():
        duration = float(sleep_row.get("duration_minutes") or 0)
        quality = float(sleep_row.get("quality") or 0)
        energy = daily_energy_by_date.get(date_key)
        cravings = daily_by_date.get(date_key, {}).get("cravings")
        bedtime = parse_time_minutes(sleep_row.get("bedtime"))
        first_meal = first_meal_by_date.get(date_key)
        if energy:
            if duration >= 420:
                seven_plus_energy.append(energy)
            elif duration:
                short_sleep_energy.append(energy)
        if cravings:
            if duration < 390 or quality <= 5:
                poor_sleep_cravings.append(float(cravings))
            else:
                good_sleep_cravings.append(float(cravings))
        if first_meal and bedtime is not None and avg_bedtime is not None:
            if abs(bedtime - avg_bedtime) <= 60:
                consistent_sleep_first_meals.append(float(first_meal))
            else:
                inconsistent_sleep_first_meals.append(float(first_meal))

    observations = []
    suggestions = []
    if sleep_hours:
        observations.append(f"Average sleep is {round(sum(sleep_hours) / len(sleep_hours), 1)} hours.")
    if sleep_debt_values:
        observations.append(f"Average sleep debt is {round(sum(sleep_debt_values) / len(sleep_debt_values), 1)} hours per logged night.")
    if recovery_scores:
        observations.append(f"Average recovery score is {round(sum(recovery_scores) / len(recovery_scores))}/100.")
    if poor_sleep_cravings and good_sleep_cravings:
        observations.append("Cravings can be compared across shorter and steadier sleep days.")
    if sleep_consistency_score < 70:
        suggestions.append("Choose one sleep anchor this week: a consistent wake time or a calmer bedtime window.")
    else:
        suggestions.append("Keep protecting your current sleep rhythm; consistency is becoming a strength.")
    if average_numbers(sleep_hours or []) and (average_numbers(sleep_hours) or 0) < 7:
        suggestions.append("Aim to add 20-30 minutes of sleep before changing anything complicated.")
    if recovery_scores and (average_numbers(recovery_scores) or 0) < 65:
        suggestions.append("Pair training days with hydration, an easy protein meal, and a lower-pressure evening routine.")

    return {
        "period_start": period_start.isoformat(),
        "period_end": period_end.isoformat(),
        "days_analyzed": safe_days,
        "daily_checkins_count": len(daily),
        "sleep_logs_count": len(sleep),
        "recovery_logs_count": len(recovery),
        "sleep": {
            "average_duration_hours": round(sum(sleep_hours) / len(sleep_hours), 1) if sleep_hours else 0,
            "average_quality": average_row_value(sleep, "quality"),
            "consistency_score": sleep_consistency_score,
            "average_bedtime": minutes_to_label(avg_bedtime),
            "average_wake_time": minutes_to_label(average_numbers([float(value) for value in wake_values])),
            "bedtime_variability_minutes": round(bedtime_variability),
            "wake_time_variability_minutes": round(wake_variability),
            "average_sleep_debt_hours": round(sum(sleep_debt_values) / len(sleep_debt_values), 1) if sleep_debt_values else 0,
            "sleep_debt_trend": trend_delta(sleep_debt_values),
            "weekday_average_hours": round(sum(float(row.get("duration_minutes") or 0) for row in weekday_sleep) / len(weekday_sleep) / 60, 1) if weekday_sleep else 0,
            "weekend_average_hours": round(sum(float(row.get("duration_minutes") or 0) for row in weekend_sleep) / len(weekend_sleep) / 60, 1) if weekend_sleep else 0,
            "weekday_quality": average_row_value(weekday_sleep, "quality"),
            "weekend_quality": average_row_value(weekend_sleep, "quality"),
        },
        "recovery": {
            "average_recovery_score": round(sum(recovery_scores) / len(recovery_scores)) if recovery_scores else 0,
            "average_readiness": average_row_value(recovery, "readiness"),
            "average_soreness": average_row_value(recovery, "soreness"),
            "average_fatigue": average_row_value(recovery, "fatigue"),
            "average_hydration": average_row_value(recovery, "hydration"),
            "readiness_trend": trend_delta(readiness_values),
            "soreness_trend": trend_delta(soreness_values),
            "fatigue_trend": trend_delta(fatigue_values),
        },
        "stress_cravings": {
            "average_energy": average_row_value(daily, "energy"),
            "average_stress": average_row_value(daily, "stress"),
            "average_cravings": average_row_value(daily, "cravings"),
            "average_cravings_after_poor_sleep": round(sum(poor_sleep_cravings) / len(poor_sleep_cravings), 1) if poor_sleep_cravings else 0,
            "average_cravings_after_better_sleep": round(sum(good_sleep_cravings) / len(good_sleep_cravings), 1) if good_sleep_cravings else 0,
        },
        "associations": {
            "energy_after_7h_sleep": round(sum(seven_plus_energy) / len(seven_plus_energy), 1) if seven_plus_energy else 0,
            "energy_after_short_sleep": round(sum(short_sleep_energy) / len(short_sleep_energy), 1) if short_sleep_energy else 0,
            "first_meal_after_consistent_sleep": minutes_to_label(average_numbers(consistent_sleep_first_meals)),
            "first_meal_after_inconsistent_sleep": minutes_to_label(average_numbers(inconsistent_sleep_first_meals)),
        },
        "observations": observations[:4],
        "suggestions": suggestions[:3],
        "profile_goal": profile.get("goal") or "your goal",
        "future_ready": {
            "circadian_rhythm_coaching": True,
            "smoking_tracking": True,
            "wearable_integrations": True,
        },
    }


def build_sleep_recovery_fallback(metrics: dict[str, Any], profile: dict[str, Any]) -> dict[str, Any]:
    name = profile.get("name") or "there"
    sleep = metrics.get("sleep", {})
    recovery = metrics.get("recovery", {})
    return {
        "summary": (
            f"{name}, your wellbeing rhythm is starting to connect: average sleep is "
            f"{sleep.get('average_duration_hours', 0)} hours, sleep consistency is "
            f"{sleep.get('consistency_score', 0)}/100, and recovery is "
            f"{recovery.get('average_recovery_score', 0)}/100. Treat this as feedback, not pressure: "
            "small changes to sleep and recovery often make food choices feel easier."
        ),
        "suggestions": metrics.get("suggestions") or [
            "Protect one consistent wake time for the next seven days.",
            "Use hydration and a protein-rich meal as your recovery baseline.",
            "If cravings rise after short sleep, plan a satisfying snack before they peak.",
        ],
    }


def format_sleep_recovery_context_for_prompt(metrics: dict[str, Any]) -> str:
    if not metrics.get("daily_checkins_count") and not metrics.get("sleep_logs_count") and not metrics.get("recovery_logs_count"):
        return "Not enough sleep or recovery check-ins yet."
    sleep = metrics.get("sleep", {})
    recovery = metrics.get("recovery", {})
    stress = metrics.get("stress_cravings", {})
    assoc = metrics.get("associations", {})
    return "\n".join([
        f"- Average sleep: {sleep.get('average_duration_hours', 0)} hours; quality: {sleep.get('average_quality', 0)}/10.",
        f"- Sleep consistency: {sleep.get('consistency_score', 0)}/100; average bedtime: {sleep.get('average_bedtime', 'Not enough data')}.",
        f"- Sleep debt: {sleep.get('average_sleep_debt_hours', 0)} hours per logged night.",
        f"- Recovery score: {recovery.get('average_recovery_score', 0)}/100; readiness: {recovery.get('average_readiness', 0)}/10.",
        f"- Stress: {stress.get('average_stress', 0)}/10; cravings: {stress.get('average_cravings', 0)}/10.",
        f"- Energy after 7+ hour sleep: {assoc.get('energy_after_7h_sleep', 0)}/10 vs short sleep: {assoc.get('energy_after_short_sleep', 0)}/10.",
    ])


def normalize_habit_type(event_type: str) -> str:
    normalized = re.sub(r"[^a-z_]", "_", event_type.strip().lower())
    return normalized or "habit"


def save_habit_event(user_id: int, data: HabitEventRequest) -> dict[str, Any]:
    event_type = normalize_habit_type(data.event_type)
    timestamp = data.timestamp or datetime.now().isoformat()
    try:
        parsed = datetime.fromisoformat(str(timestamp).replace("Z", "+00:00"))
        timestamp = parsed.isoformat()
    except ValueError:
        timestamp = datetime.now().isoformat()
    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO habit_events (
                user_id, event_type, timestamp, quantity, intensity, trigger, context, mood, notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                event_type,
                timestamp,
                float(data.quantity or 0),
                clamp_int(data.intensity),
                data.trigger.strip()[:120],
                data.context.strip()[:180],
                data.mood.strip()[:80],
                data.notes.strip()[:1000],
            ),
        )
        event_id = cursor.lastrowid
    return {"event_id": event_id, "event_type": event_type}


def load_habit_events(user_id: int, days: int = 30) -> list[dict[str, Any]]:
    safe_days = max(1, min(int(days or 30), 180))
    start = datetime.now() - timedelta(days=safe_days - 1)
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT id, event_type, timestamp, quantity, intensity, trigger, context, mood, notes, created_at
            FROM habit_events
            WHERE user_id = ? AND timestamp >= ?
            ORDER BY timestamp ASC, id ASC
            """,
            (user_id, start.isoformat()),
        ).fetchall()
    return [row_to_dict(row) for row in rows]


def event_time_window(parsed_time: datetime) -> str:
    hour = parsed_time.hour
    if 5 <= hour < 10:
        return "morning"
    if 10 <= hour < 14:
        return "midday"
    if 14 <= hour < 18:
        return "afternoon"
    if 18 <= hour < 22:
        return "evening"
    return "late night"


def parse_event_time(event: dict[str, Any]) -> datetime | None:
    try:
        parsed = datetime.fromisoformat(str(event.get("timestamp", "")).replace("Z", "+00:00"))
        if parsed.tzinfo:
            parsed = parsed.astimezone().replace(tzinfo=None)
        return parsed
    except ValueError:
        return None


def top_counts(items: list[str], limit: int = 5) -> list[dict[str, Any]]:
    counts: dict[str, int] = {}
    for item in items:
        cleaned = item.strip() if item else "Not specified"
        counts[cleaned] = counts.get(cleaned, 0) + 1
    return [
        {"label": label, "count": count}
        for label, count in sorted(counts.items(), key=lambda pair: (-pair[1], pair[0]))[:limit]
    ]


def event_frequency_trend(events: list[dict[str, Any]]) -> dict[str, Any]:
    if len(events) < 2:
        return {"direction": "steady", "delta": 0, "earlier_count": len(events), "later_count": len(events)}
    parsed = [(parse_event_time(event), event) for event in events]
    parsed = [(time, event) for time, event in parsed if time]
    if len(parsed) < 2:
        return {"direction": "steady", "delta": 0, "earlier_count": len(events), "later_count": len(events)}
    parsed.sort(key=lambda item: item[0])
    midpoint = len(parsed) // 2
    earlier = parsed[:midpoint]
    later = parsed[midpoint:]
    delta = len(later) - len(earlier)
    if delta >= 2:
        direction = "increasing"
    elif delta <= -2:
        direction = "decreasing"
    else:
        direction = "steady"
    return {
        "direction": direction,
        "delta": delta,
        "earlier_count": len(earlier),
        "later_count": len(later),
    }


def build_habit_metrics(
    events: list[dict[str, Any]],
    logs: list[dict[str, Any]],
    wellbeing: dict[str, Any],
    profile: dict[str, Any],
    days: int = 7,
) -> dict[str, Any]:
    today = datetime.now().date()
    safe_days = max(1, min(int(days or 7), 30))
    period_start = today - timedelta(days=safe_days - 1)
    period_end = today
    normalized = []
    for event in events:
        parsed = parse_event_time(event)
        if not parsed:
            continue
        if period_start <= parsed.date() <= period_end:
            normalized.append({**event, "_parsed_time": parsed, "_date": parsed.date(), "_window": event_time_window(parsed)})

    by_type: dict[str, list[dict[str, Any]]] = {}
    for event in normalized:
        by_type.setdefault(str(event.get("event_type") or "habit"), []).append(event)

    intensity_events = [
        event for event in normalized
        if event.get("intensity") is not None
    ]
    trigger_counts = top_counts([str(event.get("trigger") or "") for event in normalized])
    context_counts = top_counts([str(event.get("context") or "") for event in normalized])
    mood_counts = top_counts([str(event.get("mood") or "") for event in normalized])

    window_groups: dict[str, list[float]] = {}
    for event in intensity_events:
        try:
            intensity = float(event.get("intensity"))
        except (TypeError, ValueError):
            continue
        window_groups.setdefault(event["_window"], []).append(intensity)
    strongest_windows = [
        {
            "window": window,
            "average_intensity": round(sum(values) / len(values), 1),
            "count": len(values),
        }
        for window, values in sorted(window_groups.items(), key=lambda item: (-(sum(item[1]) / len(item[1])), -len(item[1])))
    ]

    daily_by_date = {
        str(row.get("checkin_date")): row
        for row in wellbeing.get("daily_checkins", [])
    }
    sleep_by_date = {
        str(row.get("sleep_date")): row
        for row in wellbeing.get("sleep_logs", [])
    }
    high_stress_events = []
    lower_stress_events = []
    poor_sleep_events = []
    better_sleep_events = []
    for event in normalized:
        date_key = event["_date"].isoformat()
        stress = daily_by_date.get(date_key, {}).get("stress")
        sleep_row = sleep_by_date.get(date_key, {})
        duration = float(sleep_row.get("duration_minutes") or 0)
        quality = float(sleep_row.get("quality") or 0)
        if stress:
            if float(stress) >= 7:
                high_stress_events.append(event)
            else:
                lower_stress_events.append(event)
        if duration or quality:
            if duration < 390 or quality <= 5:
                poor_sleep_events.append(event)
            else:
                better_sleep_events.append(event)

    logs_by_date: dict[str, list[dict[str, Any]]] = {}
    for log in logs:
        parsed = parse_log_time(log)
        if not parsed:
            continue
        logs_by_date.setdefault(parsed.date().isoformat(), []).append({**log, "_parsed_time": parsed})

    after_long_gap_events = []
    late_night_events = []
    next_day_energy_after_alcohol = []
    daily_energy: dict[str, float] = {}
    for date_key, day_logs in logs_by_date.items():
        energies = []
        for log in day_logs:
            try:
                energies.append(float(log.get("energy")))
            except (TypeError, ValueError):
                continue
        if energies:
            daily_energy[date_key] = round(sum(energies) / len(energies), 1)

    for event in normalized:
        event_time = event["_parsed_time"]
        if event_time.hour >= 22 or event_time.hour < 4:
            late_night_events.append(event)
        day_logs = sorted(logs_by_date.get(event["_date"].isoformat(), []), key=lambda item: item["_parsed_time"])
        previous_meals = [log for log in day_logs if log["_parsed_time"] < event_time]
        if previous_meals:
            gap = (event_time - previous_meals[-1]["_parsed_time"]).total_seconds() / 3600
            if gap >= 5:
                after_long_gap_events.append(event)
        if event.get("event_type") == "alcohol":
            next_day = (event["_date"] + timedelta(days=1)).isoformat()
            if next_day in daily_energy:
                next_day_energy_after_alcohol.append(daily_energy[next_day])

    alcohol_free_energy = []
    alcohol_dates = {event["_date"].isoformat() for event in by_type.get("alcohol", [])}
    for date_key, energy in daily_energy.items():
        if date_key not in alcohol_dates:
            alcohol_free_energy.append(energy)

    event_type_summary = [
        {
            "event_type": event_type,
            "count": len(type_events),
            "total_quantity": round(sum(float(event.get("quantity") or 0) for event in type_events), 1),
            "average_intensity": round(sum(float(event.get("intensity") or 0) for event in type_events if event.get("intensity")) / max(1, len([event for event in type_events if event.get("intensity")])), 1),
            "trend": event_frequency_trend(type_events),
        }
        for event_type, type_events in sorted(by_type.items())
    ]

    observations = []
    suggestions = []
    if trigger_counts:
        observations.append(f"Most common trigger: {trigger_counts[0]['label']} ({trigger_counts[0]['count']} events).")
    if strongest_windows:
        observations.append(f"Strongest habit window: {strongest_windows[0]['window']} with {strongest_windows[0]['average_intensity']}/10 average intensity.")
    if high_stress_events:
        observations.append(f"{len(high_stress_events)} events happened on higher-stress days.")
    if poor_sleep_events:
        observations.append(f"{len(poor_sleep_events)} events happened after shorter or lower-quality sleep.")
    if after_long_gap_events:
        observations.append(f"{len(after_long_gap_events)} events happened after a 5+ hour meal gap.")
    if trigger_counts:
        suggestions.append(f"Plan one replacement action for your top trigger: {trigger_counts[0]['label']}.")
    if strongest_windows:
        suggestions.append(f"Prepare support before your strongest window: {strongest_windows[0]['window']}.")
    if poor_sleep_events:
        suggestions.append("On short-sleep days, make the next choice easier with hydration and a planned snack.")

    return {
        "period_start": period_start.isoformat(),
        "period_end": period_end.isoformat(),
        "days_analyzed": safe_days,
        "total_events": len(normalized),
        "event_type_summary": event_type_summary,
        "most_common_triggers": trigger_counts,
        "most_common_contexts": context_counts,
        "mood_correlations": mood_counts,
        "strongest_craving_windows": strongest_windows,
        "smoking_frequency_trend": event_frequency_trend(by_type.get("smoking", [])),
        "alcohol_frequency_trend": event_frequency_trend(by_type.get("alcohol", [])),
        "stress_correlation": {
            "events_on_high_stress_days": len(high_stress_events),
            "events_on_lower_stress_days": len(lower_stress_events),
            "high_stress_threshold": "7/10 or higher",
        },
        "sleep_correlation": {
            "events_after_poor_sleep": len(poor_sleep_events),
            "events_after_better_sleep": len(better_sleep_events),
            "poor_sleep_definition": "under 6.5h or quality 5/10 or lower",
        },
        "meal_timing_correlation": {
            "events_after_long_meal_gap": len(after_long_gap_events),
            "long_gap_threshold": "5+ hours since previous meal",
            "late_night_events": len(late_night_events),
        },
        "alcohol_energy": {
            "next_day_energy_after_alcohol": round(sum(next_day_energy_after_alcohol) / len(next_day_energy_after_alcohol), 1) if next_day_energy_after_alcohol else 0,
            "energy_on_alcohol_free_days": round(sum(alcohol_free_energy) / len(alcohol_free_energy), 1) if alcohol_free_energy else 0,
        },
        "observations": observations[:5],
        "suggestions": suggestions[:3],
        "profile_goal": profile.get("goal") or "your goal",
        "future_ready": {
            "drink_smarter": True,
            "social_eating_guidance": True,
            "smoking_reduction_coaching": True,
            "habit_replacement_strategies": True,
            "alcohol_recovery_planning": True,
        },
    }


def build_habit_fallback(metrics: dict[str, Any], profile: dict[str, Any]) -> dict[str, Any]:
    name = profile.get("name") or "there"
    total = metrics.get("total_events", 0)
    trigger = (metrics.get("most_common_triggers") or [{}])[0].get("label", "not enough data")
    window = (metrics.get("strongest_craving_windows") or [{}])[0].get("window", "not enough data")
    return {
        "summary": (
            f"{name}, FuelFlow found {total} habit event signals this week. "
            f"Your most common trigger is {trigger}, and your strongest window is {window}. "
            "This is awareness, not judgment: the next step is making one supportive choice easier before the pattern starts."
        ),
        "suggestions": metrics.get("suggestions") or [
            "Pick one trigger and prepare a replacement action before it appears.",
            "Use sleep and meals as support tools on higher-intensity days.",
            "Ask Sizzle for a tiny recovery plan after alcohol, cravings, or smoking events.",
        ],
    }


def format_habit_context_for_prompt(metrics: dict[str, Any]) -> str:
    if not metrics.get("total_events"):
        return "No habit events logged yet."
    trigger = (metrics.get("most_common_triggers") or [{}])[0]
    window = (metrics.get("strongest_craving_windows") or [{}])[0]
    smoking = metrics.get("smoking_frequency_trend", {})
    alcohol = metrics.get("alcohol_frequency_trend", {})
    stress = metrics.get("stress_correlation", {})
    sleep = metrics.get("sleep_correlation", {})
    timing = metrics.get("meal_timing_correlation", {})
    alcohol_energy = metrics.get("alcohol_energy", {})
    return "\n".join([
        f"- Total habit events this week: {metrics.get('total_events', 0)}.",
        f"- Top trigger: {trigger.get('label', 'Not specified')} ({trigger.get('count', 0)} events).",
        f"- Strongest window: {window.get('window', 'Not enough data')} at {window.get('average_intensity', 0)}/10 average intensity.",
        f"- Smoking trend: {smoking.get('direction', 'steady')}; alcohol trend: {alcohol.get('direction', 'steady')}.",
        f"- Events on high-stress days: {stress.get('events_on_high_stress_days', 0)}.",
        f"- Events after poor sleep: {sleep.get('events_after_poor_sleep', 0)}.",
        f"- Events after long meal gaps: {timing.get('events_after_long_meal_gap', 0)}; late-night events: {timing.get('late_night_events', 0)}.",
        f"- Next-day energy after alcohol: {alcohol_energy.get('next_day_energy_after_alcohol', 0)}/10 vs alcohol-free days: {alcohol_energy.get('energy_on_alcohol_free_days', 0)}/10.",
    ])


def normalize_drink_type(drink_type: str) -> str:
    value = (drink_type or "").strip().lower()
    aliases = {
        "beer": "beer",
        "light beer": "beer",
        "wine": "wine",
        "red wine": "wine",
        "white wine": "wine",
        "whiskey": "whiskey",
        "whisky": "whiskey",
        "vodka": "vodka",
        "gin": "gin",
        "rum": "rum",
        "cocktail": "cocktails",
        "cocktails": "cocktails",
        "mixed drink": "cocktails",
    }
    return aliases.get(value, value if value in DRINK_REFERENCE else "beer")


def drink_reference_for(drink_type: str) -> dict[str, Any]:
    key = normalize_drink_type(drink_type)
    return {"key": key, **DRINK_REFERENCE.get(key, DRINK_REFERENCE["beer"])}


def estimate_drink_calories(drink_type: str, quantity: float | int | None) -> int:
    ref = drink_reference_for(drink_type)
    try:
        count = max(float(quantity or 0), 0)
    except (TypeError, ValueError):
        count = 0
    return round(ref["estimated_calories"] * count)


def alcohol_events_from_logs(logs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    events = []
    for log in logs:
        if not log.get("alcohol"):
            continue
        parsed = parse_log_time(log)
        if not parsed:
            continue
        events.append({
            "event_type": "alcohol",
            "timestamp": parsed.isoformat(),
            "quantity": float(log.get("drinks") or 1),
            "context": "meal log",
            "mood": (log.get("moodAfter") or {}).get("emoji") or "",
            "notes": log.get("mealName") or "",
            "_parsed_time": parsed,
            "_date": parsed.date(),
        })
    return events


def recent_alcohol_signals(events: list[dict[str, Any]], logs: list[dict[str, Any]], days: int = 14) -> list[dict[str, Any]]:
    today = datetime.now().date()
    start = today - timedelta(days=max(1, days) - 1)
    signals = []
    for event in events:
        if event.get("event_type") != "alcohol":
            continue
        parsed = parse_event_time(event)
        if parsed and start <= parsed.date() <= today:
            signals.append({**event, "_parsed_time": parsed, "_date": parsed.date()})
    signals.extend([event for event in alcohol_events_from_logs(logs) if start <= event["_date"] <= today])
    return sorted(signals, key=lambda item: item["_parsed_time"])


def build_social_event_plan(
    data: SocialPlanRequest,
    profile: dict[str, Any],
    events: list[dict[str, Any]],
    logs: list[dict[str, Any]],
    wellbeing: dict[str, Any],
) -> dict[str, Any]:
    drink = drink_reference_for(data.drink_type)
    planned_drinks = max(float(data.planned_drinks or 0), 0)
    estimated_calories = estimate_drink_calories(drink["key"], planned_drinks)
    goal = str(profile.get("goal") or data.user_profile.get("goal") or "your goal")
    event_type = (data.event_type or "drinks with friends").strip()
    recent_signals = recent_alcohol_signals(events, logs, 14)
    timing_metrics = build_food_timing_metrics(logs, profile, 14)
    sleep_metrics = build_sleep_recovery_metrics(logs, wellbeing, profile, 14)
    habit_metrics = build_habit_metrics(events, logs, wellbeing, profile, 14)
    avg_sleep = sleep_metrics.get("sleep", {}).get("average_duration_hours", 0)
    next_day_energy = habit_metrics.get("alcohol_energy", {}).get("next_day_energy_after_alcohol", 0)

    pre_event_meal = "Have a protein-forward meal 2-3 hours before you go: eggs/paneer/chicken/tofu plus rice, roti, or potatoes."
    if "lose" in goal.lower() or "cut" in goal.lower():
        pre_event_meal = "Anchor the day with lean protein and vegetables, then keep the pre-event meal lighter but satisfying."
    elif "gain" in goal.lower() or "bulk" in goal.lower():
        pre_event_meal = "Do not under-eat before going out: include protein plus carbs so training recovery stays supported."

    during_food = "Choose one filling plate if food is available: grilled protein, dal/paneer/chicken, rice/roti, and salad or vegetables."
    if event_type.lower() in {"wedding", "vacation", "dinner outing"}:
        during_food = "Enjoy the cultural food. Build the first plate around protein, then choose the items you genuinely want."

    recovery_meal = "Next day, start with water and a steady breakfast: eggs or paneer/tofu with fruit, curd, or dal."
    if next_day_energy and next_day_energy < 6:
        recovery_meal = "Your next-day energy has dipped after alcohol before, so prioritize water, electrolytes, and a protein-rich breakfast."
    if avg_sleep and avg_sleep < 7:
        recovery_meal += " Protect sleep tonight because it is already one of your strongest recovery levers."

    return {
        "event_type": event_type,
        "planned_drinks": planned_drinks,
        "estimated_calorie_impact": estimated_calories,
        "selected_drink": drink,
        "before_event": [
            pre_event_meal,
            "Drink 500-750 ml water before leaving and add electrolytes if you will be dancing or out late.",
            "Avoid arriving very hungry; long gaps make social decisions harder than they need to be.",
        ],
        "during_event": [
            f"If you choose {drink['label']}, plan around about {drink['estimated_calories']} kcal per {drink['serving']}.",
            drink["hydration_recommendation"],
            during_food,
            "Pick a pace you can feel good about tomorrow: one drink, one water, then check in with yourself.",
        ],
        "after_event": [
            recovery_meal,
            "Keep the next meal simple: protein, easy carbs, fruit or vegetables, and water.",
            "One social night does not define your progress. The reset is just the next supportive choice.",
        ],
        "smart_meal_adjustments": [
            "Before: lighter fats, steady protein, and enough carbs to avoid showing up depleted.",
            "During: choose the drink you enjoy, then reduce hidden calories with soda water, lime, or diet mixers.",
            "After: hydration first, then breakfast with 25-35g protein if that fits your body size.",
        ],
        "alternatives": {
            "lower_calorie": drink["lower_calorie_alternatives"],
            "goal_friendly": drink["goal_friendly_alternatives"],
        },
        "supportive_note": "Enjoy the experience. FuelFlow will help you adjust the plan, not shame the moment.",
        "recent_pattern": {
            "alcohol_signals_14_days": len(recent_signals),
            "next_day_energy_after_alcohol": next_day_energy,
            "meal_timing_consistency": timing_metrics.get("consistency_score", 0),
        },
    }


def build_social_balance_metrics(
    events: list[dict[str, Any]],
    logs: list[dict[str, Any]],
    wellbeing: dict[str, Any],
    profile: dict[str, Any],
    days: int = 7,
) -> dict[str, Any]:
    safe_days = max(1, min(int(days or 7), 30))
    today = datetime.now().date()
    period_start = today - timedelta(days=safe_days - 1)
    period_end = today
    alcohol_signals = [
        event for event in recent_alcohol_signals(events, logs, safe_days)
        if period_start <= event["_date"] <= period_end
    ]
    drinking_dates = {event["_date"].isoformat() for event in alcohol_signals}
    estimated_calories = 0
    by_drink: dict[str, float] = {}
    for event in alcohol_signals:
        drink_key = normalize_drink_type(str(event.get("context") or event.get("notes") or "beer"))
        quantity = float(event.get("quantity") or 1)
        by_drink[drink_key] = by_drink.get(drink_key, 0) + quantity
        estimated_calories += estimate_drink_calories(drink_key, quantity)

    daily_by_date = {str(row.get("checkin_date")): row for row in wellbeing.get("daily_checkins", [])}
    sleep_by_date = {str(row.get("sleep_date")): row for row in wellbeing.get("sleep_logs", [])}
    recovery_by_date = {str(row.get("log_date")): row for row in wellbeing.get("recovery_logs", [])}
    next_day_energy = []
    next_day_recovery = []
    next_day_sleep_quality = []
    for date_key in drinking_dates:
        next_day = (date.fromisoformat(date_key) + timedelta(days=1)).isoformat()
        daily = daily_by_date.get(next_day, {})
        sleep = sleep_by_date.get(next_day, {})
        recovery = recovery_by_date.get(next_day, {})
        if daily.get("energy"):
            next_day_energy.append(float(daily["energy"]))
        if recovery:
            next_day_recovery.append(recovery_score(recovery))
        if sleep.get("quality"):
            next_day_sleep_quality.append(float(sleep["quality"]))

    alcohol_free_energy = [
        float(row["energy"])
        for date_key, row in daily_by_date.items()
        if date_key not in drinking_dates and row.get("energy")
    ]
    frequency = len(drinking_dates)
    frequency_ratio = frequency / safe_days
    recovery_quality = round(average_numbers(next_day_recovery) or 0)
    compatibility_scores = []
    for drink_key, quantity in by_drink.items():
        score = DRINK_REFERENCE.get(drink_key, DRINK_REFERENCE["beer"])["goal_compatibility_score"]
        compatibility_scores.extend([score] * max(1, round(quantity)))
    drink_compatibility = round(average_numbers(compatibility_scores) or 0)
    goal_alignment_score = 100
    goal_alignment_score -= min(35, round(frequency_ratio * 45))
    goal_alignment_score -= min(25, round((estimated_calories / max(1, safe_days)) / 20))
    if drink_compatibility:
        goal_alignment_score = round((goal_alignment_score + drink_compatibility) / 2)
    if next_day_energy and average_numbers(next_day_energy) and average_numbers(next_day_energy) < 6:
        goal_alignment_score -= 8
    goal_alignment_score = max(0, min(100, goal_alignment_score))

    opportunities = []
    if frequency:
        opportunities.append("Choose a protein anchor before social events so the night starts steady.")
    if estimated_calories:
        opportunities.append("Use low-sugar mixers or alternate with water to reduce hidden calorie load.")
    if next_day_energy and (average_numbers(next_day_energy) or 0) < 6:
        opportunities.append("Plan a next-day recovery breakfast and hydration before the night starts.")
    if not opportunities:
        opportunities.append("Keep social flexibility available: planning ahead makes enjoyment easier.")

    top_drink = max(by_drink.items(), key=lambda item: item[1])[0] if by_drink else "not enough data"
    observations = []
    if frequency:
        observations.append(f"Alcohol/social drinking appeared on {frequency} day(s) in this period.")
        observations.append(f"Estimated alcohol calorie impact: about {estimated_calories} kcal.")
    if next_day_energy:
        observations.append(f"Average next-day energy after alcohol: {round(sum(next_day_energy) / len(next_day_energy), 1)}/10.")
    if alcohol_free_energy:
        observations.append(f"Average energy on alcohol-free check-in days: {round(sum(alcohol_free_energy) / len(alcohol_free_energy), 1)}/10.")

    return {
        "period_start": period_start.isoformat(),
        "period_end": period_end.isoformat(),
        "days_analyzed": safe_days,
        "drinking_frequency_days": frequency,
        "drinking_frequency_label": f"{frequency}/{safe_days} days",
        "estimated_calorie_impact": estimated_calories,
        "top_drink": top_drink,
        "drink_breakdown": [
            {
                "drink_type": key,
                "label": DRINK_REFERENCE.get(key, DRINK_REFERENCE["beer"])["label"],
                "quantity": round(value, 1),
                "estimated_calories": estimate_drink_calories(key, value),
            }
            for key, value in sorted(by_drink.items(), key=lambda item: -item[1])
        ],
        "recovery_quality": {
            "average_next_day_energy": round(sum(next_day_energy) / len(next_day_energy), 1) if next_day_energy else 0,
            "average_next_day_recovery": recovery_quality,
            "average_next_day_sleep_quality": round(sum(next_day_sleep_quality) / len(next_day_sleep_quality), 1) if next_day_sleep_quality else 0,
            "alcohol_free_energy": round(sum(alcohol_free_energy) / len(alcohol_free_energy), 1) if alcohol_free_energy else 0,
        },
        "goal_alignment_score": goal_alignment_score,
        "goal": profile.get("goal") or "your goal",
        "improvement_opportunities": opportunities[:3],
        "observations": observations[:5],
        "supportive_reframe": "Social events can fit your life. The goal is to plan, enjoy, recover, and keep moving.",
    }


def build_social_balance_fallback(metrics: dict[str, Any], profile: dict[str, Any]) -> dict[str, Any]:
    name = profile.get("name") or "there"
    return {
        "summary": (
            f"{name}, your social balance score is {metrics.get('goal_alignment_score', 0)}/100 this week. "
            f"FuelFlow found {metrics.get('drinking_frequency_label', '0 days')} with an estimated "
            f"{metrics.get('estimated_calorie_impact', 0)} kcal impact. This is not a judgment; it is a planning signal "
            "so your social life and goals can coexist."
        ),
        "suggestions": metrics.get("improvement_opportunities") or [
            "Eat a protein-forward meal before social events.",
            "Alternate drinks with water to support recovery.",
            "Plan a simple next-day breakfast before the night starts.",
        ],
    }


def format_social_context_for_prompt(metrics: dict[str, Any]) -> str:
    if not metrics.get("drinking_frequency_days"):
        return "No recent alcohol or social drinking pattern logged."
    recovery = metrics.get("recovery_quality", {})
    return "\n".join([
        f"- Social drinking frequency: {metrics.get('drinking_frequency_label', '0 days')}.",
        f"- Estimated alcohol calorie impact: {metrics.get('estimated_calorie_impact', 0)} kcal.",
        f"- Most common drink signal: {metrics.get('top_drink', 'not enough data')}.",
        f"- Goal alignment score: {metrics.get('goal_alignment_score', 0)}/100.",
        f"- Next-day energy after alcohol: {recovery.get('average_next_day_energy', 0)}/10.",
        f"- Alcohol-free energy: {recovery.get('alcohol_free_energy', 0)}/10.",
    ])


def row_to_meal_plan(row: sqlite3.Row | None) -> dict[str, Any] | None:
    if not row:
        return None
    try:
        plan = json.loads(row["plan_data"] or "{}")
    except json.JSONDecodeError:
        plan = {}
    plan["_server_id"] = row["id"]
    plan["_created_at"] = row["created_at"]
    return plan


def load_meal_plan_rows(user_id: int, limit: int = 12) -> list[dict[str, Any]]:
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT id, plan_data, created_at
            FROM meal_plans
            WHERE user_id = ?
            ORDER BY created_at DESC, id DESC
            LIMIT ?
            """,
            (user_id, limit),
        ).fetchall()
    return [plan for row in rows if (plan := row_to_meal_plan(row))]


def save_plan_adherence(user_id: int, data: PlanAdherenceRequest) -> dict[str, Any]:
    status = (data.status or "eaten").strip().lower()
    if status not in {"eaten", "swapped", "skipped"}:
        raise HTTPException(status_code=400, detail="Status must be eaten, swapped, or skipped.")
    with get_db() as conn:
        conn.execute(
            """
            INSERT INTO plan_adherence (
                user_id, plan_id, plan_created_at, day, meal_index, meal_name, meal_type, status, notes, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, plan_id, plan_created_at, day, meal_index)
            DO UPDATE SET
                meal_name = excluded.meal_name,
                meal_type = excluded.meal_type,
                status = excluded.status,
                notes = excluded.notes,
                updated_at = CURRENT_TIMESTAMP
            """,
            (
                user_id,
                data.plan_id,
                data.plan_created_at,
                data.day,
                data.meal_index,
                data.meal_name,
                data.meal_type,
                status,
                data.notes,
            ),
        )
    return {"ok": True, "status": status}


def load_plan_adherence(user_id: int, plan_id: int | None = None, days: int = 30) -> list[dict[str, Any]]:
    safe_days = max(1, min(int(days or 30), 90))
    params: list[Any] = [user_id, f"-{safe_days} days"]
    filter_sql = ""
    if plan_id:
        filter_sql = "AND plan_id = ?"
        params.append(plan_id)
    with get_db() as conn:
        rows = conn.execute(
            f"""
            SELECT id, plan_id, plan_created_at, day, meal_index, meal_name, meal_type, status, notes, created_at, updated_at
            FROM plan_adherence
            WHERE user_id = ? AND datetime(updated_at) >= datetime('now', ?)
            {filter_sql}
            ORDER BY updated_at DESC, id DESC
            """,
            params,
        ).fetchall()
    return [row_to_dict(row) for row in rows]


def build_plan_adherence_metrics(records: list[dict[str, Any]]) -> dict[str, Any]:
    total = len(records)
    status_counts = {
        "eaten": len([row for row in records if row.get("status") == "eaten"]),
        "swapped": len([row for row in records if row.get("status") == "swapped"]),
        "skipped": len([row for row in records if row.get("status") == "skipped"]),
    }
    followed = status_counts["eaten"] + status_counts["swapped"]
    adherence_rate = round((followed / total) * 100) if total else 0
    skipped_rate = round((status_counts["skipped"] / total) * 100) if total else 0
    swap_rate = round((status_counts["swapped"] / total) * 100) if total else 0
    meal_type_counts = top_counts([str(row.get("meal_type") or "") for row in records])
    suggestions = []
    if skipped_rate >= 30:
        suggestions.append("Make the next plan simpler: fewer friction meals, more repeatable staples.")
    if swap_rate >= 30:
        suggestions.append("Your swaps are useful data. Ask Sizzle to adapt meals around what you actually prefer.")
    if adherence_rate >= 75:
        suggestions.append("Your plan rhythm is strong. Keep the structure and adjust only what feels hard to repeat.")
    if not suggestions:
        suggestions.append("Mark meals as eaten, swapped, or skipped so FuelFlow can adapt without judgment.")
    return {
        "total_marked": total,
        "status_counts": status_counts,
        "adherence_rate": adherence_rate,
        "skipped_rate": skipped_rate,
        "swap_rate": swap_rate,
        "meal_type_patterns": meal_type_counts,
        "insights": suggestions[:3],
    }


def build_unified_weekly_metrics(user_id: int, days: int = 7) -> dict[str, Any]:
    profile = get_profile(user_id) or {}
    logs = load_user_logs(user_id)
    wellbeing = load_wellbeing_for_period(user_id, days)
    events = load_habit_events(user_id, days)
    adherence = load_plan_adherence(user_id, days=days)
    behavioral = build_behavioral_metrics(logs, profile, days)
    timing = build_food_timing_metrics(logs, profile, days)
    recovery = build_sleep_recovery_metrics(logs, wellbeing, profile, days)
    habits = build_habit_metrics(events, logs, wellbeing, profile, days)
    social = build_social_balance_metrics(events, logs, wellbeing, profile, days)
    plan = build_plan_adherence_metrics(adherence)
    overview_score_values = [
        behavioral.get("goal_alignment_score", 0),
        timing.get("consistency_score", 0),
        recovery.get("sleep", {}).get("consistency_score", 0),
        recovery.get("recovery", {}).get("average_recovery_score", 0),
        social.get("goal_alignment_score", 0),
        plan.get("adherence_rate", 0),
    ]
    meaningful_scores = [float(value) for value in overview_score_values if value]
    overview_score = round(sum(meaningful_scores) / len(meaningful_scores)) if meaningful_scores else 0
    next_actions = []
    for source in (
        build_analytics_fallback(behavioral, profile).get("recommendations", []),
        build_timing_fallback(timing, profile).get("suggestions", []),
        build_sleep_recovery_fallback(recovery, profile).get("suggestions", []),
        build_habit_fallback(habits, profile).get("suggestions", []),
        build_social_balance_fallback(social, profile).get("suggestions", []),
        plan.get("insights", []),
    ):
        for item in source:
            if item and item not in next_actions:
                next_actions.append(item)
    return {
        "period_start": behavioral.get("period_start"),
        "period_end": behavioral.get("period_end"),
        "days_analyzed": max(1, min(int(days or 7), 30)),
        "overview": {
            "score": overview_score,
            "logs_count": behavioral.get("total_logs", 0),
            "meal_consistency": behavioral.get("meal_consistency_score", 0),
            "timing_consistency": timing.get("consistency_score", 0),
            "recovery_score": recovery.get("recovery", {}).get("average_recovery_score", 0),
            "habit_events": habits.get("total_events", 0),
            "social_alignment": social.get("goal_alignment_score", 0),
            "plan_adherence": plan.get("adherence_rate", 0),
        },
        "sections": {
            "food_mood": behavioral,
            "timing": timing,
            "recovery": recovery,
            "habits": habits,
            "social": social,
            "plan_adherence": plan,
        },
        "next_actions": next_actions[:6],
        "profile_goal": profile.get("goal") or "your goal",
    }


def build_unified_weekly_fallback(metrics: dict[str, Any], profile: dict[str, Any]) -> dict[str, Any]:
    name = profile.get("name") or "there"
    overview = metrics.get("overview", {})
    actions = metrics.get("next_actions", [])[:3] or [
        "Log one meal with mood and energy tomorrow.",
        "Complete one quick wellbeing check-in.",
        "Ask Sizzle for one small focus before your next meal.",
    ]
    return {
        "summary": (
            f"{name}, your weekly FuelFlow score is {overview.get('score', 0)}/100. "
            "This combines food, mood, timing, recovery, habits, social balance, and plan follow-through into one practical signal. "
            "Use it as a compass, not a grade: the next week gets easier when you choose one small action and repeat it."
        ),
        "focus": actions[0],
        "actions": actions,
    }


def calculate_plan_macros(profile: dict[str, Any]) -> dict[str, int]:
    calories = int(profile.get("daily_calories") or 2000)
    weight_kg = float(profile.get("weight_kg") or 70)
    plan_type = str(profile.get("plan_type", "Maintain")).lower()
    if plan_type == "cut":
        protein_g = round(weight_kg * 2.0)
        fat_g = round(weight_kg * 0.8)
    elif plan_type == "bulk":
        protein_g = round(weight_kg * 1.8)
        fat_g = round(weight_kg * 1.0)
    elif plan_type == "lean bulk":
        protein_g = round(weight_kg * 2.0)
        fat_g = round(weight_kg * 0.9)
    elif plan_type == "recomp":
        protein_g = round(weight_kg * 2.2)
        fat_g = round(weight_kg * 1.0)
    else:
        protein_g = round(weight_kg * 1.6)
        fat_g = round(weight_kg * 0.9)

    protein_cals = protein_g * 4
    fat_cals = fat_g * 9
    carb_cals = calories - protein_cals - fat_cals
    carbs_g = max(round(carb_cals / 4), 50)
    return {
        "daily_calories": calories,
        "protein_g": protein_g,
        "carbs_g": carbs_g,
        "fat_g": fat_g,
    }


def parse_claude_json(raw: str) -> dict[str, Any]:
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise


ALLOWED_MEMORY_TYPES = {
    "goal",
    "preference",
    "dislike",
    "craving",
    "challenge",
    "motivation_trigger",
    "athlete_profile",
    "nutrition_constraint",
    "food_preference",
    "food_avoidance",
}


def ensure_privacy_settings(user_id: int) -> dict[str, Any]:
    with get_db() as conn:
        row = conn.execute(
            "SELECT ai_memory_enabled FROM user_privacy_settings WHERE user_id = ?",
            (user_id,),
        ).fetchone()
        if not row:
            conn.execute(
                "INSERT INTO user_privacy_settings (user_id, ai_memory_enabled) VALUES (?, ?)",
                (user_id, 1),
            )
            return {"ai_memory_enabled": True}
        return {"ai_memory_enabled": bool(row["ai_memory_enabled"])}


def set_memory_enabled(user_id: int, enabled: bool) -> None:
    with get_db() as conn:
        conn.execute(
            """
            INSERT INTO user_privacy_settings (user_id, ai_memory_enabled, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id) DO UPDATE SET
                ai_memory_enabled = excluded.ai_memory_enabled,
                updated_at = CURRENT_TIMESTAMP
            """,
            (user_id, 1 if enabled else 0),
        )


def save_chat_message(user_id: int, role: str, content: str) -> None:
    safe_role = role if role in {"user", "assistant"} else "user"
    with get_db() as conn:
        conn.execute(
            "INSERT INTO chat_messages (user_id, role, content) VALUES (?, ?, ?)",
            (user_id, safe_role, content[:6000]),
        )


def load_chat_messages(user_id: int, limit: int = 100) -> list[dict[str, Any]]:
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT id, role, content, timestamp
            FROM chat_messages
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT ?
            """,
            (user_id, limit),
        ).fetchall()
    return [
        {
            "id": row["id"],
            "role": row["role"],
            "content": row["content"],
            "timestamp": row["timestamp"],
        }
        for row in reversed(rows)
    ]


def load_ai_memories(user_id: int, limit: int = 40) -> list[dict[str, Any]]:
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT id, memory_type, memory_text, confidence_score, source, created_at, updated_at
            FROM ai_memories
            WHERE user_id = ?
            ORDER BY updated_at DESC, id DESC
            LIMIT ?
            """,
            (user_id, limit),
        ).fetchall()
    return [
        {
            "id": row["id"],
            "memory_type": row["memory_type"],
            "memory_text": row["memory_text"],
            "confidence_score": row["confidence_score"],
            "source": row["source"],
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }
        for row in rows
    ]


def format_memories_for_prompt(memories: list[dict[str, Any]]) -> str:
    if not memories:
        return "No long-term memories stored yet."
    lines = []
    for memory in memories[:16]:
        lines.append(f"- {memory['memory_type']}: {memory['memory_text']}")
    return "\n".join(lines)


def save_ai_memory(
    user_id: int,
    memory_type: str,
    memory_text: str,
    confidence_score: float,
    source: str,
) -> None:
    normalized_type = memory_type.strip().lower()
    text = re.sub(r"\s+", " ", memory_text).strip()
    if normalized_type not in ALLOWED_MEMORY_TYPES or len(text) < 12:
        return

    with get_db() as conn:
        existing = conn.execute(
            """
            SELECT id, memory_text
            FROM ai_memories
            WHERE user_id = ? AND memory_type = ?
            ORDER BY updated_at DESC
            LIMIT 30
            """,
            (user_id, normalized_type),
        ).fetchall()
        lowered = text.lower()
        for row in existing:
            existing_text = row["memory_text"].lower()
            if lowered in existing_text or existing_text in lowered:
                conn.execute(
                    """
                    UPDATE ai_memories
                    SET memory_text = ?, confidence_score = ?, source = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                    """,
                    (text, confidence_score, source, row["id"]),
                )
                return
        conn.execute(
            """
            INSERT INTO ai_memories (user_id, memory_type, memory_text, confidence_score, source)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, normalized_type, text, confidence_score, source),
        )


async def extract_memories_from_message(
    client: httpx.AsyncClient,
    user_id: int,
    user_message: str,
    assistant_reply: str,
    profile_summary: str,
) -> None:
    if not ensure_privacy_settings(user_id)["ai_memory_enabled"]:
        return

    prompt = f"""User profile:
{profile_summary}

User message:
{user_message}

Assistant reply:
{assistant_reply}

Extract only durable long-term memories useful for nutrition and wellbeing coaching.
Ignore temporary questions, generic statements, and sensitive medical diagnosis.
Allowed memory_type values:
{", ".join(sorted(ALLOWED_MEMORY_TYPES))}

Return ONLY valid JSON:
{{"memories": [{{"memory_type": "challenge", "memory_text": "User struggles with late-night cravings.", "confidence_score": 0.8, "source": "chat"}}]}}"""

    try:
        response = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-haiku-4-5-20251001",
                "max_tokens": 500,
                "system": (
                    "You extract concise long-term user memories for FuelFlow. "
                    "Return valid JSON only. If there is nothing worth remembering, return {\"memories\": []}."
                ),
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=45.0,
        )
        response_data = response.json()
        raw = response_data["content"][0]["text"].strip()
        result = parse_claude_json(raw)
        for memory in result.get("memories", [])[:5]:
            save_ai_memory(
                user_id=user_id,
                memory_type=str(memory.get("memory_type", "")),
                memory_text=str(memory.get("memory_text", "")),
                confidence_score=float(memory.get("confidence_score") or 0.7),
                source=str(memory.get("source") or "chat"),
            )
    except Exception as exc:
        print(f"SIZZLE MEMORY EXTRACTION SKIPPED: {exc}")


app = FastAPI(title="FuelFlow")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.post("/api/auth/signup")
async def signup(data: AuthRequest) -> dict[str, Any]:
    email = validate_auth(data.email, data.password)
    password_hash = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    try:
        with get_db() as conn:
            cursor = conn.execute(
                "INSERT INTO users (email, password_hash) VALUES (?, ?)",
                (email, password_hash),
            )
            user_id = cursor.lastrowid
    except sqlite3.IntegrityError as exc:
        raise HTTPException(status_code=400, detail="An account with this email already exists.") from exc
    return {"token": create_token(user_id), "user_id": user_id}


@app.post("/api/auth/login")
async def login(data: AuthRequest) -> dict[str, Any]:
    email = validate_auth(data.email, data.password)
    with get_db() as conn:
        user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    if not user or not bcrypt.checkpw(data.password.encode("utf-8"), user["password_hash"].encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return {
        "token": create_token(user["id"]),
        "user_id": user["id"],
        "has_profile": get_profile(user["id"]) is not None,
    }


@app.get("/api/auth/me")
async def me(user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    return {
        "user": {"id": user["id"], "email": user["email"], "created_at": user["created_at"]},
        "profile": get_profile(user["id"]),
    }


@app.post("/api/profile/save")
async def save_profile(
    data: ProfileSaveRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    with get_db() as conn:
        conn.execute(
            """
            INSERT INTO user_profiles (user_id, profile_data)
            VALUES (?, ?)
            ON CONFLICT(user_id) DO UPDATE SET profile_data = excluded.profile_data
            """,
            (user["id"], json.dumps(data.profile_data)),
        )
    return {"ok": True}


@app.get("/api/profile/get")
async def load_profile(user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    return {"profile_data": get_profile(user["id"])}


@app.post("/api/logs/save")
async def save_logs(
    data: LogsSaveRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    with get_db() as conn:
        conn.execute("DELETE FROM meal_logs WHERE user_id = ?", (user["id"],))
        conn.executemany(
            "INSERT INTO meal_logs (user_id, log_data) VALUES (?, ?)",
            [(user["id"], json.dumps(log)) for log in data.logs],
        )
    return {"ok": True}


@app.get("/api/logs/get")
async def load_logs(user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    return {"logs": load_user_logs(user["id"])}


@app.post("/api/wellbeing/checkin")
async def save_wellbeing(
    data: WellbeingCheckInRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    return save_wellbeing_checkin(user["id"], data)


@app.get("/api/wellbeing/checkins")
async def load_wellbeing(days: int = 30, user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    return load_wellbeing_for_period(user["id"], days)


@app.post("/api/habits/event")
async def create_habit_event(
    data: HabitEventRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    return save_habit_event(user["id"], data)


@app.get("/api/habits/events")
async def get_habit_events(days: int = 30, user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    return {"events": load_habit_events(user["id"], days)}


@app.post("/api/analytics/report")
async def generate_analytics_report(
    data: AnalyticsReportRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    logs = load_user_logs(user["id"])
    profile = get_profile(user["id"]) or {}
    metrics = build_behavioral_metrics(logs, profile, data.days)
    fallback = build_analytics_fallback(metrics, profile)
    profile_summary = (
        f"name: {profile.get('name', 'not set')}, "
        f"goal: {profile.get('goal', 'not set')}, "
        f"activity: {profile.get('activity_level', 'not set')}, "
        f"body type: {profile.get('body_type', 'not set')}, "
        f"daily target: {profile.get('daily_calories', 'not set')} kcal"
    )
    prompt = f"""User profile:
{profile_summary}

Deterministic analytics metrics:
{json.dumps(metrics, ensure_ascii=False)}

Interpret these calculated results. Do not invent new numbers.
Return ONLY valid JSON, no markdown, no explanation:
{{
  "summary": "warm, specific, supportive weekly interpretation in 120-170 words",
  "recommendations": ["specific next action 1", "specific next action 2", "specific next action 3"]
}}"""

    ai_result = fallback
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 700,
                    "system": (
                        "You are FuelFlow's behavioral insights analyst. "
                        "Use deterministic metrics that are already calculated. "
                        "Never recalculate, exaggerate, shame, or use words like cheat meal, bad food, guilt, failure, punishment, sin, or dirty eating. "
                        "Explain patterns warmly and practically. Celebrate awareness. Connect the user's food choices, mood, energy, and goal to one realistic next step. "
                        "Return valid JSON only."
                    ),
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=60.0,
            )
            response_data = response.json()
            raw = response_data["content"][0]["text"].strip()
            parsed = parse_claude_json(raw)
            ai_result = {
                "summary": parsed.get("summary") or fallback["summary"],
                "recommendations": parsed.get("recommendations") or fallback["recommendations"],
            }
    except Exception as exc:
        print(f"ANALYTICS REPORT AI FALLBACK: {exc}")

    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO insight_reports (
                user_id, period_start, period_end, report_type, metrics_data, insight_text, facts_data
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user["id"],
                metrics["period_start"],
                metrics["period_end"],
                "behavioral_dashboard",
                json.dumps(metrics),
                ai_result["summary"],
                json.dumps(ai_result["recommendations"]),
            ),
        )
        report_id = cursor.lastrowid

    return {
        "report_id": report_id,
        "period_start": metrics["period_start"],
        "period_end": metrics["period_end"],
        "metrics": metrics,
        "summary": ai_result["summary"],
        "recommendations": ai_result["recommendations"],
    }


@app.get("/api/analytics/reports")
async def load_analytics_reports(user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT id, period_start, period_end, report_type, metrics_data, insight_text, facts_data, created_at
            FROM insight_reports
            WHERE user_id = ? AND report_type = ?
            ORDER BY created_at DESC, id DESC
            LIMIT 12
            """,
            (user["id"], "behavioral_dashboard"),
        ).fetchall()

    reports = []
    for row in rows:
        reports.append({
            "id": row["id"],
            "period_start": row["period_start"],
            "period_end": row["period_end"],
            "report_type": row["report_type"],
            "metrics": json.loads(row["metrics_data"] or "{}"),
            "summary": row["insight_text"] or "",
            "recommendations": json.loads(row["facts_data"] or "[]"),
            "created_at": row["created_at"],
        })
    return {"reports": reports}


@app.post("/api/timing/report")
async def generate_timing_report(
    data: AnalyticsReportRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    logs = load_user_logs(user["id"])
    profile = get_profile(user["id"]) or {}
    metrics = build_food_timing_metrics(logs, profile, data.days)
    fallback = build_timing_fallback(metrics, profile)
    profile_summary = (
        f"name: {profile.get('name', 'not set')}, "
        f"goal: {profile.get('goal', 'not set')}, "
        f"activity: {profile.get('activity_level', 'not set')}, "
        f"daily target: {profile.get('daily_calories', 'not set')} kcal"
    )
    prompt = f"""User profile:
{profile_summary}

Deterministic food timing metrics:
{json.dumps(metrics, ensure_ascii=False)}

Interpret these calculated results. Do not invent new numbers.
Return ONLY valid JSON, no markdown, no explanation:
{{
  "summary": "warm, specific food timing interpretation in 100-150 words",
  "suggestions": ["specific timing action 1", "specific timing action 2", "specific timing action 3"]
}}"""

    ai_result = fallback
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 650,
                    "system": (
                        "You are FuelFlow's food timing coach. "
                        "Use deterministic meal timing metrics that are already calculated. "
                        "Do not recalculate or invent numbers. "
                        "Explain timing patterns warmly, practically, and without shame. "
                        "Support future circadian rhythm and sleep correlation coaching by focusing on rhythms, gaps, first meal timing, late-night patterns, energy, and mood. "
                        "Return valid JSON only."
                    ),
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=60.0,
            )
            response_data = response.json()
            raw = response_data["content"][0]["text"].strip()
            parsed = parse_claude_json(raw)
            ai_result = {
                "summary": parsed.get("summary") or fallback["summary"],
                "suggestions": parsed.get("suggestions") or fallback["suggestions"],
            }
    except Exception as exc:
        print(f"TIMING REPORT AI FALLBACK: {exc}")

    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO insight_reports (
                user_id, period_start, period_end, report_type, metrics_data, insight_text, facts_data
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user["id"],
                metrics["period_start"],
                metrics["period_end"],
                "food_timing",
                json.dumps(metrics),
                ai_result["summary"],
                json.dumps(ai_result["suggestions"]),
            ),
        )
        report_id = cursor.lastrowid

    return {
        "report_id": report_id,
        "period_start": metrics["period_start"],
        "period_end": metrics["period_end"],
        "metrics": metrics,
        "summary": ai_result["summary"],
        "suggestions": ai_result["suggestions"],
    }


@app.get("/api/timing/reports")
async def load_timing_reports(user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT id, period_start, period_end, report_type, metrics_data, insight_text, facts_data, created_at
            FROM insight_reports
            WHERE user_id = ? AND report_type = ?
            ORDER BY created_at DESC, id DESC
            LIMIT 12
            """,
            (user["id"], "food_timing"),
        ).fetchall()

    reports = []
    for row in rows:
        reports.append({
            "id": row["id"],
            "period_start": row["period_start"],
            "period_end": row["period_end"],
            "report_type": row["report_type"],
            "metrics": json.loads(row["metrics_data"] or "{}"),
            "summary": row["insight_text"] or "",
            "suggestions": json.loads(row["facts_data"] or "[]"),
            "created_at": row["created_at"],
        })
    return {"reports": reports}


@app.post("/api/recovery/report")
async def generate_recovery_report(
    data: AnalyticsReportRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    logs = load_user_logs(user["id"])
    profile = get_profile(user["id"]) or {}
    wellbeing = load_wellbeing_for_period(user["id"], data.days)
    metrics = build_sleep_recovery_metrics(logs, wellbeing, profile, data.days)
    fallback = build_sleep_recovery_fallback(metrics, profile)
    profile_summary = (
        f"name: {profile.get('name', 'not set')}, "
        f"goal: {profile.get('goal', 'not set')}, "
        f"activity: {profile.get('activity_level', 'not set')}, "
        f"body type: {profile.get('body_type', 'not set')}"
    )
    prompt = f"""User profile:
{profile_summary}

Deterministic sleep and recovery metrics:
{json.dumps(metrics, ensure_ascii=False)}

Interpret these calculated results. Do not invent new numbers.
Return ONLY valid JSON, no markdown, no explanation:
{{
  "summary": "warm, practical weekly sleep and recovery interpretation in 120-170 words",
  "suggestions": ["specific recovery action 1", "specific recovery action 2", "specific recovery action 3"]
}}"""

    ai_result = fallback
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 750,
                    "system": (
                        "You are FuelFlow's sleep and recovery analyst. "
                        "Use deterministic metrics that are already calculated. "
                        "Never recalculate, diagnose, shame, or use clinical alarmist language. "
                        "Explain sleep, stress, cravings, readiness, soreness, fatigue, hydration, meal timing, and energy patterns warmly and practically. "
                        "Support future circadian rhythm coaching, smoking tracking, and wearable integrations by focusing on patterns and low-friction habits. "
                        "Return valid JSON only."
                    ),
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=60.0,
            )
            response_data = response.json()
            raw = response_data["content"][0]["text"].strip()
            parsed = parse_claude_json(raw)
            ai_result = {
                "summary": parsed.get("summary") or fallback["summary"],
                "suggestions": parsed.get("suggestions") or fallback["suggestions"],
            }
    except Exception as exc:
        print(f"SLEEP RECOVERY REPORT AI FALLBACK: {exc}")

    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO insight_reports (
                user_id, period_start, period_end, report_type, metrics_data, insight_text, facts_data
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user["id"],
                metrics["period_start"],
                metrics["period_end"],
                "sleep_recovery",
                json.dumps(metrics),
                ai_result["summary"],
                json.dumps(ai_result["suggestions"]),
            ),
        )
        report_id = cursor.lastrowid

    return {
        "report_id": report_id,
        "period_start": metrics["period_start"],
        "period_end": metrics["period_end"],
        "metrics": metrics,
        "summary": ai_result["summary"],
        "suggestions": ai_result["suggestions"],
    }


@app.get("/api/recovery/reports")
async def load_recovery_reports(user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT id, period_start, period_end, report_type, metrics_data, insight_text, facts_data, created_at
            FROM insight_reports
            WHERE user_id = ? AND report_type = ?
            ORDER BY created_at DESC, id DESC
            LIMIT 12
            """,
            (user["id"], "sleep_recovery"),
        ).fetchall()

    reports = []
    for row in rows:
        reports.append({
            "id": row["id"],
            "period_start": row["period_start"],
            "period_end": row["period_end"],
            "report_type": row["report_type"],
            "metrics": json.loads(row["metrics_data"] or "{}"),
            "summary": row["insight_text"] or "",
            "suggestions": json.loads(row["facts_data"] or "[]"),
            "created_at": row["created_at"],
        })
    return {"reports": reports}


@app.post("/api/habits/report")
async def generate_habit_report(
    data: AnalyticsReportRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    profile = get_profile(user["id"]) or {}
    events = load_habit_events(user["id"], data.days)
    logs = load_user_logs(user["id"])
    wellbeing = load_wellbeing_for_period(user["id"], data.days)
    metrics = build_habit_metrics(events, logs, wellbeing, profile, data.days)
    fallback = build_habit_fallback(metrics, profile)
    profile_summary = (
        f"name: {profile.get('name', 'not set')}, "
        f"goal: {profile.get('goal', 'not set')}, "
        f"activity: {profile.get('activity_level', 'not set')}, "
        f"food relationship: {profile.get('food_relationship', 'not set')}"
    )
    prompt = f"""User profile:
{profile_summary}

Deterministic habit intelligence metrics:
{json.dumps(metrics, ensure_ascii=False)}

Interpret these calculated results. Do not invent new numbers.
Return ONLY valid JSON, no markdown, no explanation:
{{
  "summary": "warm, practical weekly habit interpretation in 120-170 words",
  "suggestions": ["specific low-friction action 1", "specific low-friction action 2", "specific low-friction action 3"]
}}"""

    ai_result = fallback
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 750,
                    "system": (
                        "You are FuelFlow's habit intelligence coach. "
                        "Use deterministic metrics that are already calculated. "
                        "Never shame, moralize, diagnose, or use guilt-based messaging. "
                        "Do not use words like bad habit, failure, guilt, weakness, punishment, dirty, or sin. "
                        "Explain smoking, cravings, alcohol, caffeine, triggers, mood, sleep, stress, and meal timing patterns as awareness signals. "
                        "Give practical replacement or recovery strategies that help users make better decisions, not perfect decisions. "
                        "Return valid JSON only."
                    ),
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=60.0,
            )
            response_data = response.json()
            raw = response_data["content"][0]["text"].strip()
            parsed = parse_claude_json(raw)
            ai_result = {
                "summary": parsed.get("summary") or fallback["summary"],
                "suggestions": parsed.get("suggestions") or fallback["suggestions"],
            }
    except Exception as exc:
        print(f"HABIT REPORT AI FALLBACK: {exc}")

    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO insight_reports (
                user_id, period_start, period_end, report_type, metrics_data, insight_text, facts_data
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user["id"],
                metrics["period_start"],
                metrics["period_end"],
                "habit_intelligence",
                json.dumps(metrics),
                ai_result["summary"],
                json.dumps(ai_result["suggestions"]),
            ),
        )
        report_id = cursor.lastrowid

    return {
        "report_id": report_id,
        "period_start": metrics["period_start"],
        "period_end": metrics["period_end"],
        "metrics": metrics,
        "summary": ai_result["summary"],
        "suggestions": ai_result["suggestions"],
    }


@app.get("/api/habits/reports")
async def load_habit_reports(user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT id, period_start, period_end, report_type, metrics_data, insight_text, facts_data, created_at
            FROM insight_reports
            WHERE user_id = ? AND report_type = ?
            ORDER BY created_at DESC, id DESC
            LIMIT 12
            """,
            (user["id"], "habit_intelligence"),
        ).fetchall()

    reports = []
    for row in rows:
        reports.append({
            "id": row["id"],
            "period_start": row["period_start"],
            "period_end": row["period_end"],
            "report_type": row["report_type"],
            "metrics": json.loads(row["metrics_data"] or "{}"),
            "summary": row["insight_text"] or "",
            "suggestions": json.loads(row["facts_data"] or "[]"),
            "created_at": row["created_at"],
        })
    return {"reports": reports}


@app.get("/api/drinks/reference")
async def get_drink_reference(user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    return {
        "drinks": [
            {"key": key, **value}
            for key, value in DRINK_REFERENCE.items()
        ]
    }


@app.post("/api/social/plan")
async def create_social_plan(
    data: SocialPlanRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    profile = data.user_profile or get_profile(user["id"]) or {}
    events = load_habit_events(user["id"], 30)
    logs = load_user_logs(user["id"])
    wellbeing = load_wellbeing_for_period(user["id"], 30)
    return build_social_event_plan(data, profile, events, logs, wellbeing)


@app.post("/api/social/report")
async def generate_social_report(
    data: AnalyticsReportRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    profile = get_profile(user["id"]) or {}
    events = load_habit_events(user["id"], data.days)
    logs = load_user_logs(user["id"])
    wellbeing = load_wellbeing_for_period(user["id"], data.days)
    metrics = build_social_balance_metrics(events, logs, wellbeing, profile, data.days)
    fallback = build_social_balance_fallback(metrics, profile)
    profile_summary = (
        f"name: {profile.get('name', 'not set')}, "
        f"goal: {profile.get('goal', 'not set')}, "
        f"activity: {profile.get('activity_level', 'not set')}, "
        f"body type: {profile.get('body_type', 'not set')}"
    )
    prompt = f"""User profile:
{profile_summary}

Deterministic Drink Smarter and social balance metrics:
{json.dumps(metrics, ensure_ascii=False)}

Interpret these calculated results. Do not invent new numbers.
Return ONLY valid JSON, no markdown, no explanation:
{{
  "summary": "warm, practical weekly social balance interpretation in 120-170 words",
  "suggestions": ["specific before-event action", "specific during-event action", "specific recovery action"]
}}"""

    ai_result = fallback
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 750,
                    "system": (
                        "You are FuelFlow's Drink Smarter and social eating coach. "
                        "Use deterministic metrics that are already calculated. "
                        "Never shame, moralize, or use guilt-based messaging. "
                        "Do not use words like cheat meal, bad food, guilt, failure, punishment, sin, or dirty eating. "
                        "Help users enjoy social events while staying aligned with their goals. "
                        "Give practical before, during, and after guidance with hydration, protein, sleep, and recovery. "
                        "Return valid JSON only."
                    ),
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=60.0,
            )
            response_data = response.json()
            raw = response_data["content"][0]["text"].strip()
            parsed = parse_claude_json(raw)
            ai_result = {
                "summary": parsed.get("summary") or fallback["summary"],
                "suggestions": parsed.get("suggestions") or fallback["suggestions"],
            }
    except Exception as exc:
        print(f"SOCIAL REPORT AI FALLBACK: {exc}")

    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO insight_reports (
                user_id, period_start, period_end, report_type, metrics_data, insight_text, facts_data
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user["id"],
                metrics["period_start"],
                metrics["period_end"],
                "social_balance",
                json.dumps(metrics),
                ai_result["summary"],
                json.dumps(ai_result["suggestions"]),
            ),
        )
        report_id = cursor.lastrowid

    return {
        "report_id": report_id,
        "period_start": metrics["period_start"],
        "period_end": metrics["period_end"],
        "metrics": metrics,
        "summary": ai_result["summary"],
        "suggestions": ai_result["suggestions"],
    }


@app.get("/api/social/reports")
async def load_social_reports(user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT id, period_start, period_end, report_type, metrics_data, insight_text, facts_data, created_at
            FROM insight_reports
            WHERE user_id = ? AND report_type = ?
            ORDER BY created_at DESC, id DESC
            LIMIT 12
            """,
            (user["id"], "social_balance"),
        ).fetchall()

    reports = []
    for row in rows:
        reports.append({
            "id": row["id"],
            "period_start": row["period_start"],
            "period_end": row["period_end"],
            "report_type": row["report_type"],
            "metrics": json.loads(row["metrics_data"] or "{}"),
            "summary": row["insight_text"] or "",
            "suggestions": json.loads(row["facts_data"] or "[]"),
            "created_at": row["created_at"],
        })
    return {"reports": reports}


@app.post("/api/weekly-report/generate")
async def generate_unified_weekly_report(
    data: AnalyticsReportRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    profile = get_profile(user["id"]) or {}
    metrics = build_unified_weekly_metrics(user["id"], data.days)
    fallback = build_unified_weekly_fallback(metrics, profile)
    profile_summary = (
        f"name: {profile.get('name', 'not set')}, "
        f"goal: {profile.get('goal', 'not set')}, "
        f"activity: {profile.get('activity_level', 'not set')}, "
        f"body type: {profile.get('body_type', 'not set')}, "
        f"food relationship: {profile.get('food_relationship', 'not set')}"
    )
    prompt = f"""User profile:
{profile_summary}

Unified deterministic weekly metrics:
{json.dumps(metrics, ensure_ascii=False)}

Interpret these calculated results. Do not invent new numbers.
Return ONLY valid JSON, no markdown, no explanation:
{{
  "summary": "one warm Sizzle-style weekly summary in 130-180 words",
  "focus": "one clear focus for next week",
  "actions": ["specific action 1", "specific action 2", "specific action 3"]
}}"""

    ai_result = fallback
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 900,
                    "system": (
                        "You are Sizzle, FuelFlow's weekly report coach. "
                        "Use only deterministic metrics already calculated by FuelFlow. "
                        "Do not invent numbers, diagnose, shame, or moralize. "
                        "Unify food and mood, timing, recovery, habits, social balance, and plan adherence into one clear coaching summary. "
                        "End with practical next actions. Return valid JSON only."
                    ),
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=60.0,
            )
            parsed = parse_claude_json(response.json()["content"][0]["text"].strip())
            ai_result = {
                "summary": parsed.get("summary") or fallback["summary"],
                "focus": parsed.get("focus") or fallback["focus"],
                "actions": parsed.get("actions") or fallback["actions"],
            }
    except Exception as exc:
        print(f"UNIFIED WEEKLY REPORT AI FALLBACK: {exc}")

    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO insight_reports (
                user_id, period_start, period_end, report_type, metrics_data, insight_text, facts_data
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user["id"],
                metrics["period_start"],
                metrics["period_end"],
                "unified_weekly",
                json.dumps(metrics),
                ai_result["summary"],
                json.dumps({"focus": ai_result["focus"], "actions": ai_result["actions"]}),
            ),
        )
        report_id = cursor.lastrowid

    return {
        "report_id": report_id,
        "period_start": metrics["period_start"],
        "period_end": metrics["period_end"],
        "metrics": metrics,
        "summary": ai_result["summary"],
        "focus": ai_result["focus"],
        "actions": ai_result["actions"],
    }


@app.get("/api/weekly-report/history")
async def load_unified_weekly_reports(user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT id, period_start, period_end, report_type, metrics_data, insight_text, facts_data, created_at
            FROM insight_reports
            WHERE user_id = ? AND report_type = ?
            ORDER BY created_at DESC, id DESC
            LIMIT 12
            """,
            (user["id"], "unified_weekly"),
        ).fetchall()

    reports = []
    for row in rows:
        facts = json.loads(row["facts_data"] or "{}")
        reports.append({
            "id": row["id"],
            "period_start": row["period_start"],
            "period_end": row["period_end"],
            "report_type": row["report_type"],
            "metrics": json.loads(row["metrics_data"] or "{}"),
            "summary": row["insight_text"] or "",
            "focus": facts.get("focus", ""),
            "actions": facts.get("actions", []),
            "created_at": row["created_at"],
        })
    return {"reports": reports}


@app.post("/api/get-insights")
async def get_insights(data: InsightsRequest) -> dict[str, Any]:
    summary = summarize_logs(data.logs)
    profile = data.user_profile or {}
    profile_summary = (
        f"User profile: {profile.get('name', 'there')}, "
        f"goal: {profile.get('goal', 'not set')}, "
        f"activity: {profile.get('activity_level', 'not set')}, "
        f"daily target: {profile.get('daily_calories', 'not set')} kcal, "
        f"body fat estimate: {profile.get('body_fat_mid', 'not set')}%"
    )
    prompt = f"""Here's a summary of the user's recent meals and moods:
{profile_summary}

{summary}

Return ONLY this JSON, no other text:
{{"insight": "warm motivational paragraph 100-150 words about their patterns", "facts": ["fact1", "fact2", "fact3"]}}"""

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                },
                json={
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 800,
                    "system": "You are FuelFlow's AI companion — warm, encouraging, genuinely insightful. Never shame or use words like cheat meal, bad food, or guilt. Return valid JSON only — no markdown, no backticks, no preamble whatsoever. When writing the weekly insight, always acknowledge both wins and struggles without judgment. Remind the user of their transformation goal. End with a genuinely motivating closer that connects their daily food choices to the person they are becoming.",
                    "messages": [{"role": "user", "content": prompt}]
                },
                timeout=60.0
            )
            data = response.json()
            raw = data["content"][0]["text"].strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        result = json.loads(raw.strip())
        return result
    except json.JSONDecodeError:
        return {
            "insight": "Log a few more meals and come back — your insight will be much richer with more data.",
            "facts": [
                "Food timing affects your energy more than you think.",
                "Mood before eating influences digestion.",
                "Hydration is often mistaken for hunger.",
            ],
        }


@app.post("/api/food-insight")
async def food_insight(data: FoodInsightRequest) -> dict[str, Any]:
    prompt = f"""Food: {data.food_name}
Goal: {data.goal}
Activity level: {data.activity_level}

Return ONLY this JSON, no other text:
{{"what_it_does": "2 sentence explanation of what this food does for your body", "good_for_goal": true, "next_suggestion": "one specific food suggestion to eat next to complement this meal and hit daily macros"}}"""

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                },
                json={
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 300,
                    "system": "You are FuelFlow's AI companion — warm, encouraging, genuinely insightful. Never shame or use words like cheat meal, bad food, or guilt. Return valid JSON only — no markdown, no backticks, no preamble whatsoever.",
                    "messages": [{"role": "user", "content": prompt}]
                },
                timeout=60.0
            )
            response_data = response.json()
            raw = response_data["content"][0]["text"].strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        result = json.loads(raw.strip())
        return result
    except json.JSONDecodeError:
        return {
            "what_it_does": "This meal gives your body useful energy and helps you notice how different foods support your day. Keep paying attention to how you feel afterward.",
            "good_for_goal": True,
            "next_suggestion": "Add a protein-rich snack with water later to keep your energy steady.",
        }


@app.post("/api/chat")
async def chat(data: ChatRequest, user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    profile = data.user_profile or {}
    profile_summary = (
        f"name: {profile.get('name', 'not set')}, "
        f"goal: {profile.get('goal', 'not set')}, "
        f"activity: {profile.get('activity_level', 'not set')}, "
        f"daily target: {profile.get('daily_calories', 'not set')} kcal, "
        f"body type: {profile.get('body_type', 'not set')}, "
        f"current body fat: {profile.get('body_fat_range', 'not set')}, "
        f"target body fat: {profile.get('target_body_fat_range', 'not set')}"
    )
    save_chat_message(user["id"], "user", data.message)
    stored_history = load_chat_messages(user["id"], limit=12)
    recent_history = "\n".join(
        f"{message.get('role', 'user')}: {message.get('content', '')}"
        for message in stored_history[-8:]
    )
    memory_enabled = ensure_privacy_settings(user["id"])["ai_memory_enabled"]
    memories = load_ai_memories(user["id"], limit=16) if memory_enabled else []
    memory_context = format_memories_for_prompt(memories)
    user_logs = load_user_logs(user["id"])
    recent_habit_events = load_habit_events(user["id"], 7)
    timing_metrics = build_food_timing_metrics(user_logs, profile, 7)
    timing_context = format_timing_context_for_prompt(timing_metrics)
    wellbeing_context_data = load_wellbeing_for_period(user["id"], 7)
    sleep_recovery_metrics = build_sleep_recovery_metrics(
        user_logs,
        wellbeing_context_data,
        profile,
        7,
    )
    sleep_recovery_context = format_sleep_recovery_context_for_prompt(sleep_recovery_metrics)
    habit_metrics = build_habit_metrics(
        recent_habit_events,
        user_logs,
        wellbeing_context_data,
        profile,
        7,
    )
    habit_context = format_habit_context_for_prompt(habit_metrics)
    social_metrics = build_social_balance_metrics(
        recent_habit_events,
        user_logs,
        wellbeing_context_data,
        profile,
        7,
    )
    social_context = format_social_context_for_prompt(social_metrics)
    prompt = f"""Recent chat:
{recent_history}

User asks: {data.message}

Return only your reply text."""

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 500,
                    "system": (
                        "You are Sizzle, FuelFlow's personal nutrition and wellness companion. "
                        "You are warm, honest, science-based, and genuinely invested in this person's transformation. "
                        "You care about their mental and physical wellbeing equally.\n\n"
                        "Your personality:\n"
                        "- Warm but honest — you tell people what they need to hear, not what they want to hear\n"
                        "- Motivating but realistic — you celebrate progress and gently redirect setbacks\n"
                        "- Never preachy, never guilt-tripping, never harsh\n"
                        "- You speak like a knowledgeable friend who has their best interests at heart\n\n"
                        f"You know this user's profile: {profile_summary}\n\n"
                        f"Relevant long-term memories:\n{memory_context}\n\n"
                        f"Recent food timing patterns:\n{timing_context}\n\n"
                        f"Recent sleep and recovery patterns:\n{sleep_recovery_context}\n\n"
                        f"Recent habit patterns:\n{habit_context}\n\n"
                        f"Drink smarter and social balance context:\n{social_context}\n\n"
                        "Use memories naturally when helpful. You may say things like "
                        "\"I remember you mentioned late-night cravings\" when it directly supports the user. "
                        "Do not reveal memory IDs or act like a database.\n\n"
                        "RESPONSE FORMAT:\n"
                        "- Start with 1-2 sentences of warm context or honest observation\n"
                        "- Use bullet points for specific foods, habits, or action items\n"
                        "- Each bullet: name the actual food/habit, quantity if relevant, and why it helps\n"
                        "- End with one short motivating sentence that feels genuine not generic\n"
                        "- Max 150 words total\n\n"
                        "IMPORTANT RULES:\n"
                        "- Never use: cheat meal, bad food, guilt, failure, punishment, sin, dirty eating\n"
                        "- When someone logs alcohol, junk food, or goes off track — acknowledge it without shame, explain the impact honestly, and give a practical recovery plan\n"
                        "- Always bring people back to their WHY — their goal, their transformation, their best self\n"
                        "- If someone seems discouraged, address the emotion first before the nutrition advice\n"
                        "- Remind users that one meal, one night, one week does not define their journey\n"
                        "- Be specific to their body type, goal, and activity level whenever possible\n\n"
                        "DRINK SMARTER RULES:\n"
                        "- For drinking, parties, weddings, vacations, dinner outings, and social eating, help the user plan before, during, and after\n"
                        "- Support enjoyment while explaining calorie, hydration, sleep, and recovery impact honestly\n"
                        "- Suggest lower-calorie or goal-friendly alternatives without making the original choice feel wrong\n"
                        "- Bring the user back to sustainable habits and the next supportive choice\n\n"
                        "EMPATHY RULES:\n"
                        "- Always acknowledge where the person is before giving advice\n"
                        "- Frame food as enjoyable and cultural — not just fuel or numbers\n"
                        "- If someone mentions guilt, skipping meals, or feeling out of control: acknowledge their feeling first, then give gentle practical guidance\n"
                        "- Never use: too much, you shouldn't have, avoid that, that's bad\n"
                        "- Remind people: one meal is not a moral failing. Consistency over perfection always.\n"
                        "- When someone seems emotionally low: address the emotion before the nutrition\n"
                        "- Celebrate all progress no matter how small"
                    ),
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=60.0,
            )
            response_data = response.json()
            reply = response_data["content"][0]["text"].strip()
            save_chat_message(user["id"], "assistant", reply)
            await extract_memories_from_message(client, user["id"], data.message, reply, profile_summary)
        return {"reply": reply, "history": load_chat_messages(user["id"], limit=100)}
    except Exception:
        fallback_reply = "I hit a little pause there, but here is a steady place to start: pair protein, fiber-rich carbs, and water when you can. Tell me what you ate or what your goal is, and I can help you make the next choice feel easier."
        save_chat_message(user["id"], "assistant", fallback_reply)
        return {
            "reply": fallback_reply,
            "history": load_chat_messages(user["id"], limit=100),
        }


@app.get("/api/chat/history")
async def chat_history(user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    return {"history": load_chat_messages(user["id"], limit=100)}


@app.get("/api/memories")
async def list_memories(user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    settings = ensure_privacy_settings(user["id"])
    return {
        "memory_enabled": settings["ai_memory_enabled"],
        "memories": load_ai_memories(user["id"], limit=200),
    }


@app.post("/api/memories/settings")
async def update_memory_settings(
    data: MemorySettingsRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    set_memory_enabled(user["id"], data.enabled)
    return {
        "memory_enabled": data.enabled,
        "memories": load_ai_memories(user["id"], limit=200),
    }


@app.delete("/api/memories/{memory_id}")
async def delete_memory(memory_id: int, user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    with get_db() as conn:
        conn.execute(
            "DELETE FROM ai_memories WHERE id = ? AND user_id = ?",
            (memory_id, user["id"]),
        )
    return {"ok": True, "memories": load_ai_memories(user["id"], limit=200)}


@app.delete("/api/memories")
async def delete_all_memories(user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    with get_db() as conn:
        conn.execute("DELETE FROM ai_memories WHERE user_id = ?", (user["id"],))
    return {"ok": True, "memories": []}


@app.post("/api/generate-meal-plan")
async def generate_meal_plan(
    data: MealPlanRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    try:
        return await _generate_meal_plan_impl(data, user)
    except Exception as e:
        print(f"MEAL PLAN ERROR: {e}")
        traceback.print_exc()
        raise


async def _generate_meal_plan_impl(
    data: MealPlanRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    profile = data.user_profile or {}
    macros = calculate_plan_macros(profile)
    profile_summary = (
        f"name: {profile.get('name', 'FuelFlow user')}, "
        f"weight: {profile.get('weight_kg', 'unknown')} kg, "
        f"goal: {profile.get('goal', 'unknown')}, "
        f"plan_type: {profile.get('plan_type', 'Maintain')}, "
        f"activity: {profile.get('activity_level', 'unknown')}, "
        f"body_type: {profile.get('body_type', 'unknown')}, "
        f"body_fat: {profile.get('body_fat_range', 'unknown')}, "
        f"target_body_fat: {profile.get('target_body_fat_range', 'unknown')}, "
        f"food_preference: {profile.get('food_preference', 'Mix')}, "
        f"cuisine: {profile.get('cuisine', 'Mix it up')}, "
        f"budget: {profile.get('budget', 'No limit')}, "
        f"sport: {profile.get('sport', 'General fitness')}, "
        f"alcohol_frequency: {profile.get('alcohol_frequency', 'I do not drink')}, "
        f"daily_calories: {macros['daily_calories']}, "
        f"protein_g: {macros['protein_g']}, "
        f"carbs_g: {macros['carbs_g']}, "
        f"fat_g: {macros['fat_g']}"
    )
    system_prompt = (
        "Generate a realistic meal plan. Protein target is based on bodyweight "
        "(already calculated and provided) - do NOT increase it. Fat is moderate. "
        "Carbs fill the remaining calories. Include breakfast, morning snack, lunch, "
        "afternoon snack, dinner, and one small enjoyable daily treat. Keep meals "
        "practical, affordable, and varied across the week. No two days should have "
        "the same breakfast. Return ONLY valid JSON, no markdown, no explanation."
    )

    async def call_claude_plan(
        client: httpx.AsyncClient,
        prompt: str,
    ) -> dict[str, Any]:
        response = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-haiku-4-5-20251001",
                "max_tokens": 1500,
                "system": system_prompt,
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=120.0,
        )
        response_data = response.json()
        raw = response_data["content"][0]["text"].strip()
        return parse_claude_json(raw)

    def build_day_prompt(day: str) -> str:
        return f"""User profile summary:
{profile_summary}

Generate only this day: {day}.
Meal types for the day: Breakfast, Morning Snack, Lunch, Afternoon Snack, Dinner, Daily Treat.
The Daily Treat should be 100-150 kcal and framed positively as enjoyable.
Use foods available and affordable in India unless the profile asks for another cuisine.

Return ONLY valid JSON, no markdown, no explanation, in this schema:
{{
  "day": "{day}",
  "meals": [
    {{
      "meal_type": str,
      "time": str,
      "name": str,
      "calories": int,
      "protein_g": int,
      "carbs_g": int,
      "fat_g": int,
      "description": "one sentence description of the meal",
      "why": "one sentence why it fits the goal"
    }}
  ],
  "daily_totals": {{ "calories": int, "protein_g": int, "carbs_g": int, "fat_g": int }}
}}"""

    summary_prompt = f"""User profile summary:
{profile_summary}

Generate the plan summary and supporting weekly fields only.
Grocery list must be max 15 items.

Return ONLY valid JSON, no markdown, no explanation, in this schema:
{{
  "plan_summary": {{
    "daily_calories": {macros["daily_calories"]},
    "protein_g": {macros["protein_g"]},
    "carbs_g": {macros["carbs_g"]},
    "fat_g": {macros["fat_g"]},
    "plan_type": "{profile.get("plan_type", "Maintain")}",
    "weekly_goal": "specific weekly goal for this user's transformation"
  }},
  "grocery_list": ["item1", "item2"],
  "weekly_tips": ["tip1", "tip2", "tip3"],
  "alcohol_guidance": "warm practical guidance",
  "adjustment_note": "short note about adjusting if hunger, training, or weight changes"
}}"""

    try:
        day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        async with httpx.AsyncClient() as client:
            days = []
            for day_name in day_names:
                days.append(await call_claude_plan(client, build_day_prompt(day_name)))
            summary_result = await call_claude_plan(client, summary_prompt)
        return {
            "plan_summary": summary_result["plan_summary"],
            "days": days,
            "grocery_list": summary_result["grocery_list"],
            "weekly_tips": summary_result["weekly_tips"],
            "alcohol_guidance": summary_result["alcohol_guidance"],
            "adjustment_note": summary_result["adjustment_note"],
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail="FuelFlow could not generate your meal plan yet.") from exc

    profile_json = json.dumps(profile, ensure_ascii=False)
    prompt = f"""User profile:
{profile_json}

Calculated daily targets:
- calories: {macros["daily_calories"]}
- protein_g: {macros["protein_g"]}
- carbs_g: {macros["carbs_g"]}
- fat_g: {macros["fat_g"]}

Generate a complete personalized 7-day meal plan for this user.
Use the six required meal slots every day, regardless of the selected meals_per_day value.
Always include Breakfast, Morning Snack, Lunch, Afternoon Snack, Dinner, and Daily Treat. The Daily Treat must be 100-150 kcal and framed positively as: "Your daily treat — because dieting should be enjoyable".
Respect food preference: {profile.get("food_preference", "Mix")}.
Respect cuisine preference: {profile.get("cuisine", "Mix it up")}.
Respect budget: {profile.get("budget", "No limit")}.
Respect sport/activity: {profile.get("sport", "General fitness")}.
Respect alcohol frequency: {profile.get("alcohol_frequency", "I don't drink")}.
Keep the output concise: recipes must be 1-2 sentences max, ingredient lists must be 3-4 items max per meal, and every why field must be one sentence.

Return ONLY valid JSON in this exact schema:
Meal type options are exactly: "Breakfast", "Morning Snack", "Lunch", "Afternoon Snack", "Dinner", "Daily Treat".
{{
  "plan_summary": {{
    "daily_calories": {macros["daily_calories"]},
    "protein_g": {macros["protein_g"]},
    "carbs_g": {macros["carbs_g"]},
    "fat_g": {macros["fat_g"]},
    "plan_type": "{profile.get("plan_type", "Maintain")}",
    "weekly_goal": "specific weekly goal for this user's transformation"
  }},
  "days": [
    {{
      "day": "Monday",
      "meals": [
        {{
          "meal_type": "Breakfast",
          "time": "8:00 AM",
          "name": "meal name",
          "ingredients": ["ingredient with quantity"],
          "calories": 0,
          "protein_g": 0,
          "carbs_g": 0,
          "fat_g": 0,
          "recipe": "3-4 sentence cooking instructions",
          "why": "1 sentence explaining why this meal fits their goal"
        }}
      ],
      "daily_totals": {{ "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }}
    }}
  ],
  "alcohol_guidance": "warm practical guidance",
  "grocery_list": ["item with quantity for the week"],
  "weekly_tips": ["tip1", "tip2", "tip3"],
  "adjustment_note": "short note about adjusting if hunger, training, or weight changes"
}}"""

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 8000,
                    "system": (
                        "Generate a realistic meal plan. Protein target is based on bodyweight (already calculated and provided) — do NOT increase it. "
                        "Fat is moderate. Carbs fill the remaining calories. "
                        "Include breakfast, morning snack, lunch, afternoon snack, dinner, and one small enjoyable daily treat. "
                        "Keep meals practical, affordable, and varied across the week. No two days should have the same breakfast. "
                        "Use foods that are actually available and affordable in India unless another cuisine is specified. "
                        "Daily Treat meal_type must be included every day and should say: Your daily treat — because dieting should be enjoyable. "
                        "Return ONLY valid JSON, no markdown, no explanation."
                    ),
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=120.0,
            )
            response_data = response.json()
            raw = response_data["content"][0]["text"].strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        cleaned = raw.strip()
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail="FuelFlow could not generate your meal plan yet.") from exc


@app.post("/api/plan/save")
async def save_meal_plan(
    data: MealPlanSaveRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    with get_db() as conn:
        cursor = conn.execute(
            "INSERT INTO meal_plans (user_id, plan_data) VALUES (?, ?)",
            (user["id"], json.dumps(data.plan_data)),
        )
        plan_id = cursor.lastrowid
        row = conn.execute(
            "SELECT created_at FROM meal_plans WHERE id = ?",
            (plan_id,),
        ).fetchone()
    return {"ok": True, "plan_id": plan_id, "created_at": row["created_at"] if row else ""}


@app.get("/api/plan/latest")
async def get_latest_meal_plan(user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    plans = load_meal_plan_rows(user["id"], limit=1)
    return {"plan": plans[0] if plans else None}


@app.get("/api/plan/history")
async def get_meal_plan_history(user: sqlite3.Row = Depends(get_current_user)) -> dict[str, Any]:
    return {"plans": load_meal_plan_rows(user["id"], limit=12)}


@app.post("/api/plan/adherence")
async def update_plan_adherence(
    data: PlanAdherenceRequest,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    result = save_plan_adherence(user["id"], data)
    records = load_plan_adherence(user["id"], data.plan_id, days=90)
    return {
        **result,
        "records": records,
        "metrics": build_plan_adherence_metrics(records),
    }


@app.get("/api/plan/adherence")
async def get_plan_adherence(
    plan_id: int | None = None,
    days: int = 30,
    user: sqlite3.Row = Depends(get_current_user),
) -> dict[str, Any]:
    records = load_plan_adherence(user["id"], plan_id, days)
    return {
        "records": records,
        "metrics": build_plan_adherence_metrics(records),
    }


@app.get("/")
async def landing_page() -> FileResponse:
    return FileResponse("static/landing.html")


@app.get("/app")
async def app_page() -> FileResponse:
    return FileResponse("static/index.html")


app.mount("/", StaticFiles(directory="static", html=True), name="static")
