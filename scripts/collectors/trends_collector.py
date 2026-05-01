from pytrends.request import TrendReq
from datetime import datetime
import pandas as pd

def collect_search_trends():
    print(f"[{datetime.now()}] Collecting global search trend signals...")
    
    # High-level global themes to gauge "temperature"
    keywords = ["recession", "war", "climate change", "inflation", "happiness"]
    
    try:
        # Initialize pytrends with a global focus
        pytrends = TrendReq(hl='en-US', tz=360)
        pytrends.build_payload(keywords, cat=0, timeframe='now 1-d', geo='', gprop='')
        data = pytrends.interest_over_time()
        
        if not data.empty:
            # Get latest values
            latest = data.iloc[-1]
            results = latest.to_dict()
            for kw, val in results.items():
                if kw != 'isPartial':
                    print(f"  - {kw}: {val}")
            return results
        return {}
    except Exception as e:
        print(f"  ! Error collecting Trends data: {e}")
        return {}

if __name__ == "__main__":
    data = collect_search_trends()
