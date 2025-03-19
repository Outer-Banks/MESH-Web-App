import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const { registerUser, isAuthenticated, error, clearError, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);

  const { firstName, lastName, email, password, password2, role } = formData;

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated && user) {
      if (user.role === 'startup') {
        navigate('/startup/profile');
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
    
    if (!firstName || !lastName || !email || !password || !role) {
      return toast.error('Please fill in all fields');
    }
    
    if (password !== password2) {
      return toast.error('Passwords do not match');
    }
    
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    
    setLoading(true);
    await registerUser({
      firstName,
      lastName,
      email,
      password,
      role
    });
    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="card">
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Create Your MESH Account
        </p>
        
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={onChange}
              placeholder="Enter your first name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={onChange}
              placeholder="Enter your last name"
              required
            />
          </div>
          
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
            <small className="form-text">
              This site uses Gravatar for profile images
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="role">I am a:</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={onChange}
              required
            >
              <option value="">Select your role</option>
              <option value="startup">Startup</option>
              <option value="investor">Investor</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter password (min. 6 characters)"
              required
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={password2}
              onChange={onChange}
              placeholder="Confirm your password"
              required
              minLength="6"
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
