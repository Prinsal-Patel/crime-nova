import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Phone, MapPin, Siren, Heart, Navigation, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './SOSPage.css';

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

const emergencyContacts = [
  { name: 'Police', number: '100', icon: Siren, color: '#6366f1' },
  { name: 'Ambulance', number: '108', icon: Heart, color: '#ef4444' },
  { name: 'Fire', number: '101', icon: AlertTriangle, color: '#f59e0b' },
  { name: 'Women Helpline', number: '1091', icon: Phone, color: '#ec4899' },
];

export default function SOSPage() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, locating, sending, sent, error
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  const getLocation = () => {
    setStatus('locating');
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setStatus('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
        setStatus('sending');
        // Simulate sending alert
        setTimeout(() => {
          setStatus('sent');
          setTimer(0);
          const interval = setInterval(() => setTimer(t => t + 1), 1000);
          setTimeout(() => clearInterval(interval), 300000);
        }, 2000);
      },
      (err) => {
        setError('Unable to retrieve your location. Please enable GPS.');
        setStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const resetSOS = () => {
    setStatus('idle');
    setLocation(null);
    setError('');
    setTimer(0);
  };

  return (
    <div className="sos-page">
      <div className="container">
        <div className="page-header">
          <h1><span style={{ color: 'var(--sos-red)' }}>Emergency</span> SOS</h1>
          <p>Press the SOS button to share your live GPS location with emergency services</p>
        </div>

        <div className="sos-grid">
          {/* SOS Panel */}
          <div className="sos-panel">
            {/* SOS Button */}
            <div className={`sos-button-wrap ${status === 'sent' ? 'active' : ''}`}>
              {status === 'idle' || status === 'error' ? (
                <button className="sos-trigger-btn" onClick={getLocation}>
                  <div className="sos-ripple"></div>
                  <div className="sos-ripple sos-ripple-2"></div>
                  <AlertTriangle size={48} />
                  <span>SOS</span>
                </button>
              ) : status === 'locating' ? (
                <div className="sos-status-circle locating">
                  <Loader2 size={40} className="spin" />
                  <span>Locating...</span>
                </div>
              ) : status === 'sending' ? (
                <div className="sos-status-circle sending">
                  <Navigation size={40} className="spin" />
                  <span>Sending Alert...</span>
                </div>
              ) : (
                <div className="sos-status-circle sent">
                  <CheckCircle2 size={48} />
                  <span>Alert Sent!</span>
                </div>
              )}
            </div>

            {error && <div className="sos-error">{error}</div>}

            {status === 'sent' && (
              <div className="sos-info-panel animate-fade-in-up">
                <div className="sos-info-row">
                  <Clock size={16} />
                  <span>Time Elapsed: <strong>{formatTime(timer)}</strong></span>
                </div>
                <div className="sos-info-row">
                  <MapPin size={16} />
                  <span>Location: <strong>{location?.lat.toFixed(6)}, {location?.lng.toFixed(6)}</strong></span>
                </div>
                <div className="sos-info-row">
                  <Navigation size={16} />
                  <span>Accuracy: <strong>~{Math.round(location?.accuracy || 0)}m</strong></span>
                </div>
                <div className="sos-status-badges">
                  <span className="badge badge-active">🚔 Police Notified</span>
                  <span className="badge badge-responded">🚑 Ambulance Dispatched</span>
                </div>
                <button className="btn-outline cancel-btn" onClick={resetSOS}>
                  Cancel Alert
                </button>
              </div>
            )}
          </div>

          {/* Map Panel */}
          <div className="sos-map-panel">
            <div className="sos-map-card card">
              <h3 className="section-title"><MapPin size={20} /> Your Live Location</h3>
              <div className="sos-map-wrapper">
                <MapContainer
                  center={location ? [location.lat, location.lng] : [20.5937, 78.9629]}
                  zoom={location ? 15 : 5}
                  style={{ height: '400px', width: '100%', borderRadius: '12px' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                  />
                  {location && (
                    <>
                      <RecenterMap lat={location.lat} lng={location.lng} />
                      <Marker position={[location.lat, location.lng]}>
                        <Popup>
                          <strong>📍 Your Location</strong><br />
                          {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        </Popup>
                      </Marker>
                    </>
                  )}
                </MapContainer>
                {!location && (
                  <div className="map-overlay">
                    <MapPin size={36} />
                    <p>Press SOS to share your location</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="emergency-contacts">
          <h3 className="section-title"><Phone size={20} /> Emergency Contacts</h3>
          <div className="contacts-grid">
            {emergencyContacts.map((c, i) => {
              const Icon = c.icon;
              return (
                <a
                  key={i}
                  href={`tel:${c.number}`}
                  className={`contact-card card animate-fade-in-up animate-delay-${i + 1}`}
                >
                  <div className="contact-icon" style={{ background: `${c.color}20` }}>
                    <Icon size={24} style={{ color: c.color }} />
                  </div>
                  <div className="contact-info">
                    <span className="contact-name">{c.name}</span>
                    <span className="contact-number">{c.number}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
