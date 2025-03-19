import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

  // If still loading, show nothing (or could add a spinner here)
  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If roles are specified, check if user has allowed role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  // Render the protected component
  return children;
};

export default PrivateRoute;
