import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Map, BarChart3, BrainCircuit, AlertTriangle, Settings, Menu, X } from 'lucide-react';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home', icon: Shield },
  { path: '/map', label: 'Crime Map', icon: Map },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/prediction', label: 'Prediction', icon: BrainCircuit },
  { path: '/sos', label: 'SOS', icon: AlertTriangle },
  { path: '/admin', label: 'Admin', icon: Settings },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="navbar glass">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Shield size={24} />
          </div>
          <span className="brand-text">Crimenova</span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''} ${path === '/sos' ? 'nav-sos' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
