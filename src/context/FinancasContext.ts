import { createContext } from "react";
import type { Transacao } from "../types/transacao";

// Tudo o que as telas do FinanSee podem ler e fazer com os dados
export interface FinancasContextValor {
  transacoes: Transacao[];
  transacoesDoMes: Transacao[];
  todasCategoriasDespesa: string[];
  categoriasPersonalizadas: string[];
  mesSelecionado: string;
  setMesSelecionado: (mes: string) => void;
  adicionarTransacao: (transacao: Transacao) => void;
  excluirTransacao: (id: string) => void;
  criarCategoria: (nome: string) => void;
}

// Começa como null: só passa a ter valor dentro do FinancasProvider
export const FinancasContext = createContext<FinancasContextValor | null>(
  null,
);
