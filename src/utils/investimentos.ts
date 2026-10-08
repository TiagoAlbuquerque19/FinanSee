import type {
  MovimentoInvestimento,
  TipoMovimento,
  Tributacao,
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

// Alíquota do imposto de renda sobre o rendimento, conforme há quantos
// dias (corridos) o dinheiro está aplicado
export function aliquotaIR(tributacao: Tributacao, dias: number): number {
  if (tributacao === "nenhuma") {
    return 0;
  }

  if (tributacao === "fundo") {
    // Fundos de renda fixa (curto prazo)
    return dias <= 180 ? 0.225 : 0.2;
  }

  // CDB, caixinhas, Tesouro Direto (tabela regressiva)
  if (dias <= 180) return 0.225;
  if (dias <= 360) return 0.2;
  if (dias <= 720) return 0.175;
  return 0.15;
}

// Segunda a sexta. Feriados não são descontados (é uma estimativa)
function ehDiaUtil(data: Date): boolean {
  const diaDaSemana = data.getDay(); // 0 = domingo, 6 = sábado

  return diaDaSemana !== 0 && diaDaSemana !== 6;
}

function paraTexto(data: Date): string {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

function diasEntre(inicio: string, fim: string): number {
  const umDia = 24 * 60 * 60 * 1000;
  const a = new Date(`${inicio}T00:00:00`).getTime();
  const b = new Date(`${fim}T00:00:00`).getTime();

  return Math.round((b - a) / umDia);
}

// -------------------------------------------------------------
// "Lote" = cada depósito, com a data em que entrou.
// O imposto depende de há quanto tempo CADA depósito está aplicado,
// então guardamos os depósitos separados (como o banco faz).
// -------------------------------------------------------------
interface Lote {
  data: string; // quando o dinheiro entrou
  principal: number; // quanto entrou (sem rendimento)
  valor: number; // quanto vale hoje (bruto, com rendimento)
}

function somaValores(lotes: Lote[]): number {
  let total = 0;

  for (const lote of lotes) {
    total = total + lote.valor;
  }

  return total;
}

// Imposto que seria pago se tudo fosse resgatado no dia "hoje"
function impostoDosLotes(
  lotes: Lote[],
  tributacao: Tributacao,
  hoje: string,
): number {
  let imposto = 0;

  for (const lote of lotes) {
    const rendimento = lote.valor - lote.principal;

    if (rendimento > 0) {
      imposto =
        imposto +
        rendimento * aliquotaIR(tributacao, diasEntre(lote.data, hoje));
    }
  }

  return imposto;
}

// Valor líquido (já sem o imposto) dos lotes
function valorLiquido(
  lotes: Lote[],
  tributacao: Tributacao,
  hoje: string,
): number {
  return somaValores(lotes) - impostoDosLotes(lotes, tributacao, hoje);
}

// Ajusta os lotes para que o total bata com o saldo informado pelo banco.
// Com imposto, o banco mostra o LÍQUIDO; então procuramos o fator "k" que
// multiplica o valor de cada lote para o líquido dar o valor informado:
//   líquido(k) = k × Σ valor×(1 − alíquota) + Σ principal×alíquota
// Isolando o k: k = (informado − Σ principal×alíquota) / Σ valor×(1 − alíquota)
function ajustarLotes(
  lotes: Lote[],
  informado: number,
  tributacao: Tributacao,
  dia: string,
) {
  let somaPrincipalAliquota = 0;
  let somaValorSemAliquota = 0;

  for (const lote of lotes) {
    const aliquota = aliquotaIR(tributacao, diasEntre(lote.data, dia));
    somaPrincipalAliquota = somaPrincipalAliquota + lote.principal * aliquota;
    somaValorSemAliquota = somaValorSemAliquota + lote.valor * (1 - aliquota);
  }

  if (somaValorSemAliquota <= 0) {
    // Não havia nada aplicado: o valor informado vira um lote novo
    lotes.length = 0;
    lotes.push({ data: dia, principal: informado, valor: informado });
    return;
  }

  const k = (informado - somaPrincipalAliquota) / somaValorSemAliquota;

  for (const lote of lotes) {
    lote.valor = lote.valor * k;
  }
}

// Retira dinheiro começando pelos depósitos mais antigos
function retirarDosLotes(lotes: Lote[], valor: number) {
  let falta = valor;

  while (falta > 0 && lotes.length > 0) {
    const lote = lotes[0];

    if (lote.valor <= falta) {
      falta = falta - lote.valor;
      lotes.shift();
    } else {
      // Tira uma parte: o principal diminui na mesma proporção
      const proporcao = falta / lote.valor;
      lote.principal = lote.principal * (1 - proporcao);
      lote.valor = lote.valor - falta;
      falta = 0;
    }
  }
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
  // Saldo com o rendimento estimado até hoje (null sem CDI).
  // Com imposto, é o valor LÍQUIDO (como o banco costuma mostrar)
  saldoEstimado: number | null;
  // Quanto está rendendo por dia útil, hoje, já sem imposto (null sem CDI)
  rendimentoPorDia: number | null;
  // Quanto rendeu (estimado) desde o último saldo informado
  rendimentoDesdeUltimoSaldo: number | null;
  // Imposto estimado se resgatasse tudo hoje (0 sem imposto ou sem CDI)
  impostoEstimado: number;
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
  configuracao: { percentualCdi: number; tributacao: Tributacao },
  cdiAnual: number | null,
  hoje: string,
): ResumoInvestimento {
  const { percentualCdi, tributacao } = configuracao;

  const ordenados = [...movimentos]
    .filter((movimento) => movimento.data <= hoje)
    .sort(
      (a, b) =>
        a.data.localeCompare(b.data) ||
        ordemDoTipo[a.tipo] - ordemDoTipo[b.tipo],
    );

  const taxa =
    cdiAnual === null ? null : taxaPorDiaUtil(cdiAnual, percentualCdi);

  // Mostramos tudo no mesmo "jeito" que o banco: líquido se tem imposto
  const mostrar = (lotes: Lote[], dia: string) =>
    valorLiquido(lotes, tributacao, dia);

  const lotes: Lote[] = [];
  let conhecido = 0; // sem rendimento estimado
  let ultimoSaldoEm: string | null = null;
  const fechamentos: Fechamento[] = [];

  if (ordenados.length > 0) {
    const dia = new Date(`${ordenados[0].data}T00:00:00`);
    const fim = new Date(`${hoje}T00:00:00`);
    let indice = 0;
    let primeiroDia = true;

    while (dia <= fim) {
      // 1. Rendimento do dia: cada depósito rende a mesma taxa
      if (!primeiroDia && taxa !== null && ehDiaUtil(dia)) {
        for (const lote of lotes) {
          lote.valor = lote.valor + lote.valor * taxa;
        }
      }

      // 2. Movimentos daquele dia
      const textoDoDia = paraTexto(dia);

      while (
        indice < ordenados.length &&
        ordenados[indice].data === textoDoDia
      ) {
        const { tipo, valor } = ordenados[indice];

        if (tipo === "aporte") {
          lotes.push({ data: textoDoDia, principal: valor, valor });
          conhecido = conhecido + valor;
        } else if (tipo === "resgate") {
          retirarDosLotes(lotes, valor);
          conhecido = Math.max(0, conhecido - valor);
        } else if (indice === 0) {
          // O primeiro registro sendo um saldo é o valor inicial do cofrinho
          // (o que já tinha nele ao cadastrar): não é rendimento, e o imposto
          // só é calculado sobre o que render daqui para frente
          lotes.push({ data: textoDoDia, principal: valor, valor });
          conhecido = valor;
          ultimoSaldoEm = textoDoDia;
        } else {
          // Saldo conferido: o que passou do "conhecido" é rendimento real
          const estimadoAntes = mostrar(lotes, textoDoDia);

          fechamentos.push({
            data: textoDoDia,
            real: valor - conhecido,
            estimado: taxa === null ? null : estimadoAntes - conhecido,
          });

          ajustarLotes(lotes, valor, tributacao, textoDoDia);
          conhecido = valor;
          ultimoSaldoEm = textoDoDia;
        }

        indice = indice + 1;
      }

      dia.setDate(dia.getDate() + 1);
      primeiroDia = false;
    }
  }

  // Quanto rende por dia, já descontando o imposto de cada depósito
  let rendimentoPorDia = 0;

  if (taxa !== null) {
    for (const lote of lotes) {
      const aliquota = aliquotaIR(tributacao, diasEntre(lote.data, hoje));
      rendimentoPorDia = rendimentoPorDia + lote.valor * taxa * (1 - aliquota);
    }
  }

  const saldoEstimado = taxa === null ? null : mostrar(lotes, hoje);

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
    saldoEstimado,
    rendimentoPorDia: taxa === null ? null : rendimentoPorDia,
    rendimentoDesdeUltimoSaldo:
      saldoEstimado === null ? null : saldoEstimado - conhecido,
    impostoEstimado:
      taxa === null ? 0 : impostoDosLotes(lotes, tributacao, hoje),
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
