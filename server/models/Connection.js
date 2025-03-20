const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  startup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  message: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure uniqueness of investor-startup pairs
ConnectionSchema.index({ investor: 1, startup: 1 }, { unique: true });

module.exports = mongoose.model('connection', ConnectionSchema);
