# State of the World — Intelligence Platform

> One data-backed word. Every day. A real-time global intelligence platform synthesizing signals into a single, credible daily reflection of humanity's state.

---

## Quick Start (Once Internet is Available)

```bash
# 1. Python setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 2. Add your Groq API key (free at console.groq.com)
echo "GROQ_API_KEY=your_key_here" >> scripts/.env

# 3. Run the full pipeline — pulls live data & saves to Supabase
cd scripts && python3 pipeline.py

# 4. Test the scoring engine with mock data
python3 synthesizer.py
```

---

## Project Structure

```
stateoftheworld/
├── index.html              # Main dashboard (Today's Word)
├── history.html            # Calendar + timeline of past words
├── methodology.html        # Full data transparency page
├── vercel.json             # Cron config (every 6h)
├── requirements.txt        # Python dependencies
├── .env.local              # Next.js env vars (Supabase keys)
└── scripts/
    ├── pipeline.py         # Master orchestrator — run this daily
    ├── synthesizer.py      # Scoring engine + word selection
    ├── ai_explainer.py     # Groq LLM integration (1-line explanation)
    ├── word_ontology.json  # 13 world state words + trigger conditions
    ├── .env                # Python env vars
    └── collectors/
        ├── news_collector.py       # GDELT (free)
        ├── conflict_collector.py   # GDACS / UN (free)
        ├── market_collector.py     # yfinance / Yahoo Finance (free)
        ├── weather_collector.py    # Open-Meteo (free)
        └── trends_collector.py     # pytrends / Google Trends (free)
```

---

## Tech Stack (100% Free Tier)

| Layer | Tool | Cost |
|---|---|---|
| Frontend | Vanilla HTML/CSS/JS | Free |
| Hosting | Vercel | Free |
| Database | Supabase (PostgreSQL) | Free |
| Caching | Upstash (Redis) | Free |
| AI Synthesis | Groq (Llama 3) | Free |
| News Data | GDELT Project | Free |
| Conflict Data | GDACS (UN/EU) | Free |
| Market Data | yfinance | Free |
| Weather Data | Open-Meteo | Free |
| Trends Data | pytrends | Free |

---

## Database (Supabase)

**Project:** `state-of-the-world-intel`  
**URL:** `https://dhzsdydvqnekomtfdsek.supabase.co`

Tables: `raw_signals`, `daily_states`, `predictions`

---

## How it Works

1. **Cron** triggers `pipeline.py` every 6 hours via Vercel
2. **Collectors** pull raw data from 5 free APIs
3. **Synthesizer** normalizes each signal to 0-100 and applies category weights
4. **Ontology** maps the composite score to the best-matching World State Word
5. **AI Explainer** generates a 1-sentence plain-English summary (no hallucination)
6. **Supabase** stores the final word + matrix for the frontend to consume

---

## Deployment

```bash
# Deploy to Vercel
npm install -g vercel
vercel deploy

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# GROQ_API_KEY
```

---

## Get Your Free Keys

- **Groq** (AI synthesis): https://console.groq.com
- **Supabase** (database): Already provisioned ✓
- All data sources (GDELT, GDACS, yfinance, Open-Meteo, pytrends): No key needed ✓
