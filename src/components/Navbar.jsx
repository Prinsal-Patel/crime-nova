import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  Map,
  BarChart3,
  BrainCircuit,
  AlertTriangle,
  Settings,
  Menu,
  X,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home', icon: Shield },
  { path: '/map', label: 'Crime Map', icon: Map },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3, protected: true },
  { path: '/prediction', label: 'Prediction', icon: BrainCircuit, protected: true },
  { path: '/sos', label: 'SOS', icon: AlertTriangle, protected: true },
  { path: '/admin', label: 'Admin', icon: Settings, protected: true, adminOnly: true },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();

  const getLinkClass = (path) => {
    let cls = 'nav-link';
    if (location.pathname === path) cls += ' active';
    if (path === '/sos') cls += ' nav-sos';
    return cls;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMobileOpen(false);
      const protectedPaths = ['/dashboard', '/prediction', '/sos', '/admin'];
      if (protectedPaths.includes(location.pathname)) {
        navigate('/login', {
          state: { message: 'You have been safely signed out.' },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (user) => {
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Filter out admin-only links for non-admin users
  const visibleLinks = navLinks.filter((link) => {
    if (link.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <nav className="navbar glass">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Shield size={24} />
          </div>
          <span className="brand-text">Crimenova</span>
        </Link>

        <div className={'navbar-links' + (mobileOpen ? ' open' : '')}>
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={getLinkClass(link.path)}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {currentUser ? (
            <div className="nav-user-container">
              <div
                className="nav-user-profile"
                title={`${currentUser.email} (${isAdmin ? 'Admin' : 'Citizen'})`}
              >
                <div className="nav-user-avatar">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Avatar" />
                  ) : (
                    <span>{getInitials(currentUser)}</span>
                  )}
                  <span
                    className="session-status-dot"
                    title="Session Active (Inactivity protection enabled)"
                  ></span>
                </div>
                <div className="nav-user-info">
                  <span className="nav-user-name">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                  <span className={`nav-user-badge ${isAdmin ? 'admin' : 'citizen'}`}>
                    {isAdmin ? 'Admin' : 'Citizen'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="nav-logout-btn"
                onClick={handleLogout}
                title="Log Out"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="nav-login-btn"
              onClick={() => setMobileOpen(false)}
            >
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}