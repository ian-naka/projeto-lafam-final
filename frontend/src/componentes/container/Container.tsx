import type { ReactNode } from 'react';

import { useResponsividade } from '../../hooks';

type ContainerProps = {
  ancoradoNoTopo?: boolean;
  cabecalho?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  destaque?: boolean;
  visualLateral?: ReactNode;
};

export function Container({
  ancoradoNoTopo = false,
  cabecalho,
  children,
  className = '',
  contentClassName = '',
  destaque = true,
  visualLateral,
}: ContainerProps) {
  const { ehMobileOuTablet } = useResponsividade();
  const telaSomenteContainer = !cabecalho && !visualLateral;

  return (
    <div
      className={`flex min-h-dvh w-screen bg-transparent ${
        telaSomenteContainer
          ? ancoradoNoTopo
            ? 'items-start justify-center'
            : 'items-center justify-center'
          : ''
      }${className ? ` ${className}` : ''}`}
    >
      <div
        className={`flex min-h-dvh w-screen flex-col ${
          telaSomenteContainer
            ? ancoradoNoTopo
              ? 'max-w-full justify-start'
              : 'max-w-full justify-center'
            : 'xl:w-[50vw]'
        }`}
      >
        {cabecalho ? (
          <div className="my-[22px] flex h-[53px] w-full justify-between px-[25px] py-0">
            {cabecalho}
          </div>
        ) : null}

        <main
          className={`flex w-full justify-center px-4 md:px-6 ${
            cabecalho
              ? 'flex-1 items-center pb-6 pt-2'
              : ancoradoNoTopo
                ? 'min-h-dvh items-start py-0'
                : 'min-h-dvh items-center py-6'
          }`}
        >
          <div
            className={`relative flex shrink-0 flex-col items-center justify-center gap-[10px] border bg-white ${
              destaque ? 'rounded-[24px] border-gray-200 shadow-sm' : 'rounded-[12px] border-[#E5E7EB]'
            } ${
              ehMobileOuTablet ? 'w-full max-w-[325px] min-h-[435px]' : 'h-[474px] w-[367px]'
            }${ancoradoNoTopo ? ' rounded-t-none border-t-0' : ''}${contentClassName ? ` ${contentClassName}` : ''}`}
          >
            {children}
          </div>
        </main>
      </div>

      {!ehMobileOuTablet && visualLateral ? (
        <aside className="hidden min-h-dvh xl:flex xl:w-[50vw]">
          {visualLateral}
        </aside>
      ) : null}
    </div>
  );
}
