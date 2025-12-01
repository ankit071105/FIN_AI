import React, { useEffect, useState, useRef } from 'react';
import { GitBranch, Network, Activity, Zap, Loader2 } from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import axios from 'axios';

const Causal: React.FC = () => {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [loading, setLoading] = useState(true);
    const [shockResult, setShockResult] = useState<any>(null);
    const graphRef = useRef<any>();

    useEffect(() => {
        const fetchGraph = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/butterfly-effect/graph');
                setGraphData(response.data);
            } catch (error) {
                console.error("Failed to load graph", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGraph();
    }, []);

    const handleNodeClick = async (node: any) => {
        // Center view on node
        graphRef.current?.centerAt(node.x, node.y, 1000);
        graphRef.current?.zoom(4, 2000);

        // Propagate Shock
        try {
            const response = await axios.post(`http://localhost:8000/api/butterfly-effect/shock?node_id=${node.id}&magnitude=1.0`);
            setShockResult(response.data);
        } catch (error) {
            console.error("Shock failed", error);
        }
    };

    return (
        <div className="h-screen bg-background text-foreground p-6 flex flex-col overflow-hidden">
            <header className="mb-8 flex justify-between items-center border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter text-blue-500 flex items-center gap-3">
                        <GitBranch className="w-8 h-8" />
                        CAUSAL <span className="text-white">GRAPH</span>
                    </h1>
                    <p className="text-xs text-gray-500 tracking-widest mt-1">SECOND-ORDER EFFECT MODELING</p>
                </div>
                <div className="flex gap-4 text-xs font-mono">
                    <div className="bg-blue-900/20 border border-blue-900/50 px-4 py-2 rounded text-blue-400">
                        NODES: <span className="text-white font-bold">{graphData.nodes.length}</span>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded text-gray-400">
                        RELATIONSHIPS: <span className="text-white font-bold">{graphData.links.length}</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 bg-card border border-gray-800 rounded-xl relative overflow-hidden flex items-center justify-center">
                {loading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-blue-500" size={48} />
                        <p className="text-gray-500">Constructing Knowledge Graph...</p>
                    </div>
                ) : (
                    <ForceGraph2D
                        ref={graphRef}
                        graphData={graphData}
                        nodeLabel="id"
                        nodeColor={(node: any) => {
                            if (shockResult && shockResult[node.id]) return '#ef4444'; // Red if impacted
                            return node.type === 'Company' ? '#3b82f6' : '#10b981';
                        }}
                        nodeRelSize={6}
                        linkColor={() => '#374151'}
                        backgroundColor="#020617"
                        onNodeClick={handleNodeClick}
                        cooldownTicks={100}
                    />
                )}

                {/* Floating UI Panels */}
                <div className="absolute top-6 left-6 w-64 bg-gray-900/80 backdrop-blur border border-gray-800 p-4 rounded-lg pointer-events-none">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Top Correlations</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">Oil <span className="text-gray-600">&rarr;</span> Airlines</span>
                            <span className="text-red-400 font-mono">-0.85</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">NVDA <span className="text-gray-600">&rarr;</span> SMCI</span>
                            <span className="text-green-400 font-mono">+0.92</span>
                        </div>
                    </div>
                </div>

                {/* Shock Result Panel */}
                {shockResult && (
                    <div className="absolute bottom-6 right-6 w-80 bg-red-900/90 backdrop-blur border border-red-700 p-4 rounded-lg animate-in slide-in-from-right">
                        <h3 className="text-xs font-bold text-red-200 uppercase mb-3 flex items-center gap-2">
                            <Zap size={14} /> Shock Propagation Impact
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {Object.entries(shockResult)
                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                .map(([node, impact]) => (
                                    <div key={node} className="flex justify-between items-center text-sm border-b border-red-800/50 pb-1">
                                        <span className="text-white font-bold">{node}</span>
                                        <span className="text-red-300 font-mono">{(impact as number).toFixed(3)}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Causal;
