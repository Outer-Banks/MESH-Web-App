import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="logo">
      <span className="logo-text">
        <span className="logo-m">M</span>
        <span className="logo-e">E</span>
        <span className="logo-s">S</span>
        <span className="logo-h">H</span>
      </span>
    </Link>
  );
};

export default Logo;
