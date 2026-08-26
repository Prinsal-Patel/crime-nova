import { useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { BarChart3, TrendingUp, PieChart, MapPin, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { monthlyTrends, crimeDistribution, areaStats } from '../data/crimeData';
import './DashboardPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } } },
    tooltip: {
      backgroundColor: '#1a1f35',
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(148,163,184,0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
    }
  },
  scales: {
    x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148,163,184,0.05)' } },
    y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148,163,184,0.05)' } },
  }
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right', labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, padding: 16, usePointStyle: true } },
    tooltip: {
      backgroundColor: '#1a1f35',
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(148,163,184,0.1)',
      borderWidth: 1,
      cornerRadius: 8,
    }
  },
};

export default function DashboardPage() {
  const [selectedYear] = useState('2025');

  const totalCrimes = crimeDistribution.reduce((sum, c) => sum + c.count, 0);

  // Bar chart data
  const barData = {
    labels: crimeDistribution.map(c => c.type),
    datasets: [{
      label: 'Total Cases',
      data: crimeDistribution.map(c => c.count),
      backgroundColor: crimeDistribution.map(c => c.color + '80'),
      borderColor: crimeDistribution.map(c => c.color),
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  // Pie chart data
  const pieData = {
    labels: crimeDistribution.map(c => c.type),
    datasets: [{
      data: crimeDistribution.map(c => c.count),
      backgroundColor: crimeDistribution.map(c => c.color + '99'),
      borderColor: crimeDistribution.map(c => c.color),
      borderWidth: 2,
      hoverOffset: 10,
    }]
  };

  // Line chart data
  const lineData = {
    labels: monthlyTrends.map(m => m.month),
    datasets: [
      {
        label: 'Theft', data: monthlyTrends.map(m => m.theft),
        borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)',
        fill: true, tension: 0.4, pointRadius: 4,
      },
      {
        label: 'Robbery', data: monthlyTrends.map(m => m.robbery),
        borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.05)',
        fill: true, tension: 0.4, pointRadius: 4,
      },
      {
        label: 'Assault', data: monthlyTrends.map(m => m.assault),
        borderColor: '#eab308', backgroundColor: 'rgba(234,179,8,0.05)',
        fill: true, tension: 0.4, pointRadius: 4,
      },
      {
        label: 'Cybercrime', data: monthlyTrends.map(m => m.cybercrime),
        borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.05)',
        fill: true, tension: 0.4, pointRadius: 4,
      },
    ]
  };

  const statCards = [
    { label: 'Total Crimes', value: totalCrimes.toLocaleString(), icon: BarChart3, change: '+12%', up: true, color: '#6366f1' },
    { label: 'High Risk Zones', value: '8', icon: MapPin, change: '+2', up: true, color: '#ef4444' },
    { label: 'Most Common', value: 'Theft', icon: TrendingUp, change: '46.3%', up: true, color: '#f59e0b' },
    { label: 'Cities Tracked', value: '9', icon: PieChart, change: '+3', up: true, color: '#22c55e' },
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="page-header">
          <h1><span className="gradient-text">Analytics</span> Dashboard</h1>
          <p>Comprehensive crime statistics and trends for {selectedYear}</p>
        </div>

        {/* Stat Cards */}
        <div className="dash-stats-grid">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`dash-stat-card card animate-fade-in-up animate-delay-${i + 1}`}>
                <div className="dash-stat-icon" style={{ background: `${s.color}20` }}>
                  <Icon size={22} style={{ color: s.color }} />
                </div>
                <div className="dash-stat-content">
                  <span className="dash-stat-label">{s.label}</span>
                  <span className="dash-stat-value">{s.value}</span>
                </div>
                <div className={`dash-stat-change ${s.up ? 'up' : 'down'}`}>
                  {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {s.change}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          <div className="chart-card card animate-fade-in-up animate-delay-2">
            <h3 className="section-title"><BarChart3 size={20} /> Crime by Category</h3>
            <div className="chart-container">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card card animate-fade-in-up animate-delay-3">
            <h3 className="section-title"><PieChart size={20} /> Crime Distribution</h3>
            <div className="chart-container">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* Line chart full width */}
        <div className="chart-card card full-width animate-fade-in-up animate-delay-4">
          <h3 className="section-title"><TrendingUp size={20} /> Crime Trends ({selectedYear})</h3>
          <div className="chart-container chart-container-lg">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        {/* Area-wise table */}
        <div className="chart-card card full-width animate-fade-in-up animate-delay-5">
          <h3 className="section-title"><MapPin size={20} /> Area-wise Crime Statistics</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Total Crimes</th>
                  <th>High Risk</th>
                  <th>Medium Risk</th>
                  <th>Low Risk</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {areaStats.map((area, i) => {
                  const level = area.total > 150 ? 'high' : area.total > 50 ? 'medium' : 'low';
                  return (
                    <tr key={i}>
                      <td className="area-name">{area.area}</td>
                      <td>{area.total}</td>
                      <td>{area.high}</td>
                      <td>{area.medium}</td>
                      <td>{area.low}</td>
                      <td><span className={`badge badge-${level}`}>{level}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
