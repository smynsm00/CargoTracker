import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, QrCode, ExternalLink } from 'lucide-react';
import { useShipments } from '../../context/ShipmentContext';
import { useLanguage } from '../../context/LanguageContext';

export const QRCodeShareCard = ({ token }) => {
  const { showToast } = useShipments();
  const { lang } = useLanguage();

  // Generate robust share URL for interactive route map
  const origin = window.location.origin;
  const shareUrl = `${origin}/map?token=${token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast(lang === 'en' ? 'Tracking URL copied to clipboard!' : '추적 URL 링크가 클립보드에 복사되었습니다.');
    });
  };

  const handleOpenLink = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="qr-share-box" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '1.25rem', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
        <QrCode className="w-5 h-5 text-blue-600" />
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
          {lang === 'en' ? 'Unique Tracking QR Code & Share Link' : '고유 추적 QR 코드 & 공유 링크'}
        </h3>
      </div>

      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1rem', lineHeight: 1.4 }}>
        {lang === 'en' 
          ? 'Scan this QR code or share the URL to view live shipment status instantly without signing in.' 
          : '이 QR 코드를 스캔하거나 링크를 공유하면 로그인 없이 실시간 현황을 바로 조회할 수 있습니다.'}
      </p>

      {/* QR Code Canvas */}
      <div className="qr-canvas-wrapper" style={{ background: '#ffffff', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'inline-block', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
        <QRCodeCanvas value={shareUrl} size={170} level="H" includeMargin={true} />
      </div>

      {/* Share Link Input & Action Buttons */}
      <div className="share-link-input-group" style={{ display: 'flex', gap: '0.4rem', maxWidth: 460, margin: '0 auto' }}>
        <input 
          type="text" 
          className="form-control mono" 
          value={shareUrl} 
          readOnly 
          style={{ fontSize: '0.78rem', textOverflow: 'ellipsis', background: '#ffffff', color: '#0284c7', fontWeight: 700 }} 
        />
        <button 
          className="btn-secondary" 
          onClick={handleCopy} 
          style={{ whiteSpace: 'nowrap', padding: '0.45rem 0.75rem', fontSize: '0.82rem', fontWeight: 700 }}
        >
          <Copy className="w-4 h-4" />
          {lang === 'en' ? 'Copy Link' : '링크 복사'}
        </button>
        <button 
          className="btn-primary" 
          onClick={handleOpenLink} 
          style={{ whiteSpace: 'nowrap', padding: '0.45rem 0.75rem', fontSize: '0.82rem', fontWeight: 700 }}
          title="새 탭에서 바로 이동"
        >
          <ExternalLink className="w-4 h-4" />
          {lang === 'en' ? 'Open' : '열기'}
        </button>
      </div>
    </div>
  );
};
