import type { TooltipContentProps } from "recharts";
import { formatarMoeda } from "../../../utils/formatarMoeda";
import "./TooltipGrafico.css";

// A caixinha que aparece ao passar o mouse (ou o dedo) num gráfico.
// O Recharts entrega: se está ativo, o rótulo (ex.: o mês) e os valores.
function TooltipGrafico({ active, payload, label }: TooltipContentProps) {
  if (!active || payload.length === 0) {
    return null;
  }

  // Se o dado tiver um "titulo" (ex.: "outubro de 2026"), ele vira o título
  const titulo = payload[0]?.payload?.titulo ?? label;

  return (
    <div className="tooltip-grafico">
      {titulo !== undefined && (
        <span className="tooltip-grafico-titulo">{titulo}</span>
      )}
      {payload.map((item) => (
        <div key={String(item.name)} className="tooltip-grafico-linha">
          {/* Um tracinho com a cor da série, para saber de quem é o valor */}
          <span
            className="tooltip-grafico-cor"
            style={{ background: item.color ?? item.payload?.cor }}
          />
          <strong>{formatarMoeda(Number(item.value))}</strong>
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export default TooltipGrafico;
