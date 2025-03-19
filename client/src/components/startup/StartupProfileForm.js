import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const StartupProfileForm = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startupName: '',
    location: '',
    industry: '',
    description: '',
    fundingNeeded: ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const { startupName, location, industry, description, fundingNeeded } = formData;

  // Industry options
  const industryOptions = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'E-commerce',
    'Transportation',
    'Food & Beverage',
    'Real Estate',
    'Manufacturing',
    'Energy',
    'Entertainment',
    'Other'
  ];

  useEffect(() => {
    // Fetch startup profile if it exists
    const fetchStartupProfile = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        };

        const res = await axios.get('/api/startup/profile', config);

        if (res.data) {
          setFormData({
            startupName: res.data.startupName || '',
            location: res.data.location || '',
            industry: res.data.industry || '',
            description: res.data.description || '',
            fundingNeeded: res.data.fundingNeeded || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err.response?.data?.msg || 'Server error');
        // If 404, it means no profile exists yet, which is fine
        if (err.response?.status !== 404) {
          toast.error('Failed to load profile data');
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    if (token) {
      fetchStartupProfile();
    } else {
      setLoadingProfile(false);
    }
  }, [token]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!startupName || !location || !industry || !description || !fundingNeeded) {
      return toast.error('Please fill in all fields');
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      await axios.post('/api/startup/profile', formData, config);

      toast.success('Startup profile updated successfully');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating/updating profile:', err.response?.data?.msg || 'Server error');
      toast.error(err.response?.data?.msg || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return <div className="loading-spinner">Loading profile data...</div>;
  }

  return (
    <div className="startup-profile-form">
      <h1 className="large text-primary">
        Create Your Startup Profile
      </h1>
      <p className="lead">
        <i className="fas fa-rocket"></i> Let's get some information to showcase your startup to investors
      </p>
      <small>* = required field</small>
      
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="startupName">Startup Name *</label>
          <input
            type="text"
            id="startupName"
            name="startupName"
            value={startupName}
            onChange={onChange}
            placeholder="Enter your startup name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={onChange}
            placeholder="City, Country"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="industry">Industry *</label>
          <select
            id="industry"
            name="industry"
            value={industry}
            onChange={onChange}
            required
          >
            <option value="">Select your industry</option>
            {industryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            placeholder="Describe your startup, product, and vision"
            rows="5"
            required
          ></textarea>
          <small className="form-text">A brief pitch about your startup (400 characters max)</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="fundingNeeded">Funding Needed (USD) *</label>
          <input
            type="number"
            id="fundingNeeded"
            name="fundingNeeded"
            value={fundingNeeded}
            onChange={onChange}
            placeholder="Amount in USD"
            min="0"
            required
          />
          <small className="form-text">How much funding are you looking to raise in USD?</small>
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default StartupProfileForm;
