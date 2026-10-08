import type { Tributacao } from "../types/investimento";

// Opções de imposto de renda para escolher no cofrinho
export const opcoesTributacao: { valor: Tributacao; nome: string }[] = [
  { valor: "nenhuma", nome: "Não descontar (isento ou valor bruto)" },
  { valor: "fundo", nome: "Fundo de investimento (22,5% → 20%)" },
  { valor: "cdb", nome: "CDB, caixinha, Tesouro (22,5% → 15%)" },
];
