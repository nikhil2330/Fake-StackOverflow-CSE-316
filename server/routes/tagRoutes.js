
const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tagsController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', TagController.getAllTags);
router.delete('/:id', verifyToken, TagController.deleteTag);
router.put('/:id', verifyToken, TagController.editTag);

module.exports = router;