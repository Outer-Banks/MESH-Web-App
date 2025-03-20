import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './PortfolioPage.css';

// Dummy data for portfolio investments
const dummyPortfolio = [
  {
    id: 101,
    startupName: 'TechInnovate',
    industry: 'Technology',
    investmentAmount: 200000,
    investmentDate: '2025-01-15',
    equity: 5.2,
    valuation: 3800000,
    status: 'active'
  },
  {
    id: 102,
    startupName: 'GreenEnergy Solutions',
    industry: 'Cleantech',
    investmentAmount: 350000,
    investmentDate: '2024-11-20',
    equity: 7.5,
    valuation: 4700000,
    status: 'active'
  },
  {
    id: 103,
    startupName: 'FinTech Solutions',
    industry: 'Fintech',
    investmentAmount: 150000,
    investmentDate: '2024-09-05',
    equity: 3.8,
    valuation: 3950000,
    status: 'active'
  }
];

const PortfolioPage = () => {
  const { user } = useContext(AuthContext);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalStartups: 0,
    averageEquity: 0
  });
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState({
    type: '',
    investmentId: null,
    startupName: ''
  });

  useEffect(() => {
    // In a real app, you would fetch portfolio data from an API
    // For now, we'll use the dummy data
    setTimeout(() => {
      setPortfolio(dummyPortfolio);
      
      // Calculate portfolio stats
      const totalInvested = dummyPortfolio.reduce((sum, item) => sum + item.investmentAmount, 0);
      const totalStartups = dummyPortfolio.length;
      const totalEquity = dummyPortfolio.reduce((sum, item) => sum + item.equity, 0);
      const averageEquity = totalStartups > 0 ? totalEquity / totalStartups : 0;
      
      setStats({
        totalInvested,
        totalStartups,
        averageEquity
      });
      
      setLoading(false);
    }, 1000);
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle action button clicks
  const handleAction = (action, investment) => {
    // For view details, just show a toast notification without confirmation
    if (action === 'details') {
      toast.info(`Viewing details for ${investment.startupName}`);
      return;
    }
    
    // For other actions, show confirmation modal
    setModalAction({
      type: action,
      investmentId: investment.id,
      startupName: investment.startupName
    });
    setShowModal(true);
  };

  // Handle confirmation
  const handleConfirm = () => {
    // In a real app, you would make API calls here
    const { type, investmentId, startupName } = modalAction;
    
    // Simulate action
    setTimeout(() => {
      let message = '';
      
      switch(type) {
        case 'view':
          message = `Viewing metrics for ${startupName}`;
          break;
        case 'exit':
          message = `Exit request initiated for ${startupName}`;
          // Here you would update the portfolio state
          break;
        default:
          break;
      }
      
      toast.success(message);
      setShowModal(false);
    }, 500);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Get action text for modal
  const getActionText = () => {
    const { type, startupName } = modalAction;
    
    switch(type) {
      case 'view':
        return `view metrics for ${startupName}`;
      case 'exit':
        return `initiate exit process for your investment in ${startupName}`;
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading portfolio...</div>;
  }

  return (
    <div className="portfolio-page">
      <div className="card">
        <h1 className="large text-primary">Investment Portfolio</h1>
        <p className="lead">
          <i className="fas fa-briefcase"></i> Manage your startup investments
        </p>

        <div className="portfolio-stats">
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(stats.totalInvested)}</div>
            <div className="stat-label">Total Invested</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalStartups}</div>
            <div className="stat-label">Portfolio Companies</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.averageEquity.toFixed(1)}%</div>
            <div className="stat-label">Average Equity</div>
          </div>
        </div>

        <div className="portfolio-table-container">
          <h3>Your Investments</h3>
          <table className="portfolio-table">
            <thead>
              <tr>
                <th>Startup</th>
                <th>Industry</th>
                <th>Investment</th>
                <th>Date</th>
                <th>Equity</th>
                <th>Valuation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map(investment => (
                <tr key={investment.id}>
                  <td>{investment.startupName}</td>
                  <td>{investment.industry}</td>
                  <td>{formatCurrency(investment.investmentAmount)}</td>
                  <td>{formatDate(investment.investmentDate)}</td>
                  <td>{investment.equity}%</td>
                  <td>{formatCurrency(investment.valuation)}</td>
                  <td className="action-buttons">
                    <button 
                      className="btn btn-sm btn-primary action-button"
                      data-tooltip="View Metrics"
                      onClick={() => handleAction('view', investment)}
                    >
                      <i className="fas fa-chart-line"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-dark action-button"
                      data-tooltip="View Details"
                      onClick={() => handleAction('details', investment)}
                    >
                      <i className="fas fa-info-circle"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-danger action-button"
                      data-tooltip="Exit Investment"
                      onClick={() => handleAction('exit', investment)}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirm Action</h2>
              <button className="close-button" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to {getActionText()}?</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-dark" 
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button 
                className={`btn ${modalAction.type === 'exit' ? 'btn-danger' : 'btn-primary'}`}
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
