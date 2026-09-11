import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, User, AlertTriangle } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) { setError('Please fill in all fields.'); return; }
    if (isSignUp && !formData.name) { setError('Please enter your name.'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/'); }, 1500);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/'); }, 1500);
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb login-orb-1"></div>
        <div className="login-orb login-orb-2"></div>
        <div className="login-orb login-orb-3"></div>
      </div>

      <div className="login-container">
        <div className="login-branding">
          <div className="branding-content">
            <div className="branding-logo">
              <Shield size={40} />
              <span>Crimenova</span>
            </div>
            <h2>Making Cities <span className="gradient-text">Safer</span> with AI</h2>
            <p>Access real-time crime maps, predictive analytics, and emergency SOS — all designed to keep you and your community safe.</p>
            <div className="branding-features">
              <div className="branding-feature"><div className="bf-dot" style={{ background: '#6366f1' }}></div><span>Interactive Crime Heatmaps</span></div>
              <div className="branding-feature"><div className="bf-dot" style={{ background: '#8b5cf6' }}></div><span>AI-Powered Predictions</span></div>
              <div className="branding-feature"><div className="bf-dot" style={{ background: '#ef4444' }}></div><span>Emergency SOS with GPS</span></div>
            </div>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-form-wrap">
            <div className="form-header">
              <h1>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
              <p>{isSignUp ? 'Sign up to get started with Crimenova' : 'Sign in to your Crimenova account'}</p>
            </div>

            <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="login-divider"><span>or</span></div>

            <form onSubmit={handleSubmit} className="login-form">
              {isSignUp && (
                <div className="form-group animate-fade-in">
                  <label htmlFor="name"><User size={14} /> Full Name</label>
                  <input type="text" id="name" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="email"><Mail size={14} /> Email Address</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="password"><Lock size={14} /> Password</label>
                <div className="password-input">
                  <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {!isSignUp && (
                <div className="form-options">
                  <label className="remember-me"><input type="checkbox" /><span>Remember me</span></label>
                  <a href="#" className="forgot-link">Forgot password?</a>
                </div>
              )}
              {error && (<div className="form-error animate-fade-in"><AlertTriangle size={14} />{error}</div>)}
              <button type="submit" className="btn-primary submit-btn" disabled={loading}>
                {loading ? <span className="btn-loader"></span> : <>{isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={18} /></>}
              </button>
            </form>

            <p className="toggle-text">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button className="toggle-btn" onClick={() => { setIsSignUp(!isSignUp); setError(''); }}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
