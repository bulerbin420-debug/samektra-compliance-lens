import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      const basePath = new URL(import.meta.env.BASE_URL, window.location.href).pathname;
      const scope = basePath.endsWith('/') ? basePath : `${basePath}/`;
      const swUrl = `${scope}sw.js`;
      navigator.serviceWorker
        .register(swUrl, { scope })
        .then((reg) => console.log('SW registered:', reg.scope))
        .catch((err) => console.warn('SW registration failed:', err));
    } catch (err) {
      console.warn('SW registration failed (URL resolution):', err);
    }
  });
}

