import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const navbarRef = useRef(null);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Handle scroll for landing page navbar
  useEffect(() => {
    if (!isLandingPage) return;
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLandingPage]);

  // Close menu and dropdowns when route changes
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(null);
  }, [location]);

  // Close dropdowns when clicking outside (only on mobile)
  useEffect(() => {
    if (!isMobile) return;
    
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown')) {
        setDropdownOpen(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen, isMobile]);

  const onLogout = () => {
    logout();
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const toggleDropdown = (name) => {
    if (!isMobile) return; // Don't toggle on desktop (hover handles it)
    
    if (dropdownOpen === name) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(name);
    }
  };
  
  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  const authLinks = (
    <ul className="navbar-nav">
      <li className="nav-item" style={{ '--item-index': 0 }}>
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>
      </li>
      
      {/* Discover Dropdown */}
      <li className="nav-item dropdown" style={{ '--item-index': 1 }}>
        <button 
          className={`nav-link dropdown-toggle ${isActive('/for-you') || isActive('/browse/startups') ? 'active' : ''}`} 
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown('discover');
          }}
        >
          <i className="fas fa-compass"></i>
          <span>Discover</span>
          <i className={`fas fa-chevron-down dropdown-icon ${dropdownOpen === 'discover' ? 'open' : ''}`}></i>
        </button>
        <div className={`dropdown-menu ${dropdownOpen === 'discover' ? 'show' : ''}`}>
          <Link to="/for-you" className={`dropdown-item ${isActive('/for-you') ? 'active' : ''}`}>
            <i className="fas fa-fire"></i>
            <span>For You</span>
          </Link>
          {user && user.role === 'investor' && (
            <Link to="/browse/startups" className={`dropdown-item ${isActive('/browse/startups') ? 'active' : ''}`}>
              <i className="fas fa-search"></i>
              <span>Browse Startups</span>
            </Link>
          )}
        </div>
      </li>
      
      {/* Network Dropdown */}
      <li className="nav-item dropdown" style={{ '--item-index': 2 }}>
        <button 
          className={`nav-link dropdown-toggle ${isActive('/connections') || isActive('/proposals') ? 'active' : ''}`} 
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown('network');
          }}
        >
          <i className="fas fa-network-wired"></i>
          <span>Network</span>
          <i className={`fas fa-chevron-down dropdown-icon ${dropdownOpen === 'network' ? 'open' : ''}`}></i>
        </button>
        <div className={`dropdown-menu ${dropdownOpen === 'network' ? 'show' : ''}`}>
          <Link to="/connections" className={`dropdown-item ${isActive('/connections') ? 'active' : ''}`}>
            <i className="fas fa-handshake"></i>
            <span>Connections</span>
          </Link>
          <Link to="/proposals" className={`dropdown-item ${isActive('/proposals') ? 'active' : ''}`}>
            <i className="fas fa-file-contract"></i>
            <span>Proposals</span>
          </Link>
        </div>
      </li>
      
      {/* Messages */}
      <li className="nav-item" style={{ '--item-index': 3 }}>
        <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''} ${user?.unreadMessages > 0 ? 'notification-badge' : ''}`}>
          <i className="fas fa-comments"></i>
          <span>Messages</span>
        </Link>
      </li>
      
      {/* Profile/Settings Dropdown */}
      <li className="nav-item dropdown" style={{ '--item-index': 4 }}>
        <button 
          className={`nav-link dropdown-toggle ${isActive('/startup/profile') ? 'active' : ''}`} 
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown('profile');
          }}
        >
          <div className="user-avatar-small">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span>Account</span>
          <i className={`fas fa-chevron-down dropdown-icon ${dropdownOpen === 'profile' ? 'open' : ''}`}></i>
        </button>
        <div className={`dropdown-menu dropdown-menu-right ${dropdownOpen === 'profile' ? 'show' : ''}`}>
          {user && user.role === 'startup' && (
            <Link to="/startup/profile" className={`dropdown-item ${isActive('/startup/profile') ? 'active' : ''}`}>
              <i className="fas fa-user-circle"></i>
              <span>Profile</span>
            </Link>
          )}
          <Link to="/settings" className={`dropdown-item ${isActive('/settings') ? 'active' : ''}`}>
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </Link>
          <div className="dropdown-divider"></div>
          <a onClick={onLogout} href="#!" className="dropdown-item">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </a>
        </div>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className="navbar-nav">
      <li className="nav-item" style={{ '--item-index': 0 }}>
        <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`}>
          <i className="fas fa-user-plus"></i>
          <span>Register</span>
        </Link>
      </li>
      <li className="nav-item" style={{ '--item-index': 1 }}>
        <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
          <i className="fas fa-sign-in-alt"></i>
          <span>Login</span>
        </Link>
      </li>
    </ul>
  );

  const landingPageLinks = (
    <ul className="navbar-nav">
      <li className="nav-item" style={{ '--item-index': 0 }}>
        <a href="#mission" className="nav-link">
          <span>Mission</span>
        </a>
      </li>
      <li className="nav-item" style={{ '--item-index': 1 }}>
        <a href="#features" className="nav-link">
          <span>Features</span>
        </a>
      </li>
      <li className="nav-item" style={{ '--item-index': 2 }}>
        <a href="#benefits" className="nav-link">
          <span>Benefits</span>
        </a>
      </li>
      <li className="nav-item" style={{ '--item-index': 3 }}>
        <Link to="/register" className="nav-link">
          <span>Sign Up</span>
        </Link>
      </li>
      <li className="nav-item" style={{ '--item-index': 4 }}>
        <Link to="/login" className="nav-link btn-primary">
          <span>Login</span>
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className={`navbar ${isLandingPage ? 'landing-navbar' : 'auth-navbar'} ${isScrolled ? 'scrolled' : ''}`} ref={navbarRef}>
      <div className="navbar-brand">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      
      <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="navbar-nav">
          {isLandingPage ? (
            // Landing page navigation
            <>
              <li className="nav-item">
                <a href="#mission" className="nav-link" onClick={() => setMenuOpen(false)}>
                  <span>Mission</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#features" className="nav-link" onClick={() => setMenuOpen(false)}>
                  <span>Features</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#benefits" className="nav-link" onClick={() => setMenuOpen(false)}>
                  <span>Benefits</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#signup" className="nav-link" onClick={() => setMenuOpen(false)}>
                  <span>Sign Up</span>
                </a>
              </li>
              <div className="nav-divider"></div>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  <span>Login</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </li>
            </>
          ) : isAuthenticated ? (
            // Authenticated navigation
            <>
              <li className="nav-item">
                <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                  <i className="fas fa-chart-line"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="nav-item dropdown" style={{ '--item-index': 1 }}>
                <button 
                  className={`nav-link dropdown-toggle ${isActive('/for-you') || isActive('/browse/startups') ? 'active' : ''}`} 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown('discover');
                  }}
                >
                  <i className="fas fa-compass"></i>
                  <span>Discover</span>
                  <i className={`fas fa-chevron-down dropdown-icon ${dropdownOpen === 'discover' ? 'open' : ''}`}></i>
                </button>
                <div className={`dropdown-menu ${dropdownOpen === 'discover' ? 'show' : ''}`}>
                  <Link to="/for-you" className={`dropdown-item ${isActive('/for-you') ? 'active' : ''}`}>
                    <i className="fas fa-fire"></i>
                    <span>For You</span>
                  </Link>
                  {user && user.role === 'investor' && (
                    <Link to="/browse/startups" className={`dropdown-item ${isActive('/browse/startups') ? 'active' : ''}`}>
                      <i className="fas fa-search"></i>
                      <span>Browse Startups</span>
                    </Link>
                  )}
                </div>
              </li>
              <li className="nav-item dropdown" style={{ '--item-index': 2 }}>
                <button 
                  className={`nav-link dropdown-toggle ${isActive('/connections') || isActive('/proposals') ? 'active' : ''}`} 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown('network');
                  }}
                >
                  <i className="fas fa-network-wired"></i>
                  <span>Network</span>
                  <i className={`fas fa-chevron-down dropdown-icon ${dropdownOpen === 'network' ? 'open' : ''}`}></i>
                </button>
                <div className={`dropdown-menu ${dropdownOpen === 'network' ? 'show' : ''}`}>
                  <Link to="/connections" className={`dropdown-item ${isActive('/connections') ? 'active' : ''}`}>
                    <i className="fas fa-handshake"></i>
                    <span>Connections</span>
                  </Link>
                  <Link to="/proposals" className={`dropdown-item ${isActive('/proposals') ? 'active' : ''}`}>
                    <i className="fas fa-file-contract"></i>
                    <span>Proposals</span>
                  </Link>
                </div>
              </li>
              <li className="nav-item" style={{ '--item-index': 3 }}>
                <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''} ${user?.unreadMessages > 0 ? 'notification-badge' : ''}`}>
                  <i className="fas fa-comments"></i>
                  <span>Messages</span>
                </Link>
              </li>
              <li className="nav-item dropdown" style={{ '--item-index': 4 }}>
                <button 
                  className={`nav-link dropdown-toggle ${isActive('/startup/profile') ? 'active' : ''}`} 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown('profile');
                  }}
                >
                  <div className="user-avatar-small">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span>Account</span>
                  <i className={`fas fa-chevron-down dropdown-icon ${dropdownOpen === 'profile' ? 'open' : ''}`}></i>
                </button>
                <div className={`dropdown-menu dropdown-menu-right ${dropdownOpen === 'profile' ? 'show' : ''}`}>
                  {user && user.role === 'startup' && (
                    <Link to="/startup/profile" className={`dropdown-item ${isActive('/startup/profile') ? 'active' : ''}`}>
                      <i className="fas fa-user-circle"></i>
                      <span>Profile</span>
                    </Link>
                  )}
                  <Link to="/settings" className={`dropdown-item ${isActive('/settings') ? 'active' : ''}`}>
                    <i className="fas fa-cog"></i>
                    <span>Settings</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <a onClick={onLogout} href="#!" className="dropdown-item">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </a>
                </div>
              </li>
            </>
          ) : (
            // Guest navigation
            <>
              <li className="nav-item" style={{ '--item-index': 0 }}>
                <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`}>
                  <i className="fas fa-user-plus"></i>
                  <span>Register</span>
                </Link>
              </li>
              <li className="nav-item" style={{ '--item-index': 1 }}>
                <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Login</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
