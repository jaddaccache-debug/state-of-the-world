import requests
import xml.etree.ElementTree as ET
from datetime import datetime

def collect_conflict_and_disaster():
    print(f"[{datetime.now()}] Collecting global disaster and conflict alerts from GDACS...")
    
    # GDACS RSS Feed (Global Disaster Alert and Coordination System)
    url = "https://www.gdacs.org/xml/rss.xml"
    
    try:
        response = requests.get(url)
        root = ET.fromstring(response.content)
        
        results = []
        
        for item in root.findall('./channel/item'):
            title = item.find('title').text
            description = item.find('description').text
            # GDACS specific namespaces for severity
            severity = "Unknown"
            alert_level = item.find('{http://www.gdacs.org}alertlevel')
            if alert_level is not None:
                severity = alert_level.text
                
            results.append({
                "title": title,
                "description": description,
                "severity": severity
            })
            print(f"  - [{severity}] {title}")
            
        return results
    except Exception as e:
        print(f"  ! Error collecting GDACS data: {e}")
        return []

if __name__ == "__main__":
    data = collect_conflict_and_disaster()
