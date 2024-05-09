const express = require('express');
const router = express.Router();
const AnswersController = require('../controllers/answersController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/',verifyToken, AnswersController.createAnswer);
router.get('/:id',verifyToken, AnswersController.getAnswer);
router.put('/:id',verifyToken, AnswersController.updateAnswer);
router.delete('/:id',verifyToken, AnswersController.deleteAnswer);
router.post('/upvote/:id', verifyToken, AnswersController.upvoteAnswer);
router.post('/downvote/:id', verifyToken, AnswersController.downvoteAnswer);

module.exports = router;