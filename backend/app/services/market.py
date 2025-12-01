import yfinance as yf
import pandas as pd
import random

def fetch_price_history(ticker: str, period="1mo"):
    try:
        # Fetch data
        stock = yf.Ticker(ticker)
        hist = stock.history(period=period)
        
        # Format for frontend
        data = []
        for date, row in hist.iterrows():
            data.append({
                "date": date.strftime("%Y-%m-%d"),
                "price": round(row["Close"], 2)
            })
        return data
    except Exception as e:
        print(f"Error fetching stock data: {e}")
        return []

def generate_knowledge_graph(news_items):
    # Mock knowledge graph generation based on recent news
    # In a real app, this would use NER to find relationships
    
    nodes = []
    links = []
    
    # Extract unique tickers from news
    tickers = list(set(item['ticker'] for item in news_items))
    
    # Add nodes
    for ticker in tickers:
        nodes.append({"id": ticker, "type": "company", "val": 10})
        
    # Add some related entities (Mock)
    related_entities = {
        "AAPL": ["TSMC", "Foxconn", "Samsung"],
        "TSLA": ["Panasonic", "CATL", "SpaceX"],
        "NVDA": ["TSMC", "Microsoft", "Google"],
        "AMZN": ["Rivian", "AWS", "Whole Foods"],
        "GOOGL": ["DeepMind", "Waymo", "YouTube"],
        "MSFT": ["OpenAI", "LinkedIn", "GitHub"],
        "JPM": ["Chase", "Bear Stearns", "Goldman Sachs"],
        "GS": ["JPM", "Morgan Stanley", "Apple"]
    }
    
    for ticker in tickers:
        if ticker in related_entities:
            for entity in related_entities[ticker]:
                # Add node if not exists
                if not any(n['id'] == entity for n in nodes):
                    nodes.append({"id": entity, "type": "partner", "val": 5})
                # Add link
                links.append({"source": ticker, "target": entity})
                
    return {"nodes": nodes, "links": links}
