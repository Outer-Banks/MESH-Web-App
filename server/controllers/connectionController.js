const Connection = require('../models/Connection');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @route   POST api/connections
// @desc    Create a new connection request
// @access  Private (Investor only)
exports.createConnectionRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user is an investor
    if (req.user.role !== 'investor') {
      return res.status(403).json({ msg: 'Only investors can send connection requests' });
    }

    const { startupId, message } = req.body;

    // Check if startup exists
    const startup = await User.findOne({ _id: startupId, role: 'startup' });
    if (!startup) {
      return res.status(404).json({ msg: 'Startup not found' });
    }

    // Check if connection already exists
    let connection = await Connection.findOne({
      investor: req.user.id,
      startup: startupId
    });

    if (connection) {
      return res.status(400).json({ msg: 'Connection request already exists' });
    }

    // Create new connection
    connection = new Connection({
      investor: req.user.id,
      startup: startupId,
      message: message || ''
    });

    await connection.save();

    res.json(connection);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/connections/pending
// @desc    Get all pending connection requests for a startup
// @access  Private (Startup only)
exports.getPendingConnections = async (req, res) => {
  try {
    // Check if user is a startup
    if (req.user.role !== 'startup') {
      return res.status(403).json({ msg: 'Only startups can view their pending connections' });
    }

    // Get all pending connections for the startup
    const connections = await Connection.find({
      startup: req.user.id,
      status: 'pending'
    }).populate('investor', 'name email avatar location bio focus investmentRange');

    res.json(connections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/connections/accepted
// @desc    Get all accepted connections for a user
// @access  Private
exports.getAcceptedConnections = async (req, res) => {
  try {
    let connections;
    
    if (req.user.role === 'startup') {
      // If user is a startup, get all accepted connections where they are the startup
      connections = await Connection.find({
        startup: req.user.id,
        status: 'accepted'
      }).populate('investor', 'name email avatar location bio focus investmentRange');
    } else if (req.user.role === 'investor') {
      // If user is an investor, get all accepted connections where they are the investor
      connections = await Connection.find({
        investor: req.user.id,
        status: 'accepted'
      }).populate('startup', 'name email avatar location industry description fundingNeeded');
    } else {
      return res.status(403).json({ msg: 'Invalid user role' });
    }

    res.json(connections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/connections/:id/accept
// @desc    Accept a connection request
// @access  Private (Startup only)
exports.acceptConnection = async (req, res) => {
  try {
    // Check if user is a startup
    if (req.user.role !== 'startup') {
      return res.status(403).json({ msg: 'Only startups can accept connection requests' });
    }

    // Find the connection
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ msg: 'Connection request not found' });
    }

    // Check if the connection belongs to the startup
    if (connection.startup.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to accept this connection' });
    }

    // Check if the connection is already accepted
    if (connection.status === 'accepted') {
      return res.status(400).json({ msg: 'Connection already accepted' });
    }

    // Update the connection status
    connection.status = 'accepted';
    connection.updatedAt = Date.now();
    await connection.save();

    res.json(connection);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/connections/:id/decline
// @desc    Decline a connection request
// @access  Private (Startup only)
exports.declineConnection = async (req, res) => {
  try {
    // Check if user is a startup
    if (req.user.role !== 'startup') {
      return res.status(403).json({ msg: 'Only startups can decline connection requests' });
    }

    // Find the connection
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ msg: 'Connection request not found' });
    }

    // Check if the connection belongs to the startup
    if (connection.startup.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to decline this connection' });
    }

    // Update the connection status
    connection.status = 'declined';
    connection.updatedAt = Date.now();
    await connection.save();

    res.json(connection);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/connections/sent
// @desc    Get all connection requests sent by an investor
// @access  Private (Investor only)
exports.getSentConnections = async (req, res) => {
  try {
    // Check if user is an investor
    if (req.user.role !== 'investor') {
      return res.status(403).json({ msg: 'Only investors can view their sent connections' });
    }

    // Get all connections sent by the investor
    const connections = await Connection.find({
      investor: req.user.id
    }).populate('startup', 'name email avatar location industry description fundingNeeded');

    res.json(connections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
