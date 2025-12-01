import React, { useState, useEffect } from 'react';
import { Comment, fetchComments, postComment, upvoteComment } from '../../lib/api';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ArrowBigUp, User } from 'lucide-react';

interface CommentSectionProps {
    newsId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ newsId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [userId] = useState(`Trader_${Math.floor(Math.random() * 1000)}`); // Mock User ID

    const loadComments = async () => {
        if (newsId) {
            const data = await fetchComments(newsId);
            setComments(data);
        }
    };

    useEffect(() => {
        loadComments();
        const interval = setInterval(loadComments, 5000); // Poll for new comments
        return () => clearInterval(interval);
    }, [newsId]);

    const handleSubmit = async () => {
        if (!newComment.trim()) return;
        await postComment({
            news_item_id: newsId,
            user_id: userId,
            content: newComment,
            sentiment_vote: undefined // Could pass this if integrated with poll
        });
        setNewComment('');
        loadComments();
    };

    const handleUpvote = async (id: number) => {
        await upvoteComment(id);
        loadComments();
    };

    // Simple flat list for now, can be made recursive for threading
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar mb-4">
                {comments.length === 0 ? (
                    <div className="text-center text-gray-600 py-8">Be the first to comment on this signal.</div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="bg-gray-900 border border-gray-800 rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center">
                                        <User className="w-3 h-3 text-blue-400" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-300">{comment.user_id}</span>
                                    {comment.sentiment_vote && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${comment.sentiment_vote === 'Bullish' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                                            }`}>
                                            {comment.sentiment_vote}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-gray-600">{formatDistanceToNow(new Date(comment.timestamp))} ago</span>
                            </div>
                            <p className="text-sm text-gray-200 mb-3 ml-8">{comment.content}</p>
                            <div className="flex items-center gap-4 ml-8">
                                <button
                                    onClick={() => handleUpvote(comment.id)}
                                    className="flex items-center gap-1 text-gray-500 hover:text-green-400 transition-colors"
                                >
                                    <ArrowBigUp className="w-4 h-4" />
                                    <span className="text-xs font-bold">{comment.upvotes}</span>
                                </button>
                                <button className="flex items-center gap-1 text-gray-500 hover:text-blue-400 transition-colors">
                                    <MessageSquare className="w-3 h-3" />
                                    <span className="text-xs">Reply</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-auto">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add to the discussion..."
                    className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-sm focus:outline-none focus:border-blue-500 min-h-[80px]"
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-bold"
                    >
                        POST COMMENT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentSection;
