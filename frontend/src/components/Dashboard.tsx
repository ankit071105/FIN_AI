import React, { useEffect, useState } from 'react';
import NewsFeed from './NewsFeed';
import ImpactChart from './ImpactChart';
import ChatWidget from './ChatWidget';
import { fetchLatestNews, NewsItem } from '../lib/api';

import { Volume2, VolumeX } from 'lucide-react';

import GhostTraderWidget from './GhostTraderWidget';
import ThinkingIndicator from './ThinkingIndicator';

const Dashboard: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [squawkEnabled, setSquawkEnabled] = useState(false);
    const [lastReadId, setLastReadId] = useState<string | null>(null);
    const [thinkingStep, setThinkingStep] = useState<string>('');
    const watchlist = ["AAPL", "TSLA", "NVDA"];

    useEffect(() => {
        const loadNews = async () => {
            try {
                // Simulate "Thinking" steps before fetching (for demo visual)
                if (Math.random() > 0.7) {
                    setThinkingStep('Macro');
                    await new Promise(r => setTimeout(r, 800));
                    setThinkingStep('Forensic');
                    await new Promise(r => setTimeout(r, 800));
                    setThinkingStep('Trading');
                    await new Promise(r => setTimeout(r, 800));
                    setThinkingStep('');
                }

                const data = await fetchLatestNews();
                setNews(data);

                if (squawkEnabled && data.length > 0) {
                    const latest = data[0];
                    if (latest.id !== lastReadId && latest.market_impact === 'High') {
                        const utterance = new SpeechSynthesisUtterance(`High Impact Alert. ${latest.ticker}. ${latest.headline}`);
                        window.speechSynthesis.speak(utterance);
                        setLastReadId(latest.id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch news", error);
            }
        };

        loadNews();
        const interval = setInterval(loadNews, 5000); // Poll every 5 seconds (slower to allow animations)
        return () => clearInterval(interval);
    }, [squawkEnabled, lastReadId]);

    return (
        <div className="h-screen bg-background text-foreground p-4 flex flex-col overflow-hidden relative">
            <ThinkingIndicator isThinking={!!thinkingStep} step={thinkingStep} />

            <header className="mb-4 flex justify-between items-center border-b border-gray-800 pb-2 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter text-blue-500">FIN<span className="text-white">AI</span></h1>
                    <p className="text-xs text-gray-500 tracking-widest">INTELLIGENCE TERMINAL v1.0</p>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setSquawkEnabled(!squawkEnabled)}
                        className={`flex items-center gap-2 px-3 py-1 rounded border ${squawkEnabled ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-gray-900 border-gray-700 text-gray-400'}`}
                    >
                        {squawkEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        <span className="text-xs font-bold">SQUAWK BOX</span>
                    </button>
                    <div className="flex gap-4 text-xs text-gray-400 font-mono">
                        <span>SYSTEM: <span className="text-green-500">NOMINAL</span></span>
                        <span>DATA_STREAM: <span className="text-green-500">ACTIVE</span></span>
                        <span>UPTIME: <span className="text-blue-500">99.9%</span></span>
                    </div>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
                {/* Left Column: Live Feed */}
                <div className="col-span-3 bg-card border border-gray-800 rounded-lg p-4 h-full overflow-hidden">
                    <NewsFeed news={news} pinnedTickers={watchlist} />
                </div>

                {/* Middle Column: Charts & Chat */}
                <div className="col-span-6 flex flex-col gap-4 h-full overflow-hidden">
                    <div className="flex-1 bg-card border border-gray-800 rounded-lg p-4 min-h-0">
                        <ImpactChart news={news} />
                    </div>
                    <div className="flex-1 bg-card border border-gray-800 rounded-lg p-4 min-h-0">
                        <ChatWidget />
                    </div>
                </div>

                {/* Right Column: Ghost Trader */}
                <div className="col-span-3 bg-card border border-gray-800 rounded-lg p-0 h-full overflow-hidden">
                    <GhostTraderWidget />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
