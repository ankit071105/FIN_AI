import React from 'react';
import { Bell, Eye } from 'lucide-react';

interface WatchlistProps {
    tickers: string[];
    selectedTicker: string;
    onSelect: (t: string) => void;
}

const Watchlist: React.FC<WatchlistProps> = ({ tickers, selectedTicker, onSelect }) => {
    return (
        <div className="h-full flex flex-col">
            <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" /> WATCHLIST
            </h3>
            <div className="space-y-2">
                {tickers.map(t => (
                    <div
                        key={t}
                        onClick={() => onSelect(t)}
                        className={`p-3 rounded cursor-pointer flex justify-between items-center ${selectedTicker === t ? 'bg-blue-900 border border-blue-500' : 'bg-gray-900 border border-gray-800 hover:bg-gray-800'
                            }`}
                    >
                        <span className="font-bold text-gray-200">{t}</span>
                        <Bell className="w-4 h-4 text-gray-600 hover:text-yellow-500" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Watchlist;
