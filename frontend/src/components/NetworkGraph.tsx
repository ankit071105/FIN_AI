import React, { useEffect, useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import axios from 'axios';

const NetworkGraph: React.FC = () => {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 400, height: 300 });

    useEffect(() => {
        const fetchGraph = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/supply-chain-graph');
                setGraphData(response.data);
            } catch (error) {
                console.error("Failed to fetch graph", error);
            }
        };
        fetchGraph();
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight
            });
        }
    }, [containerRef.current]);

    return (
        <div className="h-full flex flex-col" ref={containerRef}>
            <h3 className="text-lg font-bold text-purple-400 mb-2">SUPPLY CHAIN IMPACT</h3>
            <div className="flex-1 bg-gray-900 rounded border border-gray-800 overflow-hidden">
                <ForceGraph2D
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={graphData}
                    nodeLabel={(node: any) => `${node.id}: Sentiment ${node.sentiment.toFixed(2)}`}
                    nodeColor={(node: any) => node.sentiment < -0.3 ? '#ef4444' : node.sentiment > 0.3 ? '#10b981' : '#3b82f6'}
                    nodeVal={(node: any) => node.val}
                    linkColor={() => '#4b5563'}
                    linkDirectionalArrowLength={3.5}
                    linkDirectionalArrowRelPos={1}
                    backgroundColor="#111827"
                />
            </div>
        </div>
    );
};

export default NetworkGraph;
