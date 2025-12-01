import React, { useEffect, useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { fetchButterflyGraph, propagateShock } from '../lib/api';
import { Zap } from 'lucide-react';

const ButterflyEffect: React.FC = () => {
    const [graphData, setGraphData] = useState<any>({ nodes: [], links: [] });
    const [impactScores, setImpactScores] = useState<Record<string, number>>({});
    const fgRef = useRef<any>();

    useEffect(() => {
        fetchButterflyGraph().then(setGraphData);
    }, []);

    const handleNodeClick = async (node: any) => {
        // Trigger Shock
        const scores = await propagateShock(node.id, 1.0); // Magnitude 1.0 shock
        setImpactScores(scores);

        // Visual Feedback: Zoom to node
        fgRef.current?.centerAt(node.x, node.y, 1000);
        fgRef.current?.zoom(2, 2000);
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 rounded-lg border border-gray-800 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 bg-black/80 p-4 rounded border border-purple-500/50 backdrop-blur-sm">
                <h3 className="text-purple-400 font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4" /> THE BUTTERFLY EFFECT
                </h3>
                <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                    Click a node to simulate a "Shock Event" and watch the contagion risk propagate through the supply chain.
                </p>
            </div>

            <ForceGraph2D
                ref={fgRef}
                graphData={graphData}
                nodeLabel="id"
                nodeColor={(node: any) => {
                    const score = impactScores[node.id] || 0;
                    return score > 0.5 ? '#ef4444' : score > 0.1 ? '#f59e0b' : '#3b82f6';
                }}
                nodeRelSize={6}
                linkColor={() => '#4b5563'}
                onNodeClick={handleNodeClick}
                backgroundColor="#111827"
            />
        </div>
    );
};

export default ButterflyEffect;
