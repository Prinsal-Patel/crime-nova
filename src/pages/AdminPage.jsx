import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Settings, AlertTriangle, Upload, Database, MapPin, Clock, Phone, User, CheckCircle2, Loader2, Eye } from 'lucide-react';
import { sosAlerts, crimeLocations } from '../data/crimeData';
import 'leaflet/dist/leaflet.css';
import './AdminPage.css';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('alerts');
  const [alerts, setAlerts] = useState(sosAlerts);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleStatusChange = (id, newStatus) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const handleUpload = () => {
    setUploadStatus('uploading');
    setTimeout(() => setUploadStatus('success'), 2000);
    setTimeout(() => setUploadStatus(''), 4000);
  };

  const tabs = [
    { id: 'alerts', label: 'SOS Alerts', icon: AlertTriangle, count: alerts.filter(a => a.status === 'active').length },
    { id: 'data', label: 'Crime Data', icon: Database },
    { id: 'upload', label: 'Upload Dataset', icon: Upload },
  ];

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1><span className="gradient-text">Admin</span> Panel</h1>
          <p>Manage SOS alerts, crime data, and datasets</p>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                className={`admin-tab ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <Icon size={16} />
                {t.label}
                {t.count > 0 && <span className="tab-count">{t.count}</span>}
              </button>
            );
          })}
        </div>

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="admin-content animate-fade-in">
            <div className="alerts-grid-layout">
              {/* Alerts Table */}
              <div className="card">
                <h3 className="section-title"><AlertTriangle size={20} /> Live SOS Alerts</h3>
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Type</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alerts.map(alert => (
                        <tr key={alert.id}>
                          <td>
                            <div className="alert-person">
                              <User size={14} />
                              {alert.name}
                            </div>
                          </td>
                          <td><Phone size={12} /> {alert.phone}</td>
                          <td>{alert.type === 'Police' ? '🚔' : '🚑'} {alert.type}</td>
                          <td><Clock size={12} /> {alert.time.split(' ')[1]}</td>
                          <td>
                            <span className={`badge badge-${alert.status}`}>
                              {alert.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-btns">
                              {alert.status === 'active' && (
                                <button
                                  className="action-btn respond"
                                  onClick={() => handleStatusChange(alert.id, 'responded')}
                                >
                                  Respond
                                </button>
                              )}
                              {alert.status === 'responded' && (
                                <button
                                  className="action-btn resolve"
                                  onClick={() => handleStatusChange(alert.id, 'resolved')}
                                >
                                  Resolve
                                </button>
                              )}
                              {alert.status === 'resolved' && (
                                <CheckCircle2 size={16} style={{ color: '#22c55e' }} />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Alerts Map */}
              <div className="card">
                <h3 className="section-title"><MapPin size={20} /> Alert Locations</h3>
                <MapContainer
                  center={[22.5, 78.9]}
                  zoom={5}
                  style={{ height: '380px', borderRadius: '12px' }}
                >
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                  {alerts.map(a => (
                    <CircleMarker
                      key={a.id}
                      center={[a.lat, a.lng]}
                      radius={10}
                      fillColor={a.status === 'active' ? '#ef4444' : a.status === 'responded' ? '#f59e0b' : '#22c55e'}
                      fillOpacity={0.8}
                      stroke={true}
                      color={a.status === 'active' ? '#ef4444' : a.status === 'responded' ? '#f59e0b' : '#22c55e'}
                      weight={2}
                    >
                      <Popup>
                        <strong>{a.name}</strong><br />
                        {a.type} — {a.status}
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        )}

        {/* Data Tab */}
        {activeTab === 'data' && (
          <div className="admin-content animate-fade-in">
            <div className="card">
              <h3 className="section-title"><Database size={20} /> Crime Records ({crimeLocations.length} entries)</h3>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Area</th>
                      <th>Type</th>
                      <th>Severity</th>
                      <th>Cases</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crimeLocations.map(c => (
                      <tr key={c.id}>
                        <td>#{c.id}</td>
                        <td className="area-name">{c.area}</td>
                        <td>{c.type}</td>
                        <td><span className={`badge badge-${c.severity}`}>{c.severity}</span></td>
                        <td>{c.count}</td>
                        <td>{c.date}</td>
                        <td>
                          <button className="action-btn view"><Eye size={14} /> View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="admin-content animate-fade-in">
            <div className="upload-section card">
              <div className="upload-icon">
                <Upload size={48} />
              </div>
              <h3>Upload Crime Dataset</h3>
              <p>Upload CSV or JSON files containing crime data to update the system</p>
              <div className="upload-zone" onClick={handleUpload}>
                {uploadStatus === 'uploading' ? (
                  <div className="upload-progress">
                    <Loader2 size={24} className="spin" />
                    <span>Processing file...</span>
                  </div>
                ) : uploadStatus === 'success' ? (
                  <div className="upload-success">
                    <CheckCircle2 size={24} />
                    <span>Dataset uploaded successfully!</span>
                  </div>
                ) : (
                  <>
                    <Upload size={32} />
                    <span>Click to upload or drag & drop</span>
                    <span className="upload-hint">CSV, JSON up to 50MB</span>
                  </>
                )}
              </div>
              <div className="upload-formats">
                <h4>Supported Formats</h4>
                <div className="format-chips">
                  <span className="format-chip">.csv</span>
                  <span className="format-chip">.json</span>
                  <span className="format-chip">.xlsx</span>
                </div>
                <p className="format-note">
                  Required columns: latitude, longitude, crime_type, date, time, severity
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
