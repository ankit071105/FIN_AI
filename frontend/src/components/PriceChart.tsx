import React, { useEffect, useState } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter } from 'recharts';
import { fetchMarketData, NewsItem } from '../lib/api';

interface PriceChartProps {
    ticker: string;
    news: NewsItem[];
}

const PriceChart: React.FC<PriceChartProps> = ({ ticker, news }) => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const history = await fetchMarketData(ticker);

            // Merge news events
            const merged = history.map((point: any) => {
                const dayNews = news.filter(n => n.ticker === ticker && n.timestamp.startsWith(point.date));
                return {
                    ...point,
                    newsEvent: dayNews.length > 0 ? dayNews[0].sentiment_score : null,
                    headline: dayNews.length > 0 ? dayNews[0].headline : null
                };
            });

            setData(merged);
        };
        if (ticker) loadData();
    }, [ticker, news]);

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-lg font-bold text-blue-400 mb-2">{ticker} PRICE ACTION</h3>
            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} />
                        <YAxis stroke="#9ca3af" domain={['auto', 'auto']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                        />
                        <Line type="monotone" dataKey="price" stroke="#3b82f6" dot={false} strokeWidth={2} />
                        <Scatter name="News" dataKey="newsEvent" fill="red" shape="triangle" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PriceChart;
