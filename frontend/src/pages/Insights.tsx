import React, { useState, useEffect } from 'react';
import { fetchLatestNews, NewsItem } from '../lib/api';
import PriceChart from '../components/PriceChart';
import ImpactChart from '../components/ImpactChart';
import { Info } from 'lucide-react';

const InsightBox: React.FC<{ title: string, content: string }> = ({ title, content }) => (
    <div className="mt-2 bg-blue-900/20 border border-blue-500/30 rounded p-3 flex gap-3 items-start">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
            <h4 className="text-sm font-bold text-blue-300 mb-1">{title}</h4>
            <p className="text-xs text-gray-300 leading-relaxed">{content}</p>
        </div>
    </div>
);

const Insights: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [selectedTicker] = useState("AAPL");

    useEffect(() => {
        fetchLatestNews().then(setNews);
    }, []);

    return (
        <div className="h-full p-4 overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-4">MARKET INSIGHTS & EXPLAINABILITY</h2>

            <div className="grid grid-cols-2 gap-6">
                {/* Chart 1: Price Action */}
                <div className="bg-card border border-gray-800 rounded-lg p-4">
                    <div className="h-[300px]">
                        <PriceChart ticker={selectedTicker} news={news} />
                    </div>
                    <InsightBox
                        title="Price-Sentiment Correlation"
                        content={`The graph overlays ${selectedTicker}'s price action with high-impact news events (red triangles). Notice how the sharp dip at 10:00 AM correlates with the negative earnings report, validating the AI's 'Bearish' classification.`}
                    />
                </div>

                {/* Chart 2: Sentiment Trends */}
                <div className="bg-card border border-gray-800 rounded-lg p-4">
                    <div className="h-[300px]">
                        <ImpactChart news={news} />
                    </div>
                    <InsightBox
                        title="Sentiment Velocity"
                        content="This chart tracks the aggregate sentiment of all incoming news over time. A steep downward slope indicates a rapid shift in market mood, often preceding a sell-off. The current trend suggests stabilizing volatility."
                    />
                </div>
            </div>
        </div>
    );
};
export default Insights;
