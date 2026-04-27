import os
import json
from datetime import date

# ── AI Explainer (Groq Llama 3 — Free Tier) ───────────────────────────────────
# Fallback: Google Gemini Flash if Groq is unavailable
# Get free key at: https://console.groq.com/

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

# Strict system prompt — no hallucination possible
SYSTEM_PROMPT = """You are a data summarizer for a global intelligence platform.
You will receive a JSON object containing:
- today_word: The selected world state word
- global_score: A 0-100 composite score
- category_scores: Breakdown of 5 signal categories
- top_drivers: Up to 3 key factual events driving the score

Your ONLY task is to write ONE sentence (max 30 words) that connects the word
to the data. You must NOT invent facts. You must NOT access the internet.
You must NOT express opinions. Only reference what is in the JSON."""

def build_prompt(word, global_score, category_scores, top_drivers):
    payload = {
        "today_word": word,
        "global_score": global_score,
        "category_scores": category_scores,
        "top_drivers": top_drivers[:3]
    }
    return json.dumps(payload, indent=2)

def generate_explanation(word, global_score, category_scores, top_drivers):
    """
    Calls Groq (Llama 3) to generate a 1-sentence explanation.
    Returns a fallback string if API is unavailable or key not set.
    """
    if not GROQ_API_KEY:
        print("  ! GROQ_API_KEY not set. Using fallback explanation.")
        return _fallback_explanation(word, global_score, category_scores)

    try:
        import urllib.request
        prompt = build_prompt(word, global_score, category_scores, top_drivers)

        body = json.dumps({
            "model": "llama3-8b-8192",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 80,
            "temperature": 0.1  # Low temperature = deterministic, factual
        }).encode()

        req = urllib.request.Request(
            GROQ_URL,
            data=body,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            }
        )
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
            explanation = result["choices"][0]["message"]["content"].strip()
            print(f"  ✓ AI explanation: {explanation}")
            return explanation

    except Exception as e:
        print(f"  ! Groq API error: {e}. Using fallback.")
        return _fallback_explanation(word, global_score, category_scores)

def _fallback_explanation(word, score, cat_scores):
    """
    Deterministic fallback — no AI needed.
    Generates a plain-English summary from the data alone.
    """
    dominant = max(cat_scores, key=cat_scores.get)
    dominant_score = cat_scores[dominant]
    direction = "elevated" if dominant_score > 60 else "suppressed"
    return (
        f"{dominant.replace('_', ' ').title()} signals ({direction} at {dominant_score}/100) "
        f"drove the composite score to {score}/100, producing today's word: {word}."
    )

if __name__ == "__main__":
    # Test with mock data
    explanation = generate_explanation(
        word="PRECARIOUS",
        global_score=38,
        category_scores={"conflict": 74, "markets": 38, "news": 31, "trends": 29, "climate": 55},
        top_drivers=[
            "GDACS RED alert: flooding in Bangladesh and seismic activity near Taiwan",
            "VIX surged 34% — highest single-day spike since March 2022",
            "Global negative news tone index: 31/100 across 100+ languages"
        ]
    )
    print(f"\nExplanation: {explanation}")
