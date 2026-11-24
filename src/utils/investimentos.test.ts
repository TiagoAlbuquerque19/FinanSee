import { describe, expect, it } from "vitest";
import type {
  MovimentoInvestimento,
  TipoMovimento,
} from "../types/investimento";
import {
  aliquotaIR,
  calcularInvestimento,
  investidoNoMes,
  taxaPorDiaUtil,
} from "./investimentos";

// Cria um movimento sem precisar repetir id e cofrinho em todo teste
let proximoId = 0;
function mov(
  tipo: TipoMovimento,
  valor: number,
  data: string,
): MovimentoInvestimento {
  proximoId = proximoId + 1;
  return { id: String(proximoId), investimentoId: "c1", tipo, valor, data };
}

const semImposto = { percentualCdi: 100, tributacao: "nenhuma" as const };
const CDI = 13.65;
const taxa = taxaPorDiaUtil(CDI, 100);

describe("taxaPorDiaUtil", () => {
  it("converte o CDI anual em taxa por dia útil (252 por ano)", () => {
    // Render 252 dias úteis seguidos tem que dar o CDI do ano
    expect(Math.pow(1 + taxa, 252)).toBeCloseTo(1.1365, 10);
  });

  it("aplica o % do CDI do cofrinho", () => {
    expect(taxaPorDiaUtil(CDI, 95)).toBeCloseTo(taxa * 0.95, 15);
    expect(taxaPorDiaUtil(CDI, 0)).toBe(0);
  });
});

describe("aliquotaIR", () => {
  it("sem tributação é sempre zero", () => {
    expect(aliquotaIR("nenhuma", 10)).toBe(0);
    expect(aliquotaIR("nenhuma", 1000)).toBe(0);
  });

  it("fundo: 22,5% até 180 dias e 20% depois", () => {
    expect(aliquotaIR("fundo", 180)).toBe(0.225);
    expect(aliquotaIR("fundo", 181)).toBe(0.2);
    expect(aliquotaIR("fundo", 2000)).toBe(0.2);
  });

  it("CDB: tabela regressiva nas faixas certas", () => {
    expect(aliquotaIR("cdb", 0)).toBe(0.225);
    expect(aliquotaIR("cdb", 180)).toBe(0.225);
    expect(aliquotaIR("cdb", 181)).toBe(0.2);
    expect(aliquotaIR("cdb", 360)).toBe(0.2);
    expect(aliquotaIR("cdb", 361)).toBe(0.175);
    expect(aliquotaIR("cdb", 720)).toBe(0.175);
    expect(aliquotaIR("cdb", 721)).toBe(0.15);
  });
});

