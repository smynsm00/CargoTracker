import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ShipmentProvider } from './context/ShipmentContext';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ShipmentProvider>
        <App />
      </ShipmentProvider>
    </BrowserRouter>
  </React.StrictMode>
);
