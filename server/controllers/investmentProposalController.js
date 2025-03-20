const { validationResult } = require('express-validator');
const InvestmentProposal = require('../models/InvestmentProposal');
const Connection = require('../models/Connection');
const User = require('../models/User');

// @route   POST api/investment-proposals
// @desc    Create a new investment proposal
// @access  Private (Investors only)
exports.createProposal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { startupId, fundingAmount, equityPercentage, additionalConditions } = req.body;

  try {
    // Check if there is an accepted connection between the investor and startup
    const connection = await Connection.findOne({
      investor: req.user.id,
      startup: startupId,
      status: 'accepted'
    });

    if (!connection) {
      return res.status(400).json({ 
        errors: [{ msg: 'You can only send proposals to startups with whom you have an accepted connection' }] 
      });
    }

    // Create new proposal
    const newProposal = new InvestmentProposal({
      investor: req.user.id,
      startup: startupId,
      fundingAmount,
      equityPercentage,
      additionalConditions: additionalConditions || ''
    });

    const proposal = await newProposal.save();

    // Populate investor and startup details
    const populatedProposal = await InvestmentProposal.findById(proposal._id)
      .populate('investor', 'name email avatar location focus')
      .populate('startup', 'name email avatar location industry');

    res.json(populatedProposal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/investment-proposals/sent
// @desc    Get all investment proposals sent by the investor
// @access  Private (Investors only)
exports.getSentProposals = async (req, res) => {
  try {
    const proposals = await InvestmentProposal.find({ investor: req.user.id })
      .populate('investor', 'name email avatar location focus')
      .populate('startup', 'name email avatar location industry')
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/investment-proposals/received
// @desc    Get all investment proposals received by the startup
// @access  Private (Startups only)
exports.getReceivedProposals = async (req, res) => {
  try {
    const proposals = await InvestmentProposal.find({ startup: req.user.id })
      .populate('investor', 'name email avatar location focus')
      .populate('startup', 'name email avatar location industry')
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/investment-proposals/:id/accept
// @desc    Accept an investment proposal
// @access  Private (Startups only)
exports.acceptProposal = async (req, res) => {
  try {
    let proposal = await InvestmentProposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({ msg: 'Proposal not found' });
    }

    // Make sure the startup is the recipient of the proposal
    if (proposal.startup.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to accept this proposal' });
    }

    // Make sure the proposal is pending
    if (proposal.status !== 'pending') {
      return res.status(400).json({ msg: 'This proposal has already been processed' });
    }

    // Update proposal status
    proposal.status = 'accepted';
    await proposal.save();

    // Populate investor and startup details
    const populatedProposal = await InvestmentProposal.findById(proposal._id)
      .populate('investor', 'name email avatar location focus')
      .populate('startup', 'name email avatar location industry');

    res.json(populatedProposal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/investment-proposals/:id/decline
// @desc    Decline an investment proposal
// @access  Private (Startups only)
exports.declineProposal = async (req, res) => {
  try {
    let proposal = await InvestmentProposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({ msg: 'Proposal not found' });
    }

    // Make sure the startup is the recipient of the proposal
    if (proposal.startup.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to decline this proposal' });
    }

    // Make sure the proposal is pending
    if (proposal.status !== 'pending') {
      return res.status(400).json({ msg: 'This proposal has already been processed' });
    }

    // Update proposal status
    proposal.status = 'declined';
    await proposal.save();

    // Populate investor and startup details
    const populatedProposal = await InvestmentProposal.findById(proposal._id)
      .populate('investor', 'name email avatar location focus')
      .populate('startup', 'name email avatar location industry');

    res.json(populatedProposal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/investment-proposals/:id
// @desc    Get a specific investment proposal by ID
// @access  Private (Investors and Startups involved in the proposal)
exports.getProposalById = async (req, res) => {
  try {
    const proposal = await InvestmentProposal.findById(req.params.id)
      .populate('investor', 'name email avatar location focus')
      .populate('startup', 'name email avatar location industry');

    if (!proposal) {
      return res.status(404).json({ msg: 'Proposal not found' });
    }

    // Make sure the user is either the investor or the startup
    if (
      proposal.investor._id.toString() !== req.user.id &&
      proposal.startup._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'Not authorized to view this proposal' });
    }

    res.json(proposal);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Proposal not found' });
    }
    res.status(500).send('Server Error');
  }
};
