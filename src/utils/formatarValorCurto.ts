// Versão curta para os eixos dos gráficos: 1500 → "R$ 1,5 mil"
const formatador = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatarValorCurto(valor: number): string {
  return formatador.format(valor);
}
