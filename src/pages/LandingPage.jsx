import { Link } from 'react-router-dom';
import { Map, BarChart3, BrainCircuit, AlertTriangle, Shield, ArrowRight, MapPin, Eye, TrendingUp, Users } from 'lucide-react';
import './LandingPage.css';

const features = [
  {
    icon: Map,
    title: 'Interactive Crime Map',
    desc: 'View crime hotspots on an interactive heatmap. Identify high, medium, and low risk zones across cities.',
    link: '/map',
    color: '#6366f1'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Deep dive into crime statistics with beautiful bar charts, pie charts, and trend lines.',
    link: '/dashboard',
    color: '#8b5cf6'
  },
  {
    icon: BrainCircuit,
    title: 'AI Crime Prediction',
    desc: 'Machine learning models predict future crime hotspots, peak hours, and risk scores.',
    link: '/prediction',
    color: '#a78bfa'
  },
  {
    icon: AlertTriangle,
    title: 'Emergency SOS',
    desc: 'One-tap SOS alert shares your GPS location with police and ambulance for faster response.',
    link: '/sos',
    color: '#ef4444'
  },
];

const stats = [
  { value: '3,700+', label: 'Crimes Analyzed', icon: Eye },
  { value: '30+', label: 'Locations Tracked', icon: MapPin },
  { value: '92%', label: 'Prediction Accuracy', icon: TrendingUp },
  { value: '< 3 min', label: 'Avg SOS Response', icon: Users },
];

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-badge animate-fade-in-up">
            <Shield size={14} />
            <span>AI-Powered Crime Intelligence Platform</span>
          </div>
          <h1 className="hero-title animate-fade-in-up animate-delay-1">
            See Crime. <span className="gradient-text">Predict Crime.</span><br />
            Stay Safe.
          </h1>
          <p className="hero-desc animate-fade-in-up animate-delay-2">
            Crimenova uses data visualization and machine learning to map crime hotspots,
            predict future threats, and provide emergency SOS with real-time GPS tracking.
          </p>
          <div className="hero-actions animate-fade-in-up animate-delay-3">
            <Link to="/map" className="btn-primary">
              Explore Crime Map <ArrowRight size={18} />
            </Link>
            <Link to="/sos" className="btn-sos" style={{ fontSize: '0.9rem', padding: '12px 28px' }}>
              <AlertTriangle size={18} /> Emergency SOS
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className={`stat-card card animate-fade-in-up animate-delay-${i + 1}`}>
                  <Icon size={28} className="stat-icon" />
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="gradient-text">Powerful Features</h2>
            <p>Everything you need to understand, predict, and respond to crime</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Link to={f.link} key={i} className={`feature-card card animate-fade-in-up animate-delay-${i + 1}`}>
                  <div className="feature-icon-wrap" style={{ background: `${f.color}20` }}>
                    <Icon size={28} style={{ color: f.color }} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <span className="feature-link">
                    Explore <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card card">
            <div className="cta-glow"></div>
            <h2>Ready to Make Your City Safer?</h2>
            <p>Explore real-time crime data, predictive analytics, and emergency services — all in one platform.</p>
            <div className="cta-actions">
              <Link to="/dashboard" className="btn-primary">
                View Dashboard <BarChart3 size={18} />
              </Link>
              <Link to="/prediction" className="btn-outline">
                Try Prediction <BrainCircuit size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
