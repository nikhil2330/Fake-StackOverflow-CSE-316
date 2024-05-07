const express = require('express');
const router = express.Router();
const QuestionsController = require('../controllers/questionsController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, QuestionsController.createQuestion);
router.get('/', QuestionsController.getAllQuestionsWithSearch);
router.get('/:id', QuestionsController.getQuestionById);
router.post('/increment-view/:id', QuestionsController.incrementQuestionViews);
router.get('/tag/:tid', QuestionsController.getQuestionsByTag);
router.post('/upvote/:id', verifyToken, QuestionsController.upvoteQuestion);
router.post('/downvote/:id', verifyToken, QuestionsController.downvoteQuestion);

module.exports = router;
