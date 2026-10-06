export interface Investimento {
  id: string;
  nome: string; // ex.: "Reserva de emergência"
  banco: string; // ex.: "Nubank (Caixinha)"
  percentualCdi: number; // ex.: 100 (= rende 100% do CDI)
}

// aporte = guardou · resgate = tirou · saldo = conferiu no banco e informou
export type TipoMovimento = "aporte" | "resgate" | "saldo";

export interface MovimentoInvestimento {
  id: string;
  investimentoId: string;
  tipo: TipoMovimento;
  valor: number;
  data: string; // "AAAA-MM-DD"
}

export interface ConfiguracaoCdi {
  cdiAnual: number | null; // ex.: 14.9 (% ao ano); null = ainda não informado
  atualizadoEm: string | null; // "AAAA-MM-DD"
}
