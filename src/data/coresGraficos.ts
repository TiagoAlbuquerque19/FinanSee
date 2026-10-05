// A cor de cada categoria nos gráficos é FIXA: "Moradia" é sempre azul,
// em qualquer mês. Assim você aprende as cores e não se confunde quando a
// ordem do ranking muda.
// As cores de verdade ficam no index.css (--grafico-1, --grafico-2...),
// e mudam sozinhas entre o tema claro e o escuro.
const coresPorCategoria: Record<string, string> = {
  Moradia: "var(--grafico-1)",
  Alimentação: "var(--grafico-2)",
  Transporte: "var(--grafico-3)",
  Lazer: "var(--grafico-4)",
  Saúde: "var(--grafico-5)",
  Contas: "var(--grafico-6)",
  Compras: "var(--grafico-7)",
  Educação: "var(--grafico-8)",
};

// "Outros" e as categorias criadas pelo usuário ficam em cinza
export function corDaCategoria(categoria: string): string {
  return coresPorCategoria[categoria] ?? "var(--grafico-neutro)";
}

export const corReceitas = "var(--grafico-1)";
export const corDespesas = "var(--grafico-2)";
