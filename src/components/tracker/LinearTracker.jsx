import React from 'react';
import { motion } from 'framer-motion';
import { Ship, Plane } from 'lucide-react';

export const LinearTracker = ({ shipment }) => {
  const pct = Math.min(100, Math.max(0, shipment.progress_pct || 0));
  const isAir = shipment.transport_mode === 'AIR';

  return (
    <div className="tracker-visual-container">
      {/* Route Header */}
      <div className="route-header">
        <div className="location-box">
          <span class="code mono">{shipment.origin_code || 'ORG'}</span>
          <span className="city">{shipment.origin}</span>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <span>국제 운송 시각화 트래커</span>
        </div>
        <div className="location-box destination">
          <span className="code mono">{shipment.destination_code || 'DST'}</span>
          <span className="city">{shipment.destination}</span>
        </div>
      </div>

      {/* Linear Track Line */}
      <div className="track-line-wrapper">
        <div className="track-line-bg"></div>
        <motion.div 
          className="track-line-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Animated Vehicle Pin */}
        <motion.div 
          className="vehicle-pin"
          initial={{ left: '0%' }}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="progress-tooltip mono">{pct}% 진행 완료</div>
          {isAir ? (
            <Plane style={{ width: 24, height: 24, color: '#fff' }} />
          ) : (
            <Ship style={{ width: 24, height: 24, color: '#fff' }} />
          )}
        </motion.div>
      </div>

      {/* Milestones Nodes */}
      {shipment.milestones && (
        <div className="milestones-track">
          {shipment.milestones.map((m, idx) => {
            const statusClass = m.status ? m.status.toLowerCase().replace('_', '-') : 'pending';
            return (
              <div key={idx} className={`milestone-node ${statusClass}`}>
                <div className="milestone-dot"></div>
                <div className="milestone-label">{m.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 2 }}>
                  {m.date || ''}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
