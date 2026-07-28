/* CargoTracker - Admin Dashboard JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  renderStats();
  renderShipmentTable();
  renderNotificationTable();

  // Modals & Triggers
  const shipmentModal = document.getElementById('shipment-modal');
  const qrModal = document.getElementById('qr-modal');

  document.getElementById('btn-add-shipment').addEventListener('click', () => {
    openShipmentModal();
  });

  document.getElementById('btn-reset-data').addEventListener('click', () => {
    if (confirm('모든 데이터를 초기 샘플 상태로 리셋하시겠습니까?')) {
      window.cargoStore.resetToDefault();
      renderStats();
      renderShipmentTable();
      renderNotificationTable();
      showToast('샘플 데이터로 초기화되었습니다.');
    }
  });

  // Shipment Form submit
  document.getElementById('shipment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveShipmentFromForm();
  });

  // Modal Close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      shipmentModal.classList.remove('show');
      qrModal.classList.remove('show');
    });
  });

  // Progress slider dynamic label
  const progressInput = document.getElementById('form-progress');
  const progressValLabel = document.getElementById('form-progress-val');
  if (progressInput && progressValLabel) {
    progressInput.addEventListener('input', () => {
      progressValLabel.textContent = `${progressInput.value}%`;
    });
  }

  // Filter listener
  document.getElementById('filter-status').addEventListener('change', () => {
    renderShipmentTable();
  });
});

function renderStats() {
  const shipments = window.cargoStore.getShipments();
  const notifs = window.cargoStore.getNotifications();

  document.getElementById('stat-total-shipments').textContent = shipments.length;
  document.getElementById('stat-in-transit').textContent = shipments.filter(s => s.status === 'IN_TRANSIT').length;
  document.getElementById('stat-delayed').textContent = shipments.filter(s => s.status === 'DELAYED').length;
  
  const failedNotifs = notifs.filter(n => n.status === 'FAILED');
  const failedBadge = document.getElementById('stat-failed-notifs');
  failedBadge.textContent = failedNotifs.length;

  const failedNoticeBanner = document.getElementById('failed-notice-banner');
  if (failedNotifs.length > 0) {
    failedNoticeBanner.style.display = 'flex';
    document.getElementById('failed-count-text').textContent = `${failedNotifs.length}건의 자동 발송 실패가 발생했습니다. 아래 알림 이력에서 수동 재발송을 진행하세요.`;
  } else {
    failedNoticeBanner.style.display = 'none';
  }
}

function renderShipmentTable() {
  const shipments = window.cargoStore.getShipments();
  const filterVal = document.getElementById('filter-status').value;
  const tbody = document.getElementById('shipments-tbody');

  let filtered = shipments;
  if (filterVal !== 'ALL') {
    filtered = shipments.filter(s => s.status === filterVal);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">등록된 선적 정보가 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    let statusTag = '';
    if (s.status === 'COMPLETED') {
      statusTag = `<span class="badge badge-completed">운송 완료</span>`;
    } else if (s.status === 'DELAYED') {
      statusTag = `<span class="badge badge-delayed">일정 지연</span>`;
    } else {
      statusTag = `<span class="badge badge-in-transit">운송 중</span>`;
    }

    const trackingUrl = `${window.location.origin}/track.html?token=${s.public_token}`;

    return `
      <tr>
        <td class="mono" style="font-weight: 700;">
          <a href="track.html?token=${s.public_token}" target="_blank" style="color: var(--primary-cyan); text-decoration: none;">
            ${s.tracking_number}
          </a>
        </td>
        <td>
          <div style="font-weight: 600;">${s.origin} ➔ ${s.destination}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">${s.carrier_name} (${s.transport_mode})</div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; width: 60px;">
              <div style="width: ${s.progress_pct}%; height: 100%; background: var(--grad-primary);"></div>
            </div>
            <span class="mono" style="font-size: 0.8rem; font-weight: 700;">${s.progress_pct}%</span>
          </div>
        </td>
        <td>
          ${s.original_eta !== s.current_eta 
            ? `<div style="font-size:0.8rem;"><span style="text-decoration:line-through; color:var(--text-dim);">${s.original_eta}</span> ➔ <span style="color:var(--status-danger); font-weight:700;">${s.current_eta}</span></div>` 
            : `<div>${s.current_eta}</div>`}
        </td>
        <td>${statusTag}</td>
        <td>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${s.recipient_email || '-'}</div>
        </td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.8rem;" onclick="openQRModal('${s.id}')">
              QR/링크
            </button>
            <button class="btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.8rem;" onclick="openShipmentModal('${s.id}')">
              수정
            </button>
            <button class="btn-danger" style="padding: 0.35rem 0.65rem; font-size: 0.8rem;" onclick="deleteShipment('${s.id}')">
              삭제
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderNotificationTable() {
  const notifs = window.cargoStore.getNotifications();
  const tbody = document.getElementById('notifications-tbody');

  if (notifs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">발송된 알림 이력이 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = notifs.map(n => {
    const isFailed = n.status === 'FAILED';
    const statusBadge = isFailed 
      ? `<span class="badge badge-delayed">발송 실패</span>` 
      : `<span class="badge badge-completed">발송 성공</span>`;

    return `
      <tr>
        <td style="font-size: 0.8rem; color: var(--text-dim);">${n.sent_at}</td>
        <td class="mono" style="font-weight: 700;">${n.tracking_number}</td>
        <td style="font-size: 0.85rem;">${n.recipient}</td>
        <td style="font-size: 0.85rem; color: var(--text-muted);">${n.message}</td>
        <td>
          ${statusBadge}
          ${isFailed ? `<div style="font-size:0.75rem; color:#fca5a5; margin-top:2px;">${n.failure_reason}</div>` : ''}
        </td>
        <td>
          ${isFailed 
            ? `<button class="btn-primary" style="padding: 0.3rem 0.75rem; font-size: 0.75rem;" onclick="resendNotification('${n.id}')">수동 재발송</button>` 
            : `<span style="font-size:0.75rem; color:var(--text-dim);">완료</span>`}
        </td>
      </tr>
    `;
  }).join('');
}

function openShipmentModal(id = null) {
  const modal = document.getElementById('shipment-modal');
  const title = document.getElementById('modal-shipment-title');
  const form = document.getElementById('shipment-form');

  form.reset();

  if (id) {
    title.textContent = '선적 정보 수정';
    const s = window.cargoStore.getShipmentById(id);
    if (s) {
      document.getElementById('form-shipment-id').value = s.id;
      document.getElementById('form-tracking-number').value = s.tracking_number;
      document.getElementById('form-transport-mode').value = s.transport_mode;
      document.getElementById('form-carrier-name').value = s.carrier_name;
      document.getElementById('form-vessel-no').value = s.vessel_flight_no;
      document.getElementById('form-origin').value = s.origin;
      document.getElementById('form-origin-code').value = s.origin_code || '';
      document.getElementById('form-destination').value = s.destination;
      document.getElementById('form-destination-code').value = s.destination_code || '';
      document.getElementById('form-progress').value = s.progress_pct;
      document.getElementById('form-progress-val').textContent = `${s.progress_pct}%`;
      document.getElementById('form-current-step').value = s.current_step;
      document.getElementById('form-original-eta').value = s.original_eta;
      document.getElementById('form-current-eta').value = s.current_eta;
      document.getElementById('form-delay-reason').value = s.delay_reason || '';
      document.getElementById('form-status').value = s.status;
      document.getElementById('form-recipient-email').value = s.recipient_email || '';
    }
  } else {
    title.textContent = '신규 선적 등록 (고유 QR/링크 자동생성)';
    document.getElementById('form-shipment-id').value = '';
    document.getElementById('form-tracking-number').value = `CT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    document.getElementById('form-progress').value = 0;
    document.getElementById('form-progress-val').textContent = '0%';
    document.getElementById('form-original-eta').value = new Date().toISOString().split('T')[0];
    document.getElementById('form-current-eta').value = new Date().toISOString().split('T')[0];
  }

  modal.classList.add('show');
}

function saveShipmentFromForm() {
  const id = document.getElementById('form-shipment-id').value;
  const status = document.getElementById('form-status').value;
  let delayReason = document.getElementById('form-delay-reason').value.trim();

  // Edge case handling: If delayed but no reason given, default to PRD requirement: '운송사 및 현지 포트 확인 중'
  if (status === 'DELAYED' && !delayReason) {
    delayReason = '운송사 및 현지 포트 확인 중';
  }

  const data = {
    id: id || undefined,
    tracking_number: document.getElementById('form-tracking-number').value.trim(),
    transport_mode: document.getElementById('form-transport-mode').value,
    carrier_name: document.getElementById('form-carrier-name').value.trim(),
    vessel_flight_no: document.getElementById('form-vessel-no').value.trim(),
    origin: document.getElementById('form-origin').value.trim(),
    origin_code: document.getElementById('form-origin-code').value.trim().toUpperCase() || 'ORG',
    destination: document.getElementById('form-destination').value.trim(),
    destination_code: document.getElementById('form-destination-code').value.trim().toUpperCase() || 'DST',
    progress_pct: parseInt(document.getElementById('form-progress').value, 10),
    current_step: document.getElementById('form-current-step').value.trim(),
    original_eta: document.getElementById('form-original-eta').value,
    current_eta: document.getElementById('form-current-eta').value,
    delay_reason: delayReason,
    status: status,
    recipient_email: document.getElementById('form-recipient-email').value.trim()
  };

  const saved = window.cargoStore.saveShipment(data);
  document.getElementById('shipment-modal').classList.remove('show');
  
  renderStats();
  renderShipmentTable();
  renderNotificationTable();

  showToast(`선적건 ${saved.tracking_number} 저장 및 QR/알림 연동 완료!`);
}

function deleteShipment(id) {
  if (confirm('해당 선적건을 삭제하시겠습니까?')) {
    window.cargoStore.deleteShipment(id);
    renderStats();
    renderShipmentTable();
    showToast('선적 정보가 삭제되었습니다.');
  }
}

function openQRModal(id) {
  const s = window.cargoStore.getShipmentById(id);
  if (!s) return;

  const modal = document.getElementById('qr-modal');
  const trackingUrl = `${window.location.origin}/track.html?token=${s.public_token}`;

  document.getElementById('qr-modal-title').textContent = `[${s.tracking_number}] QR & 추적 링크`;
  
  const canvas = document.getElementById('admin-qr-canvas');
  if (canvas && window.QRCodeGenerator) {
    window.QRCodeGenerator.renderToCanvas(canvas, trackingUrl, 180);
  }

  const urlInput = document.getElementById('admin-share-url');
  urlInput.value = trackingUrl;

  document.getElementById('btn-admin-copy-url').onclick = () => {
    navigator.clipboard.writeText(trackingUrl).then(() => {
      showToast('추적 URL 링크가 복사되었습니다.');
    });
  };

  modal.classList.add('show');
}

function resendNotification(id) {
  const updated = window.cargoStore.resendNotification(id);
  if (updated) {
    renderStats();
    renderNotificationTable();
    showToast(`수동 재발송 완료! [${updated.tracking_number}] 수신자: ${updated.recipient}`);
  }
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
  toast.innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    <span>${msg}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function createToastContainer() {
  const div = document.createElement('div');
  div.id = 'toast-container';
  div.className = 'toast-container';
  document.body.appendChild(div);
  return div;
}

window.openShipmentModal = openShipmentModal;
window.deleteShipment = deleteShipment;
window.openQRModal = openQRModal;
window.resendNotification = resendNotification;
