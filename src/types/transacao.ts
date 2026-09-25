export type TipoTransacao = "receita" | "despesa";

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  data: string;
}
