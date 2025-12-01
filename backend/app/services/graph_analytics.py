import networkx as nx
import json

def build_supply_chain_graph(news_items):
    G = nx.DiGraph()
    
    # Mock Supply Chain Relationships (Knowledge Base)
    # In a real app, this would come from a database or NER
    relationships = [
        ("TSMC", "AAPL", "Supplier"),
        ("TSMC", "NVDA", "Supplier"),
        ("Foxconn", "AAPL", "Assembler"),
        ("Samsung", "AAPL", "Competitor"),
        ("Samsung", "NVDA", "Supplier"),
        ("ASML", "TSMC", "Supplier"),
        ("Panasonic", "TSLA", "Supplier"),
        ("CATL", "TSLA", "Supplier"),
        ("Rivian", "AMZN", "Partner"),
        ("AWS", "AMZN", "Subsidiary"),
        ("OpenAI", "MSFT", "Partner"),
        ("Azure", "MSFT", "Subsidiary"),
        ("Google", "GOOGL", "Subsidiary"),
        ("DeepMind", "GOOGL", "Subsidiary"),
        ("Waymo", "GOOGL", "Subsidiary"),
        ("YouTube", "GOOGL", "Subsidiary"),
    ]
    
    # Add nodes and edges
    for source, target, rel_type in relationships:
        G.add_edge(source, target, relationship=rel_type)
        G.nodes[source]['type'] = 'company'
        G.nodes[target]['type'] = 'company'

    # Analyze sentiment impact propagation
    # If a supplier has negative news, it impacts the buyer
    
    # 1. Map sentiment to nodes from news
    node_sentiments = {}
    for item in news_items:
        ticker = item['ticker']
        if ticker not in node_sentiments:
            node_sentiments[ticker] = []
        node_sentiments[ticker].append(item['sentiment_score'])
        
        # Also check if entities in headline match our graph nodes
        for node in G.nodes():
            if node in item['headline'] or node in item['ticker']: # Simple match
                 if node not in node_sentiments:
                    node_sentiments[node] = []
                 node_sentiments[node].append(item['sentiment_score'])

    # Calculate average sentiment per node
    for node in G.nodes():
        if node in node_sentiments:
            avg_sentiment = sum(node_sentiments[node]) / len(node_sentiments[node])
            G.nodes[node]['sentiment'] = avg_sentiment
        else:
            G.nodes[node]['sentiment'] = 0.0

    # 2. Propagate impact (Simple Logic: Supplier Sentiment * 0.5 -> Buyer)
    # This is a "First Order" propagation
    for u, v, data in G.edges(data=True):
        if G.nodes[u]['sentiment'] != 0:
             # Impact flows from Supplier (u) to Buyer (v)
             impact = G.nodes[u]['sentiment'] * 0.5
             # Add to buyer's existing sentiment (simplified)
             G.nodes[v]['propagated_impact'] = G.nodes[v].get('propagated_impact', 0) + impact

    # Convert to JSON for frontend (react-force-graph)
    nodes_data = []
    for n, data in G.nodes(data=True):
        nodes_data.append({
            "id": n,
            "group": 1 if data.get('type') == 'company' else 2,
            "sentiment": data.get('sentiment', 0),
            "propagated_impact": data.get('propagated_impact', 0),
            "val": 10 + abs(data.get('sentiment', 0)) * 10 # Size based on sentiment magnitude
        })
        
    links_data = []
    for u, v, data in G.edges(data=True):
        links_data.append({
            "source": u,
            "target": v,
            "relationship": data['relationship']
        })
        
    return {"nodes": nodes_data, "links": links_data}
