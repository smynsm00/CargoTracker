import React, { createContext, useContext, useState, useEffect } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bpvbnzbabrzueoxabqel.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdmJuemJhYnJ6dWVveGFicWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NTU2OTEsImV4cCI6MjEwMDQzMTY5MX0.C3aBQCY7PiptIz6gDIweR0K8jh-l48jnfFmyjSkmFa4';

// Default 5 shipment records per customer ID matching Supabase DB with departure_date (출항일)
const INITIAL_SHIPMENTS = [
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
    destination: "Shanghai (SHA)",
    departure_date: "2026-07-23",
    progress_pct: 100,
    current_step: "인도 완료",
    original_eta: "2026-07-26",
    current_eta: "2026-07-26",
    delay_reason: "",
    status: "COMPLETED",
    public_token: "x7v2n1k89e",
    recipient_email: "shanghai-trade@cn-logistics.com",
    recipient_phone: "010-1234-5678"
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
    destination: "Los Angeles (LAX)",
    departure_date: "2026-07-25",
    progress_pct: 35,
    current_step: "비행 중",
    original_eta: "2026-07-29",
    current_eta: "2026-07-29",
    delay_reason: "",
    status: "IN_TRANSIT",
    public_token: "p3m9z4q70c",
    recipient_email: "us-import@cargo-partner.com",
    recipient_phone: "010-1234-5678"
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
    destination: "Frankfurt (FRA)",
    departure_date: "2026-07-26",
    progress_pct: 80,
    current_step: "비행 중",
    original_eta: "2026-07-30",
    current_eta: "2026-07-30",
    delay_reason: "",
    status: "IN_TRANSIT",
    public_token: "m4k2p8z90r",
    recipient_email: "frankfurt-cargo@asiana.com",
    recipient_phone: "010-1234-5678"
  },
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
    destination: "Busan (KRPUS)",
    departure_date: "2026-07-28",
    progress_pct: 70,
    current_step: "운송 중",
    original_eta: "2026-08-04",
    current_eta: "2026-08-06",
    delay_reason: "유럽/아시아 항만 입항 정체",
    status: "DELAYED",
    public_token: "a8f9x2k91b",
    recipient_email: "importer@rotterdam-logistics.nl",
    recipient_phone: "010-1234-5678"
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
    destination: "Rotterdam (RTM)",
    departure_date: "2026-07-29",
    progress_pct: 45,
    current_step: "운송 중",
    original_eta: "2026-08-10",
    current_eta: "2026-08-15",
    delay_reason: "현지 항구 입항 정체 및 태풍 영향",
    status: "DELAYED",
    public_token: "h8k9m2p01x",
    recipient_email: "rotterdam-depot@hmm-cargo.com",
    recipient_phone: "010-1234-5678"
  }
];

const ShipmentContext = createContext();

export const ShipmentProvider = ({ children }) => {
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [toasts, setToasts] = useState([]);

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

  // Supabase Database Real-Time Auto Sync Fetch
  const fetchSupabaseShipments = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/shipment?select=*`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const mapped = data.map((dbRow) => {
            // Determine status: if ETA is delayed, ensure status is DELAYED
            let finalStatus = dbRow.status || 'IN_TRANSIT';
            if (dbRow.eta_original && dbRow.eta_current && dbRow.eta_original !== dbRow.eta_current && finalStatus !== 'COMPLETED') {
              finalStatus = 'DELAYED';
            }

            return {
              id: `shp-${dbRow.id}`,
              customer_id: dbRow.customer_id || 'CUST001',
              customer_name: dbRow.customer_name || '(주) 한진글로벌물류',
              bl_number: dbRow.bl_number,
              cargo_id: dbRow.cargo_id,
              tracking_number: dbRow.bl_number ? `CT-2026-${dbRow.id + 8800}` : `CT-2026-${dbRow.id}`,
              transport_mode: dbRow.carrier_type || 'SEA',
              carrier_name: dbRow.vessel_name || 'COSCO Shipping',
              vessel_flight_no: dbRow.vessel_name || 'COSCO PRIDE 088W',
              origin: dbRow.origin,
              destination: dbRow.destination,
              departure_date: dbRow.departure_date || (dbRow.created_at ? dbRow.created_at.split('T')[0] : '2026-07-28'),
              progress_pct: dbRow.progress_percent ?? 50,
              current_step: finalStatus === 'COMPLETED' ? '인도 완료' : '운송 중',
              original_eta: dbRow.eta_original,
              current_eta: dbRow.eta_current,
              delay_reason: dbRow.delay_reason || '',
              status: finalStatus,
              public_token: `token-${dbRow.id}`,
              recipient_phone: dbRow.recipient_phone
            };
          });
          setShipments(mapped);
        }
      }
    } catch (err) {
      console.warn('Supabase DB fetch fallback to initial shipments:', err);
    }
  };

  useEffect(() => {
    fetchSupabaseShipments();
  }, []);

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

  // Custom Login Method
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
      customer_name: '(주) 한진글로벌물류',
      name: `(주) 한진글로벌물류`,
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
    return shipments.find(s => s.public_token === token || s.public_token.includes(token));
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
        updatedList[idx] = {
          ...updatedList[idx],
          ...data,
          updated_at: new Date().toISOString()
        };
        setShipments(updatedList);
        showToast(`선적건 ${data.tracking_number} 정보가 업데이트되었습니다.`);
      }
    } else {
      const newShipment = {
        id: 'shp-' + Date.now(),
        customer_id: user?.customer_id || 'CUST001',
        customer_name: user?.customer_name || '(주) 한진글로벌물류',
        departure_date: new Date().toISOString().split('T')[0],
        public_token: generateToken(),
        created_at: new Date().toISOString(),
        ...data
      };

      setShipments([newShipment, ...updatedList]);
      showToast(`신규 선적건 ${newShipment.tracking_number} 생성 완료!`);
    }
  };

  const deleteShipment = (id) => {
    setShipments(prev => prev.filter(s => s.id !== id));
    showToast('선적 정보가 삭제되었습니다.');
  };

  return (
    <ShipmentContext.Provider value={{
      shipments,
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
      fetchSupabaseShipments
    }}>
      {children}
    </ShipmentContext.Provider>
  );
};

export const useShipments = () => useContext(ShipmentContext);
