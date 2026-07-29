import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en';
import { ko } from '../locales/ko';

const LanguageContext = createContext();

const dictionaries = { en, ko };

export const LanguageProvider = ({ children }) => {
  // Read initial language from URL ?lang=en/ko or localStorage or browser default
  const [lang, setLang] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlLang = searchParams.get('lang')?.toLowerCase();
    if (urlLang === 'en' || urlLang === 'ko') {
      return urlLang;
    }
    const saved = localStorage.getItem('cargotracker_lang');
    if (saved === 'en' || saved === 'ko') {
      return saved;
    }
    return 'ko'; // Default to Korean
  });

  useEffect(() => {
    localStorage.setItem('cargotracker_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'ko' ? 'en' : 'ko'));
  };

  const t = (key) => {
    const currentDict = dictionaries[lang] || dictionaries.ko;
    return currentDict[key] || dictionaries.ko[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
