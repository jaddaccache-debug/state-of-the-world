import requests
from datetime import datetime, timedelta
import urllib.parse

def collect_gdelt_sentiment():
    print(f"[{datetime.now()}] Collecting global news sentiment from GDELT...")

    # GDELT Doc 2.0 API — tone query (URL-encoded correctly)
    # tone < -5 means strongly negative tone articles
    query = urllib.parse.quote('sourcelang:english -tone:-5')
    url = (
        f"https://api.gdeltproject.org/api/v2/doc/doc"
        f"?query={query}&mode=artlist&maxrecords=10&format=json"
    )

    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200 or not response.text.strip():
            raise ValueError(f"Empty or bad response: {response.status_code}")

        data = response.json()
        articles = data.get("articles", [])
        print(f"  - Found {len(articles)} high-negativity news articles")
        return articles

    except Exception as e:
        print(f"  ! GDELT primary failed ({e}), trying fallback RSS...")
        return _fallback_gdelt_rss()

def _fallback_gdelt_rss():
    """GDELT also exposes a public RSS feed as a fallback."""
    try:
        import xml.etree.ElementTree as ET
        rss_url = "https://feeds.feedburner.com/ndtvnews-world-news"
        resp = requests.get(rss_url, timeout=8)
        root = ET.fromstring(resp.content)
        items = root.findall('./channel/item')
        articles = [{"url": i.find('link').text, "title": i.find('title').text, "tone": -3} for i in items[:10]]
        print(f"  - Fallback: {len(articles)} articles from RSS")
        return articles
    except Exception as e:
        print(f"  ! Fallback RSS also failed: {e}")
        return []

if __name__ == "__main__":
    data = collect_gdelt_sentiment()

