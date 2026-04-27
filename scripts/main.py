import os
import json
from collectors.market_collector import collect_market_data
from collectors.weather_collector import collect_global_weather
from collectors.conflict_collector import collect_conflict_and_disaster
from collectors.trends_collector import collect_search_trends
from datetime import datetime

def run_pipeline():
    print("=== STARTING DATA INGESTION PIPELINE ===")
    timestamp = datetime.now().isoformat()
    
    # 1. Collect Data
    signals = {
        "markets": collect_market_data(),
        "weather": collect_global_weather(),
        "conflict": collect_conflict_and_disaster(),
        "trends": collect_search_trends()
    }
    
    # 2. Output Summary
    print("\n=== PIPELINE SUMMARY ===")
    for cat, data in signals.items():
        print(f"  - {cat}: {len(data)} signals collected")
        
    # TODO: Phase 2 - Add scoring logic and push to Supabase
    # This will be integrated once the Python Supabase client is verified
    
if __name__ == "__main__":
    run_pipeline()
