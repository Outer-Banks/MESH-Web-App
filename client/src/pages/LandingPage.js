import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import meshLogo from '../assets/logo.png'; // Make sure this path is correct
import getImagePath from '../utils/imagePaths';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to MESH</h1>
          <p className="lead">
            Connecting startups and investors across APAC to drive innovation and growth
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-outline">Log In</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="mesh-network-graphic"></div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission" id="mission">
        <div className="section-container">
          <h2>Our Mission</h2>
          <p>
            We aim to unite APAC's fragmented startup ecosystems into a thriving, collaborative network.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-container">
          <h2>How MESH Works</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-network-wired"></i>
              </div>
              <h3>Creating Super-Ecosystems</h3>
              <p>MESH links startup hubs across APAC, building powerful super-ecosystems for collaboration and opportunity.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-puzzle-piece"></i>
              </div>
              <h3>Solving Defragmentation</h3>
              <p>We break down barriers between APAC regions, making it easier for startups and investors to connect.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-lock-open"></i>
              </div>
              <h3>Tackling Financial Silos</h3>
              <p>Using blockchain, MESH ensures secure, transparent funding and data sharing across APAC.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits" id="benefits">
        <div className="section-container">
          <div className="benefits-grid">
            <div className="benefits-content">
              <h2>Benefits</h2>
              <div className="benefit-item">
                <h3><i className="fas fa-user-tie"></i> Anyone Can Be an Investor</h3>
                <p>With MESH, anyone can invest in startups and join APAC's innovation wave.</p>
              </div>
              <div className="benefit-item">
                <h3><i className="fas fa-rocket"></i> Easier Funding for Startups</h3>
                <p>Startups on MESH tap into a wide investor pool across APAC for faster funding.</p>
              </div>
            </div>
            <div className="benefits-image">
              <div className="image-placeholder"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta" id="signup">
        <div className="section-container">
          <h2>Join MESH and shape the future of APAC startups</h2>
          <p>Be part of the revolution that's transforming how startups and investors connect in Asia-Pacific.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-large">Get Started</Link>
            <Link to="/login" className="btn btn-outline btn-large">Log In</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="section-container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src={meshLogo} alt="MESH Logo" className="footer-logo-img" />
              <p>&copy; 2025 MESH. All rights reserved.</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#team">Our Team</a></li>
                  <li><a href="#careers">Careers</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <ul>
                  <li><a href="#blog">Blog</a></li>
                  <li><a href="#faq">FAQ</a></li>
                  <li><a href="#support">Support</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#terms">Terms of Service</a></li>
                  <li><a href="#privacy">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
