from app.agents.macro_agent import macro_agent
from app.agents.trader_agent import trader_agent
import random

class MultiverseSimulator:
    def run_simulation(self, premise):
        """
        Simulates portfolio reaction to a hypothetical premise.
        Does NOT execute real trades.
        """
        
        # 1. Parse Premise to determine Simulated Market Regime
        # Simple keyword matching for the mock
        simulated_regime = "Risk-On"
        if any(x in premise.lower() for x in ["crash", "hike", "war", "crisis", "inflation", "oil hits"]):
            simulated_regime = "Risk-Off"
            
        # 2. Simulate Trader Reaction
        # We'll create a mock news item based on the premise
        mock_news = {
            "ticker": "SPY", # General market
            "headline": premise,
            "source": "Multiverse Simulator"
        }
        
        # Mock sentiment based on premise keywords
        sentiment = -0.8 if simulated_regime == "Risk-Off" else 0.8
        
        # Reuse Trader Logic but don't commit to DB (we'd need to refactor TraderAgent to separate logic from execution, 
        # but for now we will simulate the decision logic here)
        
        decision = {
            "action": "HOLD",
            "reason": "Uncertainty in multiverse."
        }
        
        if simulated_regime == "Risk-Off":
            decision = {
                "action": "SELL_ALL",
                "reason": f"Premise '{premise}' triggered Risk-Off regime. Liquidation recommended."
            }
        else:
             decision = {
                "action": "BUY_AGGRESSIVE",
                "reason": f"Premise '{premise}' suggests bullish continuation."
            }
            
        return {
            "premise": premise,
            "simulated_regime": simulated_regime,
            "projected_impact": {
                "portfolio_value_change": "-15%" if simulated_regime == "Risk-Off" else "+5%",
                "recommended_action": decision
            }
        }

multiverse_simulator = MultiverseSimulator()
