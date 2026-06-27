import type { ReactNode } from 'react';
import { Navigate, useLocation } from '@tanstack/react-router';
import { usuarioEstaAutenticado } from '../ajudantes/autenticacao';

const RotaProtegida = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  if (!usuarioEstaAutenticado()) {
    sessionStorage.setItem('origem_pos_login', location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RotaProtegida;
