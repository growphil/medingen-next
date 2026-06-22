import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import { CartProvider, CompareProvider, ProfileProvider } from './api/stateContext';
import { ensurePushSubscription } from './pushClient';
import Swal from 'sweetalert2';

// Check if we are running under React Snap crawler
const isPrerender = typeof window !== 'undefined' && 
  (window.__PRERENDER__ || (navigator.userAgent && navigator.userAgent.includes("ReactSnap")));

if (isPrerender) {
  // Stub SweetAlert to be a no-op / instant resolve to prevent crawl failures or modal lockouts
  Swal.fire = () => Promise.resolve({ isConfirmed: true, value: true });
  Swal.showLoading = () => {};
  Swal.close = () => {};
}

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <CartProvider>
      <CompareProvider>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </CompareProvider>
    </CartProvider>
  );
} else {
  const root = createRoot(rootElement);
  root.render(
    <CartProvider>
      <CompareProvider>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </CompareProvider>
    </CartProvider>
  );
}

// Only register service worker and push notifications in a real browser, not during pre-rendering
if (!isPrerender) {
  serviceWorker.register();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(() => {
      ensurePushSubscription();
    });
  }
}

reportWebVitals();