import type {
  MovimentoInvestimento,
  TipoMovimento,
} from "../types/investimento";
import { doisDigitos } from "./datas";

// =============================================================
// Cálculos dos cofrinhos
// =============================================================

// O CDI é informado "ao ano", mas rende por DIA ÚTIL (252 por ano).
// A taxa de um dia é a raiz 252 de (1 + taxa anual), menos 1.
// Ex.: CDI de 14% ao ano → (1,14)^(1/252) − 1 ≈ 0,052% por dia útil.
// Depois aplicamos o "% do CDI" do cofrinho (100% = igual ao CDI).
export function taxaPorDiaUtil(cdiAnual: number, percentualCdi: number) {
  const cdiPorDia = Math.pow(1 + cdiAnual / 100, 1 / 252) - 1;

  return cdiPorDia * (percentualCdi / 100);
}

// Segunda a sexta. Feriados não são descontados (é uma estimativa)
function ehDiaUtil(data: Date): boolean {
  const diaDaSemana = data.getDay(); // 0 = domingo, 6 = sábado

  return diaDaSemana !== 0 && diaDaSemana !== 6;
}

function paraTexto(data: Date): string {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

// Cada vez que você informa o saldo real, fecha-se um "período"
export interface Fechamento {
  data: string; // quando você informou o saldo
  real: number; // quanto rendeu de verdade no período
  estimado: number | null; // quanto o app tinha estimado (null sem CDI)
}

export interface ResumoInvestimento {
  // Saldo sem estimativa: último saldo informado + aportes − resgates
  saldoConhecido: number;
  // Saldo com o rendimento estimado até hoje (null sem CDI)
  saldoEstimado: number | null;
  // Quanto está rendendo por dia útil, hoje (null sem CDI)
  rendimentoPorDia: number | null;
  // Quanto rendeu (estimado) desde o último saldo informado
  rendimentoDesdeUltimoSaldo: number | null;
  ultimoSaldoEm: string | null;
  fechamentos: Fechamento[]; // do mais recente para o mais antigo
  // true quando já é outro mês e o saldo real ainda não foi conferido
  precisaAtualizar: boolean;
}

// Ordem de cada tipo no mesmo dia: primeiro o dinheiro entra/sai,
// depois vem o saldo conferido
const ordemDoTipo: Record<TipoMovimento, number> = {
  aporte: 0,
  resgate: 0,
  saldo: 1,
};

// Simula o cofrinho dia a dia, do primeiro movimento até hoje
export function calcularInvestimento(
  movimentos: MovimentoInvestimento[],
  percentualCdi: number,
  cdiAnual: number | null,
  hoje: string,
): ResumoInvestimento {
  const ordenados = [...movimentos]
    .filter((movimento) => movimento.data <= hoje)
    .sort(
      (a, b) =>
        a.data.localeCompare(b.data) ||
        ordemDoTipo[a.tipo] - ordemDoTipo[b.tipo],
    );

  const taxa =
    cdiAnual === null ? null : taxaPorDiaUtil(cdiAnual, percentualCdi);

  let conhecido = 0; // sem rendimento estimado
  let estimado = 0; // com rendimento estimado
  let ultimoSaldoEm: string | null = null;
  const fechamentos: Fechamento[] = [];

  if (ordenados.length > 0) {
    const dia = new Date(`${ordenados[0].data}T00:00:00`);
    const fim = new Date(`${hoje}T00:00:00`);
    let indice = 0;
    let primeiroDia = true;

    while (dia <= fim) {
      // 1. Rendimento do dia: o dinheiro que estava no cofrinho rende
      if (!primeiroDia && taxa !== null && ehDiaUtil(dia)) {
        estimado = estimado + estimado * taxa;
      }

      // 2. Movimentos daquele dia
      const textoDoDia = paraTexto(dia);

      while (
        indice < ordenados.length &&
        ordenados[indice].data === textoDoDia
      ) {
        const { tipo, valor } = ordenados[indice];

        if (tipo === "aporte") {
          conhecido = conhecido + valor;
          estimado = estimado + valor;
        } else if (tipo === "resgate") {
          conhecido = Math.max(0, conhecido - valor);
          estimado = Math.max(0, estimado - valor);
        } else {
          // Saldo conferido: o que passou do "conhecido" é rendimento real
          fechamentos.push({
            data: textoDoDia,
            real: valor - conhecido,
            estimado: taxa === null ? null : estimado - conhecido,
          });
          conhecido = valor;
          estimado = valor;
          ultimoSaldoEm = textoDoDia;
        }

        indice = indice + 1;
      }

      dia.setDate(dia.getDate() + 1);
      primeiroDia = false;
    }
  }

  // Pedir atualização: há dinheiro guardado desde antes deste mês e
  // o saldo ainda não foi conferido neste mês
  const inicioDoMes = `${hoje.slice(0, 7)}-01`;
  const temDinheiroAntigo =
    ordenados.length > 0 && ordenados[0].data < inicioDoMes && conhecido > 0;
  const precisaAtualizar =
    temDinheiroAntigo &&
    (ultimoSaldoEm === null || ultimoSaldoEm < inicioDoMes);

  return {
    saldoConhecido: conhecido,
    saldoEstimado: taxa === null ? null : estimado,
    rendimentoPorDia: taxa === null ? null : estimado * taxa,
    rendimentoDesdeUltimoSaldo: taxa === null ? null : estimado - conhecido,
    ultimoSaldoEm,
    fechamentos: fechamentos.reverse(),
    precisaAtualizar,
  };
}

// Quanto foi para os cofrinhos num mês: aportes − resgates
export function investidoNoMes(
  movimentos: MovimentoInvestimento[],
  mes: string,
): number {
  let total = 0;

  for (const movimento of movimentos) {
    if (movimento.data.slice(0, 7) !== mes) {
      continue;
    }

    if (movimento.tipo === "aporte") {
      total = total + movimento.valor;
    } else if (movimento.tipo === "resgate") {
      total = total - movimento.valor;
    }
  }

  return total;
}
