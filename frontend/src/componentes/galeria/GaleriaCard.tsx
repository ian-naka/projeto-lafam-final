import { Link } from '@tanstack/react-router';

type GaleriaCardProps = {
  imagem?: string;
  nome: string;
  slug: string;
  tamanho?: 'mobile' | 'tablet' | 'compacto' | 'padrao';
};

export function GaleriaCard({ imagem, nome, slug, tamanho = 'padrao' }: GaleriaCardProps) {
  const classesPorTamanho = {
    mobile: {
      card: 'aspect-[16/10] min-h-[170px] px-4 py-5',
      badge: 'px-4 py-2',
      text: 'text-sm',
    },
    tablet: {
      card: 'aspect-[4/5] min-h-[220px] px-5 py-6',
      badge: 'px-5 py-2.5',
      text: 'text-[15px]',
    },
    compacto: {
      card: 'aspect-[4/5] min-h-[238px] px-5 py-6',
      badge: 'px-5 py-3',
      text: 'text-[15px]',
    },
    padrao: {
      card: 'aspect-[3/4] min-h-[250px] px-6 py-8',
      badge: 'px-5 py-3',
      text: 'text-base',
    },
  } as const;

  const classes = classesPorTamanho[tamanho];

  return (
    <Link
      to="/galeria/$slugCategoria"
      params={{ slugCategoria: slug }}
      className={`group relative flex items-center justify-center overflow-hidden rounded-[24px] border border-gray-200 bg-white text-center font-semibold text-white shadow-sm transition-shadow duration-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.18)] ${classes.card}`}
      style={{
        backgroundImage: imagem ? `url(${imagem})` : undefined,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/30 to-black/10 transition-opacity duration-200 group-hover:opacity-90" />
      <div
        className={`relative z-10 inline-flex max-w-full items-center justify-center rounded-[12px] border border-[#E5E5E5] bg-[#FDF8F8] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] ${classes.badge}`}
      >
        <span className={`lafam-text-label text-center font-semibold text-slate-800 ${classes.text}`}>
          {nome}
        </span>
      </div>
    </Link>
  );
}
