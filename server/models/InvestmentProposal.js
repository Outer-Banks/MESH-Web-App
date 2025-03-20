const mongoose = require('mongoose');

const InvestmentProposalSchema = new mongoose.Schema({
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
  fundingAmount: {
    type: Number,
    required: true
  },
  equityPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  additionalConditions: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('investmentProposal', InvestmentProposalSchema);
