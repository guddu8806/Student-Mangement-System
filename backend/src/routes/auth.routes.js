const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');
const { loginLimiter } = require("../middleware/rateLimit.middleware");

// Public routes
router.post('/register', authController.registerUser);
router.post('/login',loginLimiter, authController.loginUser);

// Protected routes (Admin or Student)
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.delete('/profile', verifyToken, authController.deleteProfile);

// Convenient alias for /me
router.get('/me', verifyToken, authController.getProfile);

// Admin-only user management route
router.delete('/users/:id', verifyToken, requireAdmin, authController.deleteUserById);

module.exports = router;
