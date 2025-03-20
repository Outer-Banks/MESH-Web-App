import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import defaultImage from '../../assets/default-startup.jpg';
import getImagePath from '../../utils/imagePaths';
import './StartupCard.css';

const StartupCard = ({ startup, handleConnect }) => {
  const { user } = useContext(AuthContext);
  const { id, name, avatar, industry, location, description, fundingNeeded } = startup;
  
  // Format funding amount
  const formatFunding = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  // Handle missing image
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  // Check if this is TechInnovate
  const isTechInnovate = name === 'TechInnovate';

  return (
    <div className="startup-card">
      {isTechInnovate && <div className="featured-banner">Featured Startup</div>}
      <div className="startup-header">
        <div className="avatar">
          <img 
            src={getImagePath(avatar) || defaultImage} 
            alt={name} 
            onError={handleImageError}
          />
        </div>
        <div className="startup-info">
          <Link to={`/profile/startup/${id}`}>
            <h3>{name}</h3>
          </Link>
          <div className="startup-meta">
            <span className="industry-badge">
              <i className="fas fa-industry"></i> {industry}
            </span>
            <span className="location">
              <i className="fas fa-map-marker-alt"></i> {location}
            </span>
          </div>
        </div>
      </div>
      
      <div className="startup-content">
        <p className="description">{description}</p>
        <div className="funding-info">
          <span className="funding-label">Funding Needed:</span>
          <span className="funding-amount">{formatFunding(fundingNeeded)}</span>
        </div>
        
        {/* Progress display */}
        <div className="funding-progress">
          <div className="progress-bar-container">
            {/* Randomly generate progress percentage for demo purposes */}
            <div 
              className="progress-bar" 
              style={{ width: `${Math.floor(Math.random() * 80) + 10}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span>{Math.floor(Math.random() * 80) + 10}% Funded</span>
          </div>
        </div>
      </div>
      
      <div className="startup-actions">
        <Link to={`/profile/startup/${id}`} className="btn btn-primary btn-sm">
          <i className="fas fa-info-circle"></i> View Profile
        </Link>
        {user && user.role === 'investor' && handleConnect && (
          <button 
            onClick={() => handleConnect(startup)} 
            className="btn btn-dark btn-sm"
          >
            <i className="fas fa-handshake"></i> Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default StartupCard;
