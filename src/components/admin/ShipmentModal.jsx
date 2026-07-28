import React, { useState, useEffect } from 'react';
import { useShipments } from '../../context/ShipmentContext';
import { X } from 'lucide-react';

export const ShipmentModal = ({ shipment, isOpen, onClose }) => {
  const { saveShipment } = useShipments();
  const [formData, setFormData] = useState({
    tracking_number: '',
    transport_mode: 'SEA',
    carrier_name: '',
    vessel_flight_no: '',
    origin: '',
    origin_code: '',
    destination: '',
    destination_code: '',
    progress_pct: 0,
    current_step: '',
    original_eta: '',
    current_eta: '',
    delay_reason: '',
    status: 'IN_TRANSIT',
    recipient_email: ''
  });

  useEffect(() => {
    if (shipment) {
      setFormData({
        id: shipment.id,
        tracking_number: shipment.tracking_number || '',
        transport_mode: shipment.transport_mode || 'SEA',
        carrier_name: shipment.carrier_name || '',
        vessel_flight_no: shipment.vessel_flight_no || '',
        origin: shipment.origin || '',
        origin_code: shipment.origin_code || '',
        destination: shipment.destination || '',
        destination_code: shipment.destination_code || '',
        progress_pct: shipment.progress_pct || 0,
        current_step: shipment.current_step || '',
        original_eta: shipment.original_eta || '',
        current_eta: shipment.current_eta || '',
        delay_reason: shipment.delay_reason || '',
        status: shipment.status || 'IN_TRANSIT',
        recipient_email: shipment.recipient_email || ''
      });
    } else {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        tracking_number: `CT-2026-${randomNum}`,
        transport_mode: 'SEA',
        carrier_name: 'HMM (현대상선)',
        vessel_flight_no: 'HMM PACIFIC 012E',
        origin: 'Busan, KR',
        origin_code: 'PUS',
        destination: 'Rotterdam, NL',
        destination_code: 'RTM',
        progress_pct: 0,
        current_step: '선적 대기',
        original_eta: today,
        current_eta: today,
        delay_reason: '',
        status: 'IN_TRANSIT',
        recipient_email: ''
      });
    }
  }, [shipment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    let delayReason = formData.delay_reason.trim();
    if (formData.status === 'DELAYED' && !delayReason) {
      delayReason = '운송사 및 현지 포트 확인 중';
    }

    saveShipment({
      ...formData,
      delay_reason: delayReason,
      origin_code: formData.origin_code.toUpperCase() || 'ORG',
      destination_code: formData.destination_code.toUpperCase() || 'DST',
      progress_pct: Number(formData.progress_pct)
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            {shipment ? '선적 정보 수정' : '신규 선적 등록 (고유 QR/링크 자동생성)'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">선적 번호 (Tracking No.)</label>
              <input 
                type="text" 
                className="form-control mono" 
                value={formData.tracking_number}
                onChange={e => setFormData({ ...formData, tracking_number: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">운송 수단</label>
              <select 
                className="form-control" 
                value={formData.transport_mode}
                onChange={e => setFormData({ ...formData, transport_mode: e.target.value })}
                required
              >
                <option value="SEA">해상 (SEA - 선박 🚢)</option>
                <option value="AIR">항공 (AIR - 비행기 ✈️)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">운송사 (Carrier Name)</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.carrier_name}
                onChange={e => setFormData({ ...formData, carrier_name: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">편명/선박명 (Vessel / Flight No)</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.vessel_flight_no}
                onChange={e => setFormData({ ...formData, vessel_flight_no: e.target.value })}
                required 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">출발지 (Origin)</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.origin}
                onChange={e => setFormData({ ...formData, origin: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">출발 코드</label>
              <input 
                type="text" 
                className="form-control mono" 
                value={formData.origin_code}
                onChange={e => setFormData({ ...formData, origin_code: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">목적지 (Destination)</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.destination}
                onChange={e => setFormData({ ...formData, destination: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">목적지 코드</label>
              <input 
                type="text" 
                className="form-control mono" 
                value={formData.destination_code}
                onChange={e => setFormData({ ...formData, destination_code: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">진행률 (0% ~ 100%)</label>
              <span className="mono" style={{ fontWeight: 700, color: 'var(--primary-cyan)' }}>
                {formData.progress_pct}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={formData.progress_pct}
              onChange={e => setFormData({ ...formData, progress_pct: e.target.value })}
              className="form-control" 
              style={{ padding: 0, cursor: 'pointer' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">현재 진행 단계 텍스트</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.current_step}
              onChange={e => setFormData({ ...formData, current_step: e.target.value })}
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">최초 ETA</label>
              <input 
                type="date" 
                className="form-control" 
                value={formData.original_eta}
                onChange={e => setFormData({ ...formData, original_eta: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">변경 ETA</label>
              <input 
                type="date" 
                className="form-control" 
                value={formData.current_eta}
                onChange={e => setFormData({ ...formData, current_eta: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">운송 상태</label>
              <select 
                className="form-control" 
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="IN_TRANSIT">정상 운송 중</option>
                <option value="DELAYED">일정 지연</option>
                <option value="COMPLETED">운송 완료</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">지연 사유 (미입력 시 '운송사 및 현지 포트 확인 중' 자동 표시)</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.delay_reason}
              onChange={e => setFormData({ ...formData, delay_reason: e.target.value })}
              placeholder="예: 현지 항만 정체 및 기상 악화"
            />
          </div>

          <div className="form-group">
            <label className="form-label">수신자 이메일 (QR 및 링크 자동 발송)</label>
            <input 
              type="email" 
              className="form-control" 
              value={formData.recipient_email}
              onChange={e => setFormData({ ...formData, recipient_email: e.target.value })}
              placeholder="importer@company.com"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>취소</button>
            <button type="submit" className="btn-primary">저장 및 QR/알림 연동</button>
          </div>
        </form>
      </div>
    </div>
  );
};
