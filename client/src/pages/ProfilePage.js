import React from 'react';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import StartupProfileForm from '../components/startup/StartupProfileForm';

const ProfilePage = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated or not a startup
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user && user.role !== 'startup') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="profile-page">
      <div className="card">
        <h1 className="large text-primary">Startup Profile</h1>
        <p className="lead">
          <i className="fas fa-building"></i> Create or update your startup profile
        </p>
        <StartupProfileForm />
      </div>
    </div>
  );
};

export default ProfilePage;
