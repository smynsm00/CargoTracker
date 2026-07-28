import React from 'react';
import { useShipments } from '../../context/ShipmentContext';

export const StatsOverview = () => {
  const { shipments, user } = useShipments();

  const currentCustomerId = user?.customer_id || 'CUST001';
  const customerShipments = shipments.filter(s => {
    if (!s.customer_id) return true;
    return s.customer_id.toUpperCase() === currentCustomerId.toUpperCase();
  });

  const totalCount = customerShipments.length;
  const inTransitCount = customerShipments.filter(s => s.status === 'IN_TRANSIT').length;
  const delayedCount = customerShipments.filter(s => s.status === 'DELAYED').length;
  const completedCount = customerShipments.filter(s => s.status === 'COMPLETED').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
      <div className="glass-card" style={{ background: '#ffffff' }}>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>총 선적 건수</div>
        <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{totalCount}</div>
      </div>

      <div className="glass-card" style={{ background: '#ffffff' }}>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>정상 운송 중</div>
        <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7' }}>{inTransitCount}</div>
      </div>

      <div className="glass-card" style={{ background: '#ffffff' }}>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>일정 지연 건수</div>
        <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706' }}>{delayedCount}</div>
      </div>

      {/* 4th Card Updated to '운송 완료 건수' (Replaces obsolete '발송 실패 알림') */}
      <div className="glass-card" style={{ background: '#ffffff' }}>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>운송 완료 건수</div>
        <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>{completedCount}</div>
      </div>
    </div>
  );
};
