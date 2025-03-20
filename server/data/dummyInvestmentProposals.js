const mongoose = require('mongoose');

// Generate ObjectIds for users
const investorIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId()
];

const startupIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId()
];

// Dummy investment proposals
const dummyInvestmentProposals = [
  // Pending proposals
  {
    _id: new mongoose.Types.ObjectId(),
    investor: investorIds[0],
    startup: startupIds[0],
    fundingAmount: 500000,
    equityPercentage: 10,
    additionalConditions: 'Board seat required. Quarterly performance reviews.',
    status: 'pending',
    createdAt: new Date('2025-02-15T10:00:00Z'),
    updatedAt: new Date('2025-02-15T10:00:00Z')
  },
  {
    _id: new mongoose.Types.ObjectId(),
    investor: investorIds[1],
    startup: startupIds[0],
    fundingAmount: 750000,
    equityPercentage: 15,
    additionalConditions: 'Monthly financial reporting. Option for additional funding in 12 months.',
    status: 'pending',
    createdAt: new Date('2025-02-20T14:30:00Z'),
    updatedAt: new Date('2025-02-20T14:30:00Z')
  },
  {
    _id: new mongoose.Types.ObjectId(),
    investor: investorIds[0],
    startup: startupIds[1],
    fundingAmount: 300000,
    equityPercentage: 8,
    additionalConditions: 'Vesting schedule for equity over 3 years.',
    status: 'pending',
    createdAt: new Date('2025-03-01T09:15:00Z'),
    updatedAt: new Date('2025-03-01T09:15:00Z')
  },
  
  // Accepted proposals
  {
    _id: new mongoose.Types.ObjectId(),
    investor: investorIds[2],
    startup: startupIds[1],
    fundingAmount: 1000000,
    equityPercentage: 20,
    additionalConditions: 'Quarterly board meetings. Right of first refusal for future funding rounds.',
    status: 'accepted',
    createdAt: new Date('2025-01-10T11:45:00Z'),
    updatedAt: new Date('2025-01-15T16:20:00Z')
  },
  {
    _id: new mongoose.Types.ObjectId(),
    investor: investorIds[1],
    startup: startupIds[2],
    fundingAmount: 450000,
    equityPercentage: 12,
    additionalConditions: 'Co-marketing opportunities. Strategic partnership with our portfolio companies.',
    status: 'accepted',
    createdAt: new Date('2025-02-05T13:10:00Z'),
    updatedAt: new Date('2025-02-10T09:30:00Z')
  },
  
  // Declined proposals
  {
    _id: new mongoose.Types.ObjectId(),
    investor: investorIds[2],
    startup: startupIds[0],
    fundingAmount: 250000,
    equityPercentage: 25,
    additionalConditions: 'Majority control of board. Exclusive rights to technology.',
    status: 'declined',
    createdAt: new Date('2025-01-25T15:20:00Z'),
    updatedAt: new Date('2025-01-28T10:45:00Z')
  },
  {
    _id: new mongoose.Types.ObjectId(),
    investor: investorIds[0],
    startup: startupIds[2],
    fundingAmount: 600000,
    equityPercentage: 18,
    additionalConditions: 'Relocation of headquarters to San Francisco. Change of CEO within 6 months.',
    status: 'declined',
    createdAt: new Date('2025-02-12T08:30:00Z'),
    updatedAt: new Date('2025-02-14T17:15:00Z')
  }
];

