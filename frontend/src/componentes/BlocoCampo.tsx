import type { ReactNode } from 'react';

interface BlocoCampoProps {
  rotulo: string;
  children: ReactNode;
}

const BlocoCampo = ({ rotulo, children }: BlocoCampoProps) => {
  return (
    <label className="flex flex-col gap-2">
      <span className="lafam-text-label">{rotulo}</span>
      {children}
    </label>
  );
};

export default BlocoCampo;
