import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo.png';
import './Logo.css';

const Logo = () => {
  return (
    <Link to="/" className="logo">
      <div className="logo-container">
        <img src={logoImage} alt="MESH Logo" className="logo-image" />
        <span className="logo-text">MESH</span>
      </div>
    </Link>
  );
};

export default Logo;
