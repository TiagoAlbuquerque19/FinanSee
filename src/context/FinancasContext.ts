import { createContext } from "react";
import type { Transacao } from "../types/transacao";
import type { Meta } from "../types/meta";
import type { Lembrete } from "../types/lembrete";

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
  excluirCategoria: (nome: string) => void;
  metas: Meta[];
  criarMeta: (meta: Meta) => void;
  excluirMeta: (id: string) => void;
  // valor positivo guarda dinheiro na meta; negativo retira
  movimentarMeta: (id: string, valor: number) => void;
  lembretes: Lembrete[];
  criarLembrete: (lembrete: Lembrete) => void;
  excluirLembrete: (id: string) => void;
  // Marca (ou desmarca) o pagamento de um lembrete num mês "AAAA-MM"
  alternarPagamento: (id: string, mes: string) => void;
}

// Começa como null: só passa a ter valor dentro do FinancasProvider
export const FinancasContext = createContext<FinancasContextValor | null>(null);
