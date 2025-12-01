from fastapi import APIRouter, HTTPException
from app.core.database import get_db_connection
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class CommentCreate(BaseModel):
    news_item_id: str
    user_id: str
    parent_id: Optional[int] = None
    content: str
    sentiment_vote: Optional[str] = None

class CommentResponse(BaseModel):
    id: int
    news_item_id: str
    user_id: str
    parent_id: Optional[int]
    content: str
    upvotes: int
    sentiment_vote: Optional[str]
    timestamp: str

@router.get("/comments/{news_id}", response_model=List[CommentResponse])
def get_comments(news_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM comments WHERE news_item_id = ? ORDER BY timestamp DESC", (news_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@router.post("/comments", response_model=CommentResponse)
def create_comment(comment: CommentCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    timestamp = datetime.now().isoformat()
    
    cursor.execute("""
        INSERT INTO comments (news_item_id, user_id, parent_id, content, upvotes, sentiment_vote, timestamp)
        VALUES (?, ?, ?, ?, 0, ?, ?)
    """, (comment.news_item_id, comment.user_id, comment.parent_id, comment.content, comment.sentiment_vote, timestamp))
    
    comment_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return {
        "id": comment_id,
        "news_item_id": comment.news_item_id,
        "user_id": comment.user_id,
        "parent_id": comment.parent_id,
        "content": comment.content,
        "upvotes": 0,
        "sentiment_vote": comment.sentiment_vote,
        "timestamp": timestamp
    }

@router.post("/comments/{comment_id}/upvote")
def upvote_comment(comment_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE comments SET upvotes = upvotes + 1 WHERE id = ?", (comment_id,))
    conn.commit()
    conn.close()
    return {"status": "success"}
