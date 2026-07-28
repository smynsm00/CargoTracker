/* CargoTracker - Data Store & LocalStorage Persistence */

const INITIAL_SHIPMENTS = [
  {
    id: "shp-8801",
    tracking_number: "CT-2026-8801",
    transport_mode: "SEA", // SEA or AIR
    carrier_name: "HMM (현대상선)",
    vessel_flight_no: "HMM HANGOUT 042E",
    origin: "Busan, KR",
    origin_code: "PUS",
    destination: "Rotterdam, NL",
    destination_code: "RTM",
    progress_pct: 70,
    current_step: "운송 중 (인도양 항해)",
    original_eta: "2026-08-04",
    current_eta: "2026-08-06",
    delay_reason: "유럽 항구 입항 정체 및 현지 기상 악화로 인한 2일 지연",
    status: "DELAYED", // IN_TRANSIT, DELAYED, COMPLETED
    public_token: "a8f9x2k91b",
    recipient_email: "importer@rotterdam-logistics.nl",
    recipient_phone: "+31 10 123 4567",
    milestones: [
      { order: 1, name: "선적 대기", status: "COMPLETED", date: "2026-07-20" },
      { order: 2, name: "부산항 출항", status: "COMPLETED", date: "2026-07-22" },
      { order: 3, name: "인도양 운송 중", status: "IN_PROGRESS", date: "2026-07-28" },
      { order: 4, name: "로테르담 입항", status: "PENDING", date: "2026-08-06" },
      { order: 5, name: "통관 및 인도", status: "PENDING", date: "2026-08-07" }
    ],
    created_at: "2026-07-20T08:00:00Z"
  },
  {
    id: "shp-9204",
    tracking_number: "CT-2026-9204",
    transport_mode: "AIR",
    carrier_name: "Korean Air Cargo",
    vessel_flight_no: "KE021",
    origin: "Incheon, KR",
    origin_code: "ICN",
    destination: "Los Angeles, US",
    destination_code: "LAX",
    progress_pct: 35,
    current_step: "태평양 상공 비행 중",
    original_eta: "2026-07-29",
    current_eta: "2026-07-29",
    delay_reason: "",
    status: "IN_TRANSIT",
    public_token: "p3m9z4q70c",
    recipient_email: "us-import@cargo-partner.com",
    recipient_phone: "+1 213 555 0199",
    milestones: [
      { order: 1, name: "화물 입고", status: "COMPLETED", date: "2026-07-27" },
      { order: 2, name: "인천공항 이륙", status: "COMPLETED", date: "2026-07-28" },
      { order: 3, name: "태평양 운송 중", status: "IN_PROGRESS", date: "2026-07-28" },
      { order: 4, name: "LAX 착륙", status: "PENDING", date: "2026-07-29" },
      { order: 5, name: "수입 통관", status: "PENDING", date: "2026-07-29" }
    ],
    created_at: "2026-07-27T10:00:00Z"
  },
  {
    id: "shp-7730",
    tracking_number: "CT-2026-7730",
    transport_mode: "SEA",
    carrier_name: "Sinokor Merchant Marine",
    vessel_flight_no: "SINOKOR STAR 102N",
    origin: "Busan, KR",
    origin_code: "PUS",
    destination: "Shanghai, CN",
    destination_code: "SHA",
    progress_pct: 100,
    current_step: "인도 완료",
    original_eta: "2026-07-26",
    current_eta: "2026-07-26",
    delay_reason: "",
    status: "COMPLETED",
    public_token: "x7v2n1k89e",
    recipient_email: "shanghai-trade@cn-logistics.com",
    recipient_phone: "+86 21 8888 9999",
    milestones: [
      { order: 1, name: "선적 완료", status: "COMPLETED", date: "2026-07-23" },
      { order: 2, name: "부산 출항", status: "COMPLETED", date: "2026-07-24" },
      { order: 3, name: "상하이 입항", status: "COMPLETED", date: "2026-07-25" },
      { order: 4, name: "수입 통관", status: "COMPLETED", date: "2026-07-26" },
      { order: 5, name: "최종 인도", status: "COMPLETED", date: "2026-07-26" }
    ],
    created_at: "2026-07-23T04:00:00Z"
  },
  {
    id: "shp-4051",
    tracking_number: "CT-2026-4051",
    transport_mode: "SEA",
    carrier_name: "COSCO Shipping",
    vessel_flight_no: "COSCO PRIDE 088W",
    origin: "Shanghai, CN",
    origin_code: "SHA",
    destination: "Hamburg, DE",
    destination_code: "HAM",
    progress_pct: 45,
    current_step: "수에즈 운하 대기 중",
    original_eta: "2026-08-10",
    current_eta: "2026-08-15",
    delay_reason: "", // Will fall back to default text: '운송사 및 현지 포트 확인 중'
    status: "DELAYED",
    public_token: "m4k2p8z90r",
    recipient_email: "hamburg-depot@germany-freight.de",
    recipient_phone: "+49 40 12345678",
    milestones: [
      { order: 1, name: "상하이 선적", status: "COMPLETED", date: "2026-07-15" },
      { order: 2, name: "출항", status: "COMPLETED", date: "2026-07-16" },
      { order: 3, name: "해상 운송 중", status: "IN_PROGRESS", date: "2026-07-28" },
      { order: 4, name: "함부르크 입항", status: "PENDING", date: "2026-08-15" },
      { order: 5, name: "화물 인도", status: "PENDING", date: "2026-08-16" }
    ],
    created_at: "2026-07-15T12:00:00Z"
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-101",
    shipment_id: "shp-8801",
    tracking_number: "CT-2026-8801",
    recipient: "importer@rotterdam-logistics.nl",
    type: "EMAIL",
    event: "ETA_UPDATE_ALERT",
    status: "SUCCESS",
    message: "[CargoTracker] CT-2026-8801 예상 도착일이 2026-08-06으로 변경되었습니다.",
    sent_at: "2026-07-28 09:30"
  },
  {
    id: "notif-102",
    shipment_id: "shp-4051",
    tracking_number: "CT-2026-4051",
    recipient: "hamburg-depot@germany-freight.de",
    type: "EMAIL",
    event: "ETA_UPDATE_ALERT",
    status: "FAILED",
    failure_reason: "SMTP 550: Recipient mailbox unavailable / Domain timeout",
    message: "[CargoTracker] CT-2026-4051 예상 도착일 및 현황 정보 발송 실패",
    sent_at: "2026-07-28 10:15"
  }
];

