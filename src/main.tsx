// Intercept and prevent browser extension uncaught errors
if (typeof window !== 'undefined') {
  const isExtensionError = (msg?: string, url?: string, stack?: string) => {
    const str = `${msg || ''} ${url || ''} ${stack || ''}`;
    return str.includes('chrome-extension://') || str.includes('Cannot set property fetch of #<Window>');
  };

  window.addEventListener(
    'error',
    (event) => {
      const msg = event.message || '';
      const url = event.filename || '';
      const stack = event.error?.stack || '';
      if (isExtensionError(msg, url, stack)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
