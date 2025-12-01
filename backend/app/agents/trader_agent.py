import json
from datetime import datetime
from app.core.database import get_db_connection

class TraderAgent:
    def __init__(self):
        self.risk_per_trade = 0.02 # 2% risk

    def evaluate_trade(self, news_item, sentiment_score, market_regime, forensic_score):
        # 1. Macro Filter: If Risk-Off, only allow Shorts (or block Buys)
        if market_regime == "Risk-Off" and sentiment_score > 0:
            return {"action": "SKIP", "reason": "Macro Regime is Risk-Off. Longs blocked."}
        
        # 2. Forensic Filter: If Risk Score > 50, Block Trade
        if forensic_score > 50:
            return {"action": "SKIP", "reason": f"Forensic Risk too high ({forensic_score})."}

        # 3. Trade Logic
        confidence = abs(sentiment_score) # Simplified confidence
        if confidence < 0.5:
             return {"action": "SKIP", "reason": "Confidence too low."}

        action = "BUY" if sentiment_score > 0 else "SELL"
        
        # 4. Execute (Simulated)
        return self._execute_trade(news_item['ticker'], action, news_item['headline'])

    def _execute_trade(self, ticker, action, reason):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get Portfolio
        cursor.execute("SELECT * FROM portfolio LIMIT 1")
        row = cursor.fetchone()
        portfolio = dict(row)
        cash = portfolio['cash_balance']
        holdings = json.loads(portfolio['holdings_json'])
        history = json.loads(portfolio['trade_history_json'])
        
        # Sizing (Mock Price $100 for simplicity)
        price = 100.0 
        amount = cash * self.risk_per_trade
        shares = int(amount / price)
        
        if shares == 0:
             conn.close()
             return {"action": "SKIP", "reason": "Insufficient capital for position sizing."}

        # Update Holdings
        if action == "BUY":
            cash -= shares * price
            holdings[ticker] = holdings.get(ticker, 0) + shares
        else: # SELL (Short)
            cash += shares * price
            holdings[ticker] = holdings.get(ticker, 0) - shares
            
        # Update History
        trade_record = {
            "ticker": ticker,
            "action": action,
            "shares": shares,
            "price": price,
            "reason": reason,
            "timestamp": datetime.now().isoformat()
        }
        history.insert(0, trade_record)
        
        # Save DB
        cursor.execute("""
            UPDATE portfolio 
            SET cash_balance = ?, holdings_json = ?, trade_history_json = ?, last_updated = ?
            WHERE id = ?
        """, (cash, json.dumps(holdings), json.dumps(history), datetime.now().isoformat(), portfolio['id']))
        
        conn.commit()
        conn.close()
        
        return {"action": action, "details": trade_record}

trader_agent = TraderAgent()
