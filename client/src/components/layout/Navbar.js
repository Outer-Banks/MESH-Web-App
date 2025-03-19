import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const onLogout = () => {
    logout();
  };

  const authLinks = (
    <ul>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-tachometer-alt"></i>{' '}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to="/for-you">
          <i className="fas fa-fire"></i>{' '}
          <span className="hide-sm">Feed </span>
        </Link>
      </li>
      {user && user.role === 'investor' && (
        <li>
          <Link to="/browse/startups">
            <i className="fas fa-search"></i>{' '}
            <span className="hide-sm">Browse Startups</span>
          </Link>
        </li>
      )}
      <li>
        <Link to="/chat">
          <i className="fas fa-comments"></i>{' '}
          <span className="hide-sm">Messages</span>
        </Link>
      </li>
      {user && user.role === 'startup' && (
        <li>
          <Link to="/startup/profile">
            <i className="fas fa-user-circle"></i>{' '}
            <span className="hide-sm">Profile</span>
          </Link>
        </li>
      )}
      <li>
        <a onClick={onLogout} href="#!">
          <i className="fas fa-sign-out-alt"></i>{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/register">
          <i className="fas fa-user-plus"></i>{' '}
          <span className="hide-sm">Register</span>
        </Link>
      </li>
      <li>
        <Link to="/login">
          <i className="fas fa-sign-in-alt"></i>{' '}
          <span className="hide-sm">Login</span>
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <Logo />
      {isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;
