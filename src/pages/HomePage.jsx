import React, { useState } from 'react';
import { useShipments } from '../context/ShipmentContext';
import { MapView } from '../components/tracker/MapView';
import { CargoRegisterCard } from '../components/tracker/CargoRegisterCard';

export const HomePage = () => {
  const { shipments } = useShipments();
  const [selectedShipment, setSelectedShipment] = useState(() => shipments[0] || null);

  return (
    <main style={{ display: 'grid', gridTemplateColumns: '70% 30%', width: '100vw', height: 'calc(100vh - 72px)', overflow: 'hidden', background: '#eef6ff' }}>
      {/* Area A: 70% Width Interactive Map Component */}
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
        <MapView shipment={selectedShipment} />
      </div>

      {/* Area B: 30% Width Cargo Form Panel (No Floating Box, Seamless Sidebar Panel) */}
      <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: '#ffffff', borderLeft: '1px solid #cbd5e1', boxShadow: '-5px 0 20px rgba(0,0,0,0.03)' }}>
        <CargoRegisterCard onSelectShipment={(newShp) => setSelectedShipment(newShp)} />
      </div>
    </main>
  );
};
