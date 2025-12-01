import React, { useState } from 'react';
import { evolveStrategies } from '../lib/api';
import { Dna, TrendingUp } from 'lucide-react';

const DarwinianBreeder: React.FC = () => {
    const [strategies, setStrategies] = useState<any[]>([]);
    const [generation, setGeneration] = useState(0);
    const [isEvolving, setIsEvolving] = useState(false);

    const handleEvolve = async () => {
        setIsEvolving(true);
        const topStrategies = await evolveStrategies();
        setStrategies(topStrategies);
        setGeneration(g => g + 1);
        setIsEvolving(false);
    };

    return (
        <div className="h-full bg-gray-900 rounded-lg border border-gray-800 p-6 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-green-400 font-bold flex items-center gap-2 text-xl">
                        <Dna className="w-6 h-6" /> DARWINIAN STRATEGY BREEDER
                    </h3>
                    <p className="text-sm text-gray-500">Evolutionary Algorithm for Alpha Generation</p>
                </div>
                <button
                    onClick={handleEvolve}
                    disabled={isEvolving}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold flex items-center gap-2 disabled:opacity-50"
                >
                    {isEvolving ? 'EVOLVING...' : `RUN GENERATION ${generation + 1}`}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {strategies.map((strat, idx) => (
                    <div key={idx} className="bg-gray-800 border border-gray-700 rounded p-4 relative overflow-hidden group hover:border-green-500 transition-colors">
                        <div className="absolute top-0 right-0 bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded-bl font-mono">
                            FITNESS: {strat.fitness.toFixed(4)}
                        </div>

                        <h4 className="text-gray-300 font-bold mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-400" /> Strategy #{idx + 1}
                        </h4>

                        <div className="space-y-2 text-sm text-gray-400">
                            <div className="flex justify-between border-b border-gray-700 pb-1">
                                <span>RSI Buy Threshold:</span>
                                <span className="text-white font-mono">{strat.thresholds.RSI_Buy.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-700 pb-1">
                                <span>RSI Sell Threshold:</span>
                                <span className="text-white font-mono">{strat.thresholds.RSI_Sell.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>SMA Period:</span>
                                <span className="text-white font-mono">{strat.thresholds.SMA_Period}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {strategies.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-600 border-2 border-dashed border-gray-800 rounded-lg">
                        <Dna className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No strategies evolved yet.</p>
                        <p className="text-sm">Click "Run Generation" to start the genetic algorithm.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DarwinianBreeder;
