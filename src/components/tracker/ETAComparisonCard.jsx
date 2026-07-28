import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

export const ETAComparisonCard = ({ shipment }) => {
  const isDelayed = shipment.status === 'DELAYED' || shipment.current_eta !== shipment.original_eta;
  
  // REQ-02 Edge Case Requirement:
  // If delayed but reason is blank, fallback to: '운송사 및 현지 포트 확인 중'
  const delayReasonText = (shipment.delay_reason && shipment.delay_reason.trim() !== '')
    ? shipment.delay_reason
    : '운송사 및 현지 포트 확인 중';

  return (
    <div>
      <div className="eta-card-grid">
        <div className="info-block">
          <span className="label">현재 진행 단계</span>
          <span className="value">{shipment.current_step}</span>
        </div>

        <div className="info-block">
          <span className="label">예상 도착일 (ETA)</span>
          {isDelayed ? (
            <div className="eta-comparison">
              <span className="original-eta">{shipment.original_eta}</span>
              <span className="value" style={{ color: 'var(--status-danger)' }}>{shipment.current_eta}</span>
              <span className="delay-badge">
                <Clock className="w-3 h-3" />
                ETA 변동
              </span>
            </div>
          ) : (
            <span className="value">{shipment.current_eta}</span>
          )}
        </div>
      </div>

      {isDelayed && (
        <div className="delay-notice-box">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="delay-notice-title">운송 일정 지연 안내</div>
            <div className="delay-notice-desc">{delayReasonText}</div>
          </div>
        </div>
      )}
    </div>
  );
};
