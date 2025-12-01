import React, { useState, useEffect } from 'react';
import { Dna, Zap, RefreshCw, Trophy, Activity } from 'lucide-react';
import axios from 'axios';

interface StrategyGenome {
    indicators: string[];
    thresholds: {
        RSI_Buy: number;
        RSI_Sell: number;
        SMA_Period: number;
    };
    fitness: number;
}

const Strategy: React.FC = () => {
    const [strategies, setStrategies] = useState<StrategyGenome[]>([]);
    const [generation, setGeneration] = useState(1);
    const [evolving, setEvolving] = useState(false);

    const evolve = async () => {
        setEvolving(true);
        try {
            const response = await axios.get('http://localhost:8000/api/darwinian/evolve');
            setStrategies(response.data);
            setGeneration(prev => prev + 1);
        } catch (error) {
            console.error("Evolution failed", error);
        } finally {
            setEvolving(false);
        }
    };

    // Initial load
    useEffect(() => {
        evolve();
    }, []);

    const bestStrategy = strategies.length > 0 ? strategies[0] : null;

    return (
        <div className="h-screen bg-background text-foreground p-6 flex flex-col overflow-hidden">
            <header className="mb-8 flex justify-between items-center border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter text-purple-500 flex items-center gap-3">
                        <Dna className="w-8 h-8" />
                        STRATEGY <span className="text-white">BREEDER</span>
                    </h1>
                    <p className="text-xs text-gray-500 tracking-widest mt-1">DARWINIAN EVOLUTION ENGINE</p>
                </div>
                <div className="flex gap-4 text-xs font-mono">
                    <div className="bg-purple-900/20 border border-purple-900/50 px-4 py-2 rounded text-purple-400">
                        GENERATION: <span className="text-white font-bold">{generation}</span>
                    </div>
                    <button
                        onClick={evolve}
                        disabled={evolving}
                        className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-500 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                    >
                        <RefreshCw size={14} className={evolving ? "animate-spin" : ""} />
                        {evolving ? "EVOLVING..." : "NEXT GENERATION"}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
                {/* Left: Generations List */}
                <div className="col-span-4 bg-card border border-gray-800 rounded-xl p-4 overflow-hidden flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Trophy size={14} className="text-yellow-500" /> Top Performers (Gen {generation})
                    </h3>
                    <div className="space-y-3 overflow-y-auto pr-2">
                        {strategies.map((strat, idx) => (
                            <div key={idx} className={`p-4 rounded-lg border ${idx === 0 ? 'bg-purple-900/20 border-purple-500/50' : 'bg-gray-900/50 border-gray-800'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`font-mono font-bold ${idx === 0 ? 'text-purple-400' : 'text-gray-500'}`}>
                                        RANK #{idx + 1}
                                    </span>
                                    {idx === 0 && (
                                        <span className="flex items-center gap-1 text-xs text-purple-400 animate-pulse">
                                            <Zap size={10} /> ALPHA
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-center">
                                    <div className="bg-black/20 rounded p-1">
                                        <div className="text-xs text-gray-500">FITNESS</div>
                                        <div className="font-bold text-white">{strat.fitness.toFixed(4)}</div>
                                    </div>
                                    <div className="bg-black/20 rounded p-1">
                                        <div className="text-xs text-gray-500">RSI BUY</div>
                                        <div className="font-bold text-green-400">{strat.thresholds.RSI_Buy.toFixed(1)}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Genome Viewer */}
                <div className="col-span-8 bg-card border border-gray-800 rounded-xl p-6 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Dna size={200} className="text-purple-500" />
                    </div>

                    {bestStrategy ? (
                        <>
                            <h2 className="text-xl font-bold text-white mb-6">Alpha Genome Analysis</h2>

                            <div className="grid grid-cols-2 gap-6 relative z-10">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase border-b border-gray-800 pb-2">Entry Logic</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm p-3 bg-gray-900 rounded border border-gray-800">
                                            <span className="text-gray-300">RSI Threshold (Buy)</span>
                                            <span className="text-purple-400 font-mono font-bold">&lt; {bestStrategy.thresholds.RSI_Buy.toFixed(1)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm p-3 bg-gray-900 rounded border border-gray-800">
                                            <span className="text-gray-300">SMA Period</span>
                                            <span className="text-purple-400 font-mono font-bold">{bestStrategy.thresholds.SMA_Period} Days</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase border-b border-gray-800 pb-2">Exit Logic</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm p-3 bg-gray-900 rounded border border-gray-800">
                                            <span className="text-gray-300">RSI Threshold (Sell)</span>
                                            <span className="text-purple-400 font-mono font-bold">&gt; {bestStrategy.thresholds.RSI_Sell.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity size={16} className="text-purple-500" />
                                    <span className="text-sm font-bold text-gray-300">Backtest Simulation</span>
                                </div>
                                <div className="h-32 bg-gray-900 rounded-lg border border-gray-800 flex items-end p-4 gap-1">
                                    {[...Array(40)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-purple-500/50 hover:bg-purple-400 transition-colors rounded-t-sm"
                                            style={{
                                                height: `${30 + Math.random() * 70}%`,
                                                opacity: Math.random() * 0.5 + 0.5
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Initializing Population...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Strategy;
