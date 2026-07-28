import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, CheckCircle2, Clock, AlertTriangle, MapPin, Calendar, ArrowUpDown } from 'lucide-react';
import { useShipments } from '../../context/ShipmentContext';

export const ShipmentTable = ({ onShowQR }) => {
  const { shipments, user } = useShipments();
  const [filter, setFilter] = useState('ALL');
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  // Filter shipments by customer_id (e.g. CUST001)
  const currentCustomerId = user?.customer_id || 'CUST001';

  const customerShipments = shipments.filter(s => {
    if (!s.customer_id) return true;
    return s.customer_id.toUpperCase() === currentCustomerId.toUpperCase();
  });

  // Sort by departure_date (출항일 기준 정렬)
  const sortedShipments = [...customerShipments].sort((a, b) => {
    const dateA = new Date(a.departure_date || '2026-07-01');
    const dateB = new Date(b.departure_date || '2026-07-01');
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  const filtered = sortedShipments.filter(s => {
    if (filter === 'ALL') return true;
    return s.status === filter;
  });

  const handleTrackingClick = (s) => {
    navigate(`/map?token=${s.public_token}`);
  };

  return (
    <div className="glass-card" style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>선적 현황 및 진행률 관리</h2>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.1rem' }}>
            고객사: <strong style={{ color: '#0284c7' }}>{user?.customer_name || '(주) 한진글로벌물류'} ({currentCustomerId})</strong> • 총 <strong style={{ color: '#2563eb' }}>{customerShipments.length}건</strong>의 선적 정보 (출항일 순 정렬 중)
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
            <span>출항일 정렬 ({sortAsc ? '오름차순 ⬆️' : '내림차순 ⬇️'})</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>상태 필터:</span>
            <select 
              className="form-control" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              <option value="ALL">전체 보기 ({customerShipments.length})</option>
              <option value="IN_TRANSIT">운송 중</option>
              <option value="DELAYED">일정 지연</option>
              <option value="COMPLETED">운송 완료</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>선적 번호 (클릭 시 지도 이동)</th>
              <th>경로 / 운송 수단</th>
              <th>진행률 (%)</th>
              <th style={{ color: '#0284c7', background: '#f0f9ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>출항일 (ETD)</span>
                </div>
              </th>
              <th>예상 도착일 (ETA)</th>
              <th>상태</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  등록된 선적 정보가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map(s => (
                <tr key={s.id}>
                  {/* Tracking Number Cell */}
                  <td 
                    className="mono" 
                    onClick={() => handleTrackingClick(s)}
                    style={{ fontWeight: 700, cursor: 'pointer', background: 'rgba(224, 242, 254, 0.4)', borderRadius: 'var(--radius-sm)' }}
                    title="선적 번호 클릭 시 70% 항로 지도시각화 페이지로 이동합니다"
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
                    {s.departure_date || '2026-07-28'}
                  </td>

                  <td>
                    {s.original_eta !== s.current_eta ? (
                      <div style={{ fontSize: '0.8rem' }}>
                        <span style={{ textDecoration: 'line-through', color: 'var(--text-dim)' }}>{s.original_eta}</span> ➔ <span style={{ color: 'var(--status-danger)', fontWeight: 700 }}>{s.current_eta}</span>
                      </div>
                    ) : (
                      <div>{s.current_eta}</div>
                    )}
                  </td>
                  <td>
                    {s.status === 'COMPLETED' ? (
                      <span className="badge badge-completed"><CheckCircle2 className="w-3 h-3" /> 운송 완료</span>
                    ) : s.status === 'DELAYED' ? (
                      <span className="badge badge-delayed"><AlertTriangle className="w-3 h-3" /> 일정 지연</span>
                    ) : (
                      <span className="badge badge-in-transit"><Clock className="w-3 h-3" /> 운송 중</span>
                    )}
                  </td>

                  {/* Note: '수신자 연락처' column removed as requested */}

                  <td>
                    <button className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }} onClick={() => onShowQR(s)}>
                      <QrCode className="w-3.5 h-3.5" /> QR/링크
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
