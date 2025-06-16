import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootEl = document.getElementById('root');
const root = createRoot(rootEl);

function Wrapper() {
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    function handleMessage(event) {
      // Ignore Webpack or other noise
      if (event.data?.type === 'webpackWarnings') return;

      console.log('Received postMessage in iframe:', event.data);
      setPayload(event.data);
    }

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!payload) {
    return <div>Waiting for report data...</div>;
  }

  return <App {...payload} />;
}

root.render(<Wrapper />);