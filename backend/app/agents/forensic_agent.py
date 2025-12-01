import re

class ForensicAgent:
    def scan_risk(self, text):
        risk_score = 0
        red_flags = [
            "auditor resignation", "delayed filing", "restatement", 
            "sec probe", "short seller report", "accounting irregularities",
            "material weakness", "going concern"
        ]
        
        text_lower = text.lower()
        for flag in red_flags:
            if flag in text_lower:
                risk_score += 25 # High penalty per flag
                
        return min(risk_score, 100)

forensic_agent = ForensicAgent()
