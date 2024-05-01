const express = require('express');
const router = express.Router();
const AnswersController = require('../controllers/answersController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/',verifyToken, AnswersController.createAnswer);

module.exports = router;