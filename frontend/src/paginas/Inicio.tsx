import { useNavigate } from '@tanstack/react-router';
import homeForest from '../assets/home-forest.png';
import { Button } from '../componentes/botao/Button';
import { Container } from '../componentes/container';
import { useResponsividade } from '../hooks';

const Inicio = () => {
  const navigate = useNavigate();
  const { ehCelular, ehTablet, ehDesktopAmplo } = useResponsividade();
  const alturaContainer = ehCelular ? 'min-h-[68dvh]' : ehTablet ? 'min-h-[72dvh]' : 'min-h-[78dvh]';

  const classesTexto = ehDesktopAmplo
    ? {
        botao: 'h-12 min-w-[188px] px-7 text-[15px]',
        marca: 'text-base',
        subtitulo: 'text-sm md:text-base',
        credito: 'text-xs md:text-sm',
        simbolo: 'h-12 w-12',
      }
    : {
        botao: 'h-11 min-w-[168px] px-6',
        marca: 'text-sm',
        subtitulo: 'text-xs md:text-sm',
        credito: 'text-[11px] md:text-xs',
        simbolo: 'h-10 w-10',
      };

  const espacamentoInferior = ehCelular ? 'bottom-6' : ehTablet ? 'bottom-8' : 'bottom-10 md:bottom-12';

  return (
    <Container
      ancoradoNoTopo
      contentClassName={`h-auto w-full max-w-[1100px] overflow-hidden px-0 ${alturaContainer}`}
    >
      <div className={`relative w-full ${alturaContainer}`}>
        <img
          src={homeForest}
          alt="Floresta com neblina"
          className="absolute inset-x-0 bottom-0 h-full w-full object-cover object-bottom"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[34%] bg-gradient-to-b from-white via-white/78 to-transparent" />
        <div className={`absolute inset-x-0 ${espacamentoInferior} flex flex-col items-center gap-4 px-5 text-center md:px-6`}>
          <Button type="button" className={classesTexto.botao} onClick={() => navigate({ to: '/galeria' })}>
            Galeria
          </Button>
          <div className="flex flex-col items-center gap-1 text-white drop-shadow-[0_4px_16px_rgba(15,23,42,0.38)]">
            <p className={`${classesTexto.marca} font-semibold uppercase tracking-[0.34em]`}>LAFAM</p>
            <p className={`${classesTexto.subtitulo} font-medium uppercase tracking-[0.16em]`}>
              Laboratorio de Fotografia Ambiental
            </p>
            <p className={`${classesTexto.credito} font-medium tracking-[0.12em]`}>
              Registro Fotografico: Pedro Nobre
            </p>
            <img src="/favicon.png" alt="Simbolo do LAFAM" className={`mt-2 object-contain ${classesTexto.simbolo}`} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Inicio;
