import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <span className="logo-text">
            <span className="logo-m">M</span>
            <span className="logo-e">E</span>
            <span className="logo-s">S</span>
            <span className="logo-h">H</span>
          </span>
          <p>Connecting Startups & Investors across APAC</p>
        </div>
        <div className="footer-links">
          <div className="footer-section">
            <h4>For Startups</h4>
            <ul>
              <li><a href="#!">Create Profile</a></li>
              <li><a href="#!">Find Investors</a></li>
              <li><a href="#!">Resources</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>For Investors</h4>
            <ul>
              <li><a href="#!">Browse Startups</a></li>
              <li><a href="#!">Investment Opportunities</a></li>
              <li><a href="#!">Portfolio Management</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#!">About Us</a></li>
              <li><a href="#!">Contact</a></li>
              <li><a href="#!">Privacy Policy</a></li>
              <li><a href="#!">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MESH. All rights reserved.</p>
        <div className="social-links">
          <a href="#!" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
          <a href="#!" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#!" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
          <a href="#!" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
