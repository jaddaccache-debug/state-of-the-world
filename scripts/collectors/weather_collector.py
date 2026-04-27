import requests
import json
from datetime import datetime

def collect_global_weather():
    print(f"[{datetime.now()}] Collecting global weather anomalies...")
    
    # Global cities for representative climate signal
    cities = {
        "New York": {"lat": 40.71, "lon": -74.01},
        "London": {"lat": 51.51, "lon": -0.13},
        "Tokyo": {"lat": 35.69, "lon": 139.69},
        "Sydney": {"lat": -33.87, "lon": 151.21},
        "São Paulo": {"lat": -23.55, "lon": -46.63},
        "Cairo": {"lat": 30.04, "lon": 31.24}
    }
    
    results = {}
    
    for city, coords in cities.items():
        try:
            # Using Open-Meteo (Free, no key)
            url = f"https://api.open-meteo.com/v1/forecast?latitude={coords['lat']}&longitude={coords['lon']}&current_weather=true"
            response = requests.get(url)
            data = response.json()
            
            if "current_weather" in data:
                cw = data["current_weather"]
                results[city] = {
                    "temp": cw["temperature"],
                    "windspeed": cw["windspeed"],
                    "weathercode": cw["weathercode"]
                }
                print(f"  - {city}: {cw['temperature']}°C (Code: {cw['weathercode']})")
        except Exception as e:
            print(f"  ! Error collecting {city}: {e}")
            
    return results

if __name__ == "__main__":
    data = collect_global_weather()
