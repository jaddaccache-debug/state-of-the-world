import json
import math
from datetime import datetime

# ── Load Word Ontology ────────────────────────────────────────────────────────
with open("word_ontology.json") as f:
    ONTOLOGY = json.load(f)["ontology"]

# ── Category Weights (must sum to 1.0) ───────────────────────────────────────
# Higher weight = more influence on final score
WEIGHTS = {
    "conflict":  0.28,   # Highest — most viscerally impactful
    "markets":   0.23,   # Strong indicator of systemic stress
    "news":      0.22,   # Broad sentiment proxy
    "trends":    0.15,   # Public consciousness & anxiety
    "climate":   0.12,   # Stabilizing/slow-moving signal
}

# ── Normalization Helpers ─────────────────────────────────────────────────────
def clamp(val, lo=0, hi=100):
    return max(lo, min(hi, val))

def recency_decay(raw_score, hours_old):
    """Exponential decay: events from 1h ago score 5x more than 22h ago."""
    decay = math.exp(-0.08 * hours_old)
    return raw_score * decay

# ── Market Normalizer ─────────────────────────────────────────────────────────
def normalize_markets(market_data):
    """
    VIX > 30 = high fear (low score).
    Major index changes blended into 0-100.
    50 = neutral day, <50 = stress, >50 = calm.
    """
    scores = []
    for symbol, d in market_data.items():
        pct = d.get("change_pct", 0)
        if symbol == "^VIX":
            # VIX inverse: higher VIX = lower score
            vix = d.get("price", 20)
            scores.append(clamp(100 - (vix * 2.5)))
        else:
            # Map -5% to +5% daily change onto 0-100
            normalized = clamp(50 + (pct * 5))
            scores.append(normalized)
    return round(sum(scores) / len(scores)) if scores else 50

# ── Conflict Normalizer ───────────────────────────────────────────────────────
def normalize_conflict(gdacs_alerts):
    """
    RED = 90, ORANGE = 60, GREEN = 20.
    Score = 100 - average_alert_severity (conflict high = score high = bad)
    """
    severity_map = {"Red": 90, "Orange": 60, "Green": 20}
    scores = []
    for alert in gdacs_alerts:
        sev = alert.get("severity", "Green")
        scores.append(severity_map.get(sev, 20))
    if not scores:
        return 20  # Low conflict is good
    raw = sum(scores) / len(scores)
    return round(raw)  # Higher = more conflict

# ── News Normalizer ───────────────────────────────────────────────────────────
def normalize_news(articles):
    """
    GDELT returns tone scores. Negative tone = low score.
    Map -10..+10 tone scale to 0-100 (50 = neutral).
    """
    tones = []
    for a in articles:
        tone = a.get("tone", 0)
        tones.append(clamp(50 + (tone * 5)))
    return round(sum(tones) / len(tones)) if tones else 50

# ── Trends Normalizer ─────────────────────────────────────────────────────────
def normalize_trends(trend_data):
    """
    High 'recession'/'war' searches = low score.
    High 'happiness' searches = higher score.
    """
    negative_kws = ["recession", "war", "inflation"]
    positive_kws = ["happiness"]
    neg_avg = sum(trend_data.get(k, 0) for k in negative_kws) / len(negative_kws)
    pos_avg = sum(trend_data.get(k, 50) for k in positive_kws) / len(positive_kws)
    raw = (pos_avg - neg_avg + 100) / 2
    return round(clamp(raw))

# ── Climate Normalizer ────────────────────────────────────────────────────────
def normalize_climate(weather_data):
    """
    Extreme wind or severe weather codes push score down.
    weathercode 0-1 = clear = good. 95+ = thunderstorm = bad.
    """
    code_severity = {
        range(0, 3): 0,    # Clear
        range(3, 50): 15,  # Cloudy/Drizzle
        range(50, 70): 35, # Rainfall
        range(70, 80): 55, # Snow
        range(80, 95): 70, # Heavy rain
        range(95, 100): 90 # Thunderstorm/severe
    }
    scores = []
    for city, d in weather_data.items():
        code = d.get("weathercode", 0)
        severity = 0
        for r, s in code_severity.items():
            if code in r:
                severity = s
        wind = d.get("windspeed", 0)
        wind_penalty = min(wind * 0.5, 30)
        scores.append(100 - severity - wind_penalty)
    return round(sum(scores) / len(scores)) if scores else 50

# ── THE SYNTHESIZER ───────────────────────────────────────────────────────────
def synthesize(scores_by_category):
    """
    Produces:
      - Weighted global score (0-100)
      - Best matching word from ontology
    """
    weighted_score = sum(
        scores_by_category.get(cat, 50) * weight
        for cat, weight in WEIGHTS.items()
    )
    weighted_score = round(clamp(weighted_score))
    
    # Map score to word
    best_word = select_word(scores_by_category, weighted_score)
    return weighted_score, best_word

def select_word(scores, global_score):
    """
    Walks ontology conditions to find best matching word.
    Falls back to polarity-based selection.
    """
    c = scores.get("conflict", 50)
    m = scores.get("markets", 50)
    n = scores.get("news", 50)
    t = scores.get("trends", 50)
    cl = scores.get("climate", 50)

    for entry in ONTOLOGY:
        trigger = entry["trigger"]
        if "conflict_gt" in trigger and c <= trigger["conflict_gt"]: continue
        if "conflict_lt" in trigger and c >= trigger["conflict_lt"]: continue
        if "markets_gt" in trigger and m <= trigger["markets_gt"]: continue
        if "markets_lt" in trigger and m >= trigger["markets_lt"]: continue
        if "news_gt" in trigger and n <= trigger["news_gt"]: continue
        if "news_lt" in trigger and n >= trigger["news_lt"]: continue
        if "trends_lt" in trigger and t >= trigger["trends_lt"]: continue
        if "all_gt" in trigger and not all(s > trigger["all_gt"] for s in [c, m, n, t, cl]): continue
        if "all_between" in trigger:
            lo, hi = trigger["all_between"]
            if not all(lo < s < hi for s in [c, m, n, t, cl]): continue
        return entry["word"]

    # Fallback: use global score
    if global_score < 35: return "VOLATILE"
    if global_score < 50: return "UNCERTAIN"
    if global_score < 65: return "CAUTIOUS"
    if global_score < 80: return "HOPEFUL"
    return "STABLE"

# ── RUN ────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Simulate today's collected data (static example for testing)
    mock_scores = {
        "conflict": 74,
        "markets": 38,
        "news": 31,
        "trends": 29,
        "climate": 55
    }
    global_score, word = synthesize(mock_scores)
    print(f"\n=== STATE OF THE WORLD ===")
    print(f"Category Scores: {mock_scores}")
    print(f"Global Score: {global_score}/100")
    print(f"Today's Word: {word}")
    print("=" * 30)
