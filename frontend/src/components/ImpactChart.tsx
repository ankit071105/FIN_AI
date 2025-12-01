import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { NewsItem } from '../lib/api';
import { format } from 'date-fns';

interface ImpactChartProps {
    news: NewsItem[];
}

const ImpactChart: React.FC<ImpactChartProps> = ({ news }) => {
    // Process data for chart: reverse to show chronological order, take last 20
    const data = [...news].reverse().slice(-20).map(item => ({
        time: format(new Date(item.timestamp), 'HH:mm:ss'),
        sentiment: item.sentiment_score,
        ticker: item.ticker
    }));

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-green-400 border-b border-gray-700 pb-2">IMPACT VELOCITY</h2>
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} />
                        <YAxis stroke="#9ca3af" domain={[-1, 1]} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                            itemStyle={{ color: '#f3f4f6' }}
                        />
                        <Line type="monotone" dataKey="sentiment" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ImpactChart;