const STORAGE_KEYS = {
  SHIPMENTS: "cargotracker_shipments_v1",
  NOTIFICATIONS: "cargotracker_notifications_v1"
};

class CargoStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.SHIPMENTS)) {
      localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(INITIAL_SHIPMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
  }

  getShipments() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SHIPMENTS)) || [];
  }

  getShipmentByToken(token) {
    const list = this.getShipments();
    return list.find(s => s.public_token === token);
  }

  getShipmentById(id) {
    const list = this.getShipments();
    return list.find(s => s.id === id);
  }

  saveShipment(shipmentData) {
    const list = this.getShipments();
    const existingIndex = list.findIndex(s => s.id === shipmentData.id);

    // Random token helper
    const generateToken = () => Math.random().toString(36).substring(2, 12);

    if (existingIndex >= 0) {
      // Check if ETA changed or delayed to create automatic alert (REQ-06)
      const oldShipment = list[existingIndex];
      const etaChanged = oldShipment.current_eta !== shipmentData.current_eta;
      
      list[existingIndex] = {
        ...oldShipment,
        ...shipmentData,
        updated_at: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(list));

      if (etaChanged) {
        this.addNotification({
          shipment_id: shipmentData.id,
          tracking_number: shipmentData.tracking_number,
          recipient: shipmentData.recipient_email || "customer@example.com",
          type: "EMAIL",
          event: "ETA_UPDATE_ALERT",
          status: "SUCCESS",
          message: `[자동 알림] ${shipmentData.tracking_number} ETA 변경: ${shipmentData.current_eta}`,
          sent_at: new Date().toLocaleString()
        });
      }
      return list[existingIndex];
    } else {
      // Create New
      const newShipment = {
        id: "shp-" + Date.now(),
        public_token: generateToken(),
        created_at: new Date().toISOString(),
        milestones: [
          { order: 1, name: "선적 대기", status: "COMPLETED", date: new Date().toISOString().split('T')[0] },
          { order: 2, name: "출항", status: "IN_PROGRESS", date: new Date().toISOString().split('T')[0] },
          { order: 3, name: "운송 중", status: "PENDING", date: "" },
          { order: 4, name: "입항", status: "PENDING", date: "" },
          { order: 5, name: "인도", status: "PENDING", date: "" }
        ],
        ...shipmentData
      };
      list.unshift(newShipment);
      localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(list));

      // Dispatch initial QR & Link Notification (REQ-04)
      this.addNotification({
        shipment_id: newShipment.id,
        tracking_number: newShipment.tracking_number,
        recipient: newShipment.recipient_email || "customer@example.com",
        type: "EMAIL",
        event: "INITIAL_DISPATCH",
        status: "SUCCESS",
        message: `[자동 발송] ${newShipment.tracking_number} 고유 QR 및 추적 링크 발송 완료`,
        sent_at: new Date().toLocaleString()
      });

      return newShipment;
    }
  }

  deleteShipment(id) {
    let list = this.getShipments();
    list = list.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(list));
  }

  getNotifications() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || [];
  }

  addNotification(notif) {
    const list = this.getNotifications();
    const newNotif = {
      id: "notif-" + Date.now(),
      sent_at: new Date().toLocaleString('ko-KR'),
      ...notif
    };
    list.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    return newNotif;
  }

  resendNotification(notificationId) {
    const list = this.getNotifications();
    const targetIndex = list.findIndex(n => n.id === notificationId);
    if (targetIndex >= 0) {
      list[targetIndex].status = "SUCCESS";
      list[targetIndex].failure_reason = "";
      list[targetIndex].sent_at = new Date().toLocaleString('ko-KR') + " (재발송 완료)";
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
      return list[targetIndex];
    }
    return null;
  }

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(INITIAL_SHIPMENTS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
}

window.cargoStore = new CargoStore();
