import type { Transacao } from "../../../types/transacao";
import { formatarMoeda } from "../../../utils/formatarMoeda";

interface RankingCategoriasProps {
  transacoes: Transacao[];
}

function RankingCategorias({ transacoes }: RankingCategoriasProps) {
  // Soma as despesas de cada categoria, para saber onde você mais gasta
  const gastosPorCategoria: { categoria: string; total: number }[] = [];
  let totalDespesas = 0;

  for (const transacao of transacoes) {
    if (transacao.tipo === "receita") {
      continue;
    }

    totalDespesas = totalDespesas + transacao.valor;

    const itemExistente = gastosPorCategoria.find(
      (item) => item.categoria === transacao.categoria,
    );

    if (itemExistente) {
      itemExistente.total = itemExistente.total + transacao.valor;
    } else {
      gastosPorCategoria.push({
        categoria: transacao.categoria,
        total: transacao.valor,
      });
    }
  }

  // Ordena do maior gasto para o menor
  gastosPorCategoria.sort((a, b) => b.total - a.total);

  if (gastosPorCategoria.length === 0) {
    return <p>Nenhuma despesa neste mês.</p>;
  }

  return (
    <ol>
      {gastosPorCategoria.map((item) => (
        <li key={item.categoria}>
          {item.categoria}: {formatarMoeda(item.total)} (
          {Math.round((item.total / totalDespesas) * 100)}%)
        </li>
      ))}
    </ol>
  );
}

export default RankingCategorias;
