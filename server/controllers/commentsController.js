
const comments = require('../models/comments');
const Comment = require('../models/comments');
const user = require('../models/user');
const User = require('../models/user');


module.exports.getComments = async (req, res) => {
    const { targetId, type } = req.query; 
    console.log(targetId);
    try {
        const comments = await Comment.find({ [type]: targetId }).populate('commented_by', 'username').populate('created_at');
        console.log(comments);
        res.json(comments);
    } catch (error) {
        res.status(500).send("Error fetching comments: " + error.message);
    }
};

module.exports.addComment = async (req, res) => {
    const { text, targetId, type } = req.body;
    
    if (text.length > 140) {
        return res.status(400).send("Comment must not exceed 140 characters.");
    }
    try {
        const user = await User.findById(req.user.userId);
        console.log(user);
        if (user.reputation < 50) {
            return res.status(403).send("You require a minimum repuation of 50 to add comments.");
        }
        const newComment = new Comment({
            text,
            commented_by: req.user.userId,
            created_at: new Date(),
            [type]: targetId,
            
        });
        console.log(newComment);
        await newComment.save();
        console.log(newComment);
        res.json(newComment);
    } catch (error) {
        res.send("Error adding comment: " + error.message);
    }
};

module.exports.upvoteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.userId;
    
    try {
        const comment = await Comment.findById(commentId);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const alreadyUpvoted = comment.upvoters.includes(userId);
        console.log(alreadyUpvoted);
        if (alreadyUpvoted) {
            comment.votes -= 1;
            comment.upvoters.pull(userId)   
        } else{
            comment.votes += 1;
            comment.upvoters.push(userId);
        }
        await comment.save();

        res.json({ votes: comment.votes });
    } catch (error) {
        console.error('Error upvoting comment:', error);
        res.status(500).json({ message: 'Error upvoting comment' });
    }
};

