export interface Lembrete {
  id: string;
  titulo: string;
  // null quando o valor muda todo mês ou ainda não se sabe
  valor: number | null;
  // "AAAA-MM-DD": a data de vencimento (nas contas mensais, vale o dia)
  vencimento: string;
  // true = conta que se repete todo mês (aluguel, internet...)
  recorrente: boolean;
  // Os meses já pagos, no formato "AAAA-MM"
  pagamentos: string[];
}
