import type { Transacao } from "../types/transacao";
import type { MovimentoInvestimento } from "../types/investimento";

// Quanto tem disponível na conta no fim de um mês:
//   saldo inicial
//   + todas as receitas até esse mês
//   − todas as despesas até esse mês
//   − o que foi guardado nos cofrinhos (aportes) + o que foi retirado (resgates)
// Ou seja: o que sobra de um mês "passa" para o seguinte
export function saldoAcumuladoAte(
  mes: string, // "AAAA-MM"
  transacoes: Transacao[],
  movimentos: MovimentoInvestimento[],
  saldoInicial: number,
): number {
  let saldo = saldoInicial;

  for (const transacao of transacoes) {
    // Datas "AAAA-MM" podem ser comparadas como texto: "2026-10" <= "2026-11"
    if (transacao.data.slice(0, 7) > mes) {
      continue;
    }

    if (transacao.tipo === "receita") {
      saldo = saldo + transacao.valor;
    } else {
      saldo = saldo - transacao.valor;
    }
  }

  for (const movimento of movimentos) {
    if (movimento.data.slice(0, 7) > mes) {
      continue;
    }

    // O "saldo conferido" do cofrinho não mexe na conta: só aporte e resgate
    if (movimento.tipo === "aporte") {
      saldo = saldo - movimento.valor;
    } else if (movimento.tipo === "resgate") {
      saldo = saldo + movimento.valor;
    }
  }

  return saldo;
}
