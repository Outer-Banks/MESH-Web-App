import React from 'react';
import { Link } from 'react-router-dom';
import defaultImage from '../../assets/default-investor.jpg';
import './InvestorCard.css';

const InvestorCard = ({ investor }) => {
  const { id, name, avatar, focus, location, description, investmentRange } = investor;
  
  // Handle missing image
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <div className="investor-card">
      <div className="investor-header">
        <div className="avatar">
          <img 
            src={avatar || defaultImage} 
            alt={name} 
            onError={handleImageError}
          />
        </div>
        <div className="investor-info">
          <Link to={`/profile/investor/${id}`}>
            <h3>{name}</h3>
          </Link>
          <div className="investor-meta">
            <span className="focus-badge">
              <i className="fas fa-bullseye"></i> {focus}
            </span>
            <span className="location">
              <i className="fas fa-map-marker-alt"></i> {location}
            </span>
          </div>
        </div>
      </div>
      
      <div className="investor-content">
        <p className="description">{description}</p>
        <div className="investment-info">
          <span className="investment-label">Investment Range:</span>
          <span className="investment-amount">{investmentRange}</span>
        </div>
      </div>
      
      <div className="investor-actions">
        <Link to={`/profile/investor/${id}`} className="btn btn-primary btn-sm">
          <i className="fas fa-info-circle"></i> View Profile
        </Link>
        <Link to={`/chat/investor/${id}`} className="btn btn-dark btn-sm">
          <i className="fas fa-comments"></i> Connect
        </Link>
      </div>
    </div>
  );
};

export default InvestorCard;
