import random
import uuid
from datetime import datetime

TICKERS = ["AAPL", "TSLA", "GOOGL", "AMZN", "MSFT", "NVDA", "JPM", "GS"]
SOURCES = ["Bloomberg", "Reuters", "CNBC", "WSJ", "Financial Times"]
HEADLINE_TEMPLATES = [
    "{ticker} reports Q3 earnings beat, stock jumps 5%",
    "{ticker} faces regulatory scrutiny over new AI product",
    "Analysts upgrade {ticker} to Buy, citing strong demand",
    "{ticker} CEO announces surprise resignation",
    "Market rally led by {ticker} and tech sector",
    "{ticker} to acquire smaller rival for $2B",
    "Supply chain issues hit {ticker} production",
    "{ticker} unveils revolutionary new battery tech",
    "Inflation concerns weigh on {ticker} outlook",
    "{ticker} partners with major auto manufacturer"
]

def generate_news_item():
    ticker = random.choice(TICKERS)
    headline = random.choice(HEADLINE_TEMPLATES).format(ticker=ticker)
    return {
        "id": str(uuid.uuid4()),
        "ticker": ticker,
        "headline": headline,
        "source": random.choice(SOURCES),
        "timestamp": datetime.now().isoformat()
    }

def fetch_mock_news(count=1):
    return [generate_news_item() for _ in range(count)]
