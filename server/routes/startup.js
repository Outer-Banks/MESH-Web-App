const express = require('express');
const router = express.Router();
const { 
  createOrUpdateProfile,
  getProfile,
  getAllProfiles,
  getProfileById
} = require('../controllers/startupProfileController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// @route   POST /api/startup/profile
// @desc    Create or update startup profile
// @access  Private (startup role only)
router.post(
  '/profile', 
  authenticateUser, 
  authorizeRole(['startup']), 
  createOrUpdateProfile
);

// @route   GET /api/startup/profile
// @desc    Get current user's startup profile
// @access  Private (startup role only)
router.get(
  '/profile', 
  authenticateUser, 
  authorizeRole(['startup']), 
  getProfile
);

// @route   GET /api/startup/profiles
// @desc    Get all startup profiles
// @access  Private
router.get(
  '/profiles', 
  authenticateUser, 
  getAllProfiles
);

// @route   GET /api/startup/profile/:id
// @desc    Get startup profile by ID
// @access  Private
router.get(
  '/profile/:id', 
  authenticateUser, 
  getProfileById
);

module.exports = router;
