import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useShipments } from '../../context/ShipmentContext';
import { useLanguage } from '../../context/LanguageContext';
import { Zap, ShieldCheck, Search, LogOut, User, Map, ChevronDown, Globe } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useShipments();
  const { lang, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [navSearch, setNavSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (!navSearch.trim()) return;
    navigate(`/map?tracking=${encodeURIComponent(navSearch.trim())}`);
    setNavSearch('');
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    logout();
  };

  // Display customer_name
  const customerDisplayName = lang === 'en' 
    ? (user?.customer_name === '(주) 한진글로벌물류' ? 'Hanjin Global Logistics Co., Ltd.' : (user?.customer_name || 'Hanjin Global Logistics'))
    : (user?.customer_name || user?.name || '(주) 한진글로벌물류');

  return (
    <nav className="navbar" style={{ position: 'relative', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
      {/* Left-Aligned Group: Brand Logo & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" className="nav-brand">
          <Zap className="w-6 h-6 text-blue-600" />
          <span>Cargo<span className="gradient-text">Tracker</span></span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleNavSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid #cbd5e1', width: 260 }}>
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

      {/* Right Navigation Links & Language Switcher */}
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        
        {/* Language Switcher Toggle Button (🇰🇷 KO ↔ 🇺🇸 EN) */}
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

        {/* Button: Global Route Map */}
        <Link 
          to="/map?all=true" 
          className={`nav-link ${location.pathname === '/map' && location.search.includes('all=true') ? 'active' : ''}`} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
        >
          <Map className="w-4 h-4 text-blue-600" />
          {t('navMap')}
        </Link>

        {/* Button: Shipment Control Panel */}
        <Link to="/" className="btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
          <ShieldCheck className="w-4 h-4" />
          {t('navDashboard')}
        </Link>

        {/* Customer Name Dropdown Button */}
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
      </div>
    </nav>
  );
};
