import random

class MacroAgent:
    def analyze_regime(self):
        # Mock Logic: Randomly switch regimes or base on time
        # In real app, check VIX, Bond Yields, etc.
        
        indicators = {
            "VIX": random.uniform(15, 35),
            "10Y_Yield": random.uniform(3.5, 5.0),
            "Oil": random.uniform(70, 95)
        }
        
        # Simple Rule
        if indicators["VIX"] > 25 or indicators["10Y_Yield"] > 4.5:
            return "Risk-Off"
        else:
            return "Risk-On"

macro_agent = MacroAgent()
