// Como o imposto de renda é descontado do rendimento
//   nenhuma = não descontar (isentos, ou para ver o valor bruto)
//   fundo   = fundos de renda fixa: 22,5% até 180 dias, 20% depois
//   cdb     = CDB, caixinhas, Tesouro: 22,5% / 20% / 17,5% / 15%
export type Tributacao = "nenhuma" | "fundo" | "cdb";

export interface Investimento {
  id: string;
  nome: string; // ex.: "Reserva de emergência"
  banco: string; // ex.: "Nubank (Caixinha)"
  percentualCdi: number; // ex.: 100 (= rende 100% do CDI)
  tributacao: Tributacao;
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
