import os
import json

MIROFISH_API_URL = os.getenv("MIROFISH_API_URL", "http://localhost:5001/api/simulate")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

def generate_prediction_word(simulation_report):
    """
    Distills a lengthy MiroFish simulation report into a single predicted 'Word of Tomorrow'.
    """
    if not GROQ_API_KEY:
        print("  ! GROQ_API_KEY not set. Using fallback prediction word.")
        return "UNCERTAIN"
        
    prompt = f"""
You are the State of the World Synthesizer.
Based on the following future simulation report from a multi-agent system, generate a SINGLE WORD that best describes the predicted global state for tomorrow.
The word must be a noun or adjective, impactful and precise.

Simulation Report:
{simulation_report}

Respond ONLY with the single word, no punctuation, no explanation.
"""
    try:
        import urllib.request
        body = json.dumps({
            "model": "llama3-8b-8192",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 10,
            "temperature": 0.3
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
            word = result["choices"][0]["message"]["content"].strip().upper()
            word = ''.join(c for c in word if c.isalpha())
            return word
    except Exception as e:
        print(f"  ! Error generating prediction word: {e}")
        return "UNCERTAIN"

def run_prediction(today_record):
    """
    Sends the current global state to MiroFish to predict the future state.
    """
    import urllib.request
    
    print("\n[PREDICTION] Initiating MiroFish simulation for tomorrow...")
    
    # 1. Format the Seed Data
    word = today_record.get("word", "Unknown")
    explanation = today_record.get("explanation", "")
    matrix = today_record.get("matrix", {})
    
    seed_prompt = f"Today's global state is '{word}'. Conflict: {matrix.get('conflict', 0)}/100, Markets: {matrix.get('markets', 0)}/100, News: {matrix.get('news', 0)}/100. AI Summary: {explanation}. Run a 24-hour simulation of public reaction and global stability."
    
    payload = {
        "seed_text": seed_prompt,
        "agents": 100,
        "rounds": 10
    }
    
    print(f"  > Sending seed prompt to MiroFish: {seed_prompt[:80]}...")
    
    # 2. Trigger MiroFish
    try:
        req = urllib.request.Request(
            MIROFISH_API_URL, 
            data=json.dumps(payload).encode(),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        with urllib.request.urlopen(req, timeout=120) as response:
            result = json.loads(response.read().decode())
            simulation_report = result.get("report", "Simulation completed with no detailed report.")
            print("  ✓ MiroFish simulation complete.")
            
    except Exception as e:
        print(f"  ! MiroFish API unreachable or failed: {e}")
        print("  ! Ensure MiroFish backend is running on port 5001.")
        # Fallback for testing when MiroFish is offline
        simulation_report = f"Mock simulation: Due to '{word}', agents predict increased volatility over the next 24 hours."

    # 3. Parse Results
    predicted_word = generate_prediction_word(simulation_report)
    print(f"  > Predicted Word for Tomorrow: {predicted_word}")
    
    # 4. Save to Supabase
    prediction_record = {
        "date": today_record.get("date"),
        "predicted_word": predicted_word,
        "simulation_summary": simulation_report[:500], # Save a snippet
        "base_word": word
    }
    
    from pipeline import supabase_upsert
    supabase_upsert("predictions", prediction_record)
    
    return prediction_record

if __name__ == "__main__":
    # Test execution
    test_record = {
        "date": "2026-05-01",
        "word": "FRACTURED",
        "explanation": "Global tensions rise as conflict metrics hit 85.",
        "matrix": {"conflict": 85, "markets": 45, "news": 60, "climate": 50, "trends": 70}
    }
    run_prediction(test_record)
