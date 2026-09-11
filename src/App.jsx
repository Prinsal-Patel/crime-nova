import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import CrimeMapPage from './pages/CrimeMapPage';
import DashboardPage from './pages/DashboardPage';
import PredictionPage from './pages/PredictionPage';
import SOSPage from './pages/SOSPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/map" element={<CrimeMapPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/prediction" element={<PredictionPage />} />
          <Route path="/sos" element={<SOSPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
