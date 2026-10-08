import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';
import './ProtectedRoute.css';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { currentUser, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-card">
          <Loader2 className="spin" size={36} color="var(--accent-primary, #6366f1)" />
          <p className="auth-loading-title">Verifying session...</p>
          <span className="auth-loading-subtitle">Validating secure credentials</span>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login page while preserving target path
  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Please sign in to access this feature.',
        }}
        replace
      />
    );
  }

  // If admin privileges are required and user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="access-denied-container container">
        <div className="card access-denied-card">
          <div className="access-denied-icon">
            <ShieldAlert size={48} color="var(--sos-red, #ef4444)" />
          </div>
          <h2>Admin Authorization Required</h2>
          <p>
            You are currently signed in as <strong>{currentUser.email}</strong>, which does not have administrator privileges for this panel.
          </p>
          <div className="access-denied-actions">
            <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft size={16} /> Return to Home
            </Link>
            <Link to="/dashboard" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <LayoutDashboard size={16} /> Open Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
