const StartupProfile = require('../models/StartupProfile');

// @desc    Create or update startup profile
// @route   POST /api/startup/profile
// @access  Private (startup role only)
exports.createOrUpdateProfile = async (req, res) => {
  const { startupName, location, industry, description, fundingNeeded } = req.body;

  // Build profile object
  const profileFields = {
    user: req.user.id,
    startupName,
    location,
    industry,
    description,
    fundingNeeded
  };

  try {
    let profile = await StartupProfile.findOne({ user: req.user.id });

    if (profile) {
      // Update existing profile
      profile = await StartupProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    }

    // Create new profile
    profile = new StartupProfile(profileFields);
    await profile.save();
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get current user's startup profile
// @route   GET /api/startup/profile
// @access  Private (startup role only)
exports.getProfile = async (req, res) => {
  try {
    const profile = await StartupProfile.findOne({ 
      user: req.user.id 
    }).populate('user', ['firstName', 'lastName', 'email']);

    if (!profile) {
      return res.status(404).json({ msg: 'Startup profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all startup profiles
// @route   GET /api/startup/profiles
// @access  Private
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await StartupProfile.find()
      .populate('user', ['firstName', 'lastName', 'email']);
    
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get startup profile by ID
// @route   GET /api/startup/profile/:id
// @access  Private
exports.getProfileById = async (req, res) => {
  try {
    const profile = await StartupProfile.findById(req.params.id)
      .populate('user', ['firstName', 'lastName', 'email']);
    
    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server error');
  }
};
