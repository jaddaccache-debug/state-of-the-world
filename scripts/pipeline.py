import os
import json
from datetime import date, timedelta
from synthesizer import synthesize, normalize_markets, normalize_conflict, normalize_news, normalize_trends, normalize_climate
from ai_explainer import generate_explanation

# ── Supabase Client (stdlib only — no pip needed for this module) ─────────────
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://dhzsdydvqnekomtfdsek.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "")

def supabase_upsert(table, data):
    """Push a record to Supabase using urllib (no supabase-py needed)."""
    import urllib.request
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        url, data=body,
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"  ✓ Saved to Supabase table '{table}'")
            return True
    except Exception as e:
        print(f"  ! Supabase write error: {e}")
        return False

def run_full_pipeline():
    today = date.today().isoformat()
    print(f"\n{'='*40}")
    print(f"  STATE OF THE WORLD ENGINE — {today}")
    print(f"{'='*40}\n")

    # ── STEP 1: Collect ───────────────────────────────
    print("[1/5] Collecting data...")
    from collectors.market_collector import collect_market_data
    from collectors.weather_collector import collect_global_weather
    from collectors.conflict_collector import collect_conflict_and_disaster
    from collectors.trends_collector import collect_search_trends
    from collectors.news_collector import collect_gdelt_sentiment

    raw = {
        "markets":  collect_market_data(),
        "weather":  collect_global_weather(),
        "conflict": collect_conflict_and_disaster(),
        "trends":   collect_search_trends(),
        "news":     collect_gdelt_sentiment()
    }

    # ── STEP 2: Normalize ─────────────────────────────
    print("\n[2/5] Normalizing signals...")
    scores = {
        "markets":  normalize_markets(raw["markets"]),
        "climate":  normalize_climate(raw["weather"]),
        "conflict": normalize_conflict(raw["conflict"]),
        "trends":   normalize_trends(raw["trends"]),
        "news":     normalize_news(raw["news"])
    }
    for cat, score in scores.items():
        print(f"  {cat:12s} → {score:3d}/100")

    # ── STEP 3: Synthesize ────────────────────────────
    print("\n[3/5] Synthesizing...")
    global_score, word = synthesize(scores)
    print(f"  Global Score : {global_score}/100")
    print(f"  Today's Word : {word}")

    # ── STEP 4: AI Explanation ────────────────────────
    print("\n[4/5] Generating explanation...")
    top_drivers = [
        f"Conflict index at {scores['conflict']}/100",
        f"Markets index at {scores['markets']}/100",
        f"News sentiment at {scores['news']}/100"
    ]
    explanation = generate_explanation(word, global_score, scores, top_drivers)

    # ── STEP 5: Save to Supabase ──────────────────────
    print("\n[5/5] Saving to database...")
    record = {
        "date": today,
        "word": word,
        "explanation": explanation,
        "confidence_score": min(95, max(55, global_score + 40)),
        "matrix": scores
    }
    supabase_upsert("daily_states", record)

    print(f"\n{'='*40}")
    print(f"  ✅ DONE: '{word}' saved for {today}")
    print(f"{'='*40}\n")
    return record

if __name__ == "__main__":
    run_full_pipeline()
