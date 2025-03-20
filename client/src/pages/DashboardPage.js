import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is a startup and doesn't have a profile yet, redirect to profile creation
    if (user && user.role === 'startup') {
      // We could check if they have a profile here and redirect if not
      // For now, we'll just show a button to create/edit profile
    }
  }, [user, navigate]);

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="card">
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Welcome {user && user.firstName}
        </p>
        
        {user && user.role === 'startup' && (
          <div className="dashboard-actions">
            <Link to="/startup/profile" className="btn btn-primary">
              <i className="fas fa-user-circle"></i> Create/Edit Startup Profile
            </Link>
            <Link to="/startup/metrics" className="btn btn-dark">
              <i className="fas fa-chart-line"></i> View Metrics
            </Link>
          </div>
        )}
        
        {user && user.role === 'investor' && (
          <div className="dashboard-actions">
            <div className="card">
              <h3 className="text-primary">Investor Dashboard</h3>
              <p>Manage your investment opportunities and portfolio</p>
              <div className="dashboard-actions">
                <Link to="/browse/startups" className="btn btn-primary">
                  <i className="fas fa-search"></i> Browse Startups
                </Link>
                <Link to="/portfolio" className="btn btn-dark">
                  <i className="fas fa-briefcase"></i> Manage Portfolio
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
