// frontend/src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ProducerProvider } from './contexts/ProducerContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ProducerProvider>
      <App />
    </ProducerProvider>
  </React.StrictMode>
);

reportWebVitals();