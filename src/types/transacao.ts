export type TipoTransacao = "receita" | "despesa";

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoria: string;
  data: string;
}
