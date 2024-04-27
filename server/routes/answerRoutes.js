const express = require('express');
const router = express.Router();
const AnswersController = require('../controllers/answersController');

router.post('/', AnswersController.createAnswer);

module.exports = router;