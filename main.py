import json
import os
import re
import sqlite3
from datetime import datetime, timedelta, timezone
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
    with get_db() as conn:
        rows = conn.execute(
            "SELECT log_data FROM meal_logs WHERE user_id = ? ORDER BY logged_at ASC, id ASC",
            (user["id"],),
        ).fetchall()
    return {"logs": [json.loads(row["log_data"]) for row in rows]}


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
async def chat(data: ChatRequest, user: sqlite3.Row = Depends(get_current_user)) -> dict[str, str]:
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
    recent_history = "\n".join(
        f"{message.get('role', 'user')}: {message.get('content', '')}"
        for message in data.history[-6:]
    )
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
        return {"reply": reply}
    except Exception:
        return {
            "reply": "I hit a little pause there, but here is a steady place to start: pair protein, fiber-rich carbs, and water when you can. Tell me what you ate or what your goal is, and I can help you make the next choice feel easier.",
        }


@app.get("/")
async def landing_page() -> FileResponse:
    return FileResponse("static/landing.html")


@app.get("/app")
async def app_page() -> FileResponse:
    return FileResponse("static/index.html")


app.mount("/", StaticFiles(directory="static", html=True), name="static")
