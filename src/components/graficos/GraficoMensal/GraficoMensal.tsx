import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ResumoDoMes } from "../../../utils/resumoPorMes";
import { corDespesas, corReceitas } from "../../../data/coresGraficos";
import { formatarValorCurto } from "../../../utils/formatarValorCurto";
import TooltipGrafico from "../TooltipGrafico/TooltipGrafico";
import "../graficos.css";

interface GraficoMensalProps {
  dados: ResumoDoMes[];
}

// Barras de receitas e despesas lado a lado, um grupo por mês
function GraficoMensal({ dados }: GraficoMensalProps) {
  return (
    <div>
      {/* Legenda: sempre visível, para não depender só da cor */}
      <div className="legenda-grafico">
        <span>
          <span className="marcador-cor" style={{ background: corReceitas }} />
          Receitas
        </span>
        <span>
          <span className="marcador-cor" style={{ background: corDespesas }} />
          Despesas
        </span>
      </div>

      {/* ResponsiveContainer faz o gráfico ocupar toda a largura disponível */}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={dados}
          barGap={2}
          margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
        >
          {/* Só linhas horizontais, finas e discretas */}
          <CartesianGrid vertical={false} stroke="var(--grafico-grade)" />
          <XAxis
            dataKey="rotulo"
            tickLine={false}
            axisLine={{ stroke: "var(--cor-borda)" }}
            tick={{ fill: "var(--grafico-eixo)", fontSize: 13 }}
          />
          <YAxis
            tickFormatter={formatarValorCurto}
            tickLine={false}
            axisLine={false}
            width={72}
            tick={{ fill: "var(--grafico-eixo)", fontSize: 12 }}
          />
          <Tooltip
            content={TooltipGrafico}
            cursor={{ fill: "var(--cor-fundo)" }}
          />
          {/* radius: cantos arredondados só em cima; maxBarSize: barras finas */}
          <Bar
            dataKey="receitas"
            name="Receitas"
            fill={corReceitas}
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
          />
          <Bar
            dataKey="despesas"
            name="Despesas"
            fill={corDespesas}
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoMensal;
