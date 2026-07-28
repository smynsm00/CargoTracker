/* CargoTracker - Public Tracking Page JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const trackingNo = urlParams.get('tracking');

  const trackerCard = document.getElementById('tracker-card');
  const emptyState = document.getElementById('empty-state');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');

  let currentShipment = null;

  if (token) {
    currentShipment = window.cargoStore.getShipmentByToken(token);
  } else if (trackingNo) {
    const list = window.cargoStore.getShipments();
    currentShipment = list.find(s => s.tracking_number.toLowerCase() === trackingNo.trim().toLowerCase());
  }

  if (currentShipment) {
    renderShipment(currentShipment);
    if (trackerCard) trackerCard.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
  } else {
    if (trackerCard) trackerCard.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
  }

  // Handle Search submit
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = searchInput.value.trim();
      if (!val) return;

      const list = window.cargoStore.getShipments();
      const found = list.find(s => 
        s.tracking_number.toLowerCase() === val.toLowerCase() || 
        s.public_token === val
      );

      if (found) {
        window.history.pushState({}, '', `track.html?token=${found.public_token}`);
        renderShipment(found);
        trackerCard.style.display = 'block';
        emptyState.style.display = 'none';
      } else {
        showToast('해당 선적 번호 또는 토큰을 찾을 수 없습니다.', 'error');
      }
    });
  }
});

function renderShipment(s) {
  // Header / Carrier Info
  document.getElementById('shipment-tracking-no').textContent = s.tracking_number;
  document.getElementById('shipment-carrier').textContent = `${s.carrier_name} • ${s.vessel_flight_no}`;
  
  // Status Badge
  const statusBadge = document.getElementById('status-badge');
  if (s.status === 'COMPLETED') {
    statusBadge.className = 'badge badge-completed';
    statusBadge.innerHTML = `<svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg> 운송 완료`;
  } else if (s.status === 'DELAYED') {
    statusBadge.className = 'badge badge-delayed';
    statusBadge.innerHTML = `<svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg> 일정 지연`;
  } else {
    statusBadge.className = 'badge badge-in-transit';
    statusBadge.innerHTML = `<svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg> 정상 운송 중`;
  }

  // Route Header
  document.getElementById('origin-city').textContent = s.origin;
  document.getElementById('origin-code').textContent = s.origin_code || 'ORIGIN';
  document.getElementById('dest-city').textContent = s.destination;
  document.getElementById('dest-code').textContent = s.destination_code || 'DEST';

  // Linear Track Line & Vehicle Icon Position (REQ-01)
  const trackFill = document.getElementById('track-fill');
  const vehiclePin = document.getElementById('vehicle-pin');
  const vehicleIcon = document.getElementById('vehicle-icon');
  const tooltipPct = document.getElementById('tooltip-pct');

  const pct = Math.min(100, Math.max(0, s.progress_pct));
  trackFill.style.width = `${pct}%`;
  vehiclePin.style.left = `${pct}%`;
  tooltipPct.textContent = `${pct}% 진행 완료`;

  // Vehicle Icon SVG (Ship vs Plane)
  if (s.transport_mode === 'AIR') {
    vehicleIcon.innerHTML = `<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/>`;
  } else {
    // Sea / Ship Icon
    vehicleIcon.innerHTML = `<path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.64 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.04-.78s-.3-.43-.54-.52L12 7.02l-7.36 2c-.24.09-.44.28-.54.52s-.12.52-.04.78L3.95 19zM6 6h12V4H6v2z" fill="currentColor"/>`;
  }

  // Milestones Timeline
  const milestonesContainer = document.getElementById('milestones-container');
  if (milestonesContainer && s.milestones) {
    milestonesContainer.innerHTML = s.milestones.map(m => `
      <div class="milestone-node ${m.status.toLowerCase().replace('_', '-')}">
        <div class="milestone-dot"></div>
        <div class="milestone-label">${m.name}</div>
        <div style="font-size: 0.7rem; color: var(--text-dim); margin-top: 2px;">${m.date || ''}</div>
      </div>
    `).join('');
  }

  // ETA Comparison Banner (REQ-02)
  const etaContainer = document.getElementById('eta-container');
  const isDelayed = s.status === 'DELAYED' || s.current_eta !== s.original_eta;

  if (isDelayed) {
    etaContainer.innerHTML = `
      <div class="eta-comparison">
        <span class="original-eta">${s.original_eta}</span>
        <span class="value" style="color: var(--status-danger);">${s.current_eta}</span>
        <span class="delay-badge">
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
          ETA 변동
        </span>
      </div>
    `;
  } else {
    etaContainer.innerHTML = `<span class="value">${s.current_eta}</span>`;
  }

  // Current Step & Delay Reason Box (REQ-02 & Edge Cases)
  document.getElementById('current-step-text').textContent = s.current_step;

  const delayNoticeBox = document.getElementById('delay-notice-box');
  if (isDelayed) {
    // Edge Case: If delay_reason is empty, default to "운송사 및 현지 포트 확인 중"
    const delayReasonText = s.delay_reason && s.delay_reason.trim() !== '' 
      ? s.delay_reason 
      : '운송사 및 현지 포트 확인 중';
    
    document.getElementById('delay-reason-text').textContent = delayReasonText;
    delayNoticeBox.style.display = 'flex';
  } else {
    delayNoticeBox.style.display = 'none';
  }

  // Render QR Code (REQ-03)
  const qrCanvas = document.getElementById('qr-canvas');
  const trackingUrl = `${window.location.origin}${window.location.pathname}?token=${s.public_token}`;
  
  if (qrCanvas && window.QRCodeGenerator) {
    window.QRCodeGenerator.renderToCanvas(qrCanvas, trackingUrl, 160);
  }

  const shareInput = document.getElementById('share-url-input');
  if (shareInput) shareInput.value = trackingUrl;

  // Copy Link Button
  const btnCopy = document.getElementById('btn-copy-url');
  if (btnCopy) {
    btnCopy.onclick = () => {
      navigator.clipboard.writeText(trackingUrl).then(() => {
        showToast('추적 URL 링크가 클립보드에 복사되었습니다.');
      });
    };
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
