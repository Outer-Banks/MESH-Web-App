import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import defaultStartupImage from '../assets/default-startup.jpg';
import defaultInvestorImage from '../assets/default-investor.jpg';
import './ProfileViewPage.css';

// Dummy data for profiles
const dummyProfiles = {
  startups: {
    "101": {
      id: 101,
      name: 'TechInnovate',
      avatar: '/images/avatars/startup1.jpg',
      coverImage: '/images/covers/startup1.jpg',
      industry: 'Technology',
      location: 'Singapore',
      website: 'https://techinnovate.example.com',
      founded: '2023',
      team: [
        { name: 'John Smith', role: 'CEO & Co-founder' },
        { name: 'Sarah Lee', role: 'CTO & Co-founder' },
        { name: 'Michael Wong', role: 'Head of Product' }
      ],
      description: 'AI-powered platform that helps businesses automate customer support and improve customer experience.',
      longDescription: 'TechInnovate is revolutionizing customer support with our AI-powered platform. We use machine learning algorithms to understand customer queries and provide instant, accurate responses. Our solution helps businesses reduce support costs by up to 60% while improving customer satisfaction scores. We\'re targeting the growing market of e-commerce and SaaS companies across APAC.',
      fundingNeeded: 750000,
      fundingSecured: 115000,
      fundingMetrics: {
        investorCount: 3,
        avgInvestmentSize: 38333,
        investorLocations: ['Singapore', 'Hong Kong'],
        investorIndustries: ['Technology', 'Fintech', 'SaaS']
      },
      metrics: {
        customers: 50,
        mrr: 25000,
        growth: '15% MoM',
        satisfaction: '95%'
      },
      documents: [
        { name: 'Pitch Deck', type: 'pdf', size: '2.4 MB' },
        { name: 'Financial Projections', type: 'xlsx', size: '1.8 MB' },
        { name: 'Product Roadmap', type: 'pdf', size: '3.1 MB' }
      ]
    },
    "102": {
      id: 102,
      name: 'GreenEnergy Solutions',
      avatar: '/images/avatars/startup2.jpg',
      coverImage: '/images/covers/startup2.jpg',
      industry: 'Cleantech',
      location: 'Bangkok',
      website: 'https://greenenergy.example.com',
      founded: '2022',
      team: [
        { name: 'David Chen', role: 'CEO & Founder' },
        { name: 'Lisa Tan', role: 'COO' },
        { name: 'Robert Kim', role: 'Head of Engineering' }
      ],
      description: 'Renewable energy solutions for residential and commercial properties across Southeast Asia.',
      longDescription: 'GreenEnergy Solutions is on a mission to make renewable energy accessible to everyone in Southeast Asia. Our innovative solar and wind energy systems are designed specifically for the region\'s climate and energy needs. We offer flexible financing options and a user-friendly monitoring app that allows customers to track their energy production and savings in real-time.',
      fundingNeeded: 1200000,
      fundingSecured: 350000,
      fundingMetrics: {
        investorCount: 5,
        avgInvestmentSize: 70000,
        investorLocations: ['Singapore', 'Thailand', 'Malaysia'],
        investorIndustries: ['Cleantech', 'Sustainability', 'Energy']
      },
      metrics: {
        installations: 120,
        revenue: '1.8M USD (2024 projected)',
        growth: '25% QoQ',
        energySaved: '450,000 kWh'
      },
      documents: [
        { name: 'Company Overview', type: 'pdf', size: '3.5 MB' },
        { name: 'Technical Specifications', type: 'pdf', size: '2.2 MB' },
        { name: 'Market Analysis', type: 'pptx', size: '4.7 MB' }
      ]
    }
  },
  investors: {
    "201": {
      id: 201,
      name: 'Asia Ventures',
      avatar: '/images/avatars/investor1.jpg',
      coverImage: '/images/covers/investor1.jpg',
      focus: 'Technology, Healthcare, Fintech',
      location: 'Singapore',
      website: 'https://asiaventures.example.com',
      founded: '2018',
      team: [
        { name: 'James Wong', role: 'Managing Partner' },
        { name: 'Emily Tan', role: 'Partner' },
        { name: 'Daniel Lee', role: 'Investment Director' }
      ],
      description: 'Early-stage venture capital firm focused on innovative startups across APAC.',
      longDescription: 'Asia Ventures is a leading early-stage venture capital firm with a focus on technology, healthcare, and fintech startups in the APAC region. We typically invest in pre-seed to Series A rounds, with initial investments ranging from $250K to $2M. Our team brings decades of operational and investment experience to help founders navigate the challenges of scaling a business in Asia.',
      investmentRange: '$250K - $2M',
      portfolio: [
        { name: 'MediTech Solutions', industry: 'Healthcare' },
        { name: 'FinanceApp', industry: 'Fintech' },
        { name: 'LogisticsAI', industry: 'Technology' },
        { name: 'EduLearn', industry: 'Education' }
      ],
      investmentCriteria: [
        'Strong founding team with domain expertise',
        'Innovative solution addressing a large market',
        'Clear path to profitability',
        'Potential for regional or global expansion'
      ]
    },
    "202": {
      id: 202,
      name: 'Tech Growth Capital',
      avatar: '/images/avatars/investor2.jpg',
      coverImage: '/images/covers/investor2.jpg',
      focus: 'Technology, SaaS, AI',
      location: 'Hong Kong',
      website: 'https://techgrowth.example.com',
      founded: '2015',
      team: [
        { name: 'Richard Zhang', role: 'Founding Partner' },
        { name: 'Michelle Lim', role: 'Partner' },
        { name: 'Kevin Ng', role: 'Investment Manager' }
      ],
      description: 'Growth-stage investor focusing on technology companies with proven traction.',
      longDescription: 'Tech Growth Capital specializes in Series B and C investments in technology companies across Asia. We focus on SaaS, AI, and enterprise software companies that have demonstrated product-market fit and are ready to scale. Our team works closely with portfolio companies to accelerate growth, expand into new markets, and prepare for eventual exits.',
      investmentRange: '$2M - $10M',
      portfolio: [
        { name: 'CloudSoft', industry: 'SaaS' },
        { name: 'DataInsights', industry: 'AI/ML' },
        { name: 'SecureTech', industry: 'Cybersecurity' },
        { name: 'RetailOS', industry: 'Retail Technology' }
      ],
      investmentCriteria: [
        'Minimum $1M ARR with 80%+ growth rate',
        'Strong unit economics and retention metrics',
        'Experienced management team',
        'Differentiated technology with defensible moat'
      ]
    }
  }
};

