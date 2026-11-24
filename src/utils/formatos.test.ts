import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  formatarData,
  formatarMes,
  hoje,
  mesAtual,
  mudarMes,
  nomeDoMes,
} from "./datas";
import { formatarMoeda } from "./formatarMoeda";
import { calcularPlanoMeta } from "./metas";
import { calcularOcorrencia, contarPendentesUrgentes } from "./lembretes";
import type { Lembrete } from "../types/lembrete";

// O Intl usa um espaço "que não quebra" (\u00a0) depois do R$
const real = (texto: string) => texto.replace(" ", "\u00a0");

// "hoje" fixo em 24/11/2026: os testes não mudam conforme o dia em que rodam
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 24, 12, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("datas", () => {
  it("hoje e mesAtual seguem o relógio", () => {
    expect(hoje()).toBe("2026-11-24");
    expect(mesAtual()).toBe("2026-11");
  });

  it("formata datas e meses em português", () => {
    expect(formatarData("2026-10-05")).toBe("05/10/2026");
    expect(formatarMes("2026-10")).toBe("outubro de 2026");
    expect(nomeDoMes("2026-03")).toBe("março");
  });

  it("mudarMes atravessa a virada do ano nos dois sentidos", () => {
    expect(mudarMes("2026-01", -1)).toBe("2025-12");
    expect(mudarMes("2026-12", 1)).toBe("2027-01");
    expect(mudarMes("2026-11", -13)).toBe("2025-10");
  });
});

describe("formatarMoeda", () => {
  it("usa o formato brasileiro", () => {
    expect(formatarMoeda(1500)).toBe(real("R$ 1.500,00"));
    expect(formatarMoeda(7267.03)).toBe(real("R$ 7.267,03"));
    expect(formatarMoeda(0.5)).toBe(real("R$ 0,50"));
  });
});

describe("calcularPlanoMeta", () => {
  const meta = { id: "m1", nome: "Viagem", valorAlvo: 3000 };

  it("sem prazo: mostra porcentagem e quanto falta", () => {
    expect(
      calcularPlanoMeta({ ...meta, valorGuardado: 1000, prazo: "" }),
    ).toEqual({
      porcentagem: 33,
      falta: 2000,
      concluida: false,
      vencida: false,
      mesesRestantes: null,
      valorPorMes: null,
    });
  });

  it("com prazo: divide o que falta pelos meses restantes (contando este)", () => {
    // De novembro a janeiro: nov, dez e jan = 3 meses
    const plano = calcularPlanoMeta({
      ...meta,
      valorGuardado: 1500,
      prazo: "2027-01-31",
    });

    expect(plano.mesesRestantes).toBe(3);
    expect(plano.valorPorMes).toBe(500);
  });

  it("guardou mais que o alvo: concluída e a barra para em 100%", () => {
    const plano = calcularPlanoMeta({
      ...meta,
      valorGuardado: 3500,
      prazo: "2026-01-01",
    });

    expect(plano.porcentagem).toBe(100);
    expect(plano.falta).toBe(0);
    expect(plano.concluida).toBe(true);
    expect(plano.vencida).toBe(false);
  });

  it("prazo passou sem concluir: vencida", () => {
    expect(
      calcularPlanoMeta({ ...meta, valorGuardado: 0, prazo: "2026-11-01" })
        .vencida,
    ).toBe(true);
  });
});

describe("lembretes", () => {
  function lembrete(dados: Partial<Lembrete>): Lembrete {
    return {
      id: "l1",
      titulo: "Conta",
      valor: null,
      vencimento: "2026-11-30",
      recorrente: false,
      pagamentos: [],
      ...dados,
    };
  }

  it("classifica pela distância do vencimento", () => {
    expect(
      calcularOcorrencia(lembrete({ vencimento: "2026-11-20" })).situacao,
    ).toBe("atrasado");
    expect(
      calcularOcorrencia(lembrete({ vencimento: "2026-11-24" })).situacao,
    ).toBe("hoje");
    expect(
      calcularOcorrencia(lembrete({ vencimento: "2026-12-01" })).situacao,
    ).toBe("proximo");
    expect(
      calcularOcorrencia(lembrete({ vencimento: "2026-12-15" })).situacao,
    ).toBe("futuro");
  });

  it("conta mensal vence no dia dela no mês atual", () => {
    const ocorrencia = calcularOcorrencia(
      lembrete({ vencimento: "2026-01-10", recorrente: true }),
    );

    expect(ocorrencia.data).toBe("2026-11-10");
    expect(ocorrencia.situacao).toBe("atrasado");
  });

  it("dia 31 num mês de 30 dias vira o último dia do mês", () => {
    expect(
      calcularOcorrencia(
        lembrete({ vencimento: "2026-01-31", recorrente: true }),
      ).data,
    ).toBe("2026-11-30");
  });

  it("paga neste mês não é cobrada", () => {
    const paga = lembrete({
      vencimento: "2026-01-10",
      recorrente: true,
      pagamentos: ["2026-11"],
    });

    expect(calcularOcorrencia(paga).situacao).toBe("pago");
  });

  it("conta só as urgentes (atrasadas, hoje e próximos 7 dias)", () => {
    expect(
      contarPendentesUrgentes([
        lembrete({ id: "a", vencimento: "2026-11-20" }),
        lembrete({ id: "b", vencimento: "2026-11-24" }),
        lembrete({ id: "c", vencimento: "2026-11-28" }),
        lembrete({ id: "d", vencimento: "2027-02-01" }),
      ]),
    ).toBe(3);
  });
});
