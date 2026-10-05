import type { Transacao } from "../types/transacao";
import { calcularResumo } from "./calcularResumo";
import { formatarMes, mudarMes } from "./datas";

export interface ResumoDoMes {
  mes: string; // "2026-10"
  rotulo: string; // "out" (para o eixo do gráfico)
  titulo: string; // "outubro de 2026" (para o tooltip)
  receitas: number;
  despesas: number;
  saldo: number;
}

// Monta o resumo dos últimos "quantidade" meses, terminando em mesFinal.
// Ex.: mesFinal "2026-10" e quantidade 6 → de maio a outubro
export function resumoPorMes(
  transacoes: Transacao[],
  mesFinal: string,
  quantidade: number,
): ResumoDoMes[] {
  const meses: ResumoDoMes[] = [];

  // Começa no mais antigo (i = 5, 4, 3...) para o gráfico ficar em ordem
  for (let i = quantidade - 1; i >= 0; i--) {
    const mes = mudarMes(mesFinal, -i);

    const transacoesDoMes = transacoes.filter(
      (transacao) => transacao.data.slice(0, 7) === mes,
    );

    const titulo = formatarMes(mes);

    meses.push({
      mes,
      rotulo: titulo.slice(0, 3), // "outubro de 2026" → "out"
      titulo,
      ...calcularResumo(transacoesDoMes),
    });
  }

  return meses;
}
