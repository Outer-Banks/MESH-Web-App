const mongoose = require('mongoose');
const User = require('../models/User');
const Connection = require('../models/Connection');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Dummy data for startups
const startups = [
  {
    firstName: 'Tech',
    lastName: 'Innovate',
    email: 'tech@innovate.com',
    password: 'password123',
    role: 'startup',
    company: {
      name: 'TechInnovate',
      website: 'https://techinnovate.com',
      industry: 'Technology',
      location: 'Singapore',
      foundedYear: 2022,
      employeeCount: 15,
      fundingStage: 'Seed',
      fundingNeeded: 750000,
      description: 'AI-powered platform that helps businesses automate customer support and improve customer experience.'
    }
  },
  {
    firstName: 'Green',
    lastName: 'Energy',
    email: 'green@energy.com',
    password: 'password123',
    role: 'startup',
    company: {
      name: 'GreenEnergy Solutions',
      website: 'https://greenenergysolutions.com',
      industry: 'Cleantech',
      location: 'Bangkok',
      foundedYear: 2021,
      employeeCount: 8,
      fundingStage: 'Pre-seed',
      fundingNeeded: 1200000,
      description: 'Renewable energy solutions for residential and commercial properties across Southeast Asia.'
    }
  },
  {
    firstName: 'Fin',
    lastName: 'Tech',
    email: 'fin@tech.com',
    password: 'password123',
    role: 'startup',
    company: {
      name: 'FinTech Solutions',
      website: 'https://fintechsolutions.com',
      industry: 'Fintech',
      location: 'Singapore',
      foundedYear: 2023,
      employeeCount: 5,
      fundingStage: 'Pre-seed',
      fundingNeeded: 500000,
      description: 'Blockchain-based platform for secure and transparent financial transactions.'
    }
  }
];

// Dummy data for investors
const investors = [
  {
    firstName: 'Alex',
    lastName: 'Thompson',
    email: 'alex@investor.com',
    password: 'password123',
    role: 'investor',
    investor: {
      company: 'Venture Capital Partners',
      position: 'Managing Partner',
      location: 'Singapore',
      investmentFocus: ['Technology', 'Fintech', 'Healthtech'],
      investmentStage: ['Seed', 'Series A'],
      investmentRange: {
        min: 100000,
        max: 2000000
      },
      bio: 'Experienced investor with a focus on early-stage tech startups in Southeast Asia.'
    }
  },
  {
    firstName: 'Sarah',
    lastName: 'Lee',
    email: 'sarah@investor.com',
    password: 'password123',
    role: 'investor',
    investor: {
      company: 'Asia Growth Fund',
      position: 'Investment Director',
      location: 'Hong Kong',
      investmentFocus: ['Cleantech', 'Sustainability', 'Edtech'],
      investmentStage: ['Seed', 'Series A', 'Series B'],
      investmentRange: {
        min: 500000,
        max: 5000000
      },
      bio: 'Passionate about supporting sustainable startups that make a positive impact in Asia.'
    }
  },
  {
    firstName: 'Michael',
    lastName: 'Wong',
    email: 'michael@investor.com',
    password: 'password123',
    role: 'investor',
    investor: {
      company: 'Tech Angels',
      position: 'Angel Investor',
      location: 'Singapore',
      investmentFocus: ['Technology', 'SaaS', 'AI'],
      investmentStage: ['Pre-seed', 'Seed'],
      investmentRange: {
        min: 50000,
        max: 500000
      },
      bio: 'Angel investor with a background in software development, looking to support innovative tech startups.'
    }
  }
];

// Function to seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Connection.deleteMany({});
    console.log('Cleared existing users and connections');

    // Create users
    const createdStartups = [];
    const createdInvestors = [];

    // Create startups
    for (const startup of startups) {
      const newStartup = new User(startup);
      const savedStartup = await newStartup.save();
      createdStartups.push(savedStartup);
      console.log(`Created startup: ${savedStartup.firstName} ${savedStartup.lastName}`);
    }

    // Create investors
    for (const investor of investors) {
      const newInvestor = new User(investor);
      const savedInvestor = await newInvestor.save();
      createdInvestors.push(savedInvestor);
      console.log(`Created investor: ${savedInvestor.firstName} ${savedInvestor.lastName}`);
    }

    // Create connection requests
    const connectionData = [
      // Pending connections
      {
        investor: createdInvestors[0]._id,
        startup: createdStartups[0]._id,
        status: 'pending',
        message: 'I\'m impressed with your AI platform and would like to discuss potential investment opportunities.'
      },
      {
        investor: createdInvestors[1]._id,
        startup: createdStartups[1]._id,
        status: 'pending',
        message: 'Your renewable energy solutions align with my investment focus. Let\'s connect to discuss further.'
      },
      {
        investor: createdInvestors[2]._id,
        startup: createdStartups[2]._id,
        status: 'pending',
        message: 'I\'m interested in your blockchain platform and would like to learn more about your business model.'
      },
      
      // Accepted connections
      {
        investor: createdInvestors[0]._id,
        startup: createdStartups[1]._id,
        status: 'accepted',
        message: 'I believe your cleantech solutions have great potential in the Southeast Asian market.'
      },
      {
        investor: createdInvestors[1]._id,
        startup: createdStartups[0]._id,
        status: 'accepted',
        message: 'Your AI platform could revolutionize customer support in the region. Let\'s discuss how I can help.'
      },
      
      // Declined connections
      {
        investor: createdInvestors[2]._id,
        startup: createdStartups[0]._id,
        status: 'declined',
        message: 'I\'d like to explore how your AI technology can be applied to other industries.'
      }
    ];

    for (const connection of connectionData) {
      const newConnection = new Connection(connection);
      await newConnection.save();
      console.log(`Created connection: ${connection.status} between investor and startup`);
    }

    console.log('Data seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
