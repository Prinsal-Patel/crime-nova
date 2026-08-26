import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Filter, Search, MapPin, AlertTriangle, Shield } from 'lucide-react';
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
      data.forEach(point => {
        const pos = map.latLngToContainerPoint([point.lat, point.lng]);
        const radius = Math.max(30, point.count * 1.5);
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
        const color = point.severity === 'high' ? '239,68,68' : point.severity === 'medium' ? '245,158,11' : '34,197,94';
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
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [searchArea, setSearchArea] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  const filtered = crimeLocations.filter(c => {
    const matchType = selectedType === 'All' || c.type === selectedType;
    const matchSeverity = selectedSeverity === 'All' || c.severity === selectedSeverity;
    const matchSearch = !searchArea || c.area.toLowerCase().includes(searchArea.toLowerCase());
    return matchType && matchSeverity && matchSearch;
  });

  const severityColor = (s) => s === 'high' ? '#ef4444' : s === 'medium' ? '#f59e0b' : '#22c55e';

  const totalHigh = filtered.filter(c => c.severity === 'high').length;
  const totalMedium = filtered.filter(c => c.severity === 'medium').length;
  const totalLow = filtered.filter(c => c.severity === 'low').length;

  return (
    <div className="crime-map-page">
      <div className="container">
        <div className="page-header">
          <h1><span className="gradient-text">Crime</span> Map</h1>
          <p>Interactive heatmap showing crime hotspots across India</p>
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
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
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
                {crimeTypes.map(type => (
                  <button
                    key={type}
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
                {severityLevels.map(level => (
                  <button
                    key={level}
                    className={`chip ${selectedSeverity === level ? 'active' : ''} ${level !== 'All' ? `chip-${level}` : ''}`}
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
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <HeatOverlay data={filtered} />
            {filtered.map(crime => (
              <CircleMarker
                key={crime.id}
                center={[crime.lat, crime.lng]}
                radius={Math.max(6, crime.count / 5)}
                fillColor={severityColor(crime.severity)}
                fillOpacity={0.8}
                stroke={true}
                color={severityColor(crime.severity)}
                weight={2}
                opacity={0.5}
              >
                <Popup>
                  <div className="crime-popup">
                    <div className="popup-header">
                      <MapPin size={14} />
                      <strong>{crime.area}</strong>
                    </div>
                    <div className="popup-details">
                      <span><AlertTriangle size={12} /> {crime.type}</span>
                      <span className={`badge badge-${crime.severity}`}>{crime.severity}</span>
                    </div>
                    <div className="popup-meta">
                      <span>Cases: {crime.count}</span>
                      <span>Date: {crime.date}</span>
                      <span>Time: {crime.time}</span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Crime list */}
        <div className="crime-list">
          <h3 className="section-title"><MapPin size={20} /> Crime Locations ({filtered.length})</h3>
          <div className="crime-list-grid">
            {filtered.map(crime => (
              <div key={crime.id} className="crime-list-item card">
                <div className="crime-list-header">
                  <span className="crime-area">{crime.area}</span>
                  <span className={`badge badge-${crime.severity}`}>{crime.severity}</span>
                </div>
                <div className="crime-list-body">
                  <span className="crime-type">{crime.type}</span>
                  <span className="crime-count">{crime.count} cases</span>
                  <span className="crime-date">{crime.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
