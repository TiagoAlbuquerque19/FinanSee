import { Link } from "react-router";
import type { Lembrete } from "../../../types/lembrete";
import { ocorrenciasOrdenadas } from "../../../utils/lembretes";
import { formatarData } from "../../../utils/datas";
import { formatarMoeda } from "../../../utils/formatarMoeda";
import "./ProximosVencimentos.css";

interface ProximosVencimentosProps {
  lembretes: Lembrete[];
}

// Versão compacta para o Dashboard: as 4 próximas contas ainda não pagas
function ProximosVencimentos({ lembretes }: ProximosVencimentosProps) {
  const pendentes = ocorrenciasOrdenadas(lembretes)
    .filter((ocorrencia) => ocorrencia.situacao !== "pago")
    .slice(0, 4);

  if (pendentes.length === 0) {
    return (
      <p className="texto-vazio">
        Nenhuma conta pendente.{" "}
        <Link to="/lembretes" className="link">
          Criar lembrete
        </Link>
      </p>
    );
  }

  return (
    <ul className="lista-simples proximos-vencimentos">
      {pendentes.map(({ lembrete, data, situacao }) => (
        <li key={lembrete.id}>
          <span className={`proximos-vencimentos-data situacao--${situacao}`}>
            {situacao === "atrasado"
              ? "Atrasado"
              : formatarData(data).slice(0, 5)}
          </span>
          <span className="proximos-vencimentos-titulo">{lembrete.titulo}</span>
          {lembrete.valor !== null && (
            <span className="proximos-vencimentos-valor">
              {formatarMoeda(lembrete.valor)}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default ProximosVencimentos;
