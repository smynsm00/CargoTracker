import React, { useState } from 'react';
import { useShipments } from '../../context/ShipmentContext';
import { Zap, KeyRound, QrCode, Lock, User, ArrowRight, ShieldCheck, Camera } from 'lucide-react';

export const LoginModal = () => {
  const { loginWithCustom, loginWithQR } = useShipments();
  const [tab, setTab] = useState('CUSTOM'); // 'CUSTOM' or 'QR'

  // Custom Login State (Customer ID like CUST001)
  const [customerId, setCustomerId] = useState('CUST001');
  const [password, setPassword] = useState('CUST001');

  // QR Login State
  const [qrToken, setQrToken] = useState('a8f9x2k91b');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customerId.trim()) return;
    loginWithCustom(customerId.trim(), password.trim());
  };

  const handleQRSubmit = (e) => {
    e.preventDefault();
    if (!qrToken.trim()) return;
    loginWithQR(qrToken.trim());
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 3000, background: 'rgba(15, 23, 42, 0.65)' }}>
      <div className="modal-content" style={{ maxWidth: 480, padding: '2.25rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.2)' }}>
        
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
            <Zap className="w-7 h-7 text-blue-600" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
            Cargo<span className="gradient-text">Tracker</span> 로그인
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            서비스 이용 및 추적 시스템 접근을 위해 인증 방식을 선택해 주세요.
          </p>
        </div>

        {/* 2-Way Tab Switcher: Custom 로그인 vs QR 로그인 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: '#f1f5f9', padding: '0.35rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <button 
            type="button"
            onClick={() => setTab('CUSTOM')}
            style={{
              padding: '0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              background: tab === 'CUSTOM' ? '#ffffff' : 'transparent',
              color: tab === 'CUSTOM' ? '#2563eb' : '#64748b',
              boxShadow: tab === 'CUSTOM' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <KeyRound className="w-4 h-4" />
            Custom 로그인
          </button>

          <button 
            type="button"
            onClick={() => setTab('QR')}
            style={{
              padding: '0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              background: tab === 'QR' ? '#ffffff' : 'transparent',
              color: tab === 'QR' ? '#2563eb' : '#64748b',
              boxShadow: tab === 'QR' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <QrCode className="w-4 h-4" />
            QR 로그인
          </button>
        </div>

        {/* TAB 1: Custom 로그인 폼 (Customer ID) */}
        {tab === 'CUSTOM' && (
          <form onSubmit={handleCustomSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                <User className="w-3.5 h-3.5" />
                <span>고객사 아이디 (Customer ID)</span>
              </label>
              {/* Note: type="text" to allow Customer IDs like CUST001 without HTML5 @ validation error */}
              <input 
                type="text" 
                className="form-control mono" 
                placeholder="예: CUST001"
                value={customerId}
                onChange={e => setCustomerId(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                <Lock className="w-3.5 h-3.5" />
                <span>비밀번호 (Customer PW)</span>
              </label>
              <input 
                type="password" 
                className="form-control mono" 
                placeholder="예: CUST001"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}>
              <span>Custom 로그인하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 2: QR 로그인 폼 */}
        {tab === 'QR' && (
          <form onSubmit={handleQRSubmit} style={{ textAlign: 'center' }}>
            <div style={{ background: '#f8fafc', border: '1px dashed #2563eb', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ width: 80, height: 80, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 'var(--radius-sm)', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Camera className="w-8 h-8 text-blue-600" />
                <div style={{ position: 'absolute', inset: 4, border: '2px stroke #2563eb', borderRadius: 4, animation: 'pulse 1.5s infinite' }}></div>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.2rem' }}>
                모바일 카메라 / QR 스캐너 연동 중
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                발급받으신 고유 QR 코드를 스캔하거나 아래 보안 토큰을 입력하세요.
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                <QrCode className="w-3.5 h-3.5 text-blue-600" />
                <span>QR 보안 토큰 입력</span>
              </label>
              <input 
                type="text" 
                className="form-control mono" 
                placeholder="예: a8f9x2k91b"
                value={qrToken}
                onChange={e => setQrToken(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}>
              <span>QR 스캔 / 인증 로그인</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Demo Entrance */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <button 
            type="button" 
            onClick={() => loginWithCustom('CUST001', 'CUST001')}
            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
          >
            ⚡ CUST001 빠른 접속
          </button>
          <button 
            type="button" 
            onClick={() => loginWithQR('a8f9x2k91b')}
            style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 600, cursor: 'pointer' }}
          >
            📱 QR 빠른 접속
          </button>
        </div>

      </div>
    </div>
  );
};
