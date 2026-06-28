import { PONTOS_DE_QUEBRA } from './pontosDeQuebra';
import { useMediaQuery } from './useMediaQuery';

export function useResponsividade() {
  const ehCelular = useMediaQuery(PONTOS_DE_QUEBRA.celular);
  const ehTablet = useMediaQuery(PONTOS_DE_QUEBRA.tablet);
  const ehDesktopCompacto = useMediaQuery(PONTOS_DE_QUEBRA.desktopCompacto);
  const ehDesktopAmplo = useMediaQuery(PONTOS_DE_QUEBRA.desktopAmplo);

  return {
    ehCelular,
    ehTablet,
    ehDesktop: ehDesktopCompacto || ehDesktopAmplo,
    ehDesktopCompacto,
    ehDesktopAmplo,
    ehMobileOuTablet: ehCelular || ehTablet,
    usaLayoutEmpilhado: ehCelular || ehTablet,
  };
}
