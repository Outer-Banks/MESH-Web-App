const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Connection = require('../models/Connection');
const InvestmentProposal = require('../models/InvestmentProposal');
const { 
  dummyUsers, 
  dummyConnections, 
  dummyInvestmentProposals 
} = require('../data/dummyInvestmentProposals');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

// Seed the database with dummy data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({ _id: { $in: dummyUsers.map(user => user._id) } });
    await Connection.deleteMany({ _id: { $in: dummyConnections.map(conn => conn._id) } });
    await InvestmentProposal.deleteMany({ _id: { $in: dummyInvestmentProposals.map(prop => prop._id) } });
    
    console.log('Cleared existing dummy data');

    // Insert dummy users
    await User.insertMany(dummyUsers);
    console.log('Inserted dummy users');

    // Insert dummy connections
    await Connection.insertMany(dummyConnections);
    console.log('Inserted dummy connections');

    // Insert dummy investment proposals
    await InvestmentProposal.insertMany(dummyInvestmentProposals);
    console.log('Inserted dummy investment proposals');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

// Run the seeding process
connectDB().then(() => {
  seedDatabase();
});
