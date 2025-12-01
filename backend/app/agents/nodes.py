import random
import json
from app.core.database import get_chroma_client, get_db_connection
from app.services.local_rag import local_rag_service

def deduplication_node(state):
    print("--- DEDUPLICATION NODE ---")
    news_item = state["news_item"]
    client = get_chroma_client()
    collection = client.get_collection("news_embeddings")
    
    # In a real app, we would generate an embedding for the headline
    # and query the collection.
    # results = collection.query(query_embeddings=[embedding], n_results=1)
    
    # For this mock, we'll assume it's unique
    state["is_duplicate"] = False
    return state

def entity_extraction_node(state):
    print("--- ENTITY EXTRACTION NODE ---")
    if state.get("is_duplicate"):
        return state
        
    news_item = state["news_item"]
    # In a real app, use an LLM to extract entities
    entities = [news_item["ticker"]]
    state["entities"] = entities
    return state

def impact_analysis_node(state):
    print("--- IMPACT ANALYSIS NODE ---")
    if state.get("is_duplicate"):
        return state
        
    headline = state["news_item"]["headline"]
    
    # Mock sentiment logic
    sentiment_score = random.uniform(-0.2, 0.2) # Default neutral-ish
    
    positive_keywords = ["beat", "upgrade", "rally", "jump", "acquire", "revolutionary"]
    negative_keywords = ["scrutiny", "resignation", "issues", "hit", "weigh"]
    
    if any(k in headline.lower() for k in positive_keywords):
        sentiment_score = random.uniform(0.5, 0.9)
    elif any(k in headline.lower() for k in negative_keywords):
        sentiment_score = random.uniform(-0.9, -0.5)
        
    if abs(sentiment_score) > 0.6:
        impact_label = "High"
    elif abs(sentiment_score) > 0.3:
        impact_label = "Medium"
    else:
        impact_label = "Low"
        
    state["sentiment_score"] = sentiment_score
    state["market_impact"] = impact_label
    return state

def storage_node(state):
    print("--- STORAGE NODE ---")
    if state.get("is_duplicate"):
        return state
        
    news_item = state["news_item"]
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO news (id, ticker, headline, source, timestamp, sentiment_score, market_impact, summary, entities)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        news_item["id"],
        news_item["ticker"],
        news_item["headline"],
        news_item["source"],
        news_item["timestamp"],
        state["sentiment_score"],
        state["market_impact"],
        news_item["headline"], # Using headline as summary for now
        json.dumps(state["entities"])
    ))
    conn.commit()
    conn.close()
    
    # Store in Chroma via Local RAG
    local_rag_service.store_news(news_item)
    
    return state

from app.agents.macro_agent import macro_agent
from app.agents.forensic_agent import forensic_agent
from app.agents.trader_agent import trader_agent

def trader_node(state):
    print("--- TRADER NODE ---")
    if state.get("is_duplicate"):
        return state
        
    news_item = state["news_item"]
    sentiment_score = state["sentiment_score"]
    
    # 1. Macro Check
    market_regime = macro_agent.analyze_regime()
    state["market_regime"] = market_regime
    
    # 2. Forensic Check
    forensic_score = forensic_agent.scan_risk(news_item["headline"])
    state["forensic_score"] = forensic_score
    
    # 3. Trade Execution
    trade_result = trader_agent.evaluate_trade(news_item, sentiment_score, market_regime, forensic_score)
    state["trade_result"] = trade_result
    
    if trade_result["action"] != "SKIP":
        print(f"👻 GHOST TRADER EXECUTED: {trade_result['action']} {news_item['ticker']}")
    
    return state
