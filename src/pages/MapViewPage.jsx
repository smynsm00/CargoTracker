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
    // Add class to body to handle map view layout
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
    <main className="map-page-container">
      {/* Area A: Interactive Map Component (70% Desktop / 100% Mobile) */}
      <div className="map-area-container">
        <MapView 
          shipment={selectedShipment} 
          allShipments={customerShipments}
          showAll={showAllMode}
          onSelectShipment={handleSelectShipmentFromMap}
        />
      </div>

      {/* Area B: Cargo Form & AI Risk Details Panel (30% Desktop / 100% Mobile Stack) */}
      <div className="panel-area-container">
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
