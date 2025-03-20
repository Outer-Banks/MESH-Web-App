import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ConnectionContext } from '../context/ConnectionContext';
import { InvestmentProposalContext } from '../context/InvestmentProposalContext';
import { toast } from 'react-toastify';
import './ProposalsPage.css';

const ProposalsPage = () => {
  const { user } = useContext(AuthContext);
  const { acceptedConnections, getAcceptedConnections } = useContext(ConnectionContext);
  const {
    sentProposals,
    receivedProposals,
    loading,
    error,
    getSentProposals,
    getReceivedProposals,
    createProposal,
    acceptProposal,
    declineProposal,
    clearError
  } = useContext(InvestmentProposalContext);

  const [activeTab, setActiveTab] = useState(user?.role === 'startup' ? 'received' : 'sent');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  const [equityPercentage, setEquityPercentage] = useState('');
  const [additionalConditions, setAdditionalConditions] = useState('');

  useEffect(() => {
    if (user) {
      if (user.role === 'startup') {
        getReceivedProposals();
      } else if (user.role === 'investor') {
        getSentProposals();
        getAcceptedConnections();
      }
    }
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
    // eslint-disable-next-line
  }, [error]);

  const handleCreateProposal = async (e) => {
    e.preventDefault();

    if (!selectedStartup) {
      return toast.error('Please select a startup');
    }

    if (!fundingAmount || isNaN(fundingAmount) || fundingAmount <= 0) {
      return toast.error('Please enter a valid funding amount');
    }

    if (!equityPercentage || isNaN(equityPercentage) || equityPercentage < 0 || equityPercentage > 100) {
      return toast.error('Please enter a valid equity percentage (0-100)');
    }

    const proposalData = {
      startupId: selectedStartup,
      fundingAmount: parseFloat(fundingAmount),
      equityPercentage: parseFloat(equityPercentage),
      additionalConditions
    };

    const result = await createProposal(proposalData);
    if (result) {
      toast.success('Investment proposal sent successfully');
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleAccept = async (proposalId) => {
    const result = await acceptProposal(proposalId);
    if (result) {
      toast.success('Investment proposal accepted');
    }
  };

  const handleDecline = async (proposalId) => {
    const result = await declineProposal(proposalId);
    if (result) {
      toast.success('Investment proposal declined');
    }
  };

  const resetForm = () => {
    setSelectedStartup('');
    setFundingAmount('');
    setEquityPercentage('');
    setAdditionalConditions('');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Render for startup users
  const renderStartupView = () => {
    return (
      <div className="proposals-page">
        <h1>Investment Proposals</h1>
        <p className="lead">
          <i className="fas fa-file-contract"></i> Review and manage investment proposals from investors
        </p>

        <div className="tabs">
          <button
            className={activeTab === 'received' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('received')}
          >
            Received Proposals
            {receivedProposals.filter(p => p.status === 'pending').length > 0 && (
              <span className="badge">{receivedProposals.filter(p => p.status === 'pending').length}</span>
            )}
          </button>
          <button
            className={activeTab === 'history' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('history')}
          >
            Proposal History
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'received' && (
            <div className="received-proposals">
              <h2>Pending Investment Proposals</h2>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : receivedProposals.filter(p => p.status === 'pending').length === 0 ? (
                <div className="no-proposals">
                  <p>No pending investment proposals</p>
                </div>
              ) : (
                <div className="proposal-list">
                  {receivedProposals
                    .filter(proposal => proposal.status === 'pending')
                    .map((proposal) => (
                      <div key={proposal._id} className="proposal-card">
                        <div className="proposal-header">
                          <div className="investor-avatar">
                            <img
                              src={proposal.investor.avatar || '/default-investor.jpg'}
                              alt={proposal.investor.name}
                            />
                          </div>
                          <div className="investor-info">
                            <h3>{proposal.investor.name}</h3>
                            <p className="investor-meta">
                              <span className="location">
                                <i className="fas fa-map-marker-alt"></i> {proposal.investor.location || 'Location not specified'}
                              </span>
                              <span className="focus">
                                <i className="fas fa-bullseye"></i> {proposal.investor.focus || 'Focus not specified'}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="proposal-details">
                          <div className="proposal-terms">
                            <div className="term">
                              <span className="term-label">Funding Amount:</span>
                              <span className="term-value">{formatCurrency(proposal.fundingAmount)}</span>
                            </div>
                            <div className="term">
                              <span className="term-label">Equity Offered:</span>
                              <span className="term-value">{proposal.equityPercentage}%</span>
                            </div>
                            <div className="term">
                              <span className="term-label">Valuation:</span>
                              <span className="term-value">
                                {formatCurrency((proposal.fundingAmount / proposal.equityPercentage) * 100)}
                              </span>
                            </div>
                          </div>
                          {proposal.additionalConditions && (
                            <div className="additional-conditions">
                              <h4>Additional Conditions:</h4>
                              <p>{proposal.additionalConditions}</p>
                            </div>
                          )}
                          <p className="proposal-date">
                            <i className="far fa-calendar-alt"></i> Received on {formatDate(proposal.createdAt)}
                          </p>
                        </div>
                        <div className="proposal-actions">
                          <button
                            className="btn btn-success"
                            onClick={() => handleAccept(proposal._id)}
                          >
                            <i className="fas fa-check"></i> Accept
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDecline(proposal._id)}
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

          {activeTab === 'history' && (
            <div className="proposal-history">
              <h2>Proposal History</h2>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : receivedProposals.filter(p => p.status !== 'pending').length === 0 ? (
                <div className="no-proposals">
                  <p>No proposal history</p>
                </div>
              ) : (
                <div className="proposal-list">
                  {receivedProposals
                    .filter(proposal => proposal.status !== 'pending')
                    .map((proposal) => (
                      <div key={proposal._id} className={`proposal-card status-${proposal.status}`}>
                        <div className="proposal-header">
                          <div className="investor-avatar">
                            <img
                              src={proposal.investor.avatar || '/default-investor.jpg'}
                              alt={proposal.investor.name}
                            />
                          </div>
                          <div className="investor-info">
                            <h3>{proposal.investor.name}</h3>
                            <p className="investor-meta">
                              <span className="location">
                                <i className="fas fa-map-marker-alt"></i> {proposal.investor.location || 'Location not specified'}
                              </span>
                              <span className="focus">
                                <i className="fas fa-bullseye"></i> {proposal.investor.focus || 'Focus not specified'}
                              </span>
                            </p>
                          </div>
                          <div className="proposal-status">
                            <span className={`status-badge ${proposal.status}`}>
                              {proposal.status === 'accepted' ? 'Accepted' : 'Declined'}
                            </span>
                          </div>
                        </div>
                        <div className="proposal-details">
                          <div className="proposal-terms">
                            <div className="term">
                              <span className="term-label">Funding Amount:</span>
                              <span className="term-value">{formatCurrency(proposal.fundingAmount)}</span>
                            </div>
                            <div className="term">
                              <span className="term-label">Equity Offered:</span>
                              <span className="term-value">{proposal.equityPercentage}%</span>
                            </div>
                            <div className="term">
                              <span className="term-label">Valuation:</span>
                              <span className="term-value">
                                {formatCurrency((proposal.fundingAmount / proposal.equityPercentage) * 100)}
                              </span>
                            </div>
                          </div>
                          {proposal.additionalConditions && (
                            <div className="additional-conditions">
                              <h4>Additional Conditions:</h4>
                              <p>{proposal.additionalConditions}</p>
                            </div>
                          )}
                          <p className="proposal-date">
                            <i className="far fa-calendar-alt"></i> Received on {formatDate(proposal.createdAt)}
                          </p>
                          <p className="proposal-date">
                            <i className="far fa-calendar-check"></i> {proposal.status === 'accepted' ? 'Accepted' : 'Declined'} on {formatDate(proposal.updatedAt)}
                          </p>
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
      <div className="proposals-page">
        <h1>Investment Proposals</h1>
        <p className="lead">
          <i className="fas fa-file-contract"></i> Create and manage your investment proposals
        </p>

        <div className="action-bar">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="fas fa-plus"></i> New Proposal
          </button>
        </div>

        <div className="tabs">
          <button
            className={activeTab === 'sent' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('sent')}
          >
            Sent Proposals
          </button>
          <button
            className={activeTab === 'accepted' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('accepted')}
          >
            Accepted Proposals
          </button>
          <button
            className={activeTab === 'declined' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('declined')}
          >
            Declined Proposals
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'sent' && (
            <div className="sent-proposals">
              <h2>Pending Proposals</h2>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : sentProposals.filter(p => p.status === 'pending').length === 0 ? (
                <div className="no-proposals">
                  <p>No pending proposals</p>
                </div>
              ) : (
                <div className="proposal-list">
                  {sentProposals
                    .filter(proposal => proposal.status === 'pending')
                    .map((proposal) => (
                      <div key={proposal._id} className="proposal-card">
                        <div className="proposal-header">
                          <div className="startup-avatar">
                            <img
                              src={proposal.startup.avatar || '/default-startup.jpg'}
                              alt={proposal.startup.name}
                            />
                          </div>
                          <div className="startup-info">
                            <h3>{proposal.startup.name}</h3>
                            <p className="startup-meta">
                              <span className="location">
                                <i className="fas fa-map-marker-alt"></i> {proposal.startup.location || 'Location not specified'}
                              </span>
                              <span className="industry">
                                <i className="fas fa-industry"></i> {proposal.startup.industry || 'Industry not specified'}
                              </span>
                            </p>
                          </div>
                          <div className="proposal-status">
                            <span className="status-badge pending">Pending</span>
                          </div>
                        </div>
                        <div className="proposal-details">
                          <div className="proposal-terms">
                            <div className="term">
                              <span className="term-label">Funding Amount:</span>
                              <span className="term-value">{formatCurrency(proposal.fundingAmount)}</span>
                            </div>
                            <div className="term">
                              <span className="term-label">Equity Offered:</span>
                              <span className="term-value">{proposal.equityPercentage}%</span>
                            </div>
                            <div className="term">
                              <span className="term-label">Valuation:</span>
                              <span className="term-value">
                                {formatCurrency((proposal.fundingAmount / proposal.equityPercentage) * 100)}
                              </span>
                            </div>
                          </div>
                          {proposal.additionalConditions && (
                            <div className="additional-conditions">
                              <h4>Additional Conditions:</h4>
                              <p>{proposal.additionalConditions}</p>
                            </div>
                          )}
                          <p className="proposal-date">
                            <i className="far fa-calendar-alt"></i> Sent on {formatDate(proposal.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'accepted' && (
            <div className="accepted-proposals">
              <h2>Accepted Proposals</h2>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : sentProposals.filter(p => p.status === 'accepted').length === 0 ? (
                <div className="no-proposals">
                  <p>No accepted proposals</p>
                </div>
              ) : (
                <div className="proposal-list">
                  {sentProposals
                    .filter(proposal => proposal.status === 'accepted')
                    .map((proposal) => (
                      <div key={proposal._id} className="proposal-card status-accepted">
                        <div className="proposal-header">
                          <div className="startup-avatar">
                            <img
                              src={proposal.startup.avatar || '/default-startup.jpg'}
                              alt={proposal.startup.name}
                            />
                          </div>
                          <div className="startup-info">
                            <h3>{proposal.startup.name}</h3>
                            <p className="startup-meta">
                              <span className="location">
                                <i className="fas fa-map-marker-alt"></i> {proposal.startup.location || 'Location not specified'}
                              </span>
                              <span className="industry">
                                <i className="fas fa-industry"></i> {proposal.startup.industry || 'Industry not specified'}
                              </span>
                            </p>
                          </div>
                          <div className="proposal-status">
                            <span className="status-badge accepted">Accepted</span>
                          </div>
                        </div>
                        <div className="proposal-details">
                          <div className="proposal-terms">
                            <div className="term">
                              <span className="term-label">Funding Amount:</span>
                              <span className="term-value">{formatCurrency(proposal.fundingAmount)}</span>
                            </div>
                            <div className="term">
                              <span className="term-label">Equity Offered:</span>
                              <span className="term-value">{proposal.equityPercentage}%</span>
                            </div>
                            <div className="term">
                              <span className="term-label">Valuation:</span>
                              <span className="term-value">
                                {formatCurrency((proposal.fundingAmount / proposal.equityPercentage) * 100)}
                              </span>
                            </div>
                          </div>
                          {proposal.additionalConditions && (
                            <div className="additional-conditions">
                              <h4>Additional Conditions:</h4>
                              <p>{proposal.additionalConditions}</p>
                            </div>
                          )}
                          <p className="proposal-date">
                            <i className="far fa-calendar-alt"></i> Sent on {formatDate(proposal.createdAt)}
                          </p>
                          <p className="proposal-date">
                            <i className="far fa-calendar-check"></i> Accepted on {formatDate(proposal.updatedAt)}
                          </p>
                        </div>
                        <div className="proposal-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() => window.location.href = `/chat/${proposal.startup._id}`}
                          >
                            <i className="fas fa-comments"></i> Message Startup
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'declined' && (
            <div className="declined-proposals">
              <h2>Declined Proposals</h2>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : sentProposals.filter(p => p.status === 'declined').length === 0 ? (
                <div className="no-proposals">
                  <p>No declined proposals</p>
                </div>
              ) : (
                <div className="proposal-list">
                  {sentProposals
                    .filter(proposal => proposal.status === 'declined')
                    .map((proposal) => (
                      <div key={proposal._id} className="proposal-card status-declined">
                        <div className="proposal-header">
                          <div className="startup-avatar">
                            <img
                              src={proposal.startup.avatar || '/default-startup.jpg'}
                              alt={proposal.startup.name}
                            />
                          </div>
                          <div className="startup-info">
                            <h3>{proposal.startup.name}</h3>
                            <p className="startup-meta">
                              <span className="location">
                                <i className="fas fa-map-marker-alt"></i> {proposal.startup.location || 'Location not specified'}
                              </span>
                              <span className="industry">
                                <i className="fas fa-industry"></i> {proposal.startup.industry || 'Industry not specified'}
                              </span>
                            </p>
                          </div>
                          <div className="proposal-status">
                            <span className="status-badge declined">Declined</span>
                          </div>
                        </div>
                        <div className="proposal-details">
                          <div className="proposal-terms">
                            <div className="term">
                              <span className="term-label">Funding Amount:</span>
                              <span className="term-value">{formatCurrency(proposal.fundingAmount)}</span>
                            </div>
                            <div className="term">
                              <span className="term-label">Equity Offered:</span>
                              <span className="term-value">{proposal.equityPercentage}%</span>
                            </div>
                            <div className="term">
                              <span className="term-label">Valuation:</span>
                              <span className="term-value">
                                {formatCurrency((proposal.fundingAmount / proposal.equityPercentage) * 100)}
                              </span>
                            </div>
                          </div>
                          {proposal.additionalConditions && (
                            <div className="additional-conditions">
                              <h4>Additional Conditions:</h4>
                              <p>{proposal.additionalConditions}</p>
                            </div>
                          )}
                          <p className="proposal-date">
                            <i className="far fa-calendar-alt"></i> Sent on {formatDate(proposal.createdAt)}
                          </p>
                          <p className="proposal-date">
                            <i className="far fa-times-circle"></i> Declined on {formatDate(proposal.updatedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create Proposal Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Create Investment Proposal</h2>
                <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCreateProposal}>
                  <div className="form-group">
                    <label htmlFor="startup">Startup</label>
                    <select
                      id="startup"
                      value={selectedStartup}
                      onChange={(e) => setSelectedStartup(e.target.value)}
                      required
                    >
                      <option value="">Select a startup</option>
                      {acceptedConnections.map((connection) => (
                        <option key={connection._id} value={connection.startup._id}>
                          {connection.startup.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="fundingAmount">Funding Amount (USD)</label>
                    <input
                      type="number"
                      id="fundingAmount"
                      value={fundingAmount}
                      onChange={(e) => setFundingAmount(e.target.value)}
                      placeholder="e.g. 500000"
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="equityPercentage">Equity Percentage (%)</label>
                    <input
                      type="number"
                      id="equityPercentage"
                      value={equityPercentage}
                      onChange={(e) => setEquityPercentage(e.target.value)}
                      placeholder="e.g. 10"
                      min="0.01"
                      max="100"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="additionalConditions">Additional Conditions (Optional)</label>
                    <textarea
                      id="additionalConditions"
                      value={additionalConditions}
                      onChange={(e) => setAdditionalConditions(e.target.value)}
                      placeholder="Any additional terms or conditions..."
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Send Proposal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return user?.role === 'startup' ? renderStartupView() : renderInvestorView();
};

export default ProposalsPage;
