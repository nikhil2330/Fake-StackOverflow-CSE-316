const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/comments', verifyToken, commentsController.getComments);
router.post('/comments', verifyToken, commentsController.addComment);
router.post('/comments/upvote/:commentId', verifyToken, commentsController.upvoteComment);

module.exports = router;