import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ConnectionContext } from '../context/ConnectionContext';
import StartupCard from '../components/startup/StartupCard';
import { toast } from 'react-toastify';
import './BrowseStartupsPage.css';

// Dummy data for startups
const dummyStartups = [
  {
    id: 101,
    name: 'TechInnovate',
    avatar: '/images/avatars/startup1.jpg',
    industry: 'Technology',
    location: 'Singapore',
    description: 'AI-powered platform that helps businesses automate customer support and improve customer experience.',
    fundingNeeded: 750000,
    verified: true
  },
  {
    id: 102,
    name: 'GreenEnergy Solutions',
    avatar: '/images/avatars/startup2.jpg',
    industry: 'Cleantech',
    location: 'Bangkok',
    description: 'Renewable energy solutions for residential and commercial properties across Southeast Asia.',
    fundingNeeded: 1200000
  },
  {
    id: 103,
    name: 'FinTech Solutions',
    avatar: '/images/avatars/startup3.jpg',
    industry: 'Fintech',
    location: 'Singapore',
    description: 'Blockchain-based platform for secure and transparent financial transactions.',
    fundingNeeded: 500000
  },
  {
    id: 104,
    name: 'EduTech Innovators',
    avatar: '/images/avatars/startup4.jpg',
    industry: 'Education',
    location: 'Jakarta',
    description: 'Digital learning platform making quality education accessible to students across APAC.',
    fundingNeeded: 350000
  },
  {
    id: 105,
    name: 'HealthTech Connect',
    avatar: '/images/avatars/startup5.jpg',
    industry: 'Healthcare',
    location: 'Manila',
    description: 'Telemedicine platform connecting patients with healthcare providers for remote consultations.',
    fundingNeeded: 800000
  },
  {
    id: 106,
    name: 'LogisticsPro',
    avatar: '/images/avatars/startup6.jpg',
    industry: 'Transportation',
    location: 'Ho Chi Minh City',
    description: 'AI-driven logistics platform optimizing supply chain operations for businesses.',
    fundingNeeded: 600000
  }
];

const BrowseStartupsPage = () => {
  const { user } = useContext(AuthContext);
  const { sendConnectionRequest, error, clearError } = useContext(ConnectionContext);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    industry: '',
    location: '',
    fundingRange: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch startups from an API
    // For now, we'll use the dummy data
    setTimeout(() => {
      setStartups(dummyStartups);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const resetFilters = () => {
    setFilters({
      industry: '',
      location: '',
      fundingRange: ''
    });
    setSearchTerm('');
  };

  const handleConnect = (startup) => {
    setSelectedStartup(startup);
    setConnectionMessage('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStartup(null);
    setConnectionMessage('');
  };

  const handleMessageChange = (e) => {
    setConnectionMessage(e.target.value);
  };

  const handleSendRequest = async () => {
    if (!selectedStartup) return;
    
    setIsSubmitting(true);
    const success = await sendConnectionRequest(selectedStartup.id, connectionMessage);
    setIsSubmitting(false);
    
    if (success) {
      toast.success(`Connection request sent to ${selectedStartup.name}`);
      handleCloseModal();
    }
  };

  // Filter startups based on criteria
  const filteredStartups = startups.filter(startup => {
    // Filter by search term
    if (searchTerm && !startup.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !startup.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by industry
    if (filters.industry && startup.industry !== filters.industry) {
      return false;
    }
    
    // Filter by location
    if (filters.location && startup.location !== filters.location) {
      return false;
    }
    
    // Filter by funding range
    if (filters.fundingRange) {
      const [min, max] = filters.fundingRange.split('-').map(val => parseInt(val.replace(/\D/g, '')));
      if (startup.fundingNeeded < min || (max && startup.fundingNeeded > max)) {
        return false;
      }
    }
    
    return true;
  });

  // Get unique values for filter options
  const industries = [...new Set(startups.map(startup => startup.industry))];
  const locations = [...new Set(startups.map(startup => startup.location))];

  return (
    <div className="browse-startups-page">
      <div className="card">
        <h1 className="large text-primary">Browse Startups</h1>
        <p className="lead">
          <i className="fas fa-search"></i> Discover promising startups across APAC
        </p>

        <div className="filter-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search startups..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="btn btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div className="filters">
            <div className="filter-group">
              <label htmlFor="industry">Industry</label>
              <select
                id="industry"
                name="industry"
                value={filters.industry}
                onChange={handleFilterChange}
              >
                <option value="">All Industries</option>
                {industries.map((industry, index) => (
                  <option key={index} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
              >
                <option value="">All Locations</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="fundingRange">Funding Needed</label>
              <select
                id="fundingRange"
                name="fundingRange"
                value={filters.fundingRange}
                onChange={handleFilterChange}
              >
                <option value="">Any Amount</option>
                <option value="0-500000">$0 - $500K</option>
                <option value="500000-1000000">$500K - $1M</option>
                <option value="1000000-5000000">$1M - $5M</option>
                <option value="5000000-">$5M+</option>
              </select>
            </div>

            <button className="btn btn-dark" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading startups...</div>
        ) : (
          <div className="startups-grid">
            {filteredStartups.length > 0 ? (
              filteredStartups.map(startup => (
                <div key={startup.id} className="startup-item">
                  <StartupCard startup={startup} handleConnect={handleConnect} />
                </div>
              ))
            ) : (
              <p className="no-results">No startups found matching your criteria.</p>
            )}
          </div>
        )}
      </div>

      {/* Connection Request Modal */}
      {showModal && selectedStartup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Connect with {selectedStartup.name}</h2>
              <button className="close-button" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Send a connection request to {selectedStartup.name}. Include a brief message explaining why you'd like to connect.</p>
              <div className="form-group">
                <label htmlFor="connectionMessage">Message (optional)</label>
                <textarea
                  id="connectionMessage"
                  rows="4"
                  placeholder="Hi, I'm interested in your startup and would like to discuss potential investment opportunities..."
                  value={connectionMessage}
                  onChange={handleMessageChange}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-dark" 
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSendRequest}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseStartupsPage;
