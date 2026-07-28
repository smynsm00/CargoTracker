import React from 'react';
import { useLocation } from 'react-router-dom';

export const Footer = () => {
  const location = useLocation();

  // Hide global footer on /map page to prevent double scrollbars
  if (location.pathname === '/map') {
    return null;
  }

  return (
    <footer>
      <p>© 2026 CargoTracker (React Edition). All rights reserved. 국제 운송 시각화 및 자동 알림 플랫폼.</p>
    </footer>
  );
};
