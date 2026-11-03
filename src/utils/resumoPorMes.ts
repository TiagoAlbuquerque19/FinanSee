import type { Transacao } from "../types/transacao";
import type { MovimentoInvestimento } from "../types/investimento";
import { investidoNoMes } from "./investimentos";
import { calcularResumo } from "./calcularResumo";
import { formatarMes, mudarMes } from "./datas";

export interface ResumoDoMes {
  mes: string; // "2026-10"
  rotulo: string; // "out" (para o eixo do gráfico)
  titulo: string; // "outubro de 2026" (para o tooltip)
  receitas: number;
  despesas: number;
  investido: number; // guardado nos cofrinhos − retirado deles
  saldo: number; // o que sobrou: receitas − despesas − investido
}

// Monta o resumo dos últimos "quantidade" meses, terminando em mesFinal.
// Ex.: mesFinal "2026-10" e quantidade 6 → de maio a outubro
export function resumoPorMes(
  transacoes: Transacao[],
  mesFinal: string,
  quantidade: number,
  // Opcional: aportes e resgates dos cofrinhos
  movimentos: MovimentoInvestimento[] = [],
): ResumoDoMes[] {
  const meses: ResumoDoMes[] = [];

  // Começa no mais antigo (i = 5, 4, 3...) para o gráfico ficar em ordem
  for (let i = quantidade - 1; i >= 0; i--) {
    const mes = mudarMes(mesFinal, -i);

    const transacoesDoMes = transacoes.filter(
      (transacao) => transacao.data.slice(0, 7) === mes,
    );

    const titulo = formatarMes(mes);

    const { receitas, despesas } = calcularResumo(transacoesDoMes);
    const investido = investidoNoMes(movimentos, mes);

    meses.push({
      mes,
      rotulo: titulo.slice(0, 3), // "outubro de 2026" → "out"
      titulo,
      receitas,
      despesas,
      investido,
      saldo: receitas - despesas - investido,
    });
  }

  return meses;
}
