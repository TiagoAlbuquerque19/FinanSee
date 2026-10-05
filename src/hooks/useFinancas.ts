import { useContext } from "react";
import { FinancasContext } from "../context/FinancasContext";

// Atalho para pegar os dados de qualquer componente:
// const { transacoes, adicionarTransacao } = useFinancas();
export function useFinancas() {
  const contexto = useContext(FinancasContext);

  if (contexto === null) {
    throw new Error("useFinancas precisa estar dentro do FinancasProvider");
  }

  return contexto;
}
