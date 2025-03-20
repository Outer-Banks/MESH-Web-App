import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { ConnectionProvider } from './context/ConnectionContext';
import { InvestmentProposalProvider } from './context/InvestmentProposalContext';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ForYouPage from './pages/ForYouPage';
import BrowseStartupsPage from './pages/BrowseStartupsPage';
import ChatPage from './pages/ChatPage';
import ProfileViewPage from './pages/ProfileViewPage';
import ConnectionsPage from './pages/ConnectionsPage';
import ProposalsPage from './pages/ProposalsPage';
import PortfolioPage from './pages/PortfolioPage';
import LandingPage from './pages/LandingPage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';

// CSS imports
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ConnectionProvider>
        <InvestmentProposalProvider>
          <Router>
            <AppContent />
          </Router>
        </InvestmentProposalProvider>
      </ConnectionProvider>
    </AuthProvider>
  );
}

// Separate component to access location
const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  return (
    <div className={`app ${!isLandingPage ? 'app-with-navbar' : ''}`}>
      <Navbar />
      {isLandingPage ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      ) : (
        <div className="container">
          <Routes>
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
            <Route
              path="/connections"
              element={
                <PrivateRoute>
                  <ConnectionsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/proposals"
              element={
                <PrivateRoute>
                  <ProposalsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <PrivateRoute allowedRoles={['investor']}>
                  <PortfolioPage />
                </PrivateRoute>
              }
            />
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      )}
      {!isLandingPage && <Footer />}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;
