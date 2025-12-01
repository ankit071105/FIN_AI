import React, { useState, useEffect } from 'react';
import Watchlist from '../components/Watchlist';
import PriceChart from '../components/PriceChart';
import NetworkGraph from '../components/NetworkGraph';
import { fetchLatestNews, NewsItem } from '../lib/api';

const AnalyticsDashboard: React.FC = () => {
    const [selectedTicker, setSelectedTicker] = useState("AAPL");
    const [news, setNews] = useState<NewsItem[]>([]);

    useEffect(() => {
        fetchLatestNews().then(setNews);
    }, []);

    return (
        <div className="h-full p-4 grid grid-cols-12 gap-4">
            {/* Sidebar: Watchlist */}
            <div className="col-span-2 bg-card border border-gray-800 rounded-lg p-4">
                <Watchlist
                    tickers={["AAPL", "TSLA", "GOOGL", "AMZN", "MSFT", "NVDA", "JPM", "GS"]}
                    selectedTicker={selectedTicker}
                    onSelect={setSelectedTicker}
                />
            </div>

            {/* Main Content */}
            <div className="col-span-10 grid grid-rows-2 gap-4">
                {/* Top: Price Chart */}
                <div className="bg-card border border-gray-800 rounded-lg p-4">
                    <PriceChart ticker={selectedTicker} news={news} />
                </div>

                {/* Bottom: Network Graph */}
                <div className="bg-card border border-gray-800 rounded-lg p-4">
                    <NetworkGraph />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
