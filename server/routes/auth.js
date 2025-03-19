const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentUser } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateUser, getCurrentUser);

module.exports = router;
