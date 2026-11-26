const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');
const { loginLimiter } = require("../middleware/rateLimit.middleware");

router.post('/register', authController.registerUser);
router.post('/login',loginLimiter, authController.loginUser);

router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.delete('/profile', verifyToken, authController.deleteProfile);

router.get('/me', verifyToken, authController.getProfile);

router.delete('/users/:id', verifyToken, requireAdmin, authController.deleteUserById);

module.exports = router;
