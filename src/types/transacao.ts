export type TipoTransacao = "receita" | "despesa";

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoria: string;
  data: string;
  // Quando foi lançada (vem do banco). Desempata a ordem no mesmo dia
  criadoEm?: string;
}
