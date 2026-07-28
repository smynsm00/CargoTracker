import React, { useState, useEffect } from 'react';
import { useShipments } from '../../context/ShipmentContext';
import { Tag, Rocket, MapPin, Flag, Calendar, Plus, AlertTriangle, Activity, CloudLightning, Anchor, Search } from 'lucide-react';

export const CargoRegisterCard = ({ selectedShipment, onSelectShipment }) => {
  const { saveShipment } = useShipments();

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    cargo_id: 'COSU62918847',
    transport_mode: 'SEA',
    origin: 'Shanghai (CNSHA)',
    destination: 'Busan (KRPUS)',
    original_eta: today
  });

  // Automatically update input fields B when selectedShipment changes (e.g. Map marker clicked)
  useEffect(() => {
    if (selectedShipment) {
      setFormData({
        cargo_id: selectedShipment.cargo_id || selectedShipment.tracking_number || 'COSU62918847',
        transport_mode: selectedShipment.transport_mode || 'SEA',
        origin: selectedShipment.origin || 'Shanghai (CNSHA)',
        destination: selectedShipment.destination || 'Busan (KRPUS)',
        original_eta: selectedShipment.original_eta || selectedShipment.current_eta || today
      });
    }
  }, [selectedShipment, today]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newShipment = {
      tracking_number: formData.cargo_id.trim() || `CT-${Math.floor(1000 + Math.random() * 9000)}`,
      transport_mode: formData.transport_mode,
      carrier_name: formData.transport_mode === 'SEA' ? 'COSCO Shipping' : 'Korean Air',
      vessel_flight_no: formData.transport_mode === 'SEA' ? 'COSCO PRIDE 088W' : 'KE021',
      origin: formData.origin.trim() || 'Shanghai',
      origin_code: 'SHA',
      destination: formData.destination.trim() || 'Busan',
      destination_code: 'PUS',
      progress_pct: 15,
      current_step: '등록 완료 및 출항 준비 중',
      original_eta: formData.original_eta,
      current_eta: formData.original_eta,
      status: 'IN_TRANSIT'
    };

    saveShipment(newShipment);
    if (onSelectShipment) {
      onSelectShipment(newShipment);
    }
  };

  return (
    <div style={{ 
      background: '#ffffff', 
      padding: '0.85rem 1rem', 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      boxSizing: 'border-box', 
      overflow: 'hidden' 
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          
          {/* 1 & 2. Cargo ID & Transport Mode */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#334155', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>화물 번호 (Cargo ID)</span>
              </label>
              <input 
                type="text" 
                className="form-control mono" 
                placeholder="예: COSU62918847"
                value={formData.cargo_id}
                onChange={e => setFormData({ ...formData, cargo_id: e.target.value })}
                style={{ padding: '0.35rem 0.55rem', fontSize: '0.8rem' }}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#334155', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                <Rocket className="w-3.5 h-3.5 text-blue-600" />
                <span>운송 수단</span>
              </label>
              <select 
                className="form-control" 
                value={formData.transport_mode}
                onChange={e => setFormData({ ...formData, transport_mode: e.target.value })}
                style={{ padding: '0.35rem 0.55rem', fontSize: '0.8rem' }}
                required
              >
                <option value="SEA">🚢 해상 (Sea)</option>
                <option value="AIR">✈️ 항공 (Air)</option>
              </select>
            </div>
          </div>

          {/* 3 & 4. Origin & Destination */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#334155', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>출발지 (Origin)</span>
              </label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="예: Shanghai (CNSHA)"
                value={formData.origin}
                onChange={e => setFormData({ ...formData, origin: e.target.value })}
                style={{ padding: '0.35rem 0.55rem', fontSize: '0.8rem' }}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#334155', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                <Flag className="w-3.5 h-3.5 text-indigo-600" />
                <span>목적지 (Destination)</span>
              </label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="예: Busan (KRPUS)"
                value={formData.destination}
                onChange={e => setFormData({ ...formData, destination: e.target.value })}
                style={{ padding: '0.35rem 0.55rem', fontSize: '0.8rem' }}
                required
              />
            </div>
          </div>

          {/* 5. Original ETA */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#334155', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>최초 예상 도착일 (Original ETA)</span>
            </label>
            <input 
              type="date" 
              className="form-control" 
              value={formData.original_eta}
              onChange={e => setFormData({ ...formData, original_eta: e.target.value })}
              style={{ padding: '0.35rem 0.55rem', fontSize: '0.8rem' }}
              required
            />
          </div>

          {/* AI Delay Reason Analysis Yellow Box */}
          <div style={{ background: '#fffbe6', border: '1px solid #fef08a', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b45309' }}>
                  지연 사유 분석 및 위험상황 안내
                </span>
              </div>
              <span className="badge" style={{ background: '#fef3c7', color: '#d97706', fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                AI 분석 완료
              </span>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #fde68a', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.65rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#92400e', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Activity className="w-3 h-3 text-amber-600" />
                실시간 운송 지연 원인 분석 (Delay Factor Analysis)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.7rem', color: '#334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Anchor className="w-3 h-3 text-blue-600" /> 1. 항만 입항 정체 (Port Congestion)
                  </span>
                  <strong style={{ color: '#d97706' }}>45%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CloudLightning className="w-3 h-3 text-indigo-600" /> 2. 해상 기상 악화 / 태풍
                  </span>
                  <strong style={{ color: '#d97706' }}>35%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Search className="w-3 h-3 text-emerald-600" /> 3. 세관 및 통관 심사 지연
                  </span>
                  <strong style={{ color: '#475569' }}>20%</strong>
                </div>
              </div>
              <div style={{ marginTop: '0.35rem', paddingTop: '0.3rem', borderTop: '1px stroke #fef08a', fontSize: '0.68rem', color: '#78350f', lineHeight: 1.3 }}>
                💡 <strong>AI 종합 진단</strong>: {formData.origin.split(' ')[0]} ➔ {formData.destination.split(' ')[0]} 항로 구간에서 현지 항만 대기 선박 정체 및 해상 기상 악화로 인해 ETA가 지연 분석되었습니다.
              </div>
            </div>
          </div>

        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
          <Plus className="w-4 h-4" />
          선적 정보 업데이트 및 저장
        </button>
      </form>
    </div>
  );
};
