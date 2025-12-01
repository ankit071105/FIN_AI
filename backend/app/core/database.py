import sqlite3
import chromadb
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(BASE_DIR, "finai.db")
CHROMA_PATH = os.path.join(BASE_DIR, "chroma_db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_sqlite():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS news (
            id TEXT PRIMARY KEY,
            ticker TEXT,
            headline TEXT,
            source TEXT,
            timestamp TEXT,
            sentiment_score REAL,
            market_impact TEXT,
            summary TEXT,
            entities TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS prediction_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            news_id TEXT,
            ticker TEXT,
            predicted_sentiment REAL,
            stock_price_at_time REAL,
            actual_outcome_24h REAL,
            timestamp TEXT
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            news_item_id TEXT,
            user_id TEXT,
            parent_id INTEGER,
            content TEXT,
            upvotes INTEGER DEFAULT 0,
            sentiment_vote TEXT,
            timestamp TEXT
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS portfolio (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cash_balance REAL DEFAULT 100000.0,
            holdings_json TEXT DEFAULT '{}',
            trade_history_json TEXT DEFAULT '[]',
            last_updated TEXT
        )
    """)
    # Initialize portfolio if empty
    cursor.execute("SELECT count(*) FROM portfolio")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO portfolio (cash_balance, holdings_json, trade_history_json, last_updated) VALUES (100000.0, '{}', '[]', datetime('now'))")
    conn.commit()
    conn.close()

def get_chroma_client():
    return chromadb.PersistentClient(path=CHROMA_PATH)

def init_chroma():
    client = get_chroma_client()
    client.get_or_create_collection(name="news_embeddings")

def init_db():
    init_sqlite()
    init_chroma()
