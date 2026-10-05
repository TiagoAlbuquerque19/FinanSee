import type { Meta } from "../types/meta";
import { hoje } from "./datas";

export interface PlanoMeta {
  porcentagem: number;
  falta: number;
  concluida: boolean;
  vencida: boolean;
  // null quando a meta não tem prazo
  mesesRestantes: number | null;
  valorPorMes: number | null;
}

// Quantos meses faltam até o prazo, contando o mês atual.
// Ex.: hoje em outubro e prazo em dezembro = 3 (out, nov e dez)
function mesesAte(prazo: string): number {
  const [anoHoje, mesHoje] = hoje().split("-").map(Number);
  const [anoPrazo, mesPrazo] = prazo.split("-").map(Number);

  const meses = (anoPrazo - anoHoje) * 12 + (mesPrazo - mesHoje) + 1;

  return Math.max(1, meses);
}

// Calcula tudo o que a tela precisa mostrar sobre uma meta
export function calcularPlanoMeta(meta: Meta): PlanoMeta {
  const falta = Math.max(0, meta.valorAlvo - meta.valorGuardado);
  const concluida = falta === 0;

  // Math.min para a barra nunca passar de 100%
  const porcentagem = Math.min(
    100,
    Math.round((meta.valorGuardado / meta.valorAlvo) * 100),
  );

  if (meta.prazo === "") {
    return {
      porcentagem,
      falta,
      concluida,
      vencida: false,
      mesesRestantes: null,
      valorPorMes: null,
    };
  }

  // Datas em "AAAA-MM-DD" podem ser comparadas como texto
  const vencida = !concluida && meta.prazo < hoje();
  const mesesRestantes = mesesAte(meta.prazo);

  return {
    porcentagem,
    falta,
    concluida,
    vencida,
    mesesRestantes,
    valorPorMes: falta / mesesRestantes,
  };
}
