import { useState, useEffect } from 'react';
import bus from '../utils/bus';

export default function FlashMessage() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    // ouve do eventbus criado pelo hook
    const handleFlash = (e: any) => {
      const { message, type } = e.detail;
      setMessage(message);
      setType(type);
      setShow(true);

      // tempo de desaparecimento (4 segundos)
      setTimeout(() => {
        setShow(false);
      }, 4000);
    };

    bus.on('flash', handleFlash);
    return () => {
      bus.off('flash', handleFlash);
    };
  }, []);

  if (!show) return null;

  // mapeamento de cores segundo a paleta do projeto
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-[#a5002c]';

  return (
    <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 shadow-lg rounded-sm text-white font-sans text-sm tracking-wide ${bgColor} transition-opacity duration-300 ease-in-out`}>
      {message}
    </div>
  );
}
