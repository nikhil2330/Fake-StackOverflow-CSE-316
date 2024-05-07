const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/logout', verifyToken, UserController.logoutUser); 
router.get('/loggedIn', verifyToken, UserController.getLoggedIn); 
router.get('/:userId/votes',verifyToken, UserController.getUserVotes);

module.exports = router;