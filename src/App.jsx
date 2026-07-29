import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useShipments } from './context/ShipmentContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginModal } from './components/auth/LoginModal';
import { AdminPage } from './pages/AdminPage';
import { MapViewPage } from './pages/MapViewPage';
import { TrackingPage } from './pages/TrackingPage';

export function App() {
  const { isAuthenticated } = useShipments();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const tracking = searchParams.get('tracking');

  // Bypass login gate if accessing via QR Code or Share Link (?token=... or ?tracking=... or /track)
  const isPublicShareAccess = Boolean(token || tracking || location.pathname === '/track');

  return (
    <>
      <Navbar />

      {/* Show Login Modal ONLY if NOT authenticated AND NOT accessing via QR Code / Share Link */}
      {!isAuthenticated && !isPublicShareAccess && <LoginModal />}

      <Routes>
        {/* Post-Login Default Page: Admin Dashboard */}
        <Route path="/" element={<AdminPage />} />
        
        {/* Map Visual Page (No login required when accessing via QR Code / Share Token) */}
        <Route path="/map" element={<MapViewPage />} />

        {/* Public Tracking Page */}
        <Route path="/track" element={<TrackingPage />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;
