import { createContext } from "react";
import type { Transacao } from "../types/transacao";
import type { Meta } from "../types/meta";
import type { Lembrete } from "../types/lembrete";

// Tudo o que as telas do FinanSee podem ler e fazer com os dados.
// As ações devolvem Promise<void>: elas conversam com o banco e levam
// um tempinho para terminar.
export interface FinancasContextValor {
  transacoes: Transacao[];
  transacoesDoMes: Transacao[];
  todasCategoriasDespesa: string[];
  categoriasPersonalizadas: string[];
  mesSelecionado: string;
  setMesSelecionado: (mes: string) => void;
  adicionarTransacao: (transacao: Transacao) => Promise<void>;
  excluirTransacao: (id: string) => Promise<void>;
  criarCategoria: (nome: string) => Promise<void>;
  excluirCategoria: (nome: string) => Promise<void>;
  metas: Meta[];
  criarMeta: (meta: Meta) => Promise<void>;
  excluirMeta: (id: string) => Promise<void>;
  // valor positivo guarda dinheiro na meta; negativo retira
  movimentarMeta: (id: string, valor: number) => Promise<void>;
  lembretes: Lembrete[];
  criarLembrete: (lembrete: Lembrete) => Promise<void>;
  excluirLembrete: (id: string) => Promise<void>;
  // Marca (ou desmarca) o pagamento de um lembrete num mês "AAAA-MM"
  alternarPagamento: (id: string, mes: string) => Promise<void>;
  // Quantos itens antigos (salvos só neste navegador) ainda dá para importar
  quantidadeDadosLocais: number;
  importarDadosLocais: () => Promise<void>;
  descartarDadosLocais: () => void;
}

// Começa como null: só passa a ter valor dentro do FinancasProvider
export const FinancasContext = createContext<FinancasContextValor | null>(null);
