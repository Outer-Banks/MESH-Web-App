import { createContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'AUTH_ERROR':
    case 'REGISTER_FAIL':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token header
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  // Load user
  const loadUser = useCallback(async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/auth/me');
      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.msg || 'Server Error'
      });
    }
  }, []);

  // Register user
  const registerUser = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });
      
      // Set token in axios headers immediately
      setAuthToken(res.data.token);
      
      // Then load user
      await loadUser();
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.msg || 'Server Error'
      });
    }
  };

  // Login user
  const loginUser = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login', formData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
      
      // Set token in axios headers immediately
      setAuthToken(res.data.token);
      
      // Then load user
      await loadUser();
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.msg || 'Server Error'
      });
    }
  };

  // Logout
  const logout = () => {
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  useEffect(() => {
    // Set initial token if it exists in localStorage
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      loadUser();
    } else {
      dispatch({
        type: 'AUTH_ERROR'
      });
    }
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        user: state.user,
        error: state.error,
        registerUser,
        loginUser,
        logout,
        clearError,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
