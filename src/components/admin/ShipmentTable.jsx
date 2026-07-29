import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, CheckCircle2, Clock, AlertTriangle, MapPin, Calendar, ArrowUpDown } from 'lucide-react';
import { useShipments } from '../../context/ShipmentContext';
import { useLanguage } from '../../context/LanguageContext';

export const ShipmentTable = ({ onShowQR }) => {
  const { shipments, user } = useShipments();
  const { lang, t } = useLanguage();
  const [filter, setFilter] = useState('ALL');
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  // Filter shipments by customer_id (e.g. CUST001)
  const currentCustomerId = user?.customer_id || 'CUST001';

  const customerShipments = shipments.filter(s => {
    if (!s.customer_id) return true;
    return s.customer_id.toUpperCase() === currentCustomerId.toUpperCase();
  });

  // Sort by departure_date
  const sortedShipments = [...customerShipments].sort((a, b) => {
    const dateA = new Date(a.departure_date || '2026-07-01');
    const dateB = new Date(b.departure_date || '2026-07-01');
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  const filtered = sortedShipments.filter(s => {
    if (filter === 'ALL') return true;
    const isDelayed = s.status === 'DELAYED' || (s.status !== 'COMPLETED' && s.original_eta && s.current_eta && s.original_eta !== s.current_eta);
    if (filter === 'DELAYED') return isDelayed;
    if (filter === 'IN_TRANSIT') return s.status === 'IN_TRANSIT' && !isDelayed;
    return s.status === filter;
  });

  const handleTrackingClick = (s) => {
    navigate(`/map?token=${s.public_token}`);
  };

  const formatEngDate = (dateStr) => {
    if (!dateStr) return '';
    if (lang !== 'en') return dateStr;
    try {
      const [year, month, day] = dateStr.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const mIdx = parseInt(month, 10) - 1;
      return `${months[mIdx]} ${parseInt(day, 10)}, ${year}`;
    } catch {
      return dateStr;
    }
  };

  const displayCustName = lang === 'en'
    ? (user?.customer_name === '(주) 한진글로벌물류' ? 'Hanjin Global Logistics Co., Ltd.' : (user?.customer_name || 'Hanjin Global Logistics'))
    : (user?.customer_name || '(주) 한진글로벌물류');

  return (
    <div className="glass-card" style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t('tableTitle')}</h2>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.1rem' }}>
            {t('tableSubtext')}<strong style={{ color: '#0284c7' }}>{displayCustName} ({currentCustomerId})</strong> • <strong style={{ color: '#2563eb' }}>{customerShipments.length}</strong> {t('tableSubtextCount')}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Sort Toggle Button */}
          <button
            type="button"
            onClick={() => setSortAsc(!sortAsc)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
            <span>{sortAsc ? t('sortOrderAsc') : t('sortOrderDesc')}</span>
          </button>

          {/* Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <select 
              className="form-control" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              <option value="ALL">{t('filterAll')} ({customerShipments.length})</option>
              <option value="IN_TRANSIT">{t('filterInTransit')}</option>
              <option value="DELAYED">{t('filterDelayed')}</option>
              <option value="COMPLETED">{t('filterCompleted')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ minWidth: '160px' }}>{t('colTrackingNo')}</th>
              <th style={{ minWidth: '220px' }}>{t('colRouteMode')}</th>
              <th style={{ minWidth: '130px' }}>{t('colProgress')}</th>
              <th style={{ color: '#0284c7', background: '#f0f9ff', minWidth: '120px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t('colETD')}</span>
                </div>
              </th>
              <th style={{ minWidth: '130px' }}>{t('colETA')}</th>
              <th style={{ minWidth: '120px', textAlign: 'center' }}>{t('colStatus')}</th>
              <th style={{ width: '50px', textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  {lang === 'en' ? 'No shipment records found.' : '등록된 선적 정보가 없습니다.'}
                </td>
              </tr>
            ) : (
              filtered.map(s => {
                const isDelayed = s.status === 'DELAYED' || (s.status !== 'COMPLETED' && s.original_eta && s.current_eta && s.original_eta !== s.current_eta);

                return (
                  <tr key={s.id}>
                    {/* Tracking Number Cell */}
                    <td 
                      className="mono" 
                      onClick={() => handleTrackingClick(s)}
                      style={{ fontWeight: 700, cursor: 'pointer', background: 'rgba(224, 242, 254, 0.4)', borderRadius: 'var(--radius-sm)' }}
                      title={lang === 'en' ? "Click tracking number to view 70% interactive route map" : "선적 번호 클릭 시 70% 항로 지도시각화 페이지로 이동합니다"}
                    >
                      <div style={{ color: 'var(--primary-blue)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.4rem', borderRadius: 6 }}>
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span style={{ textDecoration: 'underline' }}>{s.tracking_number}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.origin} ➔ {s.destination}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{s.carrier_name} ({s.transport_mode})</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,0.08)', borderRadius: 4, overflow: 'hidden', width: 60 }}>
                          <div style={{ width: `${s.progress_pct}%`, height: '100%', background: 'var(--grad-primary)' }}></div>
                        </div>
                        <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 700 }}>{s.progress_pct}%</span>
                      </div>
                    </td>

                    {/* Departure Date Cell (출항일) */}
                    <td className="mono" style={{ fontWeight: 700, color: '#0369a1', background: '#f0f9ff' }}>
                      {formatEngDate(s.departure_date) || '2026-07-28'}
                    </td>

                    {/* Multi-line ETA */}
                    <td>
                      {s.original_eta !== s.current_eta ? (
                        <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ textDecoration: 'line-through', color: 'var(--text-dim)' }}>{formatEngDate(s.original_eta)}</span>
                          <span style={{ color: 'var(--status-danger)', fontWeight: 700 }}>➔ {formatEngDate(s.current_eta)}</span>
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.85rem' }}>{formatEngDate(s.current_eta)}</div>
                      )}
                    </td>

                    {/* Status Badge Cell */}
                    <td style={{ textAlign: 'center' }}>
                      {s.status === 'COMPLETED' ? (
                        <span className="badge badge-completed" style={{ display: 'inline-flex' }}><CheckCircle2 className="w-3 h-3" /> {t('statusCompleted')}</span>
                      ) : isDelayed ? (
                        <span className="badge badge-delayed" style={{ display: 'inline-flex' }}><AlertTriangle className="w-3 h-3" /> {t('statusDelayed')}</span>
                      ) : (
                        <span className="badge badge-in-transit" style={{ display: 'inline-flex' }}><Clock className="w-3 h-3" /> {t('statusInTransit')}</span>
                      )}
                    </td>

                    {/* Icon-only QR Code Button */}
                    <td style={{ width: '50px', textAlign: 'center' }}>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '0.35rem 0.45rem', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} 
                        onClick={() => onShowQR(s)}
                        title={lang === 'en' ? "View QR Code & Secure Link" : "QR 코드 및 보안 추적 링크 보기"}
                      >
                        <QrCode className="w-4 h-4 text-blue-600" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