const ProfileViewPage = () => {
  const { user } = useContext(AuthContext);
  const { role, id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // In a real app, you would fetch profile data from an API
    // For now, we'll use the dummy data
    setTimeout(() => {
      if (role === 'startup' && dummyProfiles.startups[id]) {
        setProfile(dummyProfiles.startups[id]);
      } else if (role === 'investor' && dummyProfiles.investors[id]) {
        setProfile(dummyProfiles.investors[id]);
      }
      setLoading(false);
    }, 1000);
  }, [role, id]);

  // Format funding amount
  const formatFunding = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  if (loading) {
    return <div className="loading-spinner">Loading profile...</div>;
  }

  if (!profile) {
    return (
      <div className="profile-not-found">
        <h2>Profile Not Found</h2>
        <p>The requested profile does not exist or you don't have permission to view it.</p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-view-page">
      <div className="profile-header">
        <div className="cover-image">
          <img 
            src={profile.coverImage || (role === 'startup' ? '/images/covers/default-startup.jpg' : '/images/covers/default-investor.jpg')} 
            alt="Cover"
            onError={(e) => {
              e.target.src = role === 'startup' ? '/images/covers/default-startup.jpg' : '/images/covers/default-investor.jpg';
            }}
          />
        </div>
        <div className="profile-header-content">
          <div className="profile-avatar">
            <img 
              src={profile.avatar || (role === 'startup' ? defaultStartupImage : defaultInvestorImage)} 
              alt={profile.name}
              onError={(e) => {
                e.target.src = role === 'startup' ? defaultStartupImage : defaultInvestorImage;
              }}
            />
          </div>
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <div className="profile-meta">
              {role === 'startup' ? (
                <>
                  <span className="industry-badge">
                    <i className="fas fa-industry"></i> {profile.industry}
                  </span>
                  <span className="location">
                    <i className="fas fa-map-marker-alt"></i> {profile.location}
                  </span>
                  <span className="founded">
                    <i className="fas fa-calendar-alt"></i> Founded {profile.founded}
                  </span>
                </>
              ) : (
                <>
                  <span className="focus-badge">
                    <i className="fas fa-bullseye"></i> {profile.focus}
                  </span>
                  <span className="location">
                    <i className="fas fa-map-marker-alt"></i> {profile.location}
                  </span>
                  <span className="founded">
                    <i className="fas fa-calendar-alt"></i> Since {profile.founded}
                  </span>
                </>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="website">
                  <i className="fas fa-globe"></i> Website
                </a>
              )}
            </div>
          </div>
          <div className="profile-actions">
            <Link to={`/chat/${role}/${id}`} className="btn btn-primary">
              <i className="fas fa-comments"></i> Connect
            </Link>
            {user?.role === 'investor' && role === 'startup' && (
              <button className="btn btn-dark">
                <i className="fas fa-star"></i> Add to Watchlist
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        {role === 'startup' ? (
          <>
            <button 
              className={`tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
              onClick={() => setActiveTab('metrics')}
            >
              Metrics
            </button>
            <button 
              className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              Team
            </button>
            <button 
              className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
            <button 
              className={`tab-btn ${activeTab === 'funding' ? 'active' : ''}`}
              onClick={() => setActiveTab('funding')}
            >
              Funding
            </button>
          </>
        ) : (
          <>
            <button 
              className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
              onClick={() => setActiveTab('portfolio')}
            >
              Portfolio
            </button>
            <button 
              className={`tab-btn ${activeTab === 'criteria' ? 'active' : ''}`}
              onClick={() => setActiveTab('criteria')}
            >
              Investment Criteria
            </button>
            <button 
              className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              Team
            </button>
          </>
        )}
      </div>

      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="card">
              <h2>About {profile.name}</h2>
              <p className="description">{profile.longDescription}</p>
              
              {role === 'startup' && (
                <div className="funding-info">
                  <h3>Funding Needed</h3>
                  <div className="funding-progress">
                    <div className="funding-simple-view">
                      <div className="funding-amount">{formatFunding(profile.fundingNeeded)}</div>
                      <div 
                        className="progress-bar-container"
                        onClick={() => {
                          const details = document.querySelector('.funding-details');
                          const simpleView = document.querySelector('.funding-simple-view');
                          
                          if (details.classList.contains('active')) {
                            details.classList.remove('active');
                            simpleView.classList.remove('hidden');
                          } else {
                            details.classList.add('active');
                            simpleView.classList.add('hidden');
                          }
                        }}
                      >
                        <div 
                          className="progress-bar" 
                          style={{ width: `${Math.min(100, (profile.fundingSecured / profile.fundingNeeded) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="funding-percentage">
                        {Math.round((profile.fundingSecured / profile.fundingNeeded) * 100)}% funded
                      </div>
                    </div>
                    
                    <div className="funding-details">
                      <div className="funding-amounts">
                        <div className="funding-amount">
                          <span className="funding-label">Target:</span> {formatFunding(profile.fundingNeeded)}
                        </div>
                        <div className="funding-amount">
                          <span className="funding-label">Secured:</span> {formatFunding(profile.fundingSecured)}
                        </div>
                        <div className="funding-amount">
                          <span className="funding-label">Remaining:</span> {formatFunding(profile.fundingNeeded - profile.fundingSecured)}
                        </div>
                      </div>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${Math.min(100, (profile.fundingSecured / profile.fundingNeeded) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="funding-percentage">
                        {Math.round((profile.fundingSecured / profile.fundingNeeded) * 100)}% funded
                      </div>
                      <div className="funding-metrics-summary">
                        <div className="metric">
                          <i className="fas fa-users"></i> {profile.fundingMetrics.investorCount} investors
                        </div>
                        <div className="metric">
                          <i className="fas fa-map-marker-alt"></i> From {profile.fundingMetrics.investorLocations.length} locations
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {role === 'investor' && (
                <div className="investment-info">
                  <h3>Investment Range</h3>
                  <div className="investment-range">{profile.investmentRange}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'metrics' && role === 'startup' && (
          <div className="metrics-tab">
            <div className="card">
              <h2>Key Metrics</h2>
              <div className="metrics-grid">
                {profile.metrics.customers && (
                  <div className="metric-item">
                    <div className="metric-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="metric-value">{profile.metrics.customers}</div>
                    <div className="metric-label">Customers</div>
                  </div>
                )}
                
                {profile.metrics.mrr && (
                  <div className="metric-item">
                    <div className="metric-icon">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="metric-value">${profile.metrics.mrr}</div>
                    <div className="metric-label">Monthly Revenue</div>
                  </div>
                )}
                
                {profile.metrics.growth && (
                  <div className="metric-item">
                    <div className="metric-icon">
                      <i className="fas fa-rocket"></i>
                    </div>
                    <div className="metric-value">{profile.metrics.growth}</div>
                    <div className="metric-label">Growth Rate</div>
                  </div>
                )}
                
                {profile.metrics.satisfaction && (
                  <div className="metric-item">
                    <div className="metric-icon">
                      <i className="fas fa-smile"></i>
                    </div>
                    <div className="metric-value">{profile.metrics.satisfaction}</div>
                    <div className="metric-label">Satisfaction Rate</div>
                  </div>
                )}
                
                {profile.metrics.installations && (
                  <div className="metric-item">
                    <div className="metric-icon">
                      <i className="fas fa-solar-panel"></i>
                    </div>
                    <div className="metric-value">{profile.metrics.installations}</div>
                    <div className="metric-label">Installations</div>
                  </div>
                )}
                
                {profile.metrics.revenue && (
                  <div className="metric-item">
                    <div className="metric-icon">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="metric-value">{profile.metrics.revenue}</div>
                    <div className="metric-label">Revenue</div>
                  </div>
                )}
                
                {profile.metrics.energySaved && (
                  <div className="metric-item">
                    <div className="metric-icon">
                      <i className="fas fa-bolt"></i>
                    </div>
                    <div className="metric-value">{profile.metrics.energySaved}</div>
                    <div className="metric-label">Energy Saved</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="team-tab">
            <div className="card">
              <h2>Team</h2>
              <div className="team-grid">
                {profile.team.map((member, index) => (
                  <div key={index} className="team-member">
                    <div className="member-avatar">
                      <img 
                        src={`/images/team/default-${index + 1}.jpg`} 
                        alt={member.name}
                        onError={(e) => {
                          e.target.src = '/images/team/default.jpg';
                        }}
                      />
                    </div>
                    <div className="member-info">
                      <h3>{member.name}</h3>
                      <p>{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && role === 'startup' && (
          <div className="documents-tab">
            <div className="card">
              <h2>Documents</h2>
              <p className="documents-note">
                <i className="fas fa-lock"></i> Documents are only visible to approved investors
              </p>
              <div className="documents-list">
                {profile.documents.map((doc, index) => (
                  <div key={index} className="document-item">
                    <div className="document-icon">
                      {doc.type === 'pdf' && <i className="fas fa-file-pdf"></i>}
                      {doc.type === 'xlsx' && <i className="fas fa-file-excel"></i>}
                      {doc.type === 'pptx' && <i className="fas fa-file-powerpoint"></i>}
                      {!['pdf', 'xlsx', 'pptx'].includes(doc.type) && <i className="fas fa-file"></i>}
                    </div>
                    <div className="document-info">
                      <h4>{doc.name}</h4>
                      <p>{doc.size}</p>
                    </div>
                    <button className="document-action">
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'funding' && role === 'startup' && (
          <div className="funding-tab">
            <div className="card">
              <h2>Funding</h2>
              <div className="funding-grid">
                <div className="funding-item">
                  <div className="funding-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="funding-value">{formatFunding(profile.fundingSecured)}</div>
                  <div className="funding-label">Funding Secured</div>
                </div>
                <div className="funding-item">
                  <div className="funding-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="funding-value">{profile.fundingMetrics.investorCount}</div>
                  <div className="funding-label">Investor Count</div>
                </div>
                <div className="funding-item">
                  <div className="funding-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="funding-value">{formatFunding(profile.fundingMetrics.avgInvestmentSize)}</div>
                  <div className="funding-label">Average Investment Size</div>
                </div>
                <div className="funding-item">
                  <div className="funding-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="funding-value">{profile.fundingMetrics.investorLocations.join(', ')}</div>
                  <div className="funding-label">Investor Locations</div>
                </div>
                <div className="funding-item">
                  <div className="funding-icon">
                    <i className="fas fa-industry"></i>
                  </div>
                  <div className="funding-value">{profile.fundingMetrics.investorIndustries.join(', ')}</div>
                  <div className="funding-label">Investor Industries</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && role === 'investor' && (
          <div className="portfolio-tab">
            <div className="card">
              <h2>Portfolio Companies</h2>
              <div className="portfolio-grid">
                {profile.portfolio.map((company, index) => (
                  <div key={index} className="portfolio-item">
                    <div className="portfolio-icon">
                      <i className="fas fa-building"></i>
                    </div>
                    <div className="portfolio-info">
                      <h3>{company.name}</h3>
                      <p>{company.industry}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'criteria' && role === 'investor' && (
          <div className="criteria-tab">
            <div className="card">
              <h2>Investment Criteria</h2>
              <ul className="criteria-list">
                {profile.investmentCriteria.map((criterion, index) => (
                  <li key={index} className="criterion-item">
                    <i className="fas fa-check-circle"></i>
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileViewPage;
