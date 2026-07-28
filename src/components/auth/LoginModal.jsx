import React, { useState } from 'react';
import { useShipments } from '../../context/ShipmentContext';
import { KeyRound, QrCode, ArrowRight, ShieldCheck, Zap, UserPlus } from 'lucide-react';

export const LoginModal = () => {
  const { loginWithCustom, loginWithQR, showToast } = useShipments();
  const [loginType, setLoginType] = useState('CUSTOM'); // 'CUSTOM' vs 'QR'

  // Custom Login State
  const [customId, setCustomId] = useState('CUST001');
  const [customPw, setCustomPw] = useState('CUST001');

  // QR Login State
  const [qrToken, setQrToken] = useState('a8f9x2k91b');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customId.trim()) {
      showToast('고객사 아이디를 입력해주세요.', 'danger');
      return;
    }
    loginWithCustom(customId, customPw);
  };

  const handleQRSubmit = (e) => {
    e.preventDefault();
    if (!qrToken.trim()) {
      showToast('보안 QR 토큰을 입력해주세요.', 'danger');
      return;
    }
    loginWithQR(qrToken);
  };

  const handleSignUpClick = () => {
    showToast('[회원가입 안내] 신규 고객사 계정 등록은 관리자(admin@cargotracker.com)에게 신청해 주세요.', 'info');
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 9999, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(10px)' }}>
      <div className="modal-content" style={{ maxWidth: 460, borderRadius: 'var(--radius-lg)', padding: '2.25rem', background: '#ffffff', border: '1px solid #cbd5e1', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', width: 48, height: 48, borderRadius: '50%', background: '#e0f2fe', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            Cargo<span className="gradient-text">Tracker</span> 로그인
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            서비스 이용 및 추적 시스템 접근을 위해 인증 방식을 선택해 주세요.
          </p>
        </div>

        {/* 2-Way Login Type Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: '#f1f5f9', padding: '0.35rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setLoginType('CUSTOM')}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              background: loginType === 'CUSTOM' ? '#ffffff' : 'transparent',
              color: loginType === 'CUSTOM' ? '#2563eb' : '#64748b',
              boxShadow: loginType === 'CUSTOM' ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <KeyRound className="w-4 h-4" />
            Custom 로그인
          </button>

          <button
            type="button"
            onClick={() => setLoginType('QR')}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              background: loginType === 'QR' ? '#ffffff' : 'transparent',
              color: loginType === 'QR' ? '#2563eb' : '#64748b',
              boxShadow: loginType === 'QR' ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <QrCode className="w-4 h-4" />
            QR 로그인
          </button>
        </div>

        {/* Mode 1: Custom Login Form */}
        {loginType === 'CUSTOM' && (
          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#334155', fontWeight: 700, fontSize: '0.85rem' }}>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>고객사 아이디 (Customer ID)</span>
              </label>
              <input 
                type="text" 
                className="form-control mono" 
                placeholder="예: CUST001, CUST002, CUST003"
                value={customId}
                onChange={e => setCustomId(e.target.value)}
                style={{ padding: '0.75rem 1rem', fontSize: '0.95rem' }}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#334155', fontWeight: 700, fontSize: '0.85rem' }}>
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span>비밀번호 (Customer PW)</span>
              </label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="비밀번호 입력..."
                value={customPw}
                onChange={e => setCustomPw(e.target.value)}
                style={{ padding: '0.75rem 1rem', fontSize: '0.95rem' }}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem 1.5rem', fontSize: '1rem', fontWeight: 800, marginTop: '0.5rem', borderRadius: 'var(--radius-md)' }}
            >
              <span>Custom 로그인하기</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}

        {/* Mode 2: QR Token Login Form */}
        {loginType === 'QR' && (
          <form onSubmit={handleQRSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#334155', fontWeight: 700, fontSize: '0.85rem' }}>
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>보안 QR 토큰 (QR Token)</span>
              </label>
              <input 
                type="text" 
                className="form-control mono" 
                placeholder="예: a8f9x2k91b"
                value={qrToken}
                onChange={e => setQrToken(e.target.value)}
                style={{ padding: '0.75rem 1rem', fontSize: '0.95rem' }}
                required
              />
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
                발급받으신 10자리 고유 QR 보안 토큰을 입력하시면 아이디 없이 일회성 보안 접근이 가능합니다.
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem 1.5rem', fontSize: '1rem', fontWeight: 800, marginTop: '0.5rem', background: 'linear-gradient(135deg, #059669, #0284c7)', borderRadius: 'var(--radius-md)' }}
            >
              <span>QR 인증 접속하기</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}

        {/* Bottom Quick Links: Left button changed to '회원가입' */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b' }}>
          {/* Changed from 'CUST001 빠른 접속' to '회원가입' */}
          <button 
            type="button" 
            onClick={handleSignUpClick}
            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <UserPlus className="w-4 h-4 text-blue-600" />
            회원가입
          </button>

          <button 
            type="button" 
            onClick={() => { setLoginType('QR'); }}
            style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            📱 QR 빠른 접속
          </button>
        </div>

      </div>
    </div>
  );
};
