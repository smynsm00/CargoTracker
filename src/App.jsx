import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

  return (
    <>
      <Navbar />

      {/* Initial Screen Login Gate (Custom Login / QR Login) */}
      {!isAuthenticated && <LoginModal />}

      <Routes>
        {/* Post-Login Default Page: Admin Dashboard (국제 운송 관리 대시보드) */}
        <Route path="/" element={<AdminPage />} />
        
        {/* Map Visual Page (Opened when clicking a tracking number) */}
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
