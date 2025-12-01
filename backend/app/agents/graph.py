from typing import TypedDict, List, Optional
from langgraph.graph import StateGraph, END
from app.agents.nodes import deduplication_node, entity_extraction_node, impact_analysis_node, storage_node, trader_node

class AgentState(TypedDict):
    news_item: dict
    is_duplicate: Optional[bool]
    entities: Optional[List[str]]
    sentiment_score: Optional[float]
    market_impact: Optional[str]
    market_regime: Optional[str]
    forensic_score: Optional[int]
    trade_result: Optional[dict]

def create_graph():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("dedup", deduplication_node)
    workflow.add_node("entity", entity_extraction_node)
    workflow.add_node("impact", impact_analysis_node)
    workflow.add_node("storage", storage_node)
    workflow.add_node("trader", trader_node)
    
    workflow.set_entry_point("dedup")
    
    def should_continue(state):
        if state.get("is_duplicate"):
            return END
        return "entity"

    workflow.add_conditional_edges(
        "dedup",
        should_continue,
        {END: END, "entity": "entity"}
    )
    
    workflow.add_edge("entity", "impact")
    workflow.add_edge("impact", "storage")
    workflow.add_edge("storage", "trader")
    workflow.add_edge("trader", END)
    
    return workflow.compile()
