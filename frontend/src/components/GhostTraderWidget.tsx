import React, { useEffect, useState } from 'react';
import { fetchPortfolio } from '../lib/api';
import { Ghost, DollarSign, Activity, History } from 'lucide-react';

const GhostTraderWidget: React.FC = () => {
    const [portfolio, setPortfolio] = useState<any>(null);

    useEffect(() => {
        const loadPortfolio = async () => {
            const data = await fetchPortfolio();
            setPortfolio(data);
        };
        loadPortfolio();
        const interval = setInterval(loadPortfolio, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!portfolio) return <div className="text-gray-500 text-xs">Loading Ghost Trader...</div>;

    const holdings = portfolio.holdings || {};
    const history = portfolio.trade_history || [];

    return (
        <div className="h-full flex flex-col bg-gray-900 border border-gray-800 rounded-lg p-3 overflow-hidden">
            <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                    <Ghost className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-gray-200">GHOST TRADER</h3>
                </div>
                <div className="flex items-center gap-1 text-green-400 font-mono text-sm">
                    <DollarSign className="w-3 h-3" />
                    {portfolio.cash_balance?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                {/* Active Positions */}
                <div>
                    <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> ACTIVE POSITIONS
                    </h4>
                    {Object.keys(holdings).length === 0 ? (
                        <div className="text-xs text-gray-600 italic">No active positions.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(holdings).map(([ticker, shares]: [string, any]) => (
                                <div key={ticker} className="bg-gray-800 p-2 rounded flex justify-between items-center">
                                    <span className="font-bold text-blue-400 text-xs">{ticker}</span>
                                    <span className="text-xs text-gray-300">{shares} sh</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Trade Log */}
                <div>
                    <h4 className="text-xs font-bold text-gray-500 mb-2 mt-4 flex items-center gap-1">
                        <History className="w-3 h-3" /> EXECUTION LOG
                    </h4>
                    <div className="space-y-2">
                        {history.slice(0, 5).map((trade: any, i: number) => (
                            <div key={i} className="text-xs border-l-2 border-purple-500 pl-2 py-1">
                                <div className="flex justify-between">
                                    <span className={`font-bold ${trade.action === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                                        {trade.action} {trade.ticker}
                                    </span>
                                    <span className="text-gray-600">{new Date(trade.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-gray-400 italic text-[10px] mt-0.5 line-clamp-2">"{trade.reason}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GhostTraderWidget;
