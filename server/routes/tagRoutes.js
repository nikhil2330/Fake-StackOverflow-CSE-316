
const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tagsController');

router.get('/', TagController.getAllTags);

module.exports = router;