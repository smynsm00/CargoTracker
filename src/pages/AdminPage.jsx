import React, { useState } from 'react';
import { useShipments } from '../context/ShipmentContext';
import { StatsOverview } from '../components/admin/StatsOverview';
import { ShipmentTable } from '../components/admin/ShipmentTable';
import { ShipmentModal } from '../components/admin/ShipmentModal';
import { QRCodeShareCard } from '../components/tracker/QRCodeShareCard';
import { X } from 'lucide-react';

export const AdminPage = () => {
  const { shipments, notifications } = useShipments();
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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>운송현황관리</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          전체 선적 건의 현황, 출항일 기준 진행률 및 운송 상태를 통합 관리합니다.
        </p>
      </div>

      {/* Stats Summary */}
      <StatsOverview shipments={shipments} notifications={notifications} />

      {/* Shipment Table */}
      <ShipmentTable onShowQR={handleShowQR} />

      {/* Edit Shipment Modal */}
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
              <h3 className="modal-title">[{qrModalShipment.tracking_number}] QR & 보안 추적 링크</h3>
              <button className="modal-close" onClick={() => setQrModalShipment(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <QRCodeShareCard token={qrModalShipment.public_token} />
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <button className="btn-secondary" onClick={() => setQrModalShipment(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
