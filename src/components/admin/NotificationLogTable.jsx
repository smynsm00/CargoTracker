import React from 'react';
import { useShipments } from '../../context/ShipmentContext';
import { RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export const NotificationLogTable = () => {
  const { notifications, resendNotification } = useShipments();

  return (
    <div className="glass-card">
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>알림 발송 이력 및 예외 처리 (REQ-04, REQ-06)</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          ETA 변동 및 선적 시작 시 수신자에게 전송된 자동 메시지 로그 및 발송 실패 시 수동 재발송 센터
        </p>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>일시</th>
              <th>선적 번호</th>
              <th>수신자</th>
              <th>메시지 내용</th>
              <th>발송 상태</th>
              <th>재발송</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  발송된 알림 이력이 없습니다.
                </td>
              </tr>
            ) : (
              notifications.map(n => {
                const isFailed = n.status === 'FAILED';

                return (
                  <tr key={n.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{n.sent_at}</td>
                    <td className="mono" style={{ fontWeight: 700 }}>{n.tracking_number}</td>
                    <td style={{ fontSize: '0.85rem' }}>{n.recipient}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{n.message}</td>
                    <td>
                      {isFailed ? (
                        <div>
                          <span className="badge badge-delayed"><AlertTriangle className="w-3 h-3" /> 발송 실패</span>
                          {n.failure_reason && (
                            <div style={{ fontSize: '0.75rem', color: '#fca5a5', marginTop: 2 }}>{n.failure_reason}</div>
                          )}
                        </div>
                      ) : (
                        <span className="badge badge-completed"><CheckCircle2 className="w-3 h-3" /> 발송 성공</span>
                      )}
                    </td>
                    <td>
                      {isFailed ? (
                        <button 
                          className="btn-primary" 
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }} 
                          onClick={() => resendNotification(n.id)}
                        >
                          <RefreshCw className="w-3 h-3" /> 수동 재발송
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>완료</span>
                      )}
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
