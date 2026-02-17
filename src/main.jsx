import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import App from './App';
import './styles.css';

try {
  const awsExportsModule = await import('./aws-exports').catch(() => null);
  if (awsExportsModule?.default) {
    Amplify.configure(awsExportsModule.default);
  }
} catch {
  // no-op if not present
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
