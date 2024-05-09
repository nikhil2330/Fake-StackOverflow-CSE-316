const express = require('express');
const router = express.Router();
const AnswersController = require('../controllers/answersController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/',verifyToken, AnswersController.createAnswer);
router.post('/upvote/:id', verifyToken, AnswersController.upvoteAnswer);
router.post('/downvote/:id', verifyToken, AnswersController.downvoteAnswer);

module.exports = router;