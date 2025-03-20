import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ConnectionContext } from '../context/ConnectionContext';
import { toast } from 'react-toastify';
import './ConnectionsPage.css';

// Dummy data for testing
const dummyPendingConnections = [
  {
    _id: 'conn1',
    investor: {
      _id: 'inv1',
      name: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      location: 'Singapore',
      focus: 'Fintech, AI',
      bio: 'Experienced angel investor with a focus on early-stage fintech and AI startups in Southeast Asia.'
    },
    startup: {
      _id: 'startup1',
      name: 'TechInnovate',
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      location: 'Singapore',
      industry: 'Technology'
    },
    status: 'pending',
    message: "I'm impressed with your innovative approach to AI-powered customer support. I'd like to discuss potential investment opportunities.",
    createdAt: '2025-03-15T08:30:00.000Z',
    updatedAt: '2025-03-15T08:30:00.000Z'
  },
  {
    _id: 'conn2',
    investor: {
      _id: 'inv2',
      name: 'Emily Wong',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      location: 'Hong Kong',
      focus: 'E-commerce, Retail Tech',
      bio: 'Venture capitalist specializing in e-commerce and retail technology solutions across Asia.'
    },
    startup: {
      _id: 'startup1',
      name: 'TechInnovate',
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      location: 'Singapore',
      industry: 'Technology'
    },
    status: 'pending',
    message: "Your platform has great potential to disrupt the customer service industry. Let's connect to explore synergies.",
    createdAt: '2025-03-17T10:15:00.000Z',
    updatedAt: '2025-03-17T10:15:00.000Z'
  }
];

const dummyAcceptedConnections = [
  {
    _id: 'conn3',
    investor: {
      _id: 'inv3',
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      location: 'Taiwan',
      focus: 'Deep Tech, Robotics',
      bio: 'Strategic investor with a background in engineering and a passion for deep tech innovations.'
    },
    startup: {
      _id: 'startup1',
      name: 'TechInnovate',
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      location: 'Singapore',
      industry: 'Technology'
    },
    status: 'accepted',
    message: 'I see great potential in your AI technology and would like to discuss how I can help scale your business.',
    createdAt: '2025-03-10T09:45:00.000Z',
    updatedAt: '2025-03-11T14:20:00.000Z'
  },
  {
    _id: 'conn4',
    investor: {
      _id: 'inv4',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      location: 'Singapore',
      focus: 'SaaS, B2B Solutions',
      bio: 'Experienced investor with a portfolio of successful B2B SaaS companies across Southeast Asia.'
    },
    startup: {
      _id: 'startup1',
      name: 'TechInnovate',
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      location: 'Singapore',
      industry: 'Technology'
    },
    status: 'accepted',
    message: "Your solution addresses a critical pain point in customer service. I'd love to discuss how my network can help you grow.",
    createdAt: '2025-03-05T11:30:00.000Z',
    updatedAt: '2025-03-06T16:45:00.000Z'
  }
];

const dummySentConnections = [
  {
    _id: 'conn5',
    investor: {
      _id: 'inv5',
      name: 'David Lee',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      location: 'Singapore',
      focus: 'Fintech, Blockchain',
      bio: 'Strategic investor focused on disruptive financial technologies and blockchain applications.'
    },
    startup: {
      _id: 'startup2',
      name: 'GreenEnergy Solutions',
      avatar: 'https://randomuser.me/api/portraits/lego/2.jpg',
      location: 'Bangkok',
      industry: 'Cleantech',
      description: 'Renewable energy solutions for residential and commercial properties across Southeast Asia.'
    },
    status: 'pending',
    message: "I'm impressed with your renewable energy solutions and would like to explore investment opportunities.",
    createdAt: '2025-03-18T13:20:00.000Z',
    updatedAt: '2025-03-18T13:20:00.000Z'
  },
  {
    _id: 'conn6',
    investor: {
      _id: 'inv5',
      name: 'David Lee',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      location: 'Singapore',
      focus: 'Fintech, Blockchain',
      bio: 'Strategic investor focused on disruptive financial technologies and blockchain applications.'
    },
    startup: {
      _id: 'startup3',
      name: 'FinTech Solutions',
      avatar: 'https://randomuser.me/api/portraits/lego/3.jpg',
      location: 'Singapore',
      industry: 'Fintech',
      description: 'Blockchain-based platform for secure and transparent financial transactions.'
    },
    status: 'accepted',
    message: "Your blockchain solution aligns perfectly with my investment thesis. Let's connect to discuss further.",
    createdAt: '2025-03-12T09:10:00.000Z',
    updatedAt: '2025-03-13T11:25:00.000Z'
  },
  {
    _id: 'conn7',
    investor: {
      _id: 'inv5',
      name: 'David Lee',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      location: 'Singapore',
      focus: 'Fintech, Blockchain',
      bio: 'Strategic investor focused on disruptive financial technologies and blockchain applications.'
    },
    startup: {
      _id: 'startup4',
      name: 'EduTech Innovators',
      avatar: 'https://randomuser.me/api/portraits/lego/4.jpg',
      location: 'Jakarta',
      industry: 'Education',
      description: 'Digital learning platform making quality education accessible to students across APAC.'
    },
    status: 'declined',
    message: "I'm interested in your edtech platform and would like to discuss potential collaboration.",
    createdAt: '2025-03-08T14:50:00.000Z',
    updatedAt: '2025-03-09T10:15:00.000Z'
  }
];

