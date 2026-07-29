import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ShipmentProvider } from './context/ShipmentContext';
import { LanguageProvider } from './context/LanguageContext';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ShipmentProvider>
          <App />
        </ShipmentProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
