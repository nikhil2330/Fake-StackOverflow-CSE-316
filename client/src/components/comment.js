import React from 'react';
import axios from 'axios';

const Comment = ({ comment, canUpvote, onUpvote }) => {
    const handleUpvote = async () => {
        if (canUpvote) {
            try {
                await axios.post(`http://localhost:8000/comments/upvote/${comment._id}`);
                onUpvote(comment._id);
            } catch (error) {
                console.error('Failed to upvote comment:', error);
            }
        }
    };
    return (
        <div className="comment">
            <p>{comment.text}</p>
            <div>
                <span>by {comment.by_user.username} | </span>
                <span>Votes: {comment.votes} </span><span> at {comment.created_at}</span>
                {canUpvote && <button onClick={handleUpvote}>Upvote</button>}
            </div>
        </div>
    );
};

export default Comment;