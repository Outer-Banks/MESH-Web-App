import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { loginUser, isAuthenticated, error, clearError, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated && user) {
      if (user.role === 'startup') {
        // Check if startup has a profile, and redirect accordingly
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    }

    // Display error if there is one
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [isAuthenticated, user, error, clearError, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }
    
    setLoading(true);
    await loginUser(formData);
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="card">
        <h1 className="large text-primary">Sign In</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Sign into your MESH account
        </p>
        
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="my-1">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
