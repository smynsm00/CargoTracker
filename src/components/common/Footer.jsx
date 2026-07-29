import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const Footer = () => {
  const location = useLocation();
  const { t } = useLanguage();

  // Hide global footer on /map page to prevent double scrollbars
  if (location.pathname === '/map') {
    return null;
  }

  return (
    <footer>
      <p>{t('copyright')}</p>
    </footer>
  );
};
