import React, { useState, useEffect } from 'react';
import { fetchLatestNews, NewsItem, postComment } from '../lib/api';
import SentimentPoll from '../components/social/SentimentPoll';
import CommentSection from '../components/social/CommentSection';
import { AlertTriangle } from 'lucide-react';

const Community: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [userVote, setUserVote] = useState<'Bullish' | 'Bearish' | null>(null);

    useEffect(() => {
        fetchLatestNews().then(data => {
            setNews(data);
            if (data.length > 0) setSelectedNews(data[0]);
        });
    }, []);

    const handleVote = async (vote: 'Bullish' | 'Bearish') => {
        setUserVote(vote);
        if (selectedNews) {
            // Post a system comment or just track the vote (simplified here)
            await postComment({
                news_item_id: selectedNews.id,
                user_id: `Trader_${Math.floor(Math.random() * 1000)}`,
                content: `Voted ${vote}`,
                sentiment_vote: vote
            });
        }
    };

    // Contrarian Logic
    const isContrarian = selectedNews && userVote && (
        (selectedNews.sentiment_score > 0.3 && userVote === 'Bearish') ||
        (selectedNews.sentiment_score < -0.3 && userVote === 'Bullish')
    );

    return (
        <div className="h-full p-4 grid grid-cols-12 gap-4">
            {/* Left: News List */}
            <div className="col-span-4 bg-card border border-gray-800 rounded-lg p-4 overflow-hidden flex flex-col">
                <h3 className="text-lg font-bold text-blue-400 mb-4">ACTIVE DISCUSSIONS</h3>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                    {news.map(item => (
                        <div
                            key={item.id}
                            onClick={() => { setSelectedNews(item); setUserVote(null); }}
                            className={`p-3 rounded cursor-pointer border transition-all ${selectedNews?.id === item.id
                                ? 'bg-blue-900/30 border-blue-500'
                                : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                                }`}
                        >
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-gray-200">{item.ticker}</span>
                                <span className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2">{item.headline}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Discussion Area */}
            <div className="col-span-8 bg-card border border-gray-800 rounded-lg p-4 flex flex-col">
                {selectedNews ? (
                    <>
                        <div className="mb-6 border-b border-gray-800 pb-6">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-2xl font-bold text-white">{selectedNews.headline}</h2>
                                {isContrarian && (
                                    <div className="flex items-center gap-2 bg-yellow-900/50 border border-yellow-600 text-yellow-200 px-3 py-1 rounded-full animate-pulse cursor-help group relative">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span className="text-xs font-bold">DIVERGENCE DETECTED</span>
                                        <div className="absolute top-full right-0 mt-2 w-64 bg-black border border-gray-700 p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                                            <p className="text-xs text-gray-300">
                                                The AI models predict <span className="font-bold text-blue-400">{selectedNews.sentiment_score > 0 ? 'Growth' : 'Decline'}</span>,
                                                but human traders are voting <span className="font-bold text-yellow-400">{userVote}</span>.
                                                High volatility expected.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-4 text-sm text-gray-400 mb-4">
                                <span>{selectedNews.source}</span>
                                <span>•</span>
                                <span>AI Sentiment: <span className={selectedNews.sentiment_score > 0 ? 'text-green-400' : 'text-red-400'}>{selectedNews.sentiment_score.toFixed(2)}</span></span>
                            </div>

                            <SentimentPoll onVote={handleVote} currentVote={userVote} />
                        </div>

                        <div className="flex-1 min-h-0">
                            <CommentSection newsId={selectedNews.id} />
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a news item to view the discussion.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Community;
