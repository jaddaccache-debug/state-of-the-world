import yfinance as yf
import pandas as pd
from datetime import datetime

def collect_market_data():
    print(f"[{datetime.now()}] Collecting global market signals...")
    
    # Core Global Indicators
    tickers = {
        "^GSPC": "S&P 500 (US)",
        "^VIX": "Volatility Index (Fear Gauge)",
        "^FTSE": "FTSE 100 (UK)",
        "^N225": "Nikkei 225 (Japan)",
        "CL=F": "Crude Oil",
        "GC=F": "Gold"
    }
    
    results = {}
    
    for symbol, name in tickers.items():
        try:
            ticker = yf.Ticker(symbol)
            # Get last 2 days to calculate % change
            hist = ticker.history(period="2d")
            if len(hist) >= 2:
                prev_close = hist['Close'].iloc[-2]
                curr_close = hist['Close'].iloc[-1]
                pct_change = ((curr_close - prev_close) / prev_close) * 100
                
                results[symbol] = {
                    "name": name,
                    "price": round(curr_close, 2),
                    "change_pct": round(pct_change, 2)
                }
                print(f"  - {name}: {round(curr_close, 2)} ({round(pct_change, 2)}%)")
        except Exception as e:
            print(f"  ! Error collecting {name}: {e}")
            
    return results

if __name__ == "__main__":
    data = collect_market_data()
    # In Phase 2, this will save to Supabase
