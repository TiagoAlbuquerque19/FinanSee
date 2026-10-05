import type { Transacao } from "../types/transacao";

export interface Resumo {
  receitas: number;
  despesas: number;
  saldo: number;
}

// Soma receitas e despesas de uma lista de transações
export function calcularResumo(transacoes: Transacao[]): Resumo {
  let receitas = 0;
  let despesas = 0;

  for (const transacao of transacoes) {
    if (transacao.tipo === "receita") {
      receitas = receitas + transacao.valor;
    } else {
      despesas = despesas + transacao.valor;
    }
  }

  return { receitas, despesas, saldo: receitas - despesas };
}
