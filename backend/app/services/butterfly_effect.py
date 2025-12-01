import networkx as nx
import json

class CausalKnowledgeGraph:
    def __init__(self):
        self.graph = nx.DiGraph()
        self._initialize_mock_data()

    def _initialize_mock_data(self):
        # Mock Knowledge Base (In production, load from DB)
        # Nodes: (ID, Type)
        self.graph.add_node("Thailand", type="Country", risk_score=0)
        self.graph.add_node("Flooding", type="Event", risk_score=0)
        self.graph.add_node("Hard_Drive_Sector", type="Industry", risk_score=0)
        self.graph.add_node("Western_Digital", type="Company", risk_score=0)
        self.graph.add_node("Seagate", type="Company", risk_score=0)
        self.graph.add_node("Data_Centers", type="Industry", risk_score=0)
        self.graph.add_node("Cloud_Providers", type="Industry", risk_score=0)
        self.graph.add_node("AMZN", type="Company", risk_score=0)
        self.graph.add_node("MSFT", type="Company", risk_score=0)

        # Edges: (Source, Target, Relationship, Weight)
        self.graph.add_edge("Flooding", "Thailand", relationship="Impacts", weight=0.9)
        self.graph.add_edge("Thailand", "Hard_Drive_Sector", relationship="Major_Producer", weight=0.8)
        self.graph.add_edge("Hard_Drive_Sector", "Western_Digital", relationship="Contains", weight=1.0)
        self.graph.add_edge("Hard_Drive_Sector", "Seagate", relationship="Contains", weight=1.0)
        self.graph.add_edge("Western_Digital", "Data_Centers", relationship="Supplies", weight=0.7)
        self.graph.add_edge("Seagate", "Data_Centers", relationship="Supplies", weight=0.7)
        self.graph.add_edge("Data_Centers", "Cloud_Providers", relationship="Critical_Infra", weight=0.9)
        self.graph.add_edge("Cloud_Providers", "AMZN", relationship="Parent", weight=1.0)
        self.graph.add_edge("Cloud_Providers", "MSFT", relationship="Parent", weight=1.0)

    def propagate_shock(self, start_node, magnitude):
        """
        Simulates the 'Butterfly Effect'.
        Traverses the graph to calculate Contagion Risk.
        """
        if start_node not in self.graph:
            return {}

        # Reset scores
        for n in self.graph.nodes:
            self.graph.nodes[n]['risk_score'] = 0

        # BFS Propagation
        queue = [(start_node, magnitude)]
        visited = {start_node}
        impact_scores = {start_node: magnitude}

        while queue:
            current_node, current_impact = queue.pop(0)
            
            # Decay factor (shock dissipates over distance)
            decay = 0.8 

            for neighbor in self.graph.successors(current_node):
                edge_data = self.graph.get_edge_data(current_node, neighbor)
                weight = edge_data.get('weight', 0.5)
                
                # Calculate transferred shock
                transferred_shock = current_impact * weight * decay
                
                if transferred_shock > 0.05: # Threshold to stop negligible impact
                    if neighbor not in impact_scores:
                        impact_scores[neighbor] = 0
                    
                    # Accumulate risk (simplified)
                    impact_scores[neighbor] += transferred_shock
                    self.graph.nodes[neighbor]['risk_score'] = impact_scores[neighbor]
                    
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append((neighbor, transferred_shock))

        return impact_scores

    def get_graph_json(self):
        return nx.node_link_data(self.graph)

knowledge_graph_engine = CausalKnowledgeGraph()
