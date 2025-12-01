import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface NewsItem {
    id: string;
    ticker: string;
    headline: string;
    source: string;
    timestamp: string;
    sentiment_score: number;
    market_impact: string;
    summary: string;
    entities: string;
}

export interface Comment {
    id: number;
    news_item_id: string;
    user_id: string;
    parent_id: number | null;
    content: string;
    upvotes: number;
    sentiment_vote: string | null;
    timestamp: string;
}

export const fetchLatestNews = async (limit: number = 50): Promise<NewsItem[]> => {
    const response = await axios.get(`${API_URL}/latest-news`, { params: { limit } });
    return response.data;
};

export const chatWithBot = async (query: string): Promise<any> => {
    const response = await axios.post(`${API_URL}/chat`, { query });
    return response.data;
};

export const fetchMarketData = async (ticker: string) => {
    const response = await axios.get(`${API_URL}/market-data/${ticker}`);
    return response.data;
};

export const fetchKnowledgeGraph = async () => {
    const response = await axios.get(`${API_URL}/knowledge-graph`);
    return response.data;
};

export const fetchComments = async (newsId: string): Promise<Comment[]> => {
    const response = await axios.get(`${API_URL}/comments/${newsId}`);
    return response.data;
};

export const postComment = async (comment: { news_item_id: string, user_id: string, content: string, parent_id?: number, sentiment_vote?: string }) => {
    const response = await axios.post(`${API_URL}/comments`, comment);
    return response.data;
};

export const upvoteComment = async (commentId: number) => {
    const response = await axios.post(`${API_URL}/comments/${commentId}/upvote`);
    return response.data;
};

export const fetchPortfolio = async () => {
    const response = await axios.get(`${API_URL}/portfolio`);
    return response.data;
};

export const fetchButterflyGraph = async () => {
    const response = await axios.get(`${API_URL}/butterfly-effect/graph`);
    return response.data;
};

export const propagateShock = async (nodeId: string, magnitude: number) => {
    const response = await axios.post(`${API_URL}/butterfly-effect/shock`, null, { params: { node_id: nodeId, magnitude } });
    return response.data;
};

export const evolveStrategies = async () => {
    const response = await axios.get(`${API_URL}/darwinian/evolve`);
    return response.data;
};

export const analyzeAudio = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/fed-whisperer/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const runSimulation = async (premise: string) => {
    const response = await axios.post(`${API_URL}/multiverse/simulate`, null, { params: { premise } });
    return response.data;
};
