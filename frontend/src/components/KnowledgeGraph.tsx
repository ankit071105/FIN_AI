import React, { useEffect, useState } from 'react';
import { fetchKnowledgeGraph } from '../lib/api';

const KnowledgeGraph: React.FC = () => {
    const [graph, setGraph] = useState<{ nodes: any[], links: any[] } | null>(null);

    useEffect(() => {
        fetchKnowledgeGraph().then(setGraph);
    }, []);

    if (!graph) return <div>Loading Graph...</div>;

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-lg font-bold text-purple-400 mb-2">ENTITY NETWORK</h3>
            <div className="flex-1 bg-gray-900 rounded border border-gray-800 relative overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 400 300">
                    {/* Simple Mock Visualization */}
                    {graph.links.map((link, i) => {
                        const sourceNode = graph.nodes.find(n => n.id === link.source);
                        const targetNode = graph.nodes.find(n => n.id === link.target);
                        if (!sourceNode || !targetNode) return null;

                        // Random positions for demo (in real app use d3-force)
                        const x1 = (sourceNode.id.length * 50) % 350 + 20;
                        const y1 = (sourceNode.id.length * 40) % 250 + 20;
                        const x2 = (targetNode.id.length * 50) % 350 + 20;
                        const y2 = (targetNode.id.length * 40) % 250 + 20;

                        return (
                            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4b5563" strokeWidth="1" />
                        );
                    })}
                    {graph.nodes.map((node, i) => {
                        const x = (node.id.length * 50) % 350 + 20;
                        const y = (node.id.length * 40) % 250 + 20;
                        return (
                            <g key={i}>
                                <circle cx={x} cy={y} r={node.type === 'company' ? 15 : 8} fill={node.type === 'company' ? '#3b82f6' : '#10b981'} />
                                <text x={x} y={y + 25} textAnchor="middle" fill="white" fontSize="10">{node.id}</text>
                            </g>
                        )
                    })}
                </svg>
            </div>
        </div>
    );
};

export default KnowledgeGraph;
