// Sample crime data for Crimenova
// Simulates crime data across major Indian cities

export const crimeLocations = [
  // Delhi - High crime zone
  { id: 1, lat: 28.6139, lng: 77.2090, type: 'Theft', severity: 'high', date: '2025-12-15', time: '23:30', area: 'Connaught Place, Delhi', count: 45 },
  { id: 2, lat: 28.6562, lng: 77.2410, type: 'Robbery', severity: 'high', date: '2025-11-20', time: '22:00', area: 'Karol Bagh, Delhi', count: 38 },
  { id: 3, lat: 28.5355, lng: 77.2510, type: 'Assault', severity: 'high', date: '2025-10-10', time: '01:15', area: 'Saket, Delhi', count: 32 },
  { id: 4, lat: 28.6892, lng: 77.2219, type: 'Burglary', severity: 'medium', date: '2025-09-05', time: '03:00', area: 'Model Town, Delhi', count: 22 },
  { id: 5, lat: 28.6280, lng: 77.2189, type: 'Cybercrime', severity: 'medium', date: '2025-08-18', time: '14:00', area: 'Rajiv Chowk, Delhi', count: 18 },
  { id: 6, lat: 28.5733, lng: 77.2588, type: 'Theft', severity: 'high', date: '2025-12-01', time: '20:45', area: 'Nehru Place, Delhi', count: 41 },
  { id: 7, lat: 28.7041, lng: 77.1025, type: 'Vandalism', severity: 'low', date: '2025-07-22', time: '16:30', area: 'Rohini, Delhi', count: 8 },

  // Mumbai - High crime
  { id: 8, lat: 19.0760, lng: 72.8777, type: 'Theft', severity: 'high', date: '2025-11-10', time: '21:00', area: 'Andheri, Mumbai', count: 52 },
  { id: 9, lat: 19.0176, lng: 72.8562, type: 'Robbery', severity: 'high', date: '2025-10-25', time: '23:45', area: 'Colaba, Mumbai', count: 35 },
  { id: 10, lat: 19.1136, lng: 72.8697, type: 'Assault', severity: 'medium', date: '2025-09-15', time: '02:30', area: 'Goregaon, Mumbai', count: 24 },
  { id: 11, lat: 19.0596, lng: 72.8295, type: 'Fraud', severity: 'medium', date: '2025-08-08', time: '11:00', area: 'Bandra, Mumbai', count: 19 },
  { id: 12, lat: 19.1860, lng: 72.8341, type: 'Theft', severity: 'high', date: '2025-12-08', time: '19:30', area: 'Borivali, Mumbai', count: 37 },

  // Bangalore - Medium crime
  { id: 13, lat: 12.9716, lng: 77.5946, type: 'Cybercrime', severity: 'medium', date: '2025-11-28', time: '15:00', area: 'MG Road, Bangalore', count: 28 },
  { id: 14, lat: 12.9352, lng: 77.6245, type: 'Theft', severity: 'medium', date: '2025-10-12', time: '22:15', area: 'Koramangala, Bangalore', count: 21 },
  { id: 15, lat: 13.0358, lng: 77.5970, type: 'Robbery', severity: 'low', date: '2025-09-20', time: '00:30', area: 'Hebbal, Bangalore', count: 12 },
  { id: 16, lat: 12.9698, lng: 77.7500, type: 'Assault', severity: 'medium', date: '2025-07-30', time: '21:45', area: 'Whitefield, Bangalore', count: 17 },

  // Kolkata - Medium crime
  { id: 17, lat: 22.5726, lng: 88.3639, type: 'Theft', severity: 'medium', date: '2025-12-05', time: '20:00', area: 'Park Street, Kolkata', count: 25 },
  { id: 18, lat: 22.5958, lng: 88.3700, type: 'Robbery', severity: 'high', date: '2025-11-15', time: '23:00', area: 'Sealdah, Kolkata', count: 33 },
  { id: 19, lat: 22.5448, lng: 88.3426, type: 'Fraud', severity: 'low', date: '2025-10-01', time: '13:00', area: 'Alipore, Kolkata', count: 10 },

  // Chennai - Low-Medium crime
  { id: 20, lat: 13.0827, lng: 80.2707, type: 'Theft', severity: 'medium', date: '2025-11-05', time: '19:00', area: 'T Nagar, Chennai', count: 20 },
  { id: 21, lat: 13.0674, lng: 80.2376, type: 'Cybercrime', severity: 'low', date: '2025-09-28', time: '10:00', area: 'Adyar, Chennai', count: 9 },
  { id: 22, lat: 13.1143, lng: 80.1548, type: 'Vandalism', severity: 'low', date: '2025-08-12', time: '17:00', area: 'Ambattur, Chennai', count: 6 },

  // Hyderabad
  { id: 23, lat: 17.3850, lng: 78.4867, type: 'Robbery', severity: 'medium', date: '2025-12-10', time: '22:30', area: 'Secunderabad, Hyderabad', count: 26 },
  { id: 24, lat: 17.4399, lng: 78.4983, type: 'Assault', severity: 'high', date: '2025-11-01', time: '01:00', area: 'Begumpet, Hyderabad', count: 30 },
  { id: 25, lat: 17.3616, lng: 78.4747, type: 'Theft', severity: 'low', date: '2025-10-18', time: '16:00', area: 'Charminar, Hyderabad', count: 14 },

  // Jaipur
  { id: 26, lat: 26.9124, lng: 75.7873, type: 'Theft', severity: 'medium', date: '2025-11-22', time: '21:15', area: 'MI Road, Jaipur', count: 23 },
  { id: 27, lat: 26.8498, lng: 75.7559, type: 'Fraud', severity: 'low', date: '2025-08-30', time: '12:00', area: 'Mansarovar, Jaipur', count: 11 },

  // Lucknow
  { id: 28, lat: 26.8467, lng: 80.9462, type: 'Robbery', severity: 'medium', date: '2025-12-02', time: '23:15', area: 'Hazratganj, Lucknow', count: 19 },
  { id: 29, lat: 26.8851, lng: 80.9115, type: 'Assault', severity: 'high', date: '2025-10-28', time: '02:00', area: 'Aminabad, Lucknow', count: 29 },

  // Pune
  { id: 30, lat: 18.5204, lng: 73.8567, type: 'Cybercrime', severity: 'medium', date: '2025-11-18', time: '14:30', area: 'Kothrud, Pune', count: 22 },
];

