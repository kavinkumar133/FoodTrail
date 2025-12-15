import { useEffect, useState } from 'react';
import '../styles/components.css';

export default function Toast() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    function onToast(e) {
      setMsg(e.detail || '');
      setTimeout(() => setMsg(''), 2000);
    }
    window.addEventListener('app-toast', onToast);
    return () => window.removeEventListener('app-toast', onToast);
  }, []);

  if (!msg) return null;
  return <div className="toast" role="status">{msg}</div>;
}
