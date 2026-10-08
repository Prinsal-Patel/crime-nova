import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Filter, Search, MapPin, AlertTriangle, Plus, X, Crosshair, Send, CheckCircle2 } from 'lucide-react';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';
import { crimeLocations } from '../data/crimeData';
import 'leaflet/dist/leaflet.css';
import './CrimeMapPage.css';

const crimeTypes = ['All', 'Theft', 'Robbery', 'Assault', 'Cybercrime', 'Fraud', 'Vandalism'];
const severityLevels = ['All', 'high', 'medium', 'low'];

function HeatOverlay({ data }) {
  const map = useMap();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!map || !data.length) return;
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '400';
    const container = map.getContainer();
    const existingCanvas = container.querySelector('.heat-canvas');
    if (existingCanvas) existingCanvas.remove();
    canvas.className = 'heat-canvas';
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const drawHeat = () => {
      const ctx = canvas.getContext('2d');
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      data.forEach((point) => {
        const pos = map.latLngToContainerPoint([point.lat, point.lng]);
        const radius = Math.max(30, (point.count || 1) * 1.5);
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
        const color =
          point.severity === 'high'
            ? '239,68,68'
            : point.severity === 'medium'
            ? '245,158,11'
            : '34,197,94';
        gradient.addColorStop(0, `rgba(${color},0.5)`);
        gradient.addColorStop(0.5, `rgba(${color},0.2)`);
        gradient.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    drawHeat();
    map.on('move zoom', drawHeat);
    return () => {
      map.off('move zoom', drawHeat);
      if (canvasRef.current) canvasRef.current.remove();
    };
  }, [map, data]);

  return null;
}

export default function CrimeMapPage() {
  const { currentUser } = useAuth();
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [searchArea, setSearchArea] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  // Community-reported crimes from Cloud Firestore
  const [communityCrimes, setCommunityCrimes] = useState([]);

  // Report Incident Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportForm, setReportForm] = useState({
    type: 'Theft',
    area: '',
    severity: 'medium',
    lat: '',
    lng: '',
    description: '',
  });

  // Listen to Firestore real-time community reports
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'crimes'),
        (snapshot) => {
          const list = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            count: d.data().count || 1,
            isLive: true,
          }));
          setCommunityCrimes(list);
        },
        (error) => {
          console.warn('[Firestore] Crimes collection listener error:', error.message);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('[Firestore] Error connecting crimes listener:', e);
    }
  }, []);

  // Merge static baseline dataset with live community reports
  const allCrimes = [...communityCrimes, ...crimeLocations];

  const filtered = allCrimes.filter((c) => {
    const matchType = selectedType === 'All' || c.type === selectedType;
    const matchSeverity = selectedSeverity === 'All' || c.severity === selectedSeverity;
    const matchSearch =
      !searchArea || c.area?.toLowerCase().includes(searchArea.toLowerCase());
    return matchType && matchSeverity && matchSearch;
  });

  const severityColor = (s) =>
    s === 'high' ? '#ef4444' : s === 'medium' ? '#f59e0b' : '#22c55e';

  const totalHigh = filtered.filter((c) => c.severity === 'high').length;
  const totalMedium = filtered.filter((c) => c.severity === 'medium').length;
  const totalLow = filtered.filter((c) => c.severity === 'low').length;

  const handleUseCurrentGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setReportForm((prev) => ({
            ...prev,
            lat: pos.coords.latitude.toFixed(6),
            lng: pos.coords.longitude.toFixed(6),
          }));
        },
        () => {
          alert('Could not acquire GPS position. Please enter manually.');
        }
      );
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportForm.area || !reportForm.lat || !reportForm.lng) {
      alert('Please provide Area and Coordinates.');
      return;
    }

    setReportLoading(true);
    try {
      await addDoc(collection(db, 'crimes'), {
        type: reportForm.type,
        area: reportForm.area.trim(),
        severity: reportForm.severity,
        lat: parseFloat(reportForm.lat),
        lng: parseFloat(reportForm.lng),
        description: reportForm.description.trim(),
        count: 1,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        reportedBy: currentUser?.displayName || currentUser?.email || 'Citizen Report',
        reporterUid: currentUser?.uid || 'anonymous',
        source: 'Live Community Report',
        createdAt: serverTimestamp(),
      });

      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setShowReportModal(false);
        setReportForm({
          type: 'Theft',
          area: '',
          severity: 'medium',
          lat: '',
          lng: '',
          description: '',
        });
      }, 1500);
    } catch (err) {
      console.error('Error submitting crime report:', err);
      alert('Failed to submit report. Please check your internet connection or login.');
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="crime-map-page">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1>
              <span className="gradient-text">Crime</span> Map
            </h1>
            <p>Interactive heatmap showing crime hotspots & live community reports across India</p>
          </div>
          <button
            type="button"
            className="btn-report-crime"
            onClick={() => setShowReportModal(true)}
          >
            <Plus size={16} /> Report Crime Incident
          </button>
        </div>

        {/* Legend */}
        <div className="map-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#ef4444' }}></span>
            High Risk ({totalHigh})
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#f59e0b' }}></span>
            Medium Risk ({totalMedium})
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#22c55e' }}></span>
            Low Risk ({totalLow})
          </div>
          {communityCrimes.length > 0 && (
            <div className="legend-item" style={{ color: '#818cf8', fontWeight: 600 }}>
              📡 Live Community Reports: {communityCrimes.length}
            </div>
          )}
          <button
            type="button"
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="map-filters card animate-fade-in">
            <div className="filter-group">
              <label>Search Area</label>
              <div className="search-input">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by area name..."
                  value={searchArea}
                  onChange={(e) => setSearchArea(e.target.value)}
                />
              </div>
            </div>
            <div className="filter-group">
              <label>Crime Type</label>
              <div className="filter-chips">
                {crimeTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`chip ${selectedType === type ? 'active' : ''}`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Severity</label>
              <div className="filter-chips">
                {severityLevels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`chip ${selectedSeverity === level ? 'active' : ''} ${
                      level !== 'All' ? `chip-${level}` : ''
                    }`}
                    onClick={() => setSelectedSeverity(level)}
                  >
                    {level === 'All' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="map-wrapper">
          <MapContainer
            center={[22.5, 78.9]}
            zoom={5}
            style={{ height: '600px', width: '100%', borderRadius: '16px' }}
            scrollWheelZoom={true}
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
            <HeatOverlay data={filtered} />
            {filtered.map((crime) => (
              <CircleMarker
                key={crime.id}
                center={[crime.lat, crime.lng]}
                radius={Math.max(6, (crime.count || 1) / 4)}
                fillColor={severityColor(crime.severity)}
                fillOpacity={0.8}
                stroke={true}
                color={crime.isLive ? '#6366f1' : severityColor(crime.severity)}
                weight={crime.isLive ? 3 : 2}
                opacity={0.7}
              >
                <Popup>
                  <div className="crime-popup">
                    <div className="popup-header">
                      <MapPin size={14} />
                      <strong>{crime.area}</strong>
                      {crime.isLive && (
                        <span style={{ fontSize: '0.7rem', background: '#6366f1', color: '#fff', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px' }}>
                          Live Report
                        </span>
                      )}
                    </div>
                    <div className="popup-details">
                      <span>
                        <AlertTriangle size={12} /> {crime.type}
                      </span>
                      <span className={`badge badge-${crime.severity}`}>{crime.severity}</span>
                    </div>
                    <div className="popup-meta">
                      <span>Cases: {crime.count}</span>
                      <span>Date: {crime.date}</span>
                      <span>Time: {crime.time}</span>
                      {crime.reportedBy && (
                        <span style={{ color: '#c7d2fe', fontSize: '0.75rem', marginTop: '4px' }}>
                          Reported by: {crime.reportedBy}
                        </span>
                      )}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Crime list */}
        <div className="crime-list">
          <h3 className="section-title">
            <MapPin size={20} /> Crime Incidents ({filtered.length})
          </h3>
          <div className="crime-list-grid">
            {filtered.slice(0, 24).map((crime) => (
              <div key={crime.id} className="crime-list-item card">
                <div className="crime-list-header">
                  <span className="crime-area">
                    {crime.area}
                    {crime.isLive && (
                      <span style={{ fontSize: '0.68rem', color: '#818cf8', fontWeight: 700, marginLeft: '6px' }}>
                        ● LIVE
                      </span>
                    )}
                  </span>
                  <span className={`badge badge-${crime.severity}`}>{crime.severity}</span>
                </div>
                <div className="crime-list-body">
                  <span className="crime-type">{crime.type}</span>
                  <span className="crime-count">{crime.count} {crime.count === 1 ? 'case' : 'cases'}</span>
                  <span className="crime-date">{crime.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Crime Incident Modal */}
      {showReportModal && (
        <div className="report-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="report-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Report Crime Incident</h3>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Your report will be synchronized live with Cloud Firestore and visualized on the crime intelligence map.
            </p>

            {reportSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', gap: '12px' }}>
                <CheckCircle2 size={48} color="#22c55e" />
                <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Report Successfully Dispatched!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Added to real-time incident heatmap.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                <div className="report-form-grid">
                  <div className="report-form-group">
                    <label>Crime Category</label>
                    <select
                      value={reportForm.type}
                      onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
                    >
                      <option value="Theft">Theft</option>
                      <option value="Robbery">Robbery</option>
                      <option value="Assault">Assault</option>
                      <option value="Cybercrime">Cybercrime</option>
                      <option value="Fraud">Fraud</option>
                      <option value="Vandalism">Vandalism</option>
                      <option value="Harassment">Harassment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="report-form-group">
                    <label>Severity Level</label>
                    <select
                      value={reportForm.severity}
                      onChange={(e) => setReportForm({ ...reportForm, severity: e.target.value })}
                    >
                      <option value="low">Low Severity</option>
                      <option value="medium">Medium Severity</option>
                      <option value="high">High Severity</option>
                    </select>
                  </div>

                  <div className="report-form-group full-width">
                    <label>Area / Locality Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Indiranagar 100ft Road, Bangalore"
                      value={reportForm.area}
                      onChange={(e) => setReportForm({ ...reportForm, area: e.target.value })}
                      required
                    />
                  </div>

                  <div className="report-form-group">
                    <label>Latitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g., 12.9716"
                      value={reportForm.lat}
                      onChange={(e) => setReportForm({ ...reportForm, lat: e.target.value })}
                      required
                    />
                  </div>

                  <div className="report-form-group">
                    <label>Longitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g., 77.5946"
                      value={reportForm.lng}
                      onChange={(e) => setReportForm({ ...reportForm, lng: e.target.value })}
                      required
                    />
                  </div>

                  <div className="report-form-group full-width">
                    <button
                      type="button"
                      className="use-gps-btn"
                      onClick={handleUseCurrentGPS}
                    >
                      <Crosshair size={13} /> Detect & Use My Current GPS Coordinates
                    </button>
                  </div>

                  <div className="report-form-group full-width">
                    <label>Incident Details (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Describe what occurred, suspect description, or circumstances..."
                      value={reportForm.description}
                      onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowReportModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={reportLoading}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    {reportLoading ? <span className="btn-loader"></span> : <><Send size={15} /> Submit Report</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
