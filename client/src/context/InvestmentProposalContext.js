import React, { createContext, useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const InvestmentProposalContext = createContext();

// Dummy data for development
const dummyInvestors = {
  'investor1': {
    _id: 'investor1',
    name: 'Alex Thompson',
    email: 'alex@venturecap.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: 'San Francisco, CA',
    focus: 'Fintech, SaaS'
  },
  'investor2': {
    _id: 'investor2',
    name: 'Sarah Johnson',
    email: 'sarah@angelinvest.com',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    location: 'New York, NY',
    focus: 'Health Tech, AI'
  },
  'investor3': {
    _id: 'investor3',
    name: 'Michael Chen',
    email: 'michael@techfund.com',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    location: 'Boston, MA',
    focus: 'B2B, Enterprise Software'
  }
};

const dummyStartups = {
  'startup1': {
    _id: 'startup1',
    name: 'NexGen Analytics',
    email: 'contact@nexgenanalytics.com',
    avatar: 'https://logo.clearbit.com/analytics.google.com',
    location: 'Austin, TX',
    industry: 'Data Analytics'
  },
  'startup2': {
    _id: 'startup2',
    name: 'EcoCharge',
    email: 'info@ecocharge.tech',
    avatar: 'https://logo.clearbit.com/tesla.com',
    location: 'Portland, OR',
    industry: 'CleanTech'
  },
  'startup3': {
    _id: 'startup3',
    name: 'MediConnect',
    email: 'support@mediconnect.health',
    avatar: 'https://logo.clearbit.com/doctorondemand.com',
    location: 'Chicago, IL',
    industry: 'HealthTech'
  }
};

// Dummy investment proposals
const dummySentProposals = [
  {
    _id: 'proposal1',
    investor: dummyInvestors.investor1,
    startup: dummyStartups.startup1,
    fundingAmount: 500000,
    equityPercentage: 10,
    additionalConditions: 'Board seat required. Quarterly performance reviews.',
    status: 'pending',
    createdAt: '2025-02-15T10:00:00Z',
    updatedAt: '2025-02-15T10:00:00Z'
  },
  {
    _id: 'proposal2',
    investor: dummyInvestors.investor1,
    startup: dummyStartups.startup2,
    fundingAmount: 300000,
    equityPercentage: 8,
    additionalConditions: 'Vesting schedule for equity over 3 years.',
    status: 'pending',
    createdAt: '2025-03-01T09:15:00Z',
    updatedAt: '2025-03-01T09:15:00Z'
  },
  {
    _id: 'proposal3',
    investor: dummyInvestors.investor1,
    startup: dummyStartups.startup3,
    fundingAmount: 600000,
    equityPercentage: 18,
    additionalConditions: 'Relocation of headquarters to San Francisco. Change of CEO within 6 months.',
    status: 'declined',
    createdAt: '2025-02-12T08:30:00Z',
    updatedAt: '2025-02-14T17:15:00Z'
  },
  {
    _id: 'proposal4',
    investor: dummyInvestors.investor1,
    startup: dummyStartups.startup2,
    fundingAmount: 1000000,
    equityPercentage: 20,
    additionalConditions: 'Quarterly board meetings. Right of first refusal for future funding rounds.',
    status: 'accepted',
    createdAt: '2025-01-10T11:45:00Z',
    updatedAt: '2025-01-15T16:20:00Z'
  }
];

const dummyReceivedProposals = [
  {
    _id: 'proposal5',
    investor: dummyInvestors.investor2,
    startup: dummyStartups.startup1,
    fundingAmount: 750000,
    equityPercentage: 15,
    additionalConditions: 'Monthly financial reporting. Option for additional funding in 12 months.',
    status: 'pending',
    createdAt: '2025-02-20T14:30:00Z',
    updatedAt: '2025-02-20T14:30:00Z'
  },
  {
    _id: 'proposal6',
    investor: dummyInvestors.investor3,
    startup: dummyStartups.startup1,
    fundingAmount: 250000,
    equityPercentage: 25,
    additionalConditions: 'Majority control of board. Exclusive rights to technology.',
    status: 'declined',
    createdAt: '2025-01-25T15:20:00Z',
    updatedAt: '2025-01-28T10:45:00Z'
  },
  {
    _id: 'proposal7',
    investor: dummyInvestors.investor2,
    startup: dummyStartups.startup1,
    fundingAmount: 450000,
    equityPercentage: 12,
    additionalConditions: 'Co-marketing opportunities. Strategic partnership with our portfolio companies.',
    status: 'accepted',
    createdAt: '2025-02-05T13:10:00Z',
    updatedAt: '2025-02-10T09:30:00Z'
  }
];

const initialState = {
  sentProposals: [],
  receivedProposals: [],
  currentProposal: null,
  loading: false,
  error: null,
  useDummyData: true // Flag to toggle between real API and dummy data
};

const investmentProposalReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'SET_SENT_PROPOSALS':
      return {
        ...state,
        sentProposals: action.payload,
        loading: false
      };
    case 'SET_RECEIVED_PROPOSALS':
      return {
        ...state,
        receivedProposals: action.payload,
        loading: false
      };
    case 'ADD_PROPOSAL':
      return {
        ...state,
        sentProposals: [action.payload, ...state.sentProposals],
        loading: false
      };
    case 'UPDATE_PROPOSAL':
      // Update in both sent and received arrays
      return {
        ...state,
        sentProposals: state.sentProposals.map(proposal =>
          proposal._id === action.payload._id ? action.payload : proposal
        ),
        receivedProposals: state.receivedProposals.map(proposal =>
          proposal._id === action.payload._id ? action.payload : proposal
        ),
        loading: false
      };
    case 'SET_CURRENT_PROPOSAL':
      return {
        ...state,
        currentProposal: action.payload,
        loading: false
      };
    case 'CLEAR_CURRENT_PROPOSAL':
      return {
        ...state,
        currentProposal: null
      };
    case 'PROPOSAL_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'TOGGLE_DUMMY_DATA':
      return {
        ...state,
        useDummyData: !state.useDummyData
      };
    default:
      return state;
  }
};

const InvestmentProposalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(investmentProposalReducer, initialState);
  const { token, user } = useContext(AuthContext);

  // Load dummy data on initial render
  useEffect(() => {
    if (state.useDummyData) {
      if (user && user.role === 'investor') {
        dispatch({
          type: 'SET_SENT_PROPOSALS',
          payload: dummySentProposals
        });
      } else if (user && user.role === 'startup') {
        dispatch({
          type: 'SET_RECEIVED_PROPOSALS',
          payload: dummyReceivedProposals
        });
      }
    }
  }, [user, state.useDummyData]);

  // Set axios auth header
  const setAuthToken = token => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  // Create a new investment proposal
  const createProposal = async (proposalData) => {
    if (state.useDummyData) {
      // Create a new dummy proposal with a unique ID
      const newProposal = {
        _id: 'proposal' + (dummySentProposals.length + dummyReceivedProposals.length + 1),
        investor: dummyInvestors.investor1, // Assuming current user is investor1
        startup: dummyStartups[proposalData.startupId] || dummyStartups.startup1,
        fundingAmount: proposalData.fundingAmount,
        equityPercentage: proposalData.equityPercentage,
        additionalConditions: proposalData.additionalConditions || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to dummy sent proposals
      dummySentProposals.unshift(newProposal);
      
      dispatch({
        type: 'ADD_PROPOSAL',
        payload: newProposal
      });
      
      return newProposal;
    } else {
      setAuthToken(token);
      dispatch({ type: 'SET_LOADING' });

      try {
        const res = await axios.post('/api/investment-proposals', proposalData);
        dispatch({
          type: 'ADD_PROPOSAL',
          payload: res.data
        });
        return res.data;
      } catch (err) {
        dispatch({
          type: 'PROPOSAL_ERROR',
          payload: err.response?.data?.errors?.[0]?.msg || 'Error creating proposal'
        });
        return null;
      }
    }
  };

  // Get all proposals sent by the investor
  const getSentProposals = async () => {
    if (state.useDummyData) {
      dispatch({
        type: 'SET_SENT_PROPOSALS',
        payload: dummySentProposals
      });
    } else {
      setAuthToken(token);
      dispatch({ type: 'SET_LOADING' });

      try {
        const res = await axios.get('/api/investment-proposals/sent');
        dispatch({
          type: 'SET_SENT_PROPOSALS',
          payload: res.data
        });
      } catch (err) {
        dispatch({
          type: 'PROPOSAL_ERROR',
          payload: err.response?.data?.msg || 'Error fetching sent proposals'
        });
      }
    }
  };

  // Get all proposals received by the startup
  const getReceivedProposals = async () => {
    if (state.useDummyData) {
      dispatch({
        type: 'SET_RECEIVED_PROPOSALS',
        payload: dummyReceivedProposals
      });
    } else {
      setAuthToken(token);
      dispatch({ type: 'SET_LOADING' });

      try {
        const res = await axios.get('/api/investment-proposals/received');
        dispatch({
          type: 'SET_RECEIVED_PROPOSALS',
          payload: res.data
        });
      } catch (err) {
        dispatch({
          type: 'PROPOSAL_ERROR',
          payload: err.response?.data?.msg || 'Error fetching received proposals'
        });
      }
    }
  };

  // Get a specific proposal by ID
  const getProposalById = async (id) => {
    if (state.useDummyData) {
      const proposal = [...dummySentProposals, ...dummyReceivedProposals].find(p => p._id === id);
      
      if (proposal) {
        dispatch({
          type: 'SET_CURRENT_PROPOSAL',
          payload: proposal
        });
        return proposal;
      } else {
        dispatch({
          type: 'PROPOSAL_ERROR',
          payload: 'Proposal not found'
        });
        return null;
      }
    } else {
      setAuthToken(token);
      dispatch({ type: 'SET_LOADING' });

      try {
        const res = await axios.get(`/api/investment-proposals/${id}`);
        dispatch({
          type: 'SET_CURRENT_PROPOSAL',
          payload: res.data
        });
        return res.data;
      } catch (err) {
        dispatch({
          type: 'PROPOSAL_ERROR',
          payload: err.response?.data?.msg || 'Error fetching proposal'
        });
        return null;
      }
    }
  };

  // Accept a proposal
  const acceptProposal = async (id) => {
    if (state.useDummyData) {
      // Find the proposal in dummy data
      const proposalIndex = dummyReceivedProposals.findIndex(p => p._id === id);
      
      if (proposalIndex !== -1) {
        // Update the proposal status
        dummyReceivedProposals[proposalIndex].status = 'accepted';
        dummyReceivedProposals[proposalIndex].updatedAt = new Date().toISOString();
        
        const updatedProposal = dummyReceivedProposals[proposalIndex];
        
        dispatch({
          type: 'UPDATE_PROPOSAL',
          payload: updatedProposal
        });
        
        return updatedProposal;
      } else {
        dispatch({
          type: 'PROPOSAL_ERROR',
          payload: 'Proposal not found'
        });
        return null;
      }
    } else {
      setAuthToken(token);
      dispatch({ type: 'SET_LOADING' });

      try {
        const res = await axios.put(`/api/investment-proposals/${id}/accept`);
        dispatch({
          type: 'UPDATE_PROPOSAL',
          payload: res.data
        });
        return res.data;
      } catch (err) {
        dispatch({
          type: 'PROPOSAL_ERROR',
          payload: err.response?.data?.msg || 'Error accepting proposal'
        });
        return null;
      }
    }
  };

  // Decline a proposal
  const declineProposal = async (id) => {
    if (state.useDummyData) {
      // Find the proposal in dummy data
      const proposalIndex = dummyReceivedProposals.findIndex(p => p._id === id);
      
      if (proposalIndex !== -1) {
        // Update the proposal status
        dummyReceivedProposals[proposalIndex].status = 'declined';
        dummyReceivedProposals[proposalIndex].updatedAt = new Date().toISOString();
        
        const updatedProposal = dummyReceivedProposals[proposalIndex];
        
        dispatch({
          type: 'UPDATE_PROPOSAL',
          payload: updatedProposal
        });
        
        return updatedProposal;
      } else {
        dispatch({
          type: 'PROPOSAL_ERROR',
          payload: 'Proposal not found'
        });
        return null;
      }
    } else {
      setAuthToken(token);
      dispatch({ type: 'SET_LOADING' });

      try {
        const res = await axios.put(`/api/investment-proposals/${id}/decline`);
        dispatch({
          type: 'UPDATE_PROPOSAL',
          payload: res.data
        });
        return res.data;
      } catch (err) {
        dispatch({
          type: 'PROPOSAL_ERROR',
          payload: err.response?.data?.msg || 'Error declining proposal'
        });
        return null;
      }
    }
  };

  // Toggle between dummy data and real API
  const toggleDummyData = () => {
    dispatch({ type: 'TOGGLE_DUMMY_DATA' });
  };

  // Clear current proposal
  const clearCurrentProposal = () => {
    dispatch({ type: 'CLEAR_CURRENT_PROPOSAL' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <InvestmentProposalContext.Provider
      value={{
        sentProposals: state.sentProposals,
        receivedProposals: state.receivedProposals,
        currentProposal: state.currentProposal,
        loading: state.loading,
        error: state.error,
        useDummyData: state.useDummyData,
        createProposal,
        getSentProposals,
        getReceivedProposals,
        getProposalById,
        acceptProposal,
        declineProposal,
        toggleDummyData,
        clearCurrentProposal,
        clearError
      }}
    >
      {children}
    </InvestmentProposalContext.Provider>
  );
};

export { InvestmentProposalContext, InvestmentProposalProvider };
