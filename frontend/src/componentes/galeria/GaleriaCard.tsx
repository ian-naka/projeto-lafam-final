import { Link } from '@tanstack/react-router';

type GaleriaCardProps = {
  imagem?: string;
  nome: string;
  slug: string;
};

export function GaleriaCard({ imagem, nome, slug }: GaleriaCardProps) {
  return (
    <Link
      to="/galeria/$slugCategoria"
      params={{ slugCategoria: slug }}
      className="group relative flex items-center justify-center overflow-hidden rounded-[24px] border border-gray-200 bg-white h-[300px] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
      style={{
        backgroundImage: imagem ? `url(${imagem})` : undefined,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent transition-opacity duration-200 group-hover:opacity-85" />
      <div className="relative z-10 inline-flex items-center justify-center rounded-[12px] border border-[#E5E5E5] bg-[#FDF8F8] px-5 py-2.5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        <span className="lafam-text-label text-center font-semibold text-slate-800">
          {nome}
        </span>
      </div>
    </Link>
  );
}
