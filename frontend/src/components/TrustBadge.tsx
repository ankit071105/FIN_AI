import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface TrustBadgeProps {
    accuracy: number;
}

const TrustBadge: React.FC<TrustBadgeProps> = ({ accuracy }) => {
    return (
        <div className="group relative inline-flex items-center gap-1 bg-blue-900/30 border border-blue-500/30 px-2 py-0.5 rounded-full cursor-help">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-bold text-blue-300">{accuracy}% Accuracy</span>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 border border-gray-700 p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <p className="text-xs text-gray-300">
                    This agent correctly predicted <span className="text-blue-400 font-bold">{accuracy}%</span> of price movements for this ticker in the last 30 days.
                </p>
            </div>
        </div>
    );
};

export default TrustBadge;
