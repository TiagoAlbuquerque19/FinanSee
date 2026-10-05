import type { Lembrete } from "../types/lembrete";
import { doisDigitos, hoje, mesAtual } from "./datas";

export type Situacao = "pago" | "atrasado" | "hoje" | "proximo" | "futuro";

export interface Ocorrencia {
  lembrete: Lembrete;
  data: string; // "AAAA-MM-DD" do vencimento que vale agora
  mes: string; // "AAAA-MM" desse vencimento
  situacao: Situacao;
  dias: number; // dias até o vencimento (negativo = atrasado)
}

// Diferença em dias entre duas datas "AAAA-MM-DD"
function diasEntre(inicio: string, fim: string): number {
  const umDia = 24 * 60 * 60 * 1000;
  const dataInicio = new Date(`${inicio}T00:00:00`);
  const dataFim = new Date(`${fim}T00:00:00`);

  return Math.round((dataFim.getTime() - dataInicio.getTime()) / umDia);
}

// Qual vencimento vale agora: nas contas mensais, é o dia delas no mês atual
function dataDoVencimento(lembrete: Lembrete): string {
  if (!lembrete.recorrente) {
    return lembrete.vencimento;
  }

  const [ano, mes] = mesAtual().split("-").map(Number);
  const dia = Number(lembrete.vencimento.slice(8, 10));

  // Conta do dia 31 em fevereiro vence no último dia do mês.
  // new Date(ano, mes, 0) é o "dia zero" do mês seguinte = último dia deste mês
  const ultimoDiaDoMes = new Date(ano, mes, 0).getDate();
  const data = `${ano}-${doisDigitos(mes)}-${doisDigitos(Math.min(dia, ultimoDiaDoMes))}`;

  // Se a conta só começa no futuro, vale a primeira data
  return lembrete.vencimento > data ? lembrete.vencimento : data;
}

export function calcularOcorrencia(lembrete: Lembrete): Ocorrencia {
  const data = dataDoVencimento(lembrete);
  const mes = data.slice(0, 7);
  const dias = diasEntre(hoje(), data);

  let situacao: Situacao;

  if (lembrete.pagamentos.includes(mes)) {
    situacao = "pago";
  } else if (dias < 0) {
    situacao = "atrasado";
  } else if (dias === 0) {
    situacao = "hoje";
  } else if (dias <= 7) {
    situacao = "proximo";
  } else {
    situacao = "futuro";
  }

  return { lembrete, data, mes, situacao, dias };
}

// Todas as ocorrências, das mais urgentes para as menos urgentes
export function ocorrenciasOrdenadas(lembretes: Lembrete[]): Ocorrencia[] {
  const ocorrencias = lembretes.map(calcularOcorrencia);

  ocorrencias.sort((a, b) => a.data.localeCompare(b.data));

  return ocorrencias;
}

// Quantas contas pedem atenção: atrasadas ou vencendo em até 7 dias
export function contarPendentesUrgentes(lembretes: Lembrete[]): number {
  let total = 0;

  for (const lembrete of lembretes) {
    const { situacao } = calcularOcorrencia(lembrete);

    if (
      situacao === "atrasado" ||
      situacao === "hoje" ||
      situacao === "proximo"
    ) {
      total = total + 1;
    }
  }

  return total;
}
