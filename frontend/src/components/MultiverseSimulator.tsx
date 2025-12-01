import React, { useState } from 'react';
import { runSimulation } from '../lib/api';
import { Globe, Play, AlertTriangle } from 'lucide-react';

const MultiverseSimulator: React.FC = () => {
    const [premise, setPremise] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSimulate = async () => {
        if (!premise.trim()) return;
        setLoading(true);
        try {
            const data = await runSimulation(premise);
            setResult(data);
        } catch (error) {
            console.error("Simulation failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full bg-gray-900 rounded-lg border border-gray-800 p-6 overflow-y-auto custom-scrollbar">
            <h3 className="text-cyan-400 font-bold flex items-center gap-2 text-xl mb-4">
                <Globe className="w-6 h-6" /> MULTIVERSE SIMULATOR
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Test counterfactual scenarios. Inject a premise to see how the Autonomous Agents would react in an alternate reality.
            </p>

            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={premise}
                    onChange={(e) => setPremise(e.target.value)}
                    placeholder="Enter premise (e.g., 'Oil hits $150', 'Fed cuts rates to 0%')"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
                />
                <button
                    onClick={handleSimulate}
                    disabled={!premise || loading}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 rounded font-bold disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-4 h-4" />}
                    SIMULATE
                </button>
            </div>

            {result && (
                <div className="bg-gray-800 rounded p-4 border border-gray-700 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${result.simulated_regime === 'Risk-Off' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                            {result.simulated_regime} REGIME
                        </div>
                        <div className="text-gray-400 text-sm">Projected Impact: <span className="text-white font-bold">{result.projected_impact.portfolio_value_change}</span></div>
                    </div>

                    <div className="bg-gray-900 p-4 rounded border-l-4 border-cyan-500">
                        <h4 className="text-cyan-400 font-bold text-sm mb-2">GHOST TRADER DECISION</h4>
                        <div className="flex justify-between items-start">
                            <div>
                                <span className={`text-xl font-bold ${result.projected_impact.recommended_action.action.includes('BUY') ? 'text-green-400' : 'text-red-400'}`}>
                                    {result.projected_impact.recommended_action.action}
                                </span>
                                <p className="text-gray-300 text-sm mt-1">"{result.projected_impact.recommended_action.reason}"</p>
                            </div>
                            {result.simulated_regime === 'Risk-Off' && <AlertTriangle className="w-8 h-8 text-yellow-500 opacity-50" />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiverseSimulator;
