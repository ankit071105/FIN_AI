import React from 'react';
import { NewsItem } from '../lib/api';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

import TrustBadge from './TrustBadge';

interface NewsFeedProps {
    news: NewsItem[];
    pinnedTickers?: string[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news, pinnedTickers = [] }) => {
    // Sort news: pinned items first
    const sortedNews = [...news].sort((a, b) => {
        const aPinned = pinnedTickers.includes(a.ticker);
        const bPinned = pinnedTickers.includes(b.ticker);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return 0; // Keep original time order
    });

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-green-400 border-b border-gray-700 pb-2 sticky top-0 bg-background z-10">LIVE INTELLIGENCE FEED</h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {sortedNews.length === 0 ? (
                    <div className="text-gray-500 text-center py-10">Waiting for intelligence...</div>
                ) : (
                    sortedNews.map((item) => {
                        const isPinned = pinnedTickers.includes(item.ticker);
                        // Mock accuracy for demo
                        const accuracy = 70 + Math.floor(Math.random() * 25);

                        return (
                            <div key={item.id} className={`p-3 rounded border transition-colors ${isPinned ? 'bg-gray-900 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.1)]' : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                                }`}>
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold ${isPinned ? 'text-yellow-400' : 'text-blue-400'}`}>{item.ticker}</span>
                                        {isPinned && <span className="text-[10px] bg-yellow-900/50 text-yellow-200 px-1 rounded">WATCHLIST</span>}
                                    </div>
                                    <span className="text-xs text-gray-500">{format(new Date(item.timestamp), 'HH:mm:ss')}</span>
                                </div>
                                <p className="text-sm text-gray-300 mb-2">{item.headline}</p>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">{item.source}</span>
                                    <div className="flex items-center gap-2">
                                        <TrustBadge accuracy={accuracy} />
                                        <span className={`px-2 py-0.5 rounded ${item.market_impact === 'High' ? 'bg-red-900 text-red-200' :
                                                item.market_impact === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                                                    'bg-gray-800 text-gray-300'
                                            }`}>
                                            {item.market_impact} Impact
                                        </span>
                                        {item.sentiment_score > 0.3 ? <TrendingUp className="w-4 h-4 text-green-500" /> :
                                            item.sentiment_score < -0.3 ? <TrendingDown className="w-4 h-4 text-red-500" /> :
                                                <Minus className="w-4 h-4 text-gray-500" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default NewsFeed;
