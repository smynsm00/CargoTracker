import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';
import { MapView } from '../components/tracker/MapView';
import { CargoRegisterCard } from '../components/tracker/CargoRegisterCard';

export const MapViewPage = () => {
  const [searchParams] = useSearchParams();
  const { shipments, user, getShipmentByToken, getShipmentByTrackingNumber } = useShipments();

  const token = searchParams.get('token');
  const trackingNo = searchParams.get('tracking');
  const isAllParam = searchParams.get('all') === 'true';

  // Filter shipments by customer_id
  const currentCustomerId = user?.customer_id || 'CUST001';
  const customerShipments = shipments.filter(s => {
    if (!s.customer_id) return true;
    return s.customer_id.toUpperCase() === currentCustomerId.toUpperCase();
  });

  const [selectedShipment, setSelectedShipment] = useState(() => customerShipments[0] || null);
  const [showAllMode, setShowAllMode] = useState(isAllParam || (!token && !trackingNo));

  useEffect(() => {
    // Add class to body to disable outer window scrollbars on map view
    document.body.classList.add('map-view-active');
    return () => {
      document.body.classList.remove('map-view-active');
    };
  }, []);

  useEffect(() => {
    if (isAllParam) {
      setShowAllMode(true);
    } else if (token) {
      setShowAllMode(false);
      const found = getShipmentByToken(token);
      if (found) setSelectedShipment(found);
    } else if (trackingNo) {
      setShowAllMode(false);
      const found = getShipmentByTrackingNumber(trackingNo);
      if (found) setSelectedShipment(found);
    } else {
      setShowAllMode(true);
    }
  }, [token, trackingNo, isAllParam, shipments]);

  const handleSelectShipmentFromMap = (shp) => {
    setSelectedShipment(shp);
  };

  return (
    <main style={{ 
      display: 'flex', 
      width: '100%', 
      height: 'calc(100vh - 64px)', 
      maxHeight: 'calc(100vh - 64px)',
      overflow: 'hidden', 
      background: '#eef6ff',
      boxSizing: 'border-box'
    }}>
      {/* Area A: 70% Width Interactive Map Component */}
      <div style={{ width: '70%', height: '100%', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        <MapView 
          shipment={selectedShipment} 
          allShipments={customerShipments}
          showAll={showAllMode}
          onSelectShipment={handleSelectShipmentFromMap}
        />
      </div>

      {/* Area B: 30% Width Cargo Form & Details Panel (Zero Scrollbar) */}
      <div style={{ width: '30%', height: '100%', overflow: 'hidden', background: '#ffffff', borderLeft: '1px solid #cbd5e1', boxShadow: '-5px 0 20px rgba(0,0,0,0.03)', boxSizing: 'border-box', flexShrink: 0 }}>
        <CargoRegisterCard 
          selectedShipment={selectedShipment}
          onSelectShipment={(newShp) => {
            setSelectedShipment(newShp);
          }} 
        />
      </div>
    </main>
  );
};
