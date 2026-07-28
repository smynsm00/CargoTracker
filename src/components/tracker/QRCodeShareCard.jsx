import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, QrCode } from 'lucide-react';
import { useShipments } from '../../context/ShipmentContext';

export const QRCodeShareCard = ({ token }) => {
  const { showToast } = useShipments();
  const shareUrl = `${window.location.origin}/track?token=${token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('추적 URL 링크가 클립보드에 복사되었습니다.');
    });
  };

  return (
    <div className="qr-share-box">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <QrCode className="w-5 h-5 text-cyan-400" />
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>고유 추적 QR 코드 & 공유 링크</h3>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        이 QR 코드를 스캔하거나 링크를 공유하면 로그인 없이 실시간 현황을 바로 조회할 수 있습니다.
      </p>
      <div className="qr-canvas-wrapper">
        <QRCodeCanvas value={shareUrl} size={160} level="H" />
      </div>
      <div className="share-link-input-group" style={{ maxWidth: 480 }}>
        <input 
          type="text" 
          className="form-control mono" 
          value={shareUrl} 
          readOnly 
          style={{ fontSize: '0.8rem', textOverflow: 'ellipsis' }} 
        />
        <button className="btn-secondary" onClick={handleCopy} style={{ whiteSpace: 'nowrap' }}>
          <Copy className="w-3.5 h-3.5" />
          링크 복사
        </button>
      </div>
    </div>
  );
};
