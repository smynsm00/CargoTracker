import React, { createContext, useContext, useState, useEffect } from 'react';

// Exactly 5 shipment records per customer ID matching Supabase DB
const INITIAL_SHIPMENTS = [
  // CUST001 - (주) 한진글로벌물류 (5 records)
  {
    id: "shp-8801",
    customer_id: "CUST001",
    customer_name: "(주) 한진글로벌물류",
    bl_number: "HDMU8810293",
    cargo_id: "COSU62918847",
    tracking_number: "CT-2026-8801",
    transport_mode: "SEA",
    carrier_name: "COSCO Shipping",
    vessel_flight_no: "COSCO PRIDE 088W",
    origin: "Shanghai (CNSHA)",
    origin_code: "SHA",
    destination: "Busan (KRPUS)",
    destination_code: "PUS",
    progress_pct: 70,
    current_step: "운송 중 (인도양 항해)",
    original_eta: "2026-08-04",
    current_eta: "2026-08-06",
    delay_reason: "유럽/아시아 항만 입항 정체",
    status: "DELAYED",
    public_token: "a8f9x2k91b",
    recipient_email: "importer@rotterdam-logistics.nl",
    recipient_phone: "010-1234-5678",
    milestones: [
      { order: 1, name: "선적 대기", status: "COMPLETED", date: "2026-07-20" },
      { order: 2, name: "출항", status: "COMPLETED", date: "2026-07-22" },
      { order: 3, name: "해상 운송 중", status: "IN_PROGRESS", date: "2026-07-28" },
      { order: 4, name: "입항", status: "PENDING", date: "2026-08-06" },
      { order: 5, name: "통관 및 인도", status: "PENDING", date: "2026-08-07" }
    ],
    created_at: "2026-07-20T08:00:00Z"
  },
  {
    id: "shp-8802",
    customer_id: "CUST001",
    customer_name: "(주) 한진글로벌물류",
    bl_number: "HDMU8810294",
    cargo_id: "COSU62918848",
    tracking_number: "CT-2026-8802",
    transport_mode: "SEA",
    carrier_name: "HMM (현대상선)",
    vessel_flight_no: "HMM HANGOUT 042E",
    origin: "Busan (KRPUS)",
    origin_code: "PUS",
    destination: "Rotterdam (RTM)",
    destination_code: "RTM",
    progress_pct: 45,
    current_step: "운송 중 (지중해 항해)",
    original_eta: "2026-08-10",
    current_eta: "2026-08-15",
    delay_reason: "현지 항구 입항 정체 및 태풍 영향",
    status: "DELAYED",
    public_token: "h8k9m2p01x",
    recipient_email: "rotterdam-depot@hmm-cargo.com",
    recipient_phone: "010-1234-5678",
    milestones: [
      { order: 1, name: "선적 대기", status: "COMPLETED", date: "2026-07-21" },
      { order: 2, name: "부산 출항", status: "COMPLETED", date: "2026-07-23" },
      { order: 3, name: "지중해 운송 중", status: "IN_PROGRESS", date: "2026-07-28" },
      { order: 4, name: "로테르담 입항", status: "PENDING", date: "2026-08-15" }
    ],
    created_at: "2026-07-21T09:00:00Z"
  },
  {
    id: "shp-9204",
    customer_id: "CUST001",
    customer_name: "(주) 한진글로벌물류",
    bl_number: "HDMU8810295",
    cargo_id: "COSU62918849",
    tracking_number: "CT-2026-9204",
    transport_mode: "AIR",
    carrier_name: "Korean Air Cargo",
    vessel_flight_no: "KE021 Cargo",
    origin: "Incheon (ICN)",
    origin_code: "ICN",
    destination: "Los Angeles (LAX)",
    destination_code: "LAX",
    progress_pct: 35,
    current_step: "태평양 상공 비행 중",
    original_eta: "2026-07-29",
    current_eta: "2026-07-29",
    delay_reason: "",
    status: "IN_TRANSIT",
    public_token: "p3m9z4q70c",
    recipient_email: "us-import@cargo-partner.com",
    recipient_phone: "010-1234-5678",
    milestones: [
      { order: 1, name: "화물 입고", status: "COMPLETED", date: "2026-07-27" },
      { order: 2, name: "이륙", status: "COMPLETED", date: "2026-07-28" },
      { order: 3, name: "운송 중", status: "IN_PROGRESS", date: "2026-07-28" },
      { order: 4, name: "착륙", status: "PENDING", date: "2026-07-29" }
    ],
    created_at: "2026-07-27T10:00:00Z"
  },
  {
    id: "shp-7730",
    customer_id: "CUST001",
    customer_name: "(주) 한진글로벌물류",
    bl_number: "HDMU8810296",
    cargo_id: "COSU62918850",
    tracking_number: "CT-2026-7730",
    transport_mode: "SEA",
    carrier_name: "Sinokor Merchant Marine",
    vessel_flight_no: "SINOKOR STAR 102N",
    origin: "Busan (KRPUS)",
    origin_code: "PUS",
    destination: "Shanghai (SHA)",
    destination_code: "SHA",
    progress_pct: 100,
    current_step: "인도 완료",
    original_eta: "2026-07-26",
    current_eta: "2026-07-26",
    delay_reason: "",
    status: "COMPLETED",
    public_token: "x7v2n1k89e",
    recipient_email: "shanghai-trade@cn-logistics.com",
    recipient_phone: "010-1234-5678",
    milestones: [
      { order: 1, name: "선적 완료", status: "COMPLETED", date: "2026-07-23" },
      { order: 2, name: "출항", status: "COMPLETED", date: "2026-07-24" },
      { order: 3, name: "입항", status: "COMPLETED", date: "2026-07-25" },
      { order: 4, name: "최종 인도", status: "COMPLETED", date: "2026-07-26" }
    ],
    created_at: "2026-07-23T04:00:00Z"
  },
  {
    id: "shp-4051",
    customer_id: "CUST001",
    customer_name: "(주) 한진글로벌물류",
    bl_number: "HDMU8810297",
    cargo_id: "COSU62918851",
    tracking_number: "CT-2026-4051",
    transport_mode: "AIR",
    carrier_name: "Asiana Cargo",
    vessel_flight_no: "OZ541 Cargo",
    origin: "Incheon (ICN)",
    origin_code: "ICN",
    destination: "Frankfurt (FRA)",
    destination_code: "FRA",
    progress_pct: 80,
    current_step: "유라시아 상공 비행 중",
    original_eta: "2026-07-30",
    current_eta: "2026-07-30",
    delay_reason: "",
    status: "IN_TRANSIT",
    public_token: "m4k2p8z90r",
    recipient_email: "frankfurt-cargo@asiana.com",
    recipient_phone: "010-1234-5678",
    milestones: [
      { order: 1, name: "선적", status: "COMPLETED", date: "2026-07-27" },
      { order: 2, name: "이륙", status: "COMPLETED", date: "2026-07-28" },
      { order: 3, name: "운송 중", status: "IN_PROGRESS", date: "2026-07-28" }
    ],
    created_at: "2026-07-27T12:00:00Z"
  },

  // CUST002 - 삼성SDS 인터내셔널 (5 records)
  {
    id: "shp-9901",
    customer_id: "CUST002",
    customer_name: "삼성SDS 인터내셔널",
    bl_number: "MAEU9920101",
    cargo_id: "MAEU10293841",
    tracking_number: "CT-2026-9901",
    transport_mode: "SEA",
    carrier_name: "Maersk",
    vessel_flight_no: "MAERSK MC-KINNEY",
    origin: "Ningbo (CNNGB)",
    origin_code: "NGB",
    destination: "Hamburg (DEHAM)",
    destination_code: "HAM",
    progress_pct: 60,
    current_step: "인도양 운송 중",
    original_eta: "2026-08-08",
    current_eta: "2026-08-08",
    delay_reason: "",
    status: "IN_TRANSIT",
    public_token: "m9k2a1p02z",
    recipient_email: "hamburg@samsung-sds.com",
    recipient_phone: "010-9876-5432"
  },
  {
    id: "shp-9902",
    customer_id: "CUST002",
    customer_name: "삼성SDS 인터내셔널",
    bl_number: "MAEU9920102",
    cargo_id: "MAEU10293842",
    tracking_number: "CT-2026-9902",
    transport_mode: "AIR",
    carrier_name: "Korean Air Cargo",
    vessel_flight_no: "KE703 Cargo",
    origin: "Incheon (ICN)",
    origin_code: "ICN",
    destination: "Tokyo (NRT)",
    destination_code: "NRT",
    progress_pct: 100,
    current_step: "인도 완료",
    original_eta: "2026-07-27",
    current_eta: "2026-07-27",
    delay_reason: "",
    status: "COMPLETED",
    public_token: "k7m0p3x91a",
    recipient_email: "tokyo@samsung-sds.com",
    recipient_phone: "010-9876-5432"
  },
  {
    id: "shp-9903",
    customer_id: "CUST002",
    customer_name: "삼성SDS 인터내셔널",
    bl_number: "MAEU9920103",
    cargo_id: "MAEU10293843",
    tracking_number: "CT-2026-9903",
    transport_mode: "SEA",
    carrier_name: "MSC",
    vessel_flight_no: "MSC ISABELLA 204",
    origin: "Busan (KRPUS)",
    origin_code: "PUS",
    destination: "Long Beach (USLGB)",
    destination_code: "LGB",
    progress_pct: 50,
    current_step: "태평양 항해 중",
    original_eta: "2026-08-02",
    current_eta: "2026-08-05",
    delay_reason: "미서안 세관 인스펙션 지연",
    status: "DELAYED",
    public_token: "l9b3x8q40p",
    recipient_email: "longbeach@samsung-sds.com",
    recipient_phone: "010-9876-5432"
  },
  {
    id: "shp-9904",
    customer_id: "CUST002",
    customer_name: "삼성SDS 인터내셔널",
    bl_number: "MAEU9920104",
    cargo_id: "MAEU10293844",
    tracking_number: "CT-2026-9904",
    transport_mode: "SEA",
    carrier_name: "KMTC",
    vessel_flight_no: "KMTC SHANGHAI 012",
    origin: "Qingdao (TAO)",
    origin_code: "TAO",
    destination: "Busan (KRPUS)",
    destination_code: "PUS",
    progress_pct: 20,
    current_step: "출항 준비 중",
    original_eta: "2026-08-01",
    current_eta: "2026-08-01",
    delay_reason: "",
    status: "IN_TRANSIT",
    public_token: "q2d4n8z10c",
    recipient_email: "busan@samsung-sds.com",
    recipient_phone: "010-9876-5432"
  },
  {
    id: "shp-9905",
    customer_id: "CUST002",
    customer_name: "삼성SDS 인터내셔널",
    bl_number: "MAEU9920105",
    cargo_id: "MAEU10293845",
    tracking_number: "CT-2026-9905",
    transport_mode: "AIR",
    carrier_name: "Singapore Airlines Cargo",
    vessel_flight_no: "SQ607 Cargo",
    origin: "Seoul (ICN)",
    origin_code: "ICN",
    destination: "Singapore (SIN)",
    destination_code: "SIN",
    progress_pct: 90,
    current_step: "비행 중",
    original_eta: "2026-07-29",
    current_eta: "2026-07-29",
    delay_reason: "",
    status: "IN_TRANSIT",
    public_token: "s9g4k2p10z",
    recipient_email: "singapore@samsung-sds.com",
    recipient_phone: "010-9876-5432"
  },

  // CUST003 - 현대글로비스 트레이딩 (5 records)
  {
    id: "shp-7701",
    customer_id: "CUST003",
    customer_name: "현대글로비스 트레이딩",
    bl_number: "ONEU7730401",
    cargo_id: "ONEU55019281",
    tracking_number: "CT-2026-7701",
    transport_mode: "SEA",
    carrier_name: "ONE Line",
    vessel_flight_no: "ONE OCEAN 005E",
    origin: "Tokyo (TYO)",
    origin_code: "TYO",
    destination: "Busan (KRPUS)",
    destination_code: "PUS",
    progress_pct: 100,
    current_step: "인도 완료",
    original_eta: "2026-07-25",
    current_eta: "2026-07-25",
    delay_reason: "",
    status: "COMPLETED",
    public_token: "t9o4k2p80z",
    recipient_email: "busan@hyundai-glovis.com",
    recipient_phone: "010-5555-7777"
  },
  {
    id: "shp-7702",
    customer_id: "CUST003",
    customer_name: "현대글로비스 트레이딩",
    bl_number: "ONEU7730402",
    cargo_id: "ONEU55019282",
    tracking_number: "CT-2026-7702",
    transport_mode: "SEA",
    carrier_name: "Evergreen",
    vessel_flight_no: "EVER GIVEN 014W",
    origin: "Busan (KRPUS)",
    origin_code: "PUS",
    destination: "Singapore (SGSIN)",
    destination_code: "SIN",
    progress_pct: 65,
    current_step: "남해 항해 중",
    original_eta: "2026-08-03",
    current_eta: "2026-08-03",
    delay_reason: "",
    status: "IN_TRANSIT",
    public_token: "e8v4k2n10p",
    recipient_email: "singapore@hyundai-glovis.com",
    recipient_phone: "010-5555-7777"
  },
  {
    id: "shp-7703",
    customer_id: "CUST003",
    customer_name: "현대글로비스 트레이딩",
    bl_number: "ONEU7730403",
    cargo_id: "ONEU55019283",
    tracking_number: "CT-2026-7703",
    transport_mode: "AIR",
    carrier_name: "Asiana Cargo",
    vessel_flight_no: "OZ222 Cargo",
    origin: "Incheon (ICN)",
    origin_code: "ICN",
    destination: "New York (JFK)",
    destination_code: "JFK",
    progress_pct: 40,
    current_step: "비행 중",
    original_eta: "2026-07-30",
    current_eta: "2026-08-01",
    delay_reason: "현지 기상 악화 이슈",
    status: "DELAYED",
    public_token: "n9y4k2q01z",
    recipient_email: "newyork@hyundai-glovis.com",
    recipient_phone: "010-5555-7777"
  },
  {
    id: "shp-7704",
    customer_id: "CUST003",
    customer_name: "현대글로비스 트레이딩",
    bl_number: "ONEU7730404",
    cargo_id: "ONEU55019284",
    tracking_number: "CT-2026-7704",
    transport_mode: "SEA",
    carrier_name: "OOCL",
    vessel_flight_no: "OOCL HONGKONG 089",
    origin: "Hong Kong (HKG)",
    origin_code: "HKG",
    destination: "Busan (KRPUS)",
    destination_code: "PUS",
    progress_pct: 25,
    current_step: "항해 중",
    original_eta: "2026-08-05",
    current_eta: "2026-08-05",
    delay_reason: "",
    status: "IN_TRANSIT",
    public_token: "h9k4n2z10p",
    recipient_email: "hongkong@hyundai-glovis.com",
    recipient_phone: "010-5555-7777"
  },
  {
    id: "shp-7705",
    customer_id: "CUST003",
    customer_name: "현대글로비스 트레이딩",
    bl_number: "ONEU7730405",
    cargo_id: "ONEU55019285",
    tracking_number: "CT-2026-7705",
    transport_mode: "AIR",
    carrier_name: "British Airways Cargo",
    vessel_flight_no: "BA018 Cargo",
    origin: "Incheon (ICN)",
    origin_code: "ICN",
    destination: "London (LHR)",
    destination_code: "LHR",
    progress_pct: 75,
    current_step: "비행 중",
    original_eta: "2026-07-30",
    current_eta: "2026-07-30",
    delay_reason: "",
    status: "IN_TRANSIT",
    public_token: "l8h4k2q01z",
    recipient_email: "london@hyundai-glovis.com",
    recipient_phone: "010-5555-7777"
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

const ShipmentContext = createContext();

export const ShipmentProvider = ({ children }) => {
  // Always reset to INITIAL_SHIPMENTS so that the dashboard shows all 5 records matching Supabase DB
  const [shipments, setShipments] = useState(() => {
    localStorage.setItem('cargotracker_react_shipments_v2', JSON.stringify(INITIAL_SHIPMENTS));
    return INITIAL_SHIPMENTS;
  });

  const [notifications, setNotifications] = useState(() => {
    const local = localStorage.getItem('cargotracker_react_notifications_v1');
    return local ? JSON.parse(local) : INITIAL_NOTIFICATIONS;
  });

  // Default User as CUST001 - (주) 한진글로벌물류
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem('cargotracker_user_v1');
    return localUser ? JSON.parse(localUser) : {
      id: 'usr-cust001',
      customer_id: 'CUST001',
      customer_name: '(주) 한진글로벌물류',
      name: '(주) 한진글로벌물류',
      email: 'cust001@cargotracker.com',
      role: 'CUSTOMER'
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const localAuth = localStorage.getItem('cargotracker_is_auth_v1');
    return localAuth !== 'false';
  });

  const [loginMethod, setLoginMethod] = useState(() => {
    return localStorage.getItem('cargotracker_login_method_v1') || 'CUSTOM';
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('cargotracker_react_shipments_v2', JSON.stringify(shipments));
  }, [shipments]);

  useEffect(() => {
    localStorage.setItem('cargotracker_react_notifications_v1', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (user && isAuthenticated) {
      localStorage.setItem('cargotracker_user_v1', JSON.stringify(user));
      localStorage.setItem('cargotracker_is_auth_v1', 'true');
      localStorage.setItem('cargotracker_login_method_v1', loginMethod || 'CUSTOM');
    } else {
      localStorage.removeItem('cargotracker_user_v1');
      localStorage.setItem('cargotracker_is_auth_v1', 'false');
      localStorage.removeItem('cargotracker_login_method_v1');
    }
  }, [user, isAuthenticated, loginMethod]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Custom Login Method with Company Name mapping
  const loginWithCustom = (idOrEmail, password) => {
    const custId = idOrEmail.trim().toUpperCase() || 'CUST001';
    let companyName = custId;
    
    if (custId === 'CUST001') {
      companyName = '(주) 한진글로벌물류';
    } else if (custId === 'CUST002') {
      companyName = '삼성SDS 인터내셔널';
    } else if (custId === 'CUST003') {
      companyName = '현대글로비스 트레이딩';
    }

    const userData = {
      id: 'usr-' + Date.now(),
      customer_id: custId,
      customer_name: companyName,
      name: companyName,
      email: `${custId.toLowerCase()}@cargotracker.com`,
      role: 'CUSTOMER'
    };

    setUser(userData);
    setIsAuthenticated(true);
    setLoginMethod('CUSTOM');
    showToast(`[로그인 성공] ${userData.customer_name}님 환영합니다!`);
  };

  // QR Login Method
  const loginWithQR = (qrToken = 'a8f9x2k91b') => {
    const userData = {
      id: 'usr-qr-' + Date.now(),
      customer_id: 'CUST001',
      customer_name: '(주) 글로벌로직스',
      name: `(주) 글로벌로직스`,
      email: `qr-user-${qrToken}@cargo.com`,
      role: 'GUEST_SHIPPER'
    };
    setUser(userData);
    setIsAuthenticated(true);
    setLoginMethod('QR');
    showToast(`[QR 로그인 성공] QR 토큰 (${qrToken}) 인증이 완료되었습니다.`);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setLoginMethod(null);
    showToast('로그아웃되었습니다.');
  };

  const getShipmentByToken = (token) => {
    return shipments.find(s => s.public_token === token);
  };

  const getShipmentByTrackingNumber = (trackingNo) => {
    return shipments.find(s => s.tracking_number.toLowerCase() === trackingNo.trim().toLowerCase());
  };

  const saveShipment = (data) => {
    let updatedList = [...shipments];
    const generateToken = () => Math.random().toString(36).substring(2, 12);

    if (data.id) {
      const idx = updatedList.findIndex(s => s.id === data.id);
      if (idx >= 0) {
        const old = updatedList[idx];
        const etaChanged = old.current_eta !== data.current_eta;
        
        updatedList[idx] = {
          ...old,
          ...data,
          updated_at: new Date().toISOString()
        };

        setShipments(updatedList);

        if (etaChanged) {
          addNotification({
            shipment_id: data.id,
            tracking_number: data.tracking_number,
            recipient: data.recipient_email || 'customer@example.com',
            type: 'EMAIL',
            event: 'ETA_UPDATE_ALERT',
            status: 'SUCCESS',
            message: `[자동 알림] ${data.tracking_number} ETA 변경: ${data.current_eta}`,
            sent_at: new Date().toLocaleString('ko-KR')
          });
        }
        showToast(`선적건 ${data.tracking_number} 정보가 업데이트되었습니다.`);
      }
    } else {
      const newShipment = {
        id: 'shp-' + Date.now(),
        customer_id: user?.customer_id || 'CUST001',
        customer_name: user?.customer_name || '(주) 한진글로벌물류',
        public_token: generateToken(),
        created_at: new Date().toISOString(),
        milestones: [
          { order: 1, name: "선적 대기", status: "COMPLETED", date: new Date().toISOString().split('T')[0] },
          { order: 2, name: "출항", status: "IN_PROGRESS", date: new Date().toISOString().split('T')[0] },
          { order: 3, name: "운송 중", status: "PENDING", date: "" },
          { order: 4, name: "입항", status: "PENDING", date: "" },
          { order: 5, name: "인도", status: "PENDING", date: "" }
        ],
        ...data
      };

      setShipments([newShipment, ...updatedList]);

      addNotification({
        shipment_id: newShipment.id,
        tracking_number: newShipment.tracking_number,
        recipient: newShipment.recipient_email || 'customer@example.com',
        type: 'EMAIL',
        event: 'INITIAL_DISPATCH',
        status: 'SUCCESS',
        message: `[자동 발송] ${newShipment.tracking_number} 고유 QR 및 추적 링크 발송 완료`,
        sent_at: new Date().toLocaleString('ko-KR')
      });

      showToast(`신규 선적건 ${newShipment.tracking_number} 생성 및 QR 발송 완료!`);
    }
  };

  const deleteShipment = (id) => {
    setShipments(prev => prev.filter(s => s.id !== id));
    showToast('선적 정보가 삭제되었습니다.');
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: 'notif-' + Date.now(),
      sent_at: new Date().toLocaleString('ko-KR'),
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const resendNotification = (id) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        showToast(`수동 재발송 완료! [${n.tracking_number}] 수신자: ${n.recipient}`);
        return {
          ...n,
          status: 'SUCCESS',
          failure_reason: '',
          sent_at: new Date().toLocaleString('ko-KR') + ' (재발송 완료)'
        };
      }
      return n;
    }));
  };

  const resetToDefault = () => {
    setShipments(INITIAL_SHIPMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.setItem('cargotracker_react_shipments_v2', JSON.stringify(INITIAL_SHIPMENTS));
    localStorage.setItem('cargotracker_react_notifications_v1', JSON.stringify(INITIAL_NOTIFICATIONS));
    showToast('샘플 데이터로 초기화되었습니다.');
  };

  return (
    <ShipmentContext.Provider value={{
      shipments,
      notifications,
      toasts,
      user,
      isAuthenticated,
      loginMethod,
      loginWithCustom,
      loginWithQR,
      logout,
      showToast,
      getShipmentByToken,
      getShipmentByTrackingNumber,
      saveShipment,
      deleteShipment,
      resendNotification,
      resetToDefault
    }}>
      {children}
    </ShipmentContext.Provider>
  );
};

export const useShipments = () => useContext(ShipmentContext);
