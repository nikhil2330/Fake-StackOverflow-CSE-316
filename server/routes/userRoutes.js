const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/logout', verifyToken, UserController.logoutUser); 
router.get('/loggedIn', verifyToken, UserController.getLoggedIn); 
router.get('/:userId/votes',verifyToken, UserController.getUserVotes);
router.get('/details/:userId',verifyToken, UserController.getUserDetails);
router.get('/questions/:userId',verifyToken, UserController.getUserQuestions);
router.get('/answers/:userId',verifyToken, UserController.getUserAnswerQuestions);
router.get('/tags/:userId',verifyToken, UserController.getUserTags);
router.get('/',verifyToken, verifyAdmin, UserController.getUser);
router.delete('/:userId',verifyToken, verifyAdmin, UserController.deleteUser);

module.exports = router;