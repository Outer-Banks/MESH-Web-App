const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const connectionController = require('../controllers/connectionController');

// @route   POST api/connections
// @desc    Create a new connection request
// @access  Private (Investor only)
router.post(
  '/',
  authenticateUser,
  authorizeRole(['investor']),
  check('startupId', 'Startup ID is required').not().isEmpty(),
  check('message', 'Message cannot exceed 500 characters').isLength({ max: 500 }),
  connectionController.createConnectionRequest
);

// @route   GET api/connections/pending
// @desc    Get all pending connection requests for a startup
// @access  Private (Startup only)
router.get('/pending', authenticateUser, authorizeRole(['startup']), connectionController.getPendingConnections);

// @route   GET api/connections/accepted
// @desc    Get all accepted connections for a user
// @access  Private
router.get('/accepted', authenticateUser, connectionController.getAcceptedConnections);

// @route   PUT api/connections/:id/accept
// @desc    Accept a connection request
// @access  Private (Startup only)
router.put('/:id/accept', authenticateUser, authorizeRole(['startup']), connectionController.acceptConnection);

// @route   PUT api/connections/:id/decline
// @desc    Decline a connection request
// @access  Private (Startup only)
router.put('/:id/decline', authenticateUser, authorizeRole(['startup']), connectionController.declineConnection);

// @route   GET api/connections/sent
// @desc    Get all connection requests sent by an investor
// @access  Private (Investor only)
router.get('/sent', authenticateUser, authorizeRole(['investor']), connectionController.getSentConnections);

module.exports = router;