// User data to populate the proposals
const dummyUsers = [
  // Investors
  {
    _id: investorIds[0],
    name: 'Alex Thompson',
    email: 'alex@venturecap.com',
    role: 'investor',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: 'San Francisco, CA',
    focus: 'Fintech, SaaS',
    bio: 'Early-stage investor with 15+ years of experience in tech startups.'
  },
  {
    _id: investorIds[1],
    name: 'Sarah Johnson',
    email: 'sarah@angelinvest.com',
    role: 'investor',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    location: 'New York, NY',
    focus: 'Health Tech, AI',
    bio: 'Angel investor focused on disruptive technologies in healthcare and artificial intelligence.'
  },
  {
    _id: investorIds[2],
    name: 'Michael Chen',
    email: 'michael@techfund.com',
    role: 'investor',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    location: 'Boston, MA',
    focus: 'B2B, Enterprise Software',
    bio: 'Venture capitalist specializing in B2B solutions and enterprise software.'
  },
  
  // Startups
  {
    _id: startupIds[0],
    name: 'NexGen Analytics',
    email: 'contact@nexgenanalytics.com',
    role: 'startup',
    avatar: 'https://logo.clearbit.com/analytics.google.com',
    location: 'Austin, TX',
    industry: 'Data Analytics',
    stage: 'Seed',
    foundedYear: 2023,
    teamSize: 8,
    bio: 'AI-powered analytics platform for business intelligence and decision making.'
  },
  {
    _id: startupIds[1],
    name: 'EcoCharge',
    email: 'info@ecocharge.tech',
    role: 'startup',
    avatar: 'https://logo.clearbit.com/tesla.com',
    location: 'Portland, OR',
    industry: 'CleanTech',
    stage: 'Series A',
    foundedYear: 2022,
    teamSize: 15,
    bio: 'Sustainable charging solutions for electric vehicles using renewable energy sources.'
  },
  {
    _id: startupIds[2],
    name: 'MediConnect',
    email: 'support@mediconnect.health',
    role: 'startup',
    avatar: 'https://logo.clearbit.com/doctorondemand.com',
    location: 'Chicago, IL',
    industry: 'HealthTech',
    stage: 'Seed',
    foundedYear: 2024,
    teamSize: 6,
    bio: 'Telemedicine platform connecting patients with healthcare providers for virtual consultations.'
  }
];

// Connection data to link investors and startups
const dummyConnections = [
  {
    _id: new mongoose.Types.ObjectId(),
    investor: investorIds[0],
    startup: startupIds[0],
    status: 'accepted',
    message: 'Impressed by your analytics solution. Would love to discuss investment opportunities.',
    createdAt: new Date('2025-01-05T08:00:00Z'),
    updatedAt: new Date('2025-01-07T10:30:00Z')
  },
  {
    _id: new mongoose.Types.ObjectId(),
    investor: investorIds[1],
    startup: startupIds[0],
    status: 'accepted',
    message: 'Your data platform aligns with our investment thesis. Let\'s connect!',
    createdAt: new Date('2025-01-10T14:15:00Z'),
    updatedAt: new Date('2025-01-12T09:45:00Z')
  },
  {
    _id: new mongoose.Types.ObjectId(),
    investor: investorIds[0],
    startup: startupIds[1],
    status: 'accepted',
    message: 'Interested in your clean energy solutions. Would like to explore funding options.',
    createdAt: new Date('2025-01-15T11:20:00Z'),
    updatedAt: new Date('2025-01-18T16:10:00Z')
  },
  {
    _id: new mongoose.Types.ObjectId(),
    investor: investorIds[2],
    startup: startupIds[1],
    status: 'accepted',
    message: 'Your EV charging technology is impressive. Let\'s discuss how we can help you scale.',
    createdAt: new Date('2025-01-08T13:40:00Z'),
    updatedAt: new Date('2025-01-10T15:25:00Z')
  },
  {
    _id: new mongoose.Types.ObjectId(),
    investor: investorIds[1],
    startup: startupIds[2],
    status: 'accepted',
    message: 'Your telemedicine platform addresses a critical gap in healthcare. Interested in learning more.',
    createdAt: new Date('2025-01-20T10:05:00Z'),
    updatedAt: new Date('2025-01-22T14:50:00Z')
  },
  {
    _id: new mongoose.Types.ObjectId(),
    investor: investorIds[2],
    startup: startupIds[0],
    status: 'accepted',
    message: 'Looking to invest in data analytics. Your solution seems promising.',
    createdAt: new Date('2025-01-12T09:30:00Z'),
    updatedAt: new Date('2025-01-14T11:15:00Z')
  },
  {
    _id: new mongoose.Types.ObjectId(),
    investor: investorIds[0],
    startup: startupIds[2],
    status: 'accepted',
    message: 'Interested in your healthcare platform. Let\'s discuss potential investment.',
    createdAt: new Date('2025-01-25T16:40:00Z'),
    updatedAt: new Date('2025-01-28T13:20:00Z')
  }
];

module.exports = {
  dummyInvestmentProposals,
  dummyUsers,
  dummyConnections,
  investorIds,
  startupIds
};
