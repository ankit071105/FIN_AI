from fastapi import APIRouter, HTTPException
from app.core.database import get_db_connection, get_chroma_client
from app.services.local_rag import local_rag_service
import sqlite3
from pydantic import BaseModel
from typing import List, Optional
import json
import random

router = APIRouter()

class NewsItem(BaseModel):
    id: str
    ticker: str
    headline: str
    source: str
    timestamp: str
    sentiment_score: Optional[float]
    market_impact: Optional[str]
    summary: Optional[str]
    entities: Optional[str]

@router.get("/latest-news", response_model=List[NewsItem])
def get_latest_news(limit: int = 50):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM news ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

class ChatRequest(BaseModel):
    query: str

class Citation(BaseModel):
    headline: str
    source: str
    ticker: str

class ChatResponse(BaseModel):
    answer: str
    citations: Optional[List[Citation]] = []

@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        result = local_rag_service.answer_query(request.query)
        if isinstance(result, dict):
            return result
        return {"answer": result, "citations": []}
    except Exception as e:
        print(f"Error in chat: {e}")
        return {"answer": "I'm having trouble accessing the market data right now.", "citations": []}

from app.services.market import fetch_price_history, generate_knowledge_graph

@router.get("/market-data/{ticker}")
def get_market_data(ticker: str):
    return fetch_price_history(ticker)

@router.get("/knowledge-graph")
def get_knowledge_graph():
    # Get recent news to build graph
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM news ORDER BY timestamp DESC LIMIT 20")
    rows = cursor.fetchall()
    conn.close()
    news_items = [dict(row) for row in rows]
    return generate_knowledge_graph(news_items)

from app.services.graph_analytics import build_supply_chain_graph

@router.get("/supply-chain-graph")
def get_supply_chain_graph():
    # Get recent news to build graph
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM news ORDER BY timestamp DESC LIMIT 50")
    rows = cursor.fetchall()
    conn.close()
    news_items = [dict(row) for row in rows]
    return build_supply_chain_graph(news_items)

@router.get("/portfolio")
def get_portfolio():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM portfolio LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    
    if row:
        data = dict(row)
        # Parse JSON fields
        data['holdings'] = json.loads(data['holdings_json'])
        data['trade_history'] = json.loads(data['trade_history_json'])
        return data
    return {}

from app.services.butterfly_effect import knowledge_graph_engine
from app.services.darwinian_breeder import strategy_breeder

@router.get("/butterfly-effect/graph")
def get_butterfly_graph():
    return knowledge_graph_engine.get_graph_json()

@router.post("/butterfly-effect/shock")
def propagate_shock(node_id: str, magnitude: float):
    return knowledge_graph_engine.propagate_shock(node_id, magnitude)

@router.get("/darwinian/evolve")
def evolve_strategies():
    return strategy_breeder.evolve()

from app.services.fed_whisperer import fed_whisperer
from app.services.multiverse import multiverse_simulator
from fastapi import UploadFile, File
import shutil
import os

@router.post("/fed-whisperer/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    temp_file = f"temp_{file.filename}"
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        result = fed_whisperer.analyze_audio(temp_file)
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)
            
    return result

@router.post("/multiverse/simulate")
def run_simulation(premise: str):
    return multiverse_simulator.run_simulation(premise)

from app.agents.forensic_agent import forensic_agent

class ForensicScanRequest(BaseModel):
    text: str

@router.post("/forensic/scan")
def scan_forensic_risk(request: ForensicScanRequest):
    score = forensic_agent.scan_risk(request.text)
    return {"risk_score": score, "details": "Scan complete"}

