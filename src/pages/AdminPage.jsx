import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import {
  AlertTriangle,
  Upload,
  Database,
  MapPin,
  Clock,
  Phone,
  User,
  CheckCircle2,
  Eye,
  Trash2,
  Users,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';
import { sosAlerts as defaultSosAlerts, crimeLocations as defaultCrimeLocations } from '../data/crimeData';
import 'leaflet/dist/leaflet.css';
import './AdminPage.css';

export default function AdminPage() {
  const { updateUserRole, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('alerts');

  // Real-time Firestore States
  const [alerts, setAlerts] = useState(defaultSosAlerts);
  const [communityCrimes, setCommunityCrimes] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [uploadedDatasets, setUploadedDatasets] = useState([]);

  // File Upload State
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(''); // idle, uploading, success, error
  const [uploadError, setUploadError] = useState('');

  // 1. Real-time SOS Alerts Listener
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, 'sos_alerts'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            }));
            // Sort by createdAt descending
            list.sort((a, b) => {
              const tA = a.createdAt?.seconds || 0;
              const tB = b.createdAt?.seconds || 0;
              return tB - tA;
            });
            setAlerts(list);
          } else {
            setAlerts(defaultSosAlerts);
          }
        },
        (err) => {
          console.warn('[Firestore] SOS alerts listener notice:', err.message);
        }
      );
      return () => unsub();
    } catch (e) {
      console.warn('[Firestore] Error connecting to sos_alerts:', e);
    }
  }, []);

  // 2. Real-time Community Crimes Listener
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, 'crimes'),
        (snapshot) => {
          const list = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            isLive: true,
          }));
          setCommunityCrimes(list);
        },
        (err) => {
          console.warn('[Firestore] Crimes collection listener notice:', err.message);
        }
      );
      return () => unsub();
    } catch (e) {
      console.warn('[Firestore] Error connecting to crimes:', e);
    }
  }, []);

  // 3. Real-time Users & Roles Listener
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, 'users'),
        (snapshot) => {
          const list = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setUsersList(list);
        },
        (err) => {
          console.warn('[Firestore] Users collection listener notice:', err.message);
        }
      );
      return () => unsub();
    } catch (e) {
      console.warn('[Firestore] Error connecting to users:', e);
    }
  }, []);

  // 4. Real-time Datasets Listener
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, 'datasets'),
        (snapshot) => {
          const list = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setUploadedDatasets(list);
        },
        (err) => {
          console.warn('[Firestore] Datasets collection notice:', err.message);
        }
      );
      return () => unsub();
    } catch (e) {
      console.warn('[Firestore] Error connecting to datasets:', e);
    }
  }, []);

  // SOS Alert Status Handler
  const handleStatusChange = async (id, newStatus) => {
    // Check if Firestore document ID
    if (typeof id === 'string' && id.length > 5) {
      try {
        await updateDoc(doc(db, 'sos_alerts', id), {
          status: newStatus,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error('Error updating SOS alert status in Firestore:', err);
      }
    } else {
      // Local fallback for initial mock rows
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    }
  };

  const handleDeleteAlert = async (id) => {
    if (window.confirm('Delete this SOS distress ticket?')) {
      if (typeof id === 'string' && id.length > 5) {
        try {
          await deleteDoc(doc(db, 'sos_alerts', id));
        } catch (err) {
          console.error('Error deleting SOS alert:', err);
        }
      } else {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      }
    }
  };

  const handleDeleteCrime = async (id) => {
    if (window.confirm('Remove this reported crime record?')) {
      try {
        await deleteDoc(doc(db, 'crimes', id));
      } catch (err) {
        console.error('Error deleting crime report:', err);
      }
    }
  };

  // Role Management Handler
  const handleToggleRole = async (targetUid, currentRole) => {
    const newRole = currentRole === 'admin' ? 'citizen' : 'admin';
    try {
      await updateUserRole(targetUid, newRole);
    } catch (err) {
      console.error('Error updating user role:', err);
      alert(err.message || 'Failed to update user role.');
    }
  };

  // File Upload Handler — parses CSV client-side and stores records in Firestore
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');
    setUploadProgress(0);
    setUploadError('');

    try {
      const text = await file.text();
      const lines = text.split('\n').filter((l) => l.trim());
      const rowCount = Math.max(lines.length - 1, 0); // exclude header

      setUploadProgress(50);

      // Store dataset metadata + summary in Firestore (no Storage needed)
      await addDoc(collection(db, 'datasets'), {
        name: file.name,
        size: file.size,
        type: file.type || 'text/csv',
        rowCount,
        headerRow: lines[0] || '',
        uploadedBy: currentUser?.displayName || currentUser?.email || 'Admin',
        createdAt: serverTimestamp(),
      });

      setUploadProgress(100);
      setUploadStatus('success');

      setTimeout(() => {
        setUploadStatus('');
        setUploadProgress(0);
      }, 3500);
    } catch (err) {
      console.error('[Firestore] Dataset upload error:', err);
      setUploadStatus('error');
      setUploadError(err.message || 'Failed to process file.');
    }
  };

  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;

  const tabs = [
    { id: 'alerts', label: 'SOS Alerts', icon: AlertTriangle, count: activeAlertsCount },
    { id: 'data', label: 'Crime Records', icon: Database, count: communityCrimes.length },
    { id: 'upload', label: 'Upload Dataset', icon: Upload },
    { id: 'users', label: 'Users & Roles', icon: Users, count: usersList.length },
  ];

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>
            <span className="gradient-text">Admin</span> Operations
          </h1>
          <p>Real-time emergency dispatch queue, community crime auditing, RBAC & Cloud Storage</p>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                className={`admin-tab ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <Icon size={16} />
                {t.label}
                {t.count !== undefined && t.count > 0 && (
                  <span className="tab-count">{t.count}</span>
                )}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="section-title" style={{ margin: 0 }}>
                    <AlertTriangle size={20} /> Real-Time SOS Dispatch Queue
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                    Live Firestore Sync
                  </span>
                </div>
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Victim / User</th>
                        <th>Contact</th>
                        <th>Type</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alerts.map((alert) => (
                        <tr key={alert.id}>
                          <td>
                            <div className="alert-person">
                              <User size={14} />
                              {alert.name}
                            </div>
                            {alert.email && alert.email !== 'N/A' && (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {alert.email}
                              </span>
                            )}
                          </td>
                          <td>
                            <Phone size={12} /> {alert.phone}
                          </td>
                          <td>
                            {alert.type === 'Police' ? '🚔' : '🚑'} {alert.type}
                          </td>
                          <td>
                            <Clock size={12} /> {alert.time ? alert.time.split(' ')[1] || alert.time : 'Just now'}
                          </td>
                          <td>
                            <span className={`badge badge-${alert.status}`}>
                              {alert.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-btns">
                              {alert.status === 'active' && (
                                <button
                                  type="button"
                                  className="action-btn respond"
                                  onClick={() => handleStatusChange(alert.id, 'responded')}
                                >
                                  Respond
                                </button>
                              )}
                              {alert.status === 'responded' && (
                                <button
                                  type="button"
                                  className="action-btn resolve"
                                  onClick={() => handleStatusChange(alert.id, 'resolved')}
                                >
                                  Resolve
                                </button>
                              )}
                              {alert.status === 'resolved' && (
                                <CheckCircle2 size={16} style={{ color: '#22c55e' }} />
                              )}
                              <button
                                type="button"
                                className="action-btn delete"
                                title="Delete Alert"
                                onClick={() => handleDeleteAlert(alert.id)}
                              >
                                <Trash2 size={13} />
                              </button>
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
                <h3 className="section-title">
                  <MapPin size={20} /> Live Distress Telemetry
                </h3>
                <MapContainer
                  center={[22.5, 78.9]}
                  zoom={5}
                  style={{ height: '380px', borderRadius: '12px' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={16}
                  />
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={16}
                  />
                  {alerts.map((a) => (
                    <CircleMarker
                      key={a.id}
                      center={[a.lat, a.lng]}
                      radius={10}
                      fillColor={
                        a.status === 'active'
                          ? '#ef4444'
                          : a.status === 'responded'
                          ? '#f59e0b'
                          : '#22c55e'
                      }
                      fillOpacity={0.8}
                      stroke={true}
                      color={
                        a.status === 'active'
                          ? '#ef4444'
                          : a.status === 'responded'
                          ? '#f59e0b'
                          : '#22c55e'
                      }
                      weight={2}
                    >
                      <Popup>
                        <strong>{a.name}</strong>
                        <br />
                        {a.type} — {a.status}
                        <br />
                        <span style={{ fontSize: '0.75rem', color: '#666' }}>
                          Coords: {a.lat.toFixed(4)}, {a.lng.toFixed(4)}
                        </span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="section-title" style={{ margin: 0 }}>
                  <Database size={20} /> Crime Dataset Records ({defaultCrimeLocations.length + communityCrimes.length} entries)
                </h3>
                {communityCrimes.length > 0 && (
                  <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>
                    📡 {communityCrimes.length} Live Community Submissions
                  </span>
                )}
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Origin</th>
                      <th>Area</th>
                      <th>Type</th>
                      <th>Severity</th>
                      <th>Cases</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Live Community Reports First */}
                    {communityCrimes.map((c) => (
                      <tr key={c.id} style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
                        <td>
                          <span style={{ fontSize: '0.72rem', background: '#6366f1', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            LIVE REPORT
                          </span>
                        </td>
                        <td className="area-name">
                          {c.area}
                          {c.reportedBy && (
                            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              by: {c.reportedBy}
                            </span>
                          )}
                        </td>
                        <td>{c.type}</td>
                        <td>
                          <span className={`badge badge-${c.severity}`}>{c.severity}</span>
                        </td>
                        <td>{c.count || 1}</td>
                        <td>{c.date}</td>
                        <td>
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={() => handleDeleteCrime(c.id)}
                            title="Remove report"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Default Baseline Incidents */}
                    {defaultCrimeLocations.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            System Baseline
                          </span>
                        </td>
                        <td className="area-name">{c.area}</td>
                        <td>{c.type}</td>
                        <td>
                          <span className={`badge badge-${c.severity}`}>{c.severity}</span>
                        </td>
                        <td>{c.count}</td>
                        <td>{c.date}</td>
                        <td>
                          <button type="button" className="action-btn view">
                            <Eye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Upload Tab (Firestore-based — no Cloud Storage needed) */}
        {activeTab === 'upload' && (
          <div className="admin-content animate-fade-in">
            <div className="upload-section card">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".csv,.json,.xlsx"
                onChange={handleFileSelect}
              />
              <div className="upload-icon">
                <Upload size={48} />
              </div>
              <h3>Upload Dataset</h3>
              <p>
                Upload CSV datasets to register them in the system. File metadata is stored in Cloud Firestore (free Spark plan).
              </p>

              <div
                className="upload-zone"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadStatus === 'uploading' ? (
                  <div style={{ width: '100%', padding: '0 20px' }}>
                    <div className="upload-progress">
                      <span>Processing file... {uploadProgress}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : uploadStatus === 'success' ? (
                  <div className="upload-success">
                    <CheckCircle2 size={32} />
                    <span>Dataset registered successfully!</span>
                  </div>
                ) : (
                  <>
                    <Upload size={36} color="var(--accent-primary)" />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      Click to choose a CSV file
                    </span>
                    <span className="upload-hint">
                      Metadata saved to Firestore <code>datasets</code> collection
                    </span>
                  </>
                )}
              </div>

              {uploadError && (
                <div style={{ color: '#ef4444', fontSize: '0.84rem', marginTop: '12px' }}>
                  {uploadError}
                </div>
              )}

              <div className="upload-formats">
                <h4>Supported Formats</h4>
                <div className="format-chips">
                  <span className="format-chip">.csv</span>
                  <span className="format-chip">.json</span>
                  <span className="format-chip">.xlsx</span>
                </div>
                <p className="format-note">
                  Expected schema: latitude, longitude, crime_type, locality, date, severity
                </p>
              </div>

              {/* Uploaded Datasets List */}
              {uploadedDatasets.length > 0 && (
                <div className="dataset-files-list">
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    <FileSpreadsheet size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                    Registered Datasets ({uploadedDatasets.length})
                  </h4>
                  {uploadedDatasets.map((d) => (
                    <div key={d.id} className="dataset-file-card">
                      <div>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{d.name}</strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {(d.size / 1024).toFixed(1)} KB • {d.rowCount ?? '?'} rows • Uploaded by {d.uploadedBy}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users & Roles Tab (RBAC) */}
        {activeTab === 'users' && (
          <div className="admin-content animate-fade-in">
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="section-title" style={{ margin: 0 }}>
                  <Users size={20} /> Registered User Profiles & RBAC
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>
                  Cloud Firestore: <code>users</code> collection
                </span>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>User ID</th>
                      <th>Access Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.length > 0 ? (
                      usersList.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <div className="alert-person">
                              <User size={14} />
                              {u.displayName || 'Citizen'}
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`role-badge ${u.role === 'admin' ? 'admin' : 'citizen'}`}>
                              {u.role === 'admin' ? 'Administrator' : 'Citizen'}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {u.id.substring(0, 10)}...
                          </td>
                          <td>
                            <button
                              type="button"
                              className="role-toggle-btn"
                              onClick={() => handleToggleRole(u.id, u.role)}
                            >
                              {u.role === 'admin' ? 'Demote to Citizen' : 'Promote to Admin'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                          <ShieldCheck size={32} style={{ display: 'block', margin: '0 auto 8px', color: '#818cf8' }} />
                          User accounts will automatically appear here as citizens sign up or log in.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
