import React from 'react';
import { useShipments } from '../../context/ShipmentContext';
import { useLanguage } from '../../context/LanguageContext';

export const StatsOverview = () => {
  const { shipments, user } = useShipments();
  const { t } = useLanguage();

  const currentCustomerId = user?.customer_id || 'CUST001';
  const customerShipments = shipments.filter(s => {
    if (!s.customer_id) return true;
    return s.customer_id.toUpperCase() === currentCustomerId.toUpperCase();
  });

  const totalCount = customerShipments.length;
  
  const delayedCount = customerShipments.filter(s => 
    s.status === 'DELAYED' || (s.status !== 'COMPLETED' && s.original_eta && s.current_eta && s.original_eta !== s.current_eta)
  ).length;

  const inTransitCount = customerShipments.filter(s => 
    s.status === 'IN_TRANSIT' && (!s.original_eta || !s.current_eta || s.original_eta === s.current_eta)
  ).length;

  const completedCount = customerShipments.filter(s => s.status === 'COMPLETED').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
      <div className="glass-card" style={{ background: '#ffffff' }}>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>{t('statTotalCount')}</div>
        <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{totalCount}</div>
      </div>

      <div className="glass-card" style={{ background: '#ffffff' }}>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>{t('statInTransit')}</div>
        <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7' }}>{inTransitCount}</div>
      </div>

      <div className="glass-card" style={{ background: '#ffffff' }}>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>{t('statDelayed')}</div>
        <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706' }}>{delayedCount}</div>
      </div>

      <div className="glass-card" style={{ background: '#ffffff' }}>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>{t('statCompleted')}</div>
        <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>{completedCount}</div>
      </div>
    </div>
  );
};
