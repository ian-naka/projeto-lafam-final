import type { ReactNode } from 'react';

interface BlocoCampoProps {
  rotulo: string;
  children: ReactNode;
}

const BlocoCampo = ({ rotulo, children }: BlocoCampoProps) => {
  return (
    <label className="bloco-campo">
      <span className="bloco-campo__rotulo">{rotulo}</span>
      {children}
    </label>
  );
};

export default BlocoCampo;
