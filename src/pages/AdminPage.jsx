import React, { useState } from 'react';
import { useShipments } from '../context/ShipmentContext';
import { useLanguage } from '../context/LanguageContext';
import { StatsOverview } from '../components/admin/StatsOverview';
import { ShipmentTable } from '../components/admin/ShipmentTable';
import { ShipmentModal } from '../components/admin/ShipmentModal';
import { QRCodeShareCard } from '../components/tracker/QRCodeShareCard';
import { X } from 'lucide-react';

export const AdminPage = () => {
  const { shipments, notifications } = useShipments();
  const { t } = useLanguage();
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrModalShipment, setQrModalShipment] = useState(null);

  const handleShowQR = (s) => {
    setQrModalShipment(s);
  };

  return (
    <main className="container">
      {/* Top Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>{t('dashboardTitle')}</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          {t('dashboardSubtitle')}
        </p>
      </div>

      {/* Stats Summary */}
      <StatsOverview shipments={shipments} notifications={notifications} />

      {/* Shipment Table */}
      <ShipmentTable onShowQR={handleShowQR} />

      {/* Edit / New Shipment Modal */}
      {isModalOpen && (
        <ShipmentModal 
          shipment={selectedShipment}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* QR Code Modal */}
      {qrModalShipment && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: 480, textAlign: 'center' }}>
            <div className="modal-header">
              <h3 className="modal-title">[{qrModalShipment.tracking_number}] QR & Share Link</h3>
              <button className="modal-close" onClick={() => setQrModalShipment(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <QRCodeShareCard token={qrModalShipment.public_token} />
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <button className="btn-secondary" onClick={() => setQrModalShipment(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
