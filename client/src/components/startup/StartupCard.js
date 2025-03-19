import React from 'react';
import { Link } from 'react-router-dom';
import defaultImage from '../../assets/default-startup.jpg';
import './StartupCard.css';

const StartupCard = ({ startup }) => {
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

  return (
    <div className="startup-card">
      <div className="startup-header">
        <div className="avatar">
          <img 
            src={avatar || defaultImage} 
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
      </div>
      
      <div className="startup-actions">
        <Link to={`/profile/startup/${id}`} className="btn btn-primary btn-sm">
          <i className="fas fa-info-circle"></i> View Profile
        </Link>
        <Link to={`/chat/startup/${id}`} className="btn btn-dark btn-sm">
          <i className="fas fa-comments"></i> Connect
        </Link>
      </div>
    </div>
  );
};

export default StartupCard;
