import { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { BrainCircuit, AlertTriangle, TrendingUp, Clock, Calendar, MapPin, ArrowUpRight, ArrowDownRight, Minus, Search } from 'lucide-react';
import { predictionData, crimeLocations } from '../data/crimeData';
import './PredictionPage.css';

const areas = [...new Set(crimeLocations.map(c => c.area.split(', ').pop()))];

export default function PredictionPage() {
  const [selectedArea, setSelectedArea] = useState('All Cities');
  const [timeframe, setTimeframe] = useState('Next Month');
  const [showResults, setShowResults] = useState(true);

  const hotspots = selectedArea === 'All Cities'
    ? predictionData.hotspots
    : predictionData.hotspots.filter(h => h.area.includes(selectedArea));

  const peakHoursData = {
    labels: predictionData.peakHours.map(h => h.hour),
    datasets: [{
      label: 'Crime Risk Level',
      data: predictionData.peakHours.map(h => h.risk),
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#8b5cf6',
    }]
  };

  const weeklyData = {
    labels: predictionData.weeklyPattern.map(d => d.day),
    datasets: [{
      label: 'Risk Score',
      data: predictionData.weeklyPattern.map(d => d.risk),
      backgroundColor: predictionData.weeklyPattern.map(d =>
        d.risk > 60 ? 'rgba(239,68,68,0.7)' : d.risk > 40 ? 'rgba(245,158,11,0.7)' : 'rgba(34,197,94,0.7)'
      ),
      borderColor: predictionData.weeklyPattern.map(d =>
        d.risk > 60 ? '#ef4444' : d.risk > 40 ? '#f59e0b' : '#22c55e'
      ),
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } },
      tooltip: { backgroundColor: '#1a1f35', titleColor: '#f1f5f9', bodyColor: '#94a3b8', borderColor: 'rgba(148,163,184,0.1)', borderWidth: 1, cornerRadius: 8, padding: 12 }
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148,163,184,0.05)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148,163,184,0.05)' }, max: 100 },
    }
  };

  const trendIcon = (trend) => {
    if (trend === 'increasing') return <ArrowUpRight size={14} className="trend-up" />;
    if (trend === 'decreasing') return <ArrowDownRight size={14} className="trend-down" />;
    return <Minus size={14} className="trend-stable" />;
  };

  return (
    <div className="prediction-page">
      <div className="container">
        <div className="page-header">
          <h1><span className="gradient-text">AI Crime</span> Prediction</h1>
          <p>Machine learning powered forecasting of crime hotspots and patterns</p>
        </div>

        {/* Prediction Controls */}
        <div className="prediction-controls card animate-fade-in-up">
          <div className="control-group">
            <label><MapPin size={14} /> Select Region</label>
            <select value={selectedArea} onChange={e => setSelectedArea(e.target.value)}>
              <option>All Cities</option>
              {areas.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label><Calendar size={14} /> Timeframe</label>
            <select value={timeframe} onChange={e => setTimeframe(e.target.value)}>
              <option>Next Week</option>
              <option>Next Month</option>
              <option>Next 3 Months</option>
              <option>Next 6 Months</option>
            </select>
          </div>
          <button className="btn-primary predict-btn" onClick={() => setShowResults(true)}>
            <BrainCircuit size={18} /> Run Prediction
          </button>
        </div>

        {showResults && (
          <>
            {/* Predicted Hotspots */}
            <div className="section-title animate-fade-in-up animate-delay-1">
              <AlertTriangle size={20} /> Predicted Hotspots — {timeframe}
            </div>
            <div className="hotspots-grid">
              {hotspots.map((h, i) => (
                <div key={i} className={`hotspot-card card animate-fade-in-up animate-delay-${Math.min(i + 1, 6)}`}>
                  <div className="hotspot-header">
                    <span className="hotspot-area">{h.area}</span>
                    {trendIcon(h.trend)}
                  </div>
                  <div className="risk-score-wrap">
                    <div className="risk-score-bar">
                      <div
                        className="risk-score-fill"
                        style={{
                          width: `${h.riskScore}%`,
                          background: h.riskScore > 80 ? 'var(--crime-high)' : h.riskScore > 60 ? 'var(--crime-medium)' : 'var(--crime-low)'
                        }}
                      ></div>
                    </div>
                    <span className="risk-score-value" style={{
                      color: h.riskScore > 80 ? 'var(--crime-high)' : h.riskScore > 60 ? 'var(--crime-medium)' : 'var(--crime-low)'
                    }}>
                      {h.riskScore}%
                    </span>
                  </div>
                  <div className="hotspot-meta">
                    <span>Predicted: <strong>{h.predictedCrimes} crimes</strong></span>
                    <span>Type: <strong>{h.dominantType}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="prediction-charts">
              <div className="chart-card card animate-fade-in-up animate-delay-3">
                <h3 className="section-title"><Clock size={20} /> Peak Crime Hours</h3>
                <div className="chart-container">
                  <Line data={peakHoursData} options={chartOptions} />
                </div>
              </div>
              <div className="chart-card card animate-fade-in-up animate-delay-4">
                <h3 className="section-title"><Calendar size={20} /> Weekly Risk Pattern</h3>
                <div className="chart-container">
                  <Bar data={weeklyData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Insight */}
            <div className="insight-card card animate-fade-in-up animate-delay-5">
              <div className="insight-icon">
                <BrainCircuit size={28} />
              </div>
              <div className="insight-content">
                <h3>AI Insight</h3>
                <p>
                  Based on analysis of historical data, <strong>weekends (Saturday & Sunday)</strong> show
                  significantly higher crime risk, with peak hours between <strong>10 PM - 2 AM</strong>.
                  Theft remains the dominant crime type across all regions, with an upward trend in
                  cybercrime in metro cities like Bangalore and Pune. Resource allocation should
                  prioritize these times and locations.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
