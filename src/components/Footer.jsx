import { Shield, Github, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer glass">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <Shield size={20} />
            <span>Crimenova</span>
          </div>
          <p className="footer-tagline">See crime. Predict crime. Stay safe.</p>
        </div>

        <div className="footer-links">
          <Link to="/map">Crime Map</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/prediction">Prediction</Link>
          <Link to="/sos">Emergency SOS</Link>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Crimenova — Minor Project | Built with <Heart size={14} className="heart-icon" /> for public safety
          </p>
        </div>
      </div>
    </footer>
  );
}
