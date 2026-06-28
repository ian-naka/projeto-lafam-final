import { useEffect, useState } from 'react';

export function useMediaQuery(consulta: string, valorPadrao = false) {
  const [corresponde, setCorresponde] = useState(() => {
    if (typeof window === 'undefined') return valorPadrao;
    return window.matchMedia(consulta).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const listaMidia = window.matchMedia(consulta);
    const atualizar = (evento?: MediaQueryListEvent) => {
      setCorresponde(evento ? evento.matches : listaMidia.matches);
    };

    atualizar();
    listaMidia.addEventListener('change', atualizar);

    return () => {
      listaMidia.removeEventListener('change', atualizar);
    };
  }, [consulta]);

  return corresponde;
}
