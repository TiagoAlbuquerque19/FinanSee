import { Cell, Pie, PieChart, Tooltip } from "recharts";
import type { Transacao } from "../../../types/transacao";
import { agruparDespesasPorCategoria } from "../../../utils/agruparPorCategoria";
import { corDaCategoria } from "../../../data/coresGraficos";
import { formatarMoeda } from "../../../utils/formatarMoeda";
import TooltipGrafico from "../TooltipGrafico/TooltipGrafico";
import "../graficos.css";
import "./GraficoCategorias.css";

interface GraficoCategoriasProps {
  transacoes: Transacao[];
}

// Uma rosca com muitas fatias fica impossível de ler.
// Mostramos as 5 maiores e juntamos o resto numa fatia só.
const MAXIMO_DE_FATIAS = 5;

function GraficoCategorias({ transacoes }: GraficoCategoriasProps) {
  const totais = agruparDespesasPorCategoria(transacoes);

  if (totais.length === 0) {
    return <p className="texto-vazio">Nenhuma despesa neste período.</p>;
  }

  let totalDespesas = 0;

  for (const item of totais) {
    totalDespesas = totalDespesas + item.total;
  }

  // Cada fatia vira um objeto com nome, valor e cor
  const fatias = totais.slice(0, MAXIMO_DE_FATIAS).map((item) => ({
    nome: item.categoria,
    valor: item.total,
    cor: corDaCategoria(item.categoria),
  }));

  const resto = totais.slice(MAXIMO_DE_FATIAS);

  if (resto.length > 0) {
    let totalResto = 0;

    for (const item of resto) {
      totalResto = totalResto + item.total;
    }

    fatias.push({
      nome: `Demais (${resto.length})`,
      valor: totalResto,
      cor: "var(--grafico-neutro)",
    });
  }

  return (
    <div className="grafico-categorias">
      <div className="grafico-categorias-rosca">
        <PieChart width={200} height={200}>
          <Pie
            data={fatias}
            dataKey="valor"
            nameKey="nome"
            innerRadius={70}
            outerRadius={96}
            // A borda da cor do fundo cria um respiro de 2px entre as fatias
            stroke="var(--cor-superficie)"
            strokeWidth={2}
            startAngle={90}
            endAngle={-270}
          >
            {fatias.map((fatia) => (
              <Cell key={fatia.nome} fill={fatia.cor} />
            ))}
          </Pie>
          <Tooltip content={TooltipGrafico} />
        </PieChart>

        {/* O total fica no "buraco" da rosca */}
        <div className="grafico-categorias-centro">
          <span>Total</span>
          <strong>{formatarMoeda(totalDespesas)}</strong>
        </div>
      </div>

      {/* A legenda também funciona como tabela: nome, valor e porcentagem */}
      <ul className="grafico-categorias-legenda">
        {fatias.map((fatia) => (
          <li key={fatia.nome}>
            <span className="marcador-cor" style={{ background: fatia.cor }} />
            <span className="grafico-categorias-nome">{fatia.nome}</span>
            <span className="grafico-categorias-valor">
              {formatarMoeda(fatia.valor)}
            </span>
            <span className="grafico-categorias-porcentagem">
              {Math.round((fatia.valor / totalDespesas) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GraficoCategorias;
