import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import TelaCarregando from "../TelaCarregando/TelaCarregando";

interface RotaProtegidaProps {
  children: ReactNode;
  // true = só para quem está logado; false = só para quem NÃO está
  // (ex.: a tela de login não faz sentido para quem já entrou)
  precisaEstarLogado: boolean;
}

function RotaProtegida({ children, precisaEstarLogado }: RotaProtegidaProps) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <TelaCarregando />;
  }

  if (precisaEstarLogado && usuario === null) {
    return <Navigate to="/entrar" replace />;
  }

  if (!precisaEstarLogado && usuario !== null) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default RotaProtegida;
