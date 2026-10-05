import type { Transacao } from "../types/transacao";

export interface TotalCategoria {
  categoria: string;
  total: number;
}

// Soma as despesas de cada categoria e ordena do maior gasto para o menor
export function agruparDespesasPorCategoria(
  transacoes: Transacao[],
): TotalCategoria[] {
  const totais: TotalCategoria[] = [];

  for (const transacao of transacoes) {
    if (transacao.tipo === "receita") {
      continue;
    }

    const itemExistente = totais.find(
      (item) => item.categoria === transacao.categoria,
    );

    if (itemExistente) {
      itemExistente.total = itemExistente.total + transacao.valor;
    } else {
      totais.push({ categoria: transacao.categoria, total: transacao.valor });
    }
  }

  totais.sort((a, b) => b.total - a.total);

  return totais;
}
