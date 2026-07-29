import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useShipments } from '../../context/ShipmentContext';
import { useLanguage } from '../../context/LanguageContext';
import { Zap, ShieldCheck, Search, LogOut, User, Map, ChevronDown, Globe, Menu, X, ArrowRight } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useShipments();
  const { lang, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [navSearch, setNavSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (!navSearch.trim()) return;
    navigate(`/map?tracking=${encodeURIComponent(navSearch.trim())}`);
    setNavSearch('');
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    logout();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Display customer_name
  const customerDisplayName = lang === 'en' 
    ? (user?.customer_name === '(주) 한진글로벌물류' ? 'Hanjin Global Logistics Co., Ltd.' : (user?.customer_name || 'Hanjin Global Logistics'))
    : (user?.customer_name || user?.name || '(주) 한진글로벌물류');

  return (
    <nav className="navbar" style={{ position: 'relative', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
      {/* Left-Aligned Group: Brand Logo & Desktop Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
          <Zap className="w-6 h-6 text-blue-600" />
          <span>Cargo<span className="gradient-text">Tracker</span></span>
        </Link>

        {/* Desktop Search Bar (Hidden on Mobile) */}
        <form className="desktop-search-form" onSubmit={handleNavSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid #cbd5e1', width: 260 }}>
          <Search className="w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder={lang === 'en' ? "Tracking No. / Token..." : "선적 번호 / 보안 토큰 검색..."}
            value={navSearch}
            onChange={e => setNavSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem', width: '100%', color: '#0f172a' }}
          />
        </form>
      </div>

      {/* Right Navigation Links: Desktop Mode (Section A Items) */}
      <div className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        
        {/* 1. Button: Global Route Map */}
        <Link 
          to="/map?all=true" 
          className={`nav-link ${location.pathname === '/map' && location.search.includes('all=true') ? 'active' : ''}`} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
        >
          <Map className="w-4 h-4 text-blue-600" />
          {t('navMap')}
        </Link>

        {/* 2. Button: Shipment Control Panel */}
        <Link to="/" className="btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
          <ShieldCheck className="w-4 h-4" />
          {t('navDashboard')}
        </Link>

        {/* 3. Customer Name Dropdown Button */}
        {isAuthenticated && (
          <div style={{ position: 'relative' }}>
            <button 
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#e0f2fe',
                color: '#0284c7',
                border: '1px solid #bae6fd',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <User className="w-4 h-4 text-blue-600" />
              <span>{customerDisplayName}</span>
              <ChevronDown className="w-3.5 h-3.5" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 0.5rem)',
                  width: 160,
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 12px 30px -5px rgba(0,0,0,0.15)',
                  padding: '0.35rem 0',
                  zIndex: 200
                }}
              >
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.65rem 1rem',
                    background: 'none',
                    border: 'none',
                    color: '#e11d48',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fff1f2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  {t('navLogout')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. Language Switcher Toggle Button */}
        <button
          type="button"
          onClick={toggleLanguage}
          title={lang === 'ko' ? "Switch to English Version" : "한국어 버전으로 전환"}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            padding: '0.35rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#1e293b',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease'
          }}
        >
          <Globe className="w-4 h-4 text-blue-600" />
          <span>{lang === 'ko' ? '🇺🇸 ENG' : '🇰🇷 KOR'}</span>
        </button>

      </div>

      {/* Mobile Controls: Globe Toggle + Hamburger Button B (Visible only on Mobile) */}
      <div className="mobile-controls-group" style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={toggleLanguage}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            background: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            padding: '0.3rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#1e293b',
            cursor: 'pointer'
          }}
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>{lang === 'ko' ? 'ENG' : 'KOR'}</span>
        </button>

        {/* Mobile Hamburger Button B (☰) */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#ffffff',
            border: 'none',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 4px 12px rgba(37,99,235,0.35)',
            fontWeight: 800
          }}
          aria-label="Toggle Mobile Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Slide-out Drawer Overlay Portal (Renders into document.body to escape navbar CSS clipping!) */}
      {isMobileMenuOpen && ReactDOM.createPortal(
        <div 
          className="mobile-drawer-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999999,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={closeMobileMenu}
        >
          <div 
            className="mobile-drawer-content"
            style={{
              width: '85%',
              maxWidth: '340px',
              height: '100vh',
              maxHeight: '100vh',
              background: '#ffffff',
              boxShadow: '-10px 0 35px rgba(0,0,0,0.3)',
              padding: '1.5rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              overflowY: 'auto',
              position: 'relative',
              zIndex: 10000000
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header: Title & Close Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.85rem', borderBottom: '1.5px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap className="w-6 h-6 text-blue-600" />
                <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a' }}>CargoTracker Menu</span>
              </div>
              <button 
                type="button" 
                onClick={closeMobileMenu}
                style={{ background: '#f1f5f9', border: 'none', color: '#475569', borderRadius: '50%', padding: '0.35rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Logged-in Customer User Info Card (Section A Item) */}
            {isAuthenticated && (
              <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)', border: '1px solid #bae6fd', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.2rem' }}>
                  Logged-in Customer (고객사)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.92rem', fontWeight: 800, color: '#0369a1' }}>
                  <User className="w-4 h-4 text-blue-600" />
                  <span>{customerDisplayName}</span>
                </div>
              </div>
            )}

            {/* Mobile Search Bar Inside Drawer */}
            <form onSubmit={handleNavSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #cbd5e1' }}>
              <Search className="w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder={lang === 'en' ? "Tracking No. / Token..." : "선적 번호 / 보안 토큰..."}
                value={navSearch}
                onChange={e => setNavSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem', width: '100%', color: '#0f172a', fontWeight: 600 }}
              />
            </form>

            {/* Section A Menu Links Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              
              {/* Section A Item 1: 전체항로맵 (Global Route Map) */}
              <Link 
                to="/map?all=true" 
                onClick={closeMobileMenu}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.1rem', 
                  borderRadius: 'var(--radius-md)', 
                  background: location.pathname === '/map' && location.search.includes('all=true') ? '#eff6ff' : '#f8fafc',
                  color: location.pathname === '/map' && location.search.includes('all=true') ? '#2563eb' : '#1e293b',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  border: location.pathname === '/map' && location.search.includes('all=true') ? '1.5px solid #93c5fd' : '1px solid #e2e8f0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Map className="w-5 h-5 text-blue-600" />
                  <span>{t('navMap')}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* Section A Item 2: 운송현황관리 (Shipment Control Panel) */}
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.1rem', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <ShieldCheck className="w-5 h-5 text-white" />
                  <span>{t('navDashboard')}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>

            {/* Language Switcher Section */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Language (언어 설정)</span>
              <button
                type="button"
                onClick={toggleLanguage}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#ffffff',
                  border: '1.5px solid #2563eb',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#2563eb',
                  cursor: 'pointer'
                }}
              >
                <Globe className="w-4 h-4 text-blue-600" />
                <span>{lang === 'ko' ? '🇺🇸 ENG Switch' : '🇰🇷 한국어 전환'}</span>
              </button>
            </div>

            {/* Logout Button */}
            {isAuthenticated && (
              <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    borderRadius: 'var(--radius-md)',
                    color: '#e11d48',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  {t('navLogout')}
                </button>
              </div>
            )}

          </div>
        </div>,
        document.body
      )}

    </nav>
  );
};
