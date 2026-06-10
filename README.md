# FuelFlow

FuelFlow is a warm food and mood tracking demo. Users log meals, mood before and after eating, energy, notes, and optional alcohol context. The app stores logs in the browser and uses Gemini to generate supportive weekly insights.

## Stack

- Python + FastAPI
- Vanilla HTML, CSS, and JavaScript
- Google Gemini via `google-generativeai`
- Browser `localStorage`
- No auth, payments, or database

## Setup

1. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Add your Gemini API key to `.env`:

   ```env
   GEMINI_API_KEY=your_real_key_here
   ```

3. Run the app:

   ```bash
   uvicorn main:app --reload
   ```

4. Open:

   ```text
   http://127.0.0.1:8000
   ```

## API

`POST /api/get-insights`

Request body:

```json
{
  "logs": [
    {
      "mealName": "Dal chawal",
      "mealType": "Lunch",
      "moodBefore": { "emoji": "😐", "label": "Neutral" },
      "moodAfter": { "emoji": "😊", "label": "Good" },
      "energy": 8,
      "timestamp": "2026-06-09T12:30:00.000Z"
    }
  ]
}
```

Response:

```json
{
  "insight": "A warm weekly reflection...",
  "facts": ["Fact one", "Fact two", "Fact three"]
}
```
