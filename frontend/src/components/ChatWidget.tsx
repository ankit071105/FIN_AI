import React, { useState, useRef, useEffect } from 'react';
import { chatWithBot } from '../lib/api';
import { Send, BookOpen } from 'lucide-react';

interface Citation {
    headline: string;
    source: string;
    ticker: string;
}

interface Message {
    role: 'user' | 'bot';
    content: string;
    citations?: Citation[];
}

const ChatWidget: React.FC = () => {
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleSend = async () => {
        if (!query.trim()) return;

        const userMsg = query;
        setQuery('');
        setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const response = await chatWithBot(userMsg);
            // Handle both string and object responses for backward compatibility
            if (typeof response === 'string') {
                setHistory(prev => [...prev, { role: 'bot', content: response }]);
            } else {
                setHistory(prev => [...prev, {
                    role: 'bot',
                    content: response.answer,
                    citations: response.citations
                }]);
            }
        } catch (error) {
            setHistory(prev => [...prev, { role: 'bot', content: "Error connecting to FinAI." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-green-400 border-b border-gray-700 pb-2">RAG CHAT</h2>
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto mb-4 space-y-3 p-2 bg-gray-900/50 rounded border border-gray-800 custom-scrollbar"
            >
                {history.length === 0 && (
                    <div className="text-gray-500 text-sm text-center mt-4">Ask about market trends, specific tickers, or sentiment...</div>
                )}
                {history.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-2 rounded text-sm ${msg.role === 'user' ? 'bg-blue-900 text-blue-100' : 'bg-gray-800 text-gray-300'
                            }`}>
                            {msg.content}
                        </div>
                        {/* Citations */}
                        {msg.citations && msg.citations.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1 max-w-[85%]">
                                {msg.citations.map((cit, i) => (
                                    <div key={i} className="group relative">
                                        <span className="text-[10px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded cursor-pointer hover:bg-gray-600 flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" /> [{i + 1}]
                                        </span>
                                        {/* Citation Tooltip */}
                                        <div className="absolute bottom-full left-0 mb-1 w-48 bg-black border border-gray-600 p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-xs">
                                            <p className="font-bold text-gray-200">{cit.headline}</p>
                                            <p className="text-gray-400">{cit.source} • {cit.ticker}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {loading && <div className="text-xs text-gray-500 animate-pulse">FinAI is thinking...</div>}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask FinAI..."
                    className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-50"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ChatWidget;
