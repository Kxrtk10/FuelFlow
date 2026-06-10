import json
import os
from typing import Any

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field


load_dotenv()
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")


class InsightsRequest(BaseModel):
    logs: list[dict[str, Any]] = Field(default_factory=list)


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


@app.post("/api/get-insights")
async def get_insights(data: InsightsRequest) -> dict[str, Any]:
    summary = summarize_logs(data.logs)
    prompt = f"""Here's a summary of the user's recent meals and moods:
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
                    "system": "You are FuelFlow's AI companion — warm, encouraging, genuinely insightful. Never shame or use words like cheat meal, bad food, or guilt. Return valid JSON only — no markdown, no backticks, no preamble whatsoever.",
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


app.mount("/", StaticFiles(directory="static", html=True), name="static")
