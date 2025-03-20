import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const ConnectionContext = createContext();

const connectionReducer = (state, action) => {
  switch (action.type) {
    case 'GET_PENDING_CONNECTIONS':
      return {
        ...state,
        pendingConnections: action.payload,
        loading: false
      };
    case 'GET_ACCEPTED_CONNECTIONS':
      return {
        ...state,
        acceptedConnections: action.payload,
        loading: false
      };
    case 'GET_SENT_CONNECTIONS':
      return {
        ...state,
        sentConnections: action.payload,
        loading: false
      };
    case 'ACCEPT_CONNECTION':
      return {
        ...state,
        pendingConnections: state.pendingConnections.filter(
          conn => conn._id !== action.payload._id
        ),
        acceptedConnections: [...state.acceptedConnections, action.payload],
        loading: false
      };
    case 'DECLINE_CONNECTION':
      return {
        ...state,
        pendingConnections: state.pendingConnections.filter(
          conn => conn._id !== action.payload._id
        ),
        loading: false
      };
    case 'CONNECTION_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

const ConnectionProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  
  const initialState = {
    pendingConnections: [],
    acceptedConnections: [],
    sentConnections: [],
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(connectionReducer, initialState);

  // Set config with token
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  };

  // Get pending connection requests (for startups)
  const getPendingConnections = async () => {
    setLoading();
    try {
      const res = await axios.get('/api/connections/pending', config);
      dispatch({ type: 'GET_PENDING_CONNECTIONS', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'CONNECTION_ERROR',
        payload: err.response?.data?.msg || 'Failed to fetch pending connections'
      });
    }
  };

  // Get accepted connections
  const getAcceptedConnections = async () => {
    setLoading();
    try {
      const res = await axios.get('/api/connections/accepted', config);
      dispatch({ type: 'GET_ACCEPTED_CONNECTIONS', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'CONNECTION_ERROR',
        payload: err.response?.data?.msg || 'Failed to fetch accepted connections'
      });
    }
  };

  // Get sent connection requests (for investors)
  const getSentConnections = async () => {
    setLoading();
    try {
      const res = await axios.get('/api/connections/sent', config);
      dispatch({ type: 'GET_SENT_CONNECTIONS', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'CONNECTION_ERROR',
        payload: err.response?.data?.msg || 'Failed to fetch sent connections'
      });
    }
  };

  // Send a connection request (for investors)
  const sendConnectionRequest = async (startupId, message) => {
    setLoading();
    try {
      await axios.post(
        '/api/connections',
        { startupId, message },
        config
      );
      return true;
    } catch (err) {
      dispatch({
        type: 'CONNECTION_ERROR',
        payload: err.response?.data?.msg || 'Failed to send connection request'
      });
      return false;
    }
  };

  // Accept a connection request (for startups)
  const acceptConnection = async (connectionId) => {
    setLoading();
    try {
      const res = await axios.put(
        `/api/connections/${connectionId}/accept`,
        {},
        config
      );
      dispatch({ type: 'ACCEPT_CONNECTION', payload: res.data });
      return true;
    } catch (err) {
      dispatch({
        type: 'CONNECTION_ERROR',
        payload: err.response?.data?.msg || 'Failed to accept connection'
      });
      return false;
    }
  };

  // Decline a connection request (for startups)
  const declineConnection = async (connectionId) => {
    setLoading();
    try {
      const res = await axios.put(
        `/api/connections/${connectionId}/decline`,
        {},
        config
      );
      dispatch({ type: 'DECLINE_CONNECTION', payload: res.data });
      return true;
    } catch (err) {
      dispatch({
        type: 'CONNECTION_ERROR',
        payload: err.response?.data?.msg || 'Failed to decline connection'
      });
      return false;
    }
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Set loading
  const setLoading = () => {
    dispatch({ type: 'SET_LOADING' });
  };

  return (
    <ConnectionContext.Provider
      value={{
        pendingConnections: state.pendingConnections,
        acceptedConnections: state.acceptedConnections,
        sentConnections: state.sentConnections,
        loading: state.loading,
        error: state.error,
        getPendingConnections,
        getAcceptedConnections,
        getSentConnections,
        sendConnectionRequest,
        acceptConnection,
        declineConnection,
        clearError
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export { ConnectionContext, ConnectionProvider };
