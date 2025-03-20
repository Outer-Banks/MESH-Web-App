const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const investmentProposalController = require('../controllers/investmentProposalController');

// @route   POST api/investment-proposals
// @desc    Create a new investment proposal
// @access  Private (Investors only)
router.post(
  '/',
  [
    authenticateUser,
    authorizeRole('investor'),
    [
      check('startupId', 'Startup ID is required').not().isEmpty(),
      check('fundingAmount', 'Funding amount is required and must be a positive number')
        .isNumeric()
        .custom(value => value > 0),
      check('equityPercentage', 'Equity percentage is required and must be between 0 and 100')
        .isNumeric()
        .custom(value => value >= 0 && value <= 100)
    ]
  ],
  investmentProposalController.createProposal
);

// @route   GET api/investment-proposals/sent
// @desc    Get all investment proposals sent by the investor
// @access  Private (Investors only)
router.get(
  '/sent',
  [authenticateUser, authorizeRole('investor')],
  investmentProposalController.getSentProposals
);

// @route   GET api/investment-proposals/received
// @desc    Get all investment proposals received by the startup
// @access  Private (Startups only)
router.get(
  '/received',
  [authenticateUser, authorizeRole('startup')],
  investmentProposalController.getReceivedProposals
);

// @route   PUT api/investment-proposals/:id/accept
// @desc    Accept an investment proposal
// @access  Private (Startups only)
router.put(
  '/:id/accept',
  [authenticateUser, authorizeRole('startup')],
  investmentProposalController.acceptProposal
);

// @route   PUT api/investment-proposals/:id/decline
// @desc    Decline an investment proposal
// @access  Private (Startups only)
router.put(
  '/:id/decline',
  [authenticateUser, authorizeRole('startup')],
  investmentProposalController.declineProposal
);

// @route   GET api/investment-proposals/:id
// @desc    Get a specific investment proposal by ID
// @access  Private (Investors and Startups involved in the proposal)
router.get(
  '/:id',
  authenticateUser,
  investmentProposalController.getProposalById
);

module.exports = router;
