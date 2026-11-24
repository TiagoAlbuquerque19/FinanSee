import { describe, expect, it } from "vitest";
import type { Transacao, TipoTransacao } from "../types/transacao";
import type {
  MovimentoInvestimento,
  TipoMovimento,
} from "../types/investimento";
import { calcularResumo } from "./calcularResumo";
import { saldoAcumuladoAte } from "./saldoAcumulado";
import { resumoPorMes } from "./resumoPorMes";
import { agruparDespesasPorCategoria } from "./agruparPorCategoria";

function tr(
  tipo: TipoTransacao,
  valor: number,
  data: string,
  categoria = "Outros",
): Transacao {
  return { id: data + valor, descricao: "x", valor, tipo, categoria, data };
}

function mov(
  tipo: TipoMovimento,
  valor: number,
  data: string,
): MovimentoInvestimento {
  return { id: data + tipo, investimentoId: "c1", tipo, valor, data };
}

const transacoes = [
  tr("receita", 6000, "2026-10-01", "Salário"),
  tr("despesa", 2500, "2026-10-05", "Moradia"),
  tr("receita", 500, "2026-11-02", "Freelance"),
  tr("despesa", 300, "2026-11-02", "Alimentação"),
  tr("despesa", 100, "2026-11-10", "Alimentação"),
];

const movimentos = [
  mov("saldo", 7000, "2026-09-01"), // só informação: não mexe na conta
  mov("aporte", 1000, "2026-10-10"),
  mov("resgate", 200, "2026-11-15"),
];

describe("calcularResumo", () => {
  it("soma receitas e despesas e calcula o saldo", () => {
    expect(calcularResumo(transacoes)).toEqual({
      receitas: 6500,
      despesas: 2900,
      saldo: 3600,
    });
  });

  it("lista vazia dá tudo zero", () => {
    expect(calcularResumo([])).toEqual({ receitas: 0, despesas: 0, saldo: 0 });
  });
});

describe("saldoAcumuladoAte", () => {
  it("o que sobra num mês passa para o seguinte", () => {
    // Outubro: 6000 − 2500 − 1000 (cofrinho) = 2500
    expect(saldoAcumuladoAte("2026-10", transacoes, movimentos, 0)).toBe(2500);
    // Novembro: 2500 + 500 − 300 − 100 + 200 (resgate) = 2800
    expect(saldoAcumuladoAte("2026-11", transacoes, movimentos, 0)).toBe(2800);
  });

  it("começa do saldo inicial", () => {
    expect(saldoAcumuladoAte("2026-10", transacoes, movimentos, 1500)).toBe(
      4000,
    );
  });

  it("antes de qualquer lançamento, é só o saldo inicial", () => {
    expect(saldoAcumuladoAte("2026-08", transacoes, movimentos, 1500)).toBe(
      1500,
    );
  });
});

describe("resumoPorMes", () => {
  it("monta os meses em ordem, do mais antigo ao mais recente", () => {
    const meses = resumoPorMes(transacoes, "2026-11", 3, movimentos);

    expect(meses.map((m) => m.mes)).toEqual(["2026-09", "2026-10", "2026-11"]);
    expect(meses[0].titulo).toBe("setembro de 2026");
    expect(meses[0].rotulo).toBe("set");
  });

  it("o saldo do mês desconta o que foi para os cofrinhos", () => {
    const [, outubro, novembro] = resumoPorMes(
      transacoes,
      "2026-11",
      3,
      movimentos,
    );

    expect(outubro).toMatchObject({
      receitas: 6000,
      despesas: 2500,
      investido: 1000,
      saldo: 2500,
    });
    expect(novembro).toMatchObject({
      receitas: 500,
      despesas: 400,
      investido: -200,
      saldo: 300,
    });
  });

  it("atravessa a virada do ano", () => {
    const meses = resumoPorMes([], "2027-01", 3);

    expect(meses.map((m) => m.mes)).toEqual(["2026-11", "2026-12", "2027-01"]);
    expect(meses.every((m) => m.saldo === 0)).toBe(true);
  });
});

describe("agruparDespesasPorCategoria", () => {
  it("soma por categoria, ignora receitas e ordena do maior para o menor", () => {
    expect(agruparDespesasPorCategoria(transacoes)).toEqual([
      { categoria: "Moradia", total: 2500 },
      { categoria: "Alimentação", total: 400 },
    ]);
  });
});