const ConnectionsPage = () => {
  const { user } = useContext(AuthContext);
  const {
    pendingConnections: apiPendingConnections,
    acceptedConnections: apiAcceptedConnections,
    sentConnections: apiSentConnections,
    loading: apiLoading,
    error,
    getPendingConnections,
    getAcceptedConnections,
    getSentConnections,
    acceptConnection,
    declineConnection,
    clearError
  } = useContext(ConnectionContext);

  // Use dummy data or API data
  const [pendingConnections, setPendingConnections] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [sentConnections, setSentConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [useDummyData, setUseDummyData] = useState(true); // Toggle this to use real or dummy data

  useEffect(() => {
    if (useDummyData) {
      // Simulate loading
      setLoading(true);
      setTimeout(() => {
        if (user?.role === 'startup') {
          setPendingConnections(dummyPendingConnections);
          setAcceptedConnections(dummyAcceptedConnections);
        } else if (user?.role === 'investor') {
          setSentConnections(dummySentConnections);
          setAcceptedConnections(dummySentConnections.filter(conn => conn.status === 'accepted'));
        }
        setLoading(false);
      }, 1000);
    } else {
      // Use real API data
      if (user) {
        if (user.role === 'startup') {
          getPendingConnections();
          getAcceptedConnections();
        } else if (user.role === 'investor') {
          getSentConnections();
          getAcceptedConnections();
        }
      }
    }
    // eslint-disable-next-line
  }, [user, useDummyData]);

  // Update states when API data changes (only if not using dummy data)
  useEffect(() => {
    if (!useDummyData) {
      setPendingConnections(apiPendingConnections);
      setAcceptedConnections(apiAcceptedConnections);
      setSentConnections(apiSentConnections);
      setLoading(apiLoading);
    }
  }, [apiPendingConnections, apiAcceptedConnections, apiSentConnections, apiLoading, useDummyData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
    // eslint-disable-next-line
  }, [error]);

  const handleAccept = async (connectionId) => {
    if (useDummyData) {
      // Simulate accepting a connection with dummy data
      setLoading(true);
      setTimeout(() => {
        const updatedConnection = dummyPendingConnections.find(conn => conn._id === connectionId);
        if (updatedConnection) {
          updatedConnection.status = 'accepted';
          updatedConnection.updatedAt = new Date().toISOString();
          
          setPendingConnections(pendingConnections.filter(conn => conn._id !== connectionId));
          setAcceptedConnections([...acceptedConnections, updatedConnection]);
          toast.success('Connection request accepted');
        }
        setLoading(false);
      }, 500);
    } else {
      const success = await acceptConnection(connectionId);
      if (success) {
        toast.success('Connection request accepted');
      }
    }
  };

  const handleDecline = async (connectionId) => {
    if (useDummyData) {
      // Simulate declining a connection with dummy data
      setLoading(true);
      setTimeout(() => {
        setPendingConnections(pendingConnections.filter(conn => conn._id !== connectionId));
        toast.success('Connection request declined');
        setLoading(false);
      }, 500);
    } else {
      const success = await declineConnection(connectionId);
      if (success) {
        toast.success('Connection request declined');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Toggle between dummy and real data (for development purposes)
  const toggleDataSource = () => {
    setUseDummyData(!useDummyData);
    toast.info(`Using ${!useDummyData ? 'dummy' : 'real'} data`);
  };

  // Render for startup users
  const renderStartupView = () => {
    return (
      <div className="connections-page">
        <h1>Manage Connections</h1>
        <p className="lead">
          <i className="fas fa-handshake"></i> View and manage your connection requests
        </p>

        {/* Dev mode indicator */}
        <div className="dev-mode-toggle">
          <button className={`toggle-btn ${useDummyData ? 'dummy' : 'real'}`} onClick={toggleDataSource}>
            {useDummyData ? 'Using Dummy Data' : 'Using Real Data'}
          </button>
        </div>

        <div className="tabs">
          <button
            className={activeTab === 'pending' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('pending')}
          >
            Pending Requests
            {pendingConnections.length > 0 && (
              <span className="badge">{pendingConnections.length}</span>
            )}
          </button>
          <button
            className={activeTab === 'accepted' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('accepted')}
          >
            Accepted Connections
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'pending' && (
            <div className="pending-connections">
              <h2>Pending Connection Requests</h2>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : pendingConnections.length === 0 ? (
                <div className="no-connections">
                  <p>No pending connection requests</p>
                </div>
              ) : (
                <div className="connection-list">
                  {pendingConnections.map((connection) => (
                    <div key={connection._id} className="connection-card">
                      <div className="connection-avatar">
                        <img
                          src={connection.investor.avatar || '/default-investor.jpg'}
                          alt={connection.investor.name}
                        />
                      </div>
                      <div className="connection-info">
                        <h3>{connection.investor.name}</h3>
                        <p className="connection-meta">
                          <span className="location">
                            <i className="fas fa-map-marker-alt"></i> {connection.investor.location || 'Location not specified'}
                          </span>
                          <span className="focus">
                            <i className="fas fa-bullseye"></i> {connection.investor.focus || 'Focus not specified'}
                          </span>
                        </p>
                        <p className="connection-bio">
                          {connection.investor.bio || 'No bio provided'}
                        </p>
                        {connection.message && (
                          <div className="connection-message">
                            <p><strong>Message:</strong> {connection.message}</p>
                          </div>
                        )}
                        <p className="connection-date">
                          <i className="far fa-clock"></i> Requested on {formatDate(connection.createdAt)}
                        </p>
                      </div>
                      <div className="connection-actions">
                        <button
                          className="btn btn-success"
                          onClick={() => handleAccept(connection._id)}
                        >
                          <i className="fas fa-check"></i> Accept
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDecline(connection._id)}
                        >
                          <i className="fas fa-times"></i> Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'accepted' && (
            <div className="accepted-connections">
              <h2>Accepted Connections</h2>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : acceptedConnections.length === 0 ? (
                <div className="no-connections">
                  <p>No accepted connections yet</p>
                </div>
              ) : (
                <div className="connection-list">
                  {acceptedConnections.map((connection) => (
                    <div key={connection._id} className="connection-card">
                      <div className="connection-avatar">
                        <img
                          src={connection.investor.avatar || '/default-investor.jpg'}
                          alt={connection.investor.name}
                        />
                      </div>
                      <div className="connection-info">
                        <h3>{connection.investor.name}</h3>
                        <p className="connection-meta">
                          <span className="location">
                            <i className="fas fa-map-marker-alt"></i> {connection.investor.location || 'Location not specified'}
                          </span>
                          <span className="focus">
                            <i className="fas fa-bullseye"></i> {connection.investor.focus || 'Focus not specified'}
                          </span>
                        </p>
                        <p className="connection-bio">
                          {connection.investor.bio || 'No bio provided'}
                        </p>
                        <p className="connection-date">
                          <i className="far fa-calendar-check"></i> Connected since {formatDate(connection.updatedAt)}
                        </p>
                      </div>
                      <div className="connection-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => window.location.href = `/chat/${connection.investor._id}`}
                        >
                          <i className="fas fa-comments"></i> Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render for investor users
  const renderInvestorView = () => {
    return (
      <div className="connections-page">
        <h1>My Connections</h1>
        <p className="lead">
          <i className="fas fa-handshake"></i> View your connection requests and established connections
        </p>

        {/* Dev mode indicator */}
        <div className="dev-mode-toggle">
          <button className={`toggle-btn ${useDummyData ? 'dummy' : 'real'}`} onClick={toggleDataSource}>
            {useDummyData ? 'Using Dummy Data' : 'Using Real Data'}
          </button>
        </div>

        <div className="tabs">
          <button
            className={activeTab === 'pending' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('pending')}
          >
            Sent Requests
          </button>
          <button
            className={activeTab === 'accepted' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('accepted')}
          >
            Accepted Connections
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'pending' && (
            <div className="sent-connections">
              <h2>Sent Connection Requests</h2>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : sentConnections.length === 0 ? (
                <div className="no-connections">
                  <p>You haven't sent any connection requests yet</p>
                </div>
              ) : (
                <div className="connection-list">
                  {sentConnections.map((connection) => (
                    <div key={connection._id} className="connection-card">
                      <div className="connection-avatar">
                        <img
                          src={connection.startup.avatar || '/default-startup.jpg'}
                          alt={connection.startup.name}
                        />
                      </div>
                      <div className="connection-info">
                        <h3>{connection.startup.name}</h3>
                        <p className="connection-meta">
                          <span className="location">
                            <i className="fas fa-map-marker-alt"></i> {connection.startup.location || 'Location not specified'}
                          </span>
                          <span className="industry">
                            <i className="fas fa-industry"></i> {connection.startup.industry || 'Industry not specified'}
                          </span>
                        </p>
                        <p className="connection-bio">
                          {connection.startup.description || 'No description provided'}
                        </p>
                        {connection.message && (
                          <div className="connection-message">
                            <p><strong>Your message:</strong> {connection.message}</p>
                          </div>
                        )}
                        <p className="connection-date">
                          <i className="far fa-clock"></i> Sent on {formatDate(connection.createdAt)}
                        </p>
                        <p className="connection-status">
                          <i className="fas fa-circle"></i> Status: <span className={`status-${connection.status}`}>{connection.status}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'accepted' && (
            <div className="accepted-connections">
              <h2>Accepted Connections</h2>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : acceptedConnections.length === 0 ? (
                <div className="no-connections">
                  <p>No accepted connections yet</p>
                </div>
              ) : (
                <div className="connection-list">
                  {acceptedConnections.map((connection) => (
                    <div key={connection._id} className="connection-card">
                      <div className="connection-avatar">
                        <img
                          src={connection.startup.avatar || '/default-startup.jpg'}
                          alt={connection.startup.name}
                        />
                      </div>
                      <div className="connection-info">
                        <h3>{connection.startup.name}</h3>
                        <p className="connection-meta">
                          <span className="location">
                            <i className="fas fa-map-marker-alt"></i> {connection.startup.location || 'Location not specified'}
                          </span>
                          <span className="industry">
                            <i className="fas fa-industry"></i> {connection.startup.industry || 'Industry not specified'}
                          </span>
                        </p>
                        <p className="connection-bio">
                          {connection.startup.description || 'No description provided'}
                        </p>
                        <p className="connection-date">
                          <i className="far fa-calendar-check"></i> Connected since {formatDate(connection.updatedAt)}
                        </p>
                      </div>
                      <div className="connection-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => window.location.href = `/chat/${connection.startup._id}`}
                        >
                          <i className="fas fa-comments"></i> Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return user?.role === 'startup' ? renderStartupView() : renderInvestorView();
};

export default ConnectionsPage;