describe("calcularInvestimento", () => {
  it("sem movimentos, está tudo zerado", () => {
    const r = calcularInvestimento([], semImposto, CDI, "2026-11-24");

    expect(r.saldoConhecido).toBe(0);
    expect(r.saldoEstimado).toBe(0);
    expect(r.ultimoSaldoEm).toBeNull();
    expect(r.precisaAtualizar).toBe(false);
  });

  it("sem CDI informado, não estima nada", () => {
    const r = calcularInvestimento(
      [mov("aporte", 1000, "2026-11-02")],
      semImposto,
      null,
      "2026-11-24",
    );

    expect(r.saldoConhecido).toBe(1000);
    expect(r.saldoEstimado).toBeNull();
    expect(r.rendimentoPorDia).toBeNull();
    expect(r.impostoEstimado).toBe(0);
  });

  it("rende só nos dias úteis, a partir do dia seguinte ao depósito", () => {
    // 02/11/2026 é segunda. Até sexta (06/11) são 4 dias de rendimento
    const sexta = calcularInvestimento(
      [mov("aporte", 1000, "2026-11-02")],
      semImposto,
      CDI,
      "2026-11-06",
    );
    expect(sexta.saldoEstimado).toBeCloseTo(1000 * Math.pow(1 + taxa, 4), 8);

    // Sábado e domingo não rendem: o valor de domingo é igual ao de sexta
    const domingo = calcularInvestimento(
      [mov("aporte", 1000, "2026-11-02")],
      semImposto,
      CDI,
      "2026-11-08",
    );
    expect(domingo.saldoEstimado).toBeCloseTo(sexta.saldoEstimado!, 8);
    expect(domingo.rendimentoDesdeUltimoSaldo).toBeCloseTo(
      domingo.saldoEstimado! - 1000,
      8,
    );
  });

  it("ignora movimentos com data no futuro", () => {
    const r = calcularInvestimento(
      [mov("aporte", 1000, "2026-11-02"), mov("aporte", 500, "2026-12-01")],
      semImposto,
      null,
      "2026-11-24",
    );

    expect(r.saldoConhecido).toBe(1000);
  });

  it("resgate tira dos depósitos mais antigos primeiro", () => {
    // O depósito de outubro (com o que rendeu) sai inteiro;
    // o resto do resgate sai do depósito de novembro
    const r = calcularInvestimento(
      [
        mov("aporte", 300, "2026-10-01"),
        mov("aporte", 700, "2026-11-01"),
        mov("resgate", 400, "2026-11-10"),
      ],
      { percentualCdi: 100, tributacao: "cdb" },
      CDI,
      "2026-11-10",
    );

    expect(r.saldoConhecido).toBe(600);
    expect(r.saldoEstimado).not.toBeNull();
    // Sobrou só parte do depósito de novembro: o saldo líquido é perto de 600
    expect(r.saldoEstimado!).toBeGreaterThan(600);
    expect(r.saldoEstimado!).toBeLessThan(610);
  });

  it("o primeiro saldo informado é o valor inicial, não rendimento", () => {
    const r = calcularInvestimento(
      [mov("saldo", 7000, "2026-11-02")],
      semImposto,
      CDI,
      "2026-11-02",
    );

    expect(r.saldoConhecido).toBe(7000);
    expect(r.saldoEstimado).toBeCloseTo(7000, 8);
    expect(r.fechamentos).toHaveLength(0);
    expect(r.ultimoSaldoEm).toBe("2026-11-02");
  });

  it("saldo conferido fecha o período: compara real e estimado", () => {
    const movimentos = [
      mov("aporte", 1000, "2026-11-02"),
      mov("saldo", 1010, "2026-11-06"),
    ];
    const r = calcularInvestimento(movimentos, semImposto, CDI, "2026-11-06");

    expect(r.fechamentos).toHaveLength(1);
    expect(r.fechamentos[0].data).toBe("2026-11-06");
    expect(r.fechamentos[0].real).toBeCloseTo(10, 8);
    expect(r.fechamentos[0].estimado).toBeCloseTo(
      1000 * Math.pow(1 + taxa, 4) - 1000,
      8,
    );
    // Depois de conferir, o app passa a usar o valor do banco
    expect(r.saldoConhecido).toBe(1010);
    expect(r.saldoEstimado).toBeCloseTo(1010, 8);
  });

  it("com imposto, o saldo conferido vira o valor LÍQUIDO", () => {
    const configuracao = { percentualCdi: 100, tributacao: "cdb" as const };
    const movimentos = [
      mov("aporte", 1000, "2026-09-01"),
      mov("aporte", 500, "2026-11-02"),
      mov("saldo", 1530, "2026-11-20"),
    ];
    const r = calcularInvestimento(movimentos, configuracao, CDI, "2026-11-20");

    // Mesmo com depósitos de idades diferentes, o líquido bate com o banco
    expect(r.saldoEstimado).toBeCloseTo(1530, 6);
    expect(r.impostoEstimado).toBeGreaterThan(0);
  });

  it("calcula o imposto sobre o rendimento (22,5% no começo)", () => {
    const configuracao = { percentualCdi: 100, tributacao: "cdb" as const };
    const r = calcularInvestimento(
      [mov("aporte", 1000, "2026-11-02")],
      configuracao,
      CDI,
      "2026-11-06",
    );
    const bruto = 1000 * Math.pow(1 + taxa, 4);

    expect(r.impostoEstimado).toBeCloseTo((bruto - 1000) * 0.225, 8);
    expect(r.saldoEstimado).toBeCloseTo(bruto - r.impostoEstimado, 8);
  });

  it("pede atualização quando virou o mês sem conferir o saldo", () => {
    const antigos = [mov("aporte", 1000, "2026-10-05")];

    expect(
      calcularInvestimento(antigos, semImposto, CDI, "2026-11-24")
        .precisaAtualizar,
    ).toBe(true);

    const conferido = [...antigos, mov("saldo", 1012, "2026-11-03")];
    expect(
      calcularInvestimento(conferido, semImposto, CDI, "2026-11-24")
        .precisaAtualizar,
    ).toBe(false);
  });

  it("não pede atualização se o dinheiro entrou neste mês", () => {
    const r = calcularInvestimento(
      [mov("aporte", 1000, "2026-11-05")],
      semImposto,
      CDI,
      "2026-11-24",
    );

    expect(r.precisaAtualizar).toBe(false);
  });
});

describe("investidoNoMes", () => {
  it("soma aportes, desconta resgates e ignora saldos e outros meses", () => {
    const movimentos = [
      mov("aporte", 1000, "2026-11-01"),
      mov("aporte", 250.5, "2026-11-15"),
      mov("resgate", 100, "2026-11-20"),
      mov("saldo", 9999, "2026-11-21"),
      mov("aporte", 5000, "2026-10-31"),
    ];

    expect(investidoNoMes(movimentos, "2026-11")).toBeCloseTo(1150.5, 10);
    expect(investidoNoMes(movimentos, "2026-10")).toBe(5000);
    expect(investidoNoMes(movimentos, "2026-12")).toBe(0);
  });
});