// Monthly crime trend data
export const monthlyTrends = [
  { month: 'Jan', theft: 120, robbery: 45, assault: 30, cybercrime: 25, fraud: 15, vandalism: 10 },
  { month: 'Feb', theft: 115, robbery: 42, assault: 28, cybercrime: 22, fraud: 18, vandalism: 8 },
  { month: 'Mar', theft: 130, robbery: 50, assault: 35, cybercrime: 30, fraud: 20, vandalism: 12 },
  { month: 'Apr', theft: 125, robbery: 48, assault: 32, cybercrime: 28, fraud: 16, vandalism: 11 },
  { month: 'May', theft: 140, robbery: 55, assault: 40, cybercrime: 35, fraud: 22, vandalism: 15 },
  { month: 'Jun', theft: 155, robbery: 60, assault: 45, cybercrime: 32, fraud: 25, vandalism: 18 },
  { month: 'Jul', theft: 160, robbery: 58, assault: 42, cybercrime: 38, fraud: 28, vandalism: 20 },
  { month: 'Aug', theft: 150, robbery: 52, assault: 38, cybercrime: 40, fraud: 24, vandalism: 16 },
  { month: 'Sep', theft: 135, robbery: 47, assault: 33, cybercrime: 36, fraud: 21, vandalism: 13 },
  { month: 'Oct', theft: 145, robbery: 53, assault: 37, cybercrime: 42, fraud: 26, vandalism: 14 },
  { month: 'Nov', theft: 165, robbery: 62, assault: 48, cybercrime: 45, fraud: 30, vandalism: 22 },
  { month: 'Dec', theft: 175, robbery: 68, assault: 52, cybercrime: 48, fraud: 35, vandalism: 25 },
];

// Crime type distribution
export const crimeDistribution = [
  { type: 'Theft', count: 1715, color: '#ef4444' },
  { type: 'Robbery', count: 640, color: '#f97316' },
  { type: 'Assault', count: 460, color: '#eab308' },
  { type: 'Cybercrime', count: 421, color: '#8b5cf6' },
  { type: 'Fraud', count: 280, color: '#06b6d4' },
  { type: 'Vandalism', count: 184, color: '#22c55e' },
];

