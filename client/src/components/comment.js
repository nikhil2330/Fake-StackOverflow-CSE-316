import React from 'react';
import { getTimeStamp } from '../helpers';

const Comment = ({ comment, canUpvote, onUpvote, isUpvoted }) => {
    return (
        <>
             <div className="comment">
                {canUpvote && <button id = "comment-upvote" className= {isUpvoted  ? "voted" : "vote"} onClick={onUpvote}>🔼</button>}
                <span>{comment.votes}</span>
                <div className="comment-content">
                    <p className="comment-text">{comment.text}</p>
                    <div className="comment-details">   
                        <span className="comment-author">- {comment.commented_by.username}</span>
                        <span className="comment-date">commented {getTimeStamp(comment.created_at)}</span>
                    </div>
                </div>
            </div>
            <div className="comment-divider"></div> 
        </>
    );
};

export default Comment;
