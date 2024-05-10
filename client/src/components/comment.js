import React from 'react';
import { getTimeStamp } from '../helpers';
const Comment = ({comment, canUpvote, onUpvote}) => {
    return (
        <div className="comment">
            <p>{comment.text}</p>
            <div>
                <span>by {comment.commented_by.username} </span>
                <span>Votes: {comment.votes} </span>
                <span> at {getTimeStamp(comment.created_at)}</span>
                {canUpvote && <button onClick={onUpvote}>Upvote</button>}
            </div>
        </div>
    );
};

export default Comment;