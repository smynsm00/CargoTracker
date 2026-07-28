import React, { useEffect, useRef } from 'react';
import { Compass, Layers, Activity, TrendingUp } from 'lucide-react';

const MAP_API_KEY = '36b32457393a49d5ab826e667d74b5e6';

// Exact Port & Airport International Coordinates (Maritime & Aviation Hubs)
const CITY_COORDS = {
  'Shanghai (CNSHA)': [31.2304, 121.4737],
  'Shanghai (SHA)': [31.2304, 121.4737],
  'Shanghai': [31.2304, 121.4737],
  'Busan (KRPUS)': [35.1028, 129.0403],
  'Busan, KR': [35.1028, 129.0403],
  'Busan': [35.1028, 129.0403],
  'Rotterdam (RTM)': [51.9244, 4.4777],
  'Rotterdam, NL': [51.9244, 4.4777],
  'Incheon (ICN)': [37.4602, 126.4407],
  'Incheon, KR': [37.4602, 126.4407],
  'Los Angeles (LAX)': [33.7423, -118.2705],
  'Los Angeles, US': [33.7423, -118.2705],
  'Hamburg (DEHAM)': [53.5511, 9.9937],
  'Hamburg, DE': [53.5511, 9.9937],
  'Ningbo (CNNGB)': [29.8683, 121.5440],
  'Tokyo (NRT)': [35.6762, 139.6503],
  'Tokyo (TYO)': [35.6762, 139.6503],
  'Singapore (SGSIN)': [1.3521, 103.8198],
  'Frankfurt (FRA)': [50.0379, 8.5622]
};

// Vibrant colors for multi-shipment routes
const ROUTE_COLORS = ['#2563eb', '#e11d48', '#059669', '#d97706', '#8b5cf6'];

export const MapView = ({ shipment, allShipments = [], showAll = false, onSelectShipment }) => {
  const mapContainerRef = useRef(null);
  const leafletMapInstance = useRef(null);

  // List of shipments to display (Single vs All mode)
  const targetList = showAll && allShipments.length > 0 
    ? allShipments 
    : (shipment ? [shipment] : (allShipments.length > 0 ? [allShipments[0]] : []));

  const currentShipment = targetList[0] || shipment || null;
  const currentProgress = currentShipment?.progress_pct ?? 50;

  // Calculate Average Progress for multi-shipment mode
  const avgProgress = targetList.length > 0 
    ? Math.round(targetList.reduce((acc, curr) => acc + (curr.progress_pct || 0), 0) / targetList.length)
    : 50;

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const L = window.L;
    if (!L) return;

    // Initialize or re-center Leaflet Map Instance
    if (!leafletMapInstance.current) {
      const map = L.map(mapContainerRef.current, {
        center: [30, 20],
        zoom: 3,
        zoomControl: true,
        minZoom: 2,
        maxZoom: 18
      });

      // CartoDB Voyager Tile Layer with MAP_API_KEY
      L.tileLayer(`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?apiKey=${MAP_API_KEY}`, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18
      }).addTo(map);

      leafletMapInstance.current = map;
    }

    const map = leafletMapInstance.current;

    // Clear previous markers & polylines
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const allPoints = [];

    // Custom Pin Creator with Extended Width Shape
    const createCustomDivIcon = (color, text) => L.divIcon({
      className: 'custom-leaflet-pin',
      html: `<div style="background: ${color}; color: #ffffff; padding: 4px 12px; border-radius: 12px; font-weight: 800; font-size: 11.5px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); white-space: nowrap; border: 2px solid #ffffff; cursor: pointer; display: inline-block; min-width: 120px; text-align: center;">${text}</div>`,
      iconSize: [160, 30],
      iconAnchor: [80, 15]
    });

    // Render each shipment's route, markers, and vehicle pin
    targetList.forEach((shp, index) => {
      const color = ROUTE_COLORS[index % ROUTE_COLORS.length];
      const isAir = shp.transport_mode === 'AIR';
      const progressPct = shp.progress_pct ?? 50;

      const originStr = shp.origin || 'Shanghai (CNSHA)';
      const destStr = shp.destination || 'Busan (KRPUS)';

      const originCoords = CITY_COORDS[originStr] || CITY_COORDS['Shanghai'] || [31.2304, 121.4737];
      const destCoords = CITY_COORDS[destStr] || CITY_COORDS['Busan'] || [35.1028, 129.0403];

      const currentLat = originCoords[0] + (destCoords[0] - originCoords[0]) * (progressPct / 100);
      const currentLng = originCoords[1] + (destCoords[1] - originCoords[1]) * (progressPct / 100);

      allPoints.push(originCoords, destCoords, [currentLat, currentLng]);

      const vesselDivIcon = L.divIcon({
        className: 'custom-vehicle-pin',
        html: `<div style="background: ${color}; color: #ffffff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px ${color}; border: 2.5px solid #ffffff; cursor: pointer;">
                ${isAir ? '✈️' : '🚢'}
              </div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      // Origin Marker with Extended Width Shape
      const originMarker = L.marker(originCoords, { icon: createCustomDivIcon(color, `${shp.tracking_number} 출발`) })
        .addTo(map)
        .bindPopup(`<b>[${shp.tracking_number}] 출발지</b><br/>${originStr}`);
      
      originMarker.on('click', () => {
        if (onSelectShipment) onSelectShipment(shp);
      });

      // Destination Marker with Extended Width Shape
      const destMarker = L.marker(destCoords, { icon: createCustomDivIcon('#0f172a', `${shp.tracking_number} 도착`) })
        .addTo(map)
        .bindPopup(`<b>[${shp.tracking_number}] 목적지</b><br/>${destStr}`);
      
      destMarker.on('click', () => {
        if (onSelectShipment) onSelectShipment(shp);
      });

      // Vehicle Marker
      const vesselMarker = L.marker([currentLat, currentLng], { icon: vesselDivIcon })
        .addTo(map)
        .bindPopup(`<b>[${shp.tracking_number}] ${shp.carrier_name}</b><br/>상태: ${shp.status}<br/>진행률: ${progressPct}%`);

      vesselMarker.on('click', () => {
        if (onSelectShipment) onSelectShipment(shp);
      });

      // Polyline Route
      L.polyline([originCoords, [currentLat, currentLng], destCoords], {
        color: color,
        weight: showAll ? 3.5 : 4.5,
        dashArray: '6, 8',
        opacity: 0.85
      }).addTo(map);
    });

    // Auto Fit Bounds with maxZoom: 6
    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 6 });
    }

  }, [targetList, showAll, onSelectShipment]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#eef6ff' }}>
      
      {/* Real Interactive Leaflet Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* Floating Area A: Prominently Displaying Transport Progress (%) */}
      <div style={{ position: 'absolute', bottom: '0.85rem', left: '1.25rem', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        
        {/* Floating Progress Card */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          background: 'rgba(255, 255, 255, 0.98)', 
          backdropFilter: 'blur(12px)', 
          padding: '0.55rem 1.15rem', 
          borderRadius: 'var(--radius-full)', 
          border: '1.5px solid #93c5fd', 
          boxShadow: '0 10px 30px -5px rgba(37, 99, 235, 0.25)', 
          width: 'fit-content' 
        }}>
          {showAll ? (
            <Layers className="w-5 h-5 text-blue-600" />
          ) : (
            <TrendingUp className="w-5 h-5 text-blue-600" />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
              {showAll ? (
                `고객사 전체항로 통합 관제 (총 ${targetList.length}건)`
              ) : (
                `[${currentShipment?.tracking_number || '선적건'}] 운송 진행률`
              )}
            </span>

            {/* Mini Progress Bar */}
            <div style={{ width: 85, height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
              <div style={{ 
                width: `${showAll ? avgProgress : currentProgress}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #2563eb, #059669)',
                borderRadius: 4,
                transition: 'width 0.5s ease'
              }} />
            </div>

            {/* Prominent Highlighted Progress Percentage Badge */}
            <span style={{ 
              background: 'linear-gradient(135deg, #2563eb, #0284c7)', 
              color: '#ffffff', 
              padding: '0.2rem 0.65rem', 
              borderRadius: '20px', 
              fontWeight: 900, 
              fontSize: '0.92rem', 
              letterSpacing: '-0.01em',
              boxShadow: '0 2px 8px rgba(37,99,235,0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}>
              {showAll ? `${avgProgress}% (평균)` : `${currentProgress}%`}
            </span>
          </div>
        </div>

        {/* Section A: Copyright text placed at the VERY BOTTOM */}
        <div style={{ background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(8px)', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.68rem', color: '#64748b', border: '1px solid #e2e8f0', width: 'fit-content' }}>
          © 2026 CargoTracker (React Edition). All rights reserved. 국제 운송 시각화 및 자동 알림 플랫폼.
        </div>

      </div>

    </div>
  );
};
