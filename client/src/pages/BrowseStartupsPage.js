import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StartupCard from '../components/startup/StartupCard';
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
    fundingNeeded: 750000
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
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    industry: '',
    location: '',
    fundingRange: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app, you would fetch startups from an API
    // For now, we'll use the dummy data
    setTimeout(() => {
      setStartups(dummyStartups);
      setLoading(false);
    }, 1000);
  }, []);

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
                  <StartupCard startup={startup} />
                </div>
              ))
            ) : (
              <p className="no-results">No startups found matching your criteria.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseStartupsPage;
