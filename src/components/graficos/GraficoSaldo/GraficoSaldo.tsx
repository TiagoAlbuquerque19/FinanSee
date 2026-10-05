import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ResumoDoMes } from "../../../utils/resumoPorMes";
import { formatarValorCurto } from "../../../utils/formatarValorCurto";
import TooltipGrafico from "../TooltipGrafico/TooltipGrafico";
import "../graficos.css";

interface GraficoSaldoProps {
  dados: ResumoDoMes[];
}

// Linha com o saldo (receitas − despesas) de cada mês.
// Acima da linha do zero, sobrou dinheiro; abaixo, faltou.
function GraficoSaldo({ dados }: GraficoSaldoProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={dados}
        margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
      >
        <CartesianGrid vertical={false} stroke="var(--grafico-grade)" />
        <XAxis
          dataKey="rotulo"
          tickLine={false}
          axisLine={false}
          // Espaço nas pontas para os primeiros e últimos pontos não colarem no eixo
          padding={{ left: 16, right: 16 }}
          tick={{ fill: "var(--grafico-eixo)", fontSize: 13 }}
        />
        <YAxis
          tickFormatter={formatarValorCurto}
          tickLine={false}
          axisLine={false}
          width={72}
          tick={{ fill: "var(--grafico-eixo)", fontSize: 12 }}
        />
        {/* A linha do zero fica mais forte que as outras: é a referência */}
        <ReferenceLine y={0} stroke="var(--grafico-eixo)" />
        <Tooltip
          content={TooltipGrafico}
          cursor={{ stroke: "var(--grafico-eixo)", strokeWidth: 1 }}
        />
        {/* Linha de 2px com uma "sombra" bem clarinha embaixo (10% de opacidade) */}
        <Area
          type="monotone"
          dataKey="saldo"
          name="Saldo"
          stroke="var(--grafico-1)"
          strokeWidth={2}
          fill="var(--grafico-1)"
          fillOpacity={0.1}
          dot={{
            r: 4,
            fill: "var(--grafico-1)",
            stroke: "var(--cor-superficie)",
            strokeWidth: 2,
          }}
          activeDot={{ r: 6, stroke: "var(--cor-superficie)", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default GraficoSaldo;
