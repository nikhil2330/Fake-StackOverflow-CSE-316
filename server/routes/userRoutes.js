const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/logout', verifyToken, UserController.logoutUser); 
router.get('/loggedIn', verifyToken, UserController.getLoggedIn); 
router.get('/:userId/votes',verifyToken, UserController.getUserVotes);
router.get('/details',verifyToken, UserController.getUserDetails);
router.get('/questions',verifyToken, UserController.getUserQuestions);
router.get('/answers',verifyToken, UserController.getUserAnswerQuestions);
router.get('/tags',verifyToken, UserController.getUserTags);
//router.get('/',verifyToken, verifyAdmin, UserController.getUser);
//router.get('/',verifyToken, verifyAdmin, UserController.deleteUser);

module.exports = router;