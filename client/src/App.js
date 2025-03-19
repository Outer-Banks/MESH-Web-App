import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ForYouPage from './pages/ForYouPage';
import BrowseStartupsPage from './pages/BrowseStartupsPage';
import ChatPage from './pages/ChatPage';
import ProfileViewPage from './pages/ProfileViewPage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';

// CSS imports
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/startup/profile"
                element={
                  <PrivateRoute allowedRoles={['startup']}>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/for-you"
                element={
                  <PrivateRoute>
                    <ForYouPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/browse/startups"
                element={
                  <PrivateRoute allowedRoles={['investor']}>
                    <BrowseStartupsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <ChatPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat/:id"
                element={
                  <PrivateRoute>
                    <ChatPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile/:role/:id"
                element={
                  <PrivateRoute>
                    <ProfileViewPage />
                  </PrivateRoute>
                }
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
          <Footer />
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