// Area-wise crime stats
export const areaStats = [
  { area: 'Delhi', total: 224, high: 3, medium: 2, low: 1 },
  { area: 'Mumbai', total: 167, high: 3, medium: 2, low: 0 },
  { area: 'Bangalore', total: 78, high: 0, medium: 3, low: 1 },
  { area: 'Kolkata', total: 68, high: 1, medium: 1, low: 1 },
  { area: 'Chennai', total: 35, high: 0, medium: 1, low: 2 },
  { area: 'Hyderabad', total: 70, high: 1, medium: 1, low: 1 },
  { area: 'Jaipur', total: 34, high: 0, medium: 1, low: 1 },
  { area: 'Lucknow', total: 48, high: 1, medium: 1, low: 0 },
  { area: 'Pune', total: 22, high: 0, medium: 1, low: 0 },
];

// Prediction data (simulated ML output)
export const predictionData = {
  hotspots: [
    { area: 'Connaught Place, Delhi', riskScore: 92, predictedCrimes: 48, dominantType: 'Theft', trend: 'increasing' },
    { area: 'Andheri, Mumbai', riskScore: 88, predictedCrimes: 55, dominantType: 'Theft', trend: 'increasing' },
    { area: 'Sealdah, Kolkata', riskScore: 82, predictedCrimes: 36, dominantType: 'Robbery', trend: 'stable' },
    { area: 'Begumpet, Hyderabad', riskScore: 78, predictedCrimes: 32, dominantType: 'Assault', trend: 'increasing' },
    { area: 'Aminabad, Lucknow', riskScore: 75, predictedCrimes: 31, dominantType: 'Assault', trend: 'stable' },
    { area: 'Karol Bagh, Delhi', riskScore: 85, predictedCrimes: 40, dominantType: 'Robbery', trend: 'decreasing' },
    { area: 'Nehru Place, Delhi', riskScore: 80, predictedCrimes: 43, dominantType: 'Theft', trend: 'increasing' },
    { area: 'Borivali, Mumbai', riskScore: 72, predictedCrimes: 39, dominantType: 'Theft', trend: 'stable' },
  ],
  peakHours: [
    { hour: '00:00', risk: 65 }, { hour: '02:00', risk: 72 }, { hour: '04:00', risk: 45 },
    { hour: '06:00', risk: 20 }, { hour: '08:00', risk: 15 }, { hour: '10:00', risk: 18 },
    { hour: '12:00', risk: 22 }, { hour: '14:00', risk: 25 }, { hour: '16:00', risk: 30 },
    { hour: '18:00', risk: 42 }, { hour: '20:00', risk: 58 }, { hour: '22:00', risk: 70 },
  ],
  weeklyPattern: [
    { day: 'Mon', risk: 45 }, { day: 'Tue', risk: 40 }, { day: 'Wed', risk: 38 },
    { day: 'Thu', risk: 42 }, { day: 'Fri', risk: 55 }, { day: 'Sat', risk: 72 },
    { day: 'Sun', risk: 68 },
  ],
};

// SOS alerts (simulated)
export const sosAlerts = [
  { id: 1, name: 'Rahul Sharma', phone: '+91-9876543210', lat: 28.6139, lng: 77.2090, time: '2025-12-15 23:45', status: 'active', type: 'Police' },
  { id: 2, name: 'Priya Patel', phone: '+91-9123456789', lat: 19.0760, lng: 72.8777, time: '2025-12-15 23:30', status: 'responded', type: 'Ambulance' },
  { id: 3, name: 'Amit Kumar', phone: '+91-8765432109', lat: 12.9716, lng: 77.5946, time: '2025-12-15 22:15', status: 'resolved', type: 'Police' },
  { id: 4, name: 'Sneha Reddy', phone: '+91-7654321098', lat: 17.3850, lng: 78.4867, time: '2025-12-15 21:00', status: 'active', type: 'Ambulance' },
  { id: 5, name: 'Vikram Singh', phone: '+91-6543210987', lat: 26.9124, lng: 75.7873, time: '2025-12-15 20:30', status: 'responded', type: 'Police' },
];
