import React from 'react';
import { useShipments } from '../../context/ShipmentContext';
import { Info, AlertTriangle } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useShipments();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type === 'error' ? 'toast-error' : ''}`}>
          {t.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-red-400" />
          ) : (
            <Info className="w-5 h-5 text-cyan-400" />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};
