import React, { useState } from 'react';
import { Globe, Play, RotateCcw, Sliders, AlertTriangle, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import axios from 'axios';

const Simulator: React.FC = () => {
    const [premise, setPremise] = useState("Oil prices surge to $150 due to supply chain disruption");
    const [simulating, setSimulating] = useState(false);
    const [result, setResult] = useState<any>(null);

    const runSimulation = async () => {
        if (!premise) return;
        setSimulating(true);
        try {
            const response = await axios.post(`http://localhost:8000/api/multiverse/simulate?premise=${encodeURIComponent(premise)}`);
            setResult(response.data);
        } catch (error) {
            console.error("Simulation failed", error);
        } finally {
            setSimulating(false);
        }
    };

    return (
        <div className="h-screen bg-background text-foreground p-6 flex flex-col overflow-hidden">
            <header className="mb-8 flex justify-between items-center border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter text-amber-500 flex items-center gap-3">
                        <Globe className="w-8 h-8" />
                        MULTIVERSE <span className="text-white">SIMULATOR</span>
                    </h1>
                    <p className="text-xs text-gray-500 tracking-widest mt-1">COUNTERFACTUAL MARKET ENGINE</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={runSimulation}
                        disabled={simulating}
                        className="bg-amber-600 hover:bg-amber-500 disabled:bg-gray-800 disabled:text-gray-500 text-black font-bold px-6 py-2 rounded flex items-center gap-2 transition-colors"
                    >
                        {simulating ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
                        {simulating ? "SIMULATING..." : "RUN SIMULATION"}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
                {/* Left: Controls */}
                <div className="col-span-4 bg-card border border-gray-800 rounded-xl p-6 overflow-y-auto flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Sliders size={16} /> Scenario Parameters
                    </h3>

                    <div className="space-y-6 flex-1">
                        <div>
                            <label className="text-sm text-gray-300 mb-2 block font-bold">Hypothetical Premise</label>
                            <textarea
                                className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 resize-none"
                                value={premise}
                                onChange={(e) => setPremise(e.target.value)}
                                placeholder="Describe a market event (e.g., 'Fed cuts rates by 100bps', 'War breaks out in region X')..."
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                The engine uses semantic analysis to determine the likely market regime ("Risk-On" vs "Risk-Off") and projects portfolio impact.
                            </p>
                        </div>

                        <div className="pt-6 border-t border-gray-800">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Quick Scenarios</h4>
                            <div className="space-y-2">
                                <button onClick={() => setPremise("Fed announces surprise 50bps rate cut")} className="w-full text-left p-2 rounded hover:bg-gray-800 text-sm text-gray-400 transition-colors">
                                    🚀 Fed Rate Cut (Bullish)
                                </button>
                                <button onClick={() => setPremise("Global pandemic declared by WHO")} className="w-full text-left p-2 rounded hover:bg-gray-800 text-sm text-gray-400 transition-colors">
                                    🦠 Pandemic Outbreak (Bearish)
                                </button>
                                <button onClick={() => setPremise("Tech sector earnings beat expectations by 20%")} className="w-full text-left p-2 rounded hover:bg-gray-800 text-sm text-gray-400 transition-colors">
                                    📈 Tech Earnings Boom (Bullish)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Results */}
                <div className="col-span-8 bg-card border border-gray-800 rounded-xl p-6 flex flex-col relative overflow-hidden">
                    {!result ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                            <Globe size={64} className="mb-4" />
                            <p>Enter a premise and run simulation to see results.</p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 h-full flex flex-col">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Projected Market Impact</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 text-sm">Regime Detected:</span>
                                        <span className={`px-3 py-1 rounded text-xs font-bold border ${result.simulated_regime === 'Risk-On'
                                                ? 'bg-green-900/20 text-green-400 border-green-900/50'
                                                : 'bg-red-900/20 text-red-400 border-red-900/50'
                                            }`}>
                                            {result.simulated_regime.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-400">Portfolio Value Change</div>
                                    <div className={`text-3xl font-bold ${result.projected_impact.portfolio_value_change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                        {result.projected_impact.portfolio_value_change}
                                    </div>
                                </div>
                            </div>

                            {/* Action Card */}
                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                                    <AlertTriangle size={16} /> Recommended Action
                                </h3>
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${result.projected_impact.recommended_action.action.includes('BUY') ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                                        }`}>
                                        {result.projected_impact.recommended_action.action.includes('BUY') ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                                    </div>
                                    <div>
                                        <div className={`text-xl font-bold mb-1 ${result.projected_impact.recommended_action.action.includes('BUY') ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {result.projected_impact.recommended_action.action}
                                        </div>
                                        <p className="text-gray-300 italic">
                                            "{result.projected_impact.recommended_action.reason}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Mock Chart Area */}
                            <div className="flex-1 bg-gray-900/30 rounded-lg border border-gray-800 relative flex items-end px-8 pb-8 gap-2 overflow-hidden">
                                <div className="absolute top-4 left-4 text-xs text-gray-500 font-mono">SIMULATED TRAJECTORY (T+30 DAYS)</div>
                                {[...Array(30)].map((_, i) => {
                                    // Generate a trend based on regime
                                    const isBullish = result.simulated_regime === 'Risk-On';
                                    const baseHeight = 30;
                                    const trend = isBullish ? i * 2 : i * -1;
                                    const noise = Math.random() * 20;
                                    const height = Math.max(5, Math.min(100, baseHeight + trend + noise));

                                    return (
                                        <div
                                            key={i}
                                            className={`flex-1 border-t-2 ${isBullish ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}
                                            style={{ height: `${height}%` }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Simulator;
