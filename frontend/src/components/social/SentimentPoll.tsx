import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface SentimentPollProps {
    onVote: (vote: 'Bullish' | 'Bearish') => void;
    currentVote: string | null;
}

const SentimentPoll: React.FC<SentimentPollProps> = ({ onVote, currentVote }) => {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded p-4 mb-4">
            <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">What's your take?</h4>
            <div className="flex gap-4">
                <button
                    onClick={() => onVote('Bullish')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-bold transition-all ${currentVote === 'Bullish'
                            ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.5)]'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-green-400'
                        }`}
                >
                    <ThumbsUp className="w-4 h-4" /> BULLISH
                </button>
                <button
                    onClick={() => onVote('Bearish')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-bold transition-all ${currentVote === 'Bearish'
                            ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-red-400'
                        }`}
                >
                    <ThumbsDown className="w-4 h-4" /> BEARISH
                </button>
            </div>
        </div>
    );
};

export default SentimentPoll;
