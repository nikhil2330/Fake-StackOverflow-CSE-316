
const Comment = require('../models/comments');
const User = require('../models/user');


module.exports.getComments = async (req, res) => {
    const { targetId, type } = req.query; 
    try {
        const comments = await Comment.find({ [type]: targetId }).populate('by_user', 'username').populate('created_at');
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
        if (user.reputation < 50) {
            return res.status(403).send("You require a minimum repuation of 50 to add comments.");
        }
        const newComment = new Comment({
            text,
            by_user: req.user.userId,
            [type]: targetId,
            created_at: Date.now
        });
        await newComment.save();
        res.json(newComment);
    } catch (error) {
        res.status(500).send("Error adding comment: " + error.message);
    }
};
