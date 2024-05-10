const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', commentsController.getComments);
router.post('/', verifyToken, commentsController.addComment);
router.post('/upvote/:commentId', verifyToken, commentsController.upvoteComment);

module.exports = router;