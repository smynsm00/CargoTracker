import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';
import { LinearTracker } from '../components/tracker/LinearTracker';
import { ETAComparisonCard } from '../components/tracker/ETAComparisonCard';
import { QRCodeShareCard } from '../components/tracker/QRCodeShareCard';
import { Search, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const TrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getShipmentByToken, getShipmentByTrackingNumber } = useShipments();
  const [searchInput, setSearchInput] = useState('');

  const token = searchParams.get('token');
  const trackingNo = searchParams.get('tracking');

  let currentShipment = null;
  if (token) {
    currentShipment = getShipmentByToken(token);
  } else if (trackingNo) {
    currentShipment = getShipmentByTrackingNumber(trackingNo);
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchParams({ tracking: searchInput.trim() });
  };

  return (
    <main className="container">
      {/* Top Search Bar */}
      <div style={{ marginBottom: '2rem', maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="선적 번호 (예: CT-2026-8801) 또는 보안 토큰 입력..." 
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-primary">
            <Search className="w-4 h-4" />
            조회하기
          </button>
        </form>
      </div>

      {!currentShipment ? (
        /* Empty / Not Found State */
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: 680, margin: '0 auto' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>선적 정보를 찾을 수 없습니다</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            전달받으신 QR 코드를 다시 스캔하시거나, 올바른 선적 번호/보안 토큰을 입력해 주세요.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/track?token=a8f9x2k91b" className="btn-secondary">샘플 선적건 (해상 70%) 보기</Link>
            <Link to="/track?token=p3m9z4q70c" className="btn-secondary">샘플 선적건 (항공 35%) 보기</Link>
          </div>
        </div>
      ) : (
        /* Main Tracker Visual Card (REQ-01, REQ-02, REQ-07) */
        <div className="glass-card">
          {/* Card Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h1 className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                  {currentShipment.tracking_number}
                </h1>
                {currentShipment.status === 'COMPLETED' ? (
                  <span className="badge badge-completed"><CheckCircle2 className="w-3 h-3" /> 운송 완료</span>
                ) : currentShipment.status === 'DELAYED' ? (
                  <span className="badge badge-delayed"><AlertCircle className="w-3 h-3" /> 일정 지연</span>
                ) : (
                  <span className="badge badge-in-transit"><Clock className="w-3 h-3" /> 운송 중</span>
                )}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {currentShipment.carrier_name} • {currentShipment.vessel_flight_no}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>No-Login 보안 인증 조회 완료</span>
              <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)' }}>React 토큰 접근중</span>
            </div>
          </div>

          {/* REQ-01 Linear Progress Visualization */}
          <LinearTracker shipment={currentShipment} />

          {/* REQ-02 ETA Comparison & Delay Cause */}
          <ETAComparisonCard shipment={currentShipment} />

          {/* REQ-03 & REQ-07 QR Code & Share Box */}
          <QRCodeShareCard token={currentShipment.public_token} />
        </div>
      )}
    </main>
  );
};
