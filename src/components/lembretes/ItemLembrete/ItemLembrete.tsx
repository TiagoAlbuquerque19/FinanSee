import {
  CalendarClock,
  CircleAlert,
  CircleCheck,
  Clock,
  Trash2,
} from "lucide-react";
import type { Ocorrencia, Situacao } from "../../../utils/lembretes";
import { formatarData } from "../../../utils/datas";
import { formatarMoeda } from "../../../utils/formatarMoeda";
import "./ItemLembrete.css";

interface ItemLembreteProps {
  ocorrencia: Ocorrencia;
  onAlternarPagamento: (ocorrencia: Ocorrencia) => void;
  onExcluir: (id: string) => void;
}

// Ícone de cada situação: a situação aparece com ícone + texto, não só cor
const icones: Record<Situacao, typeof Clock> = {
  pago: CircleCheck,
  atrasado: CircleAlert,
  hoje: Clock,
  proximo: Clock,
  futuro: CalendarClock,
};

// O texto que explica a situação: "Atrasado há 3 dias", "Vence hoje"...
function textoSituacao({ situacao, dias }: Ocorrencia): string {
  if (situacao === "pago") {
    return "Pago";
  }

  if (situacao === "atrasado") {
    return dias === -1 ? "Atrasado há 1 dia" : `Atrasado há ${-dias} dias`;
  }

  if (situacao === "hoje") {
    return "Vence hoje";
  }

  return dias === 1 ? "Vence amanhã" : `Vence em ${dias} dias`;
}

function ItemLembrete({
  ocorrencia,
  onAlternarPagamento,
  onExcluir,
}: ItemLembreteProps) {
  const { lembrete, situacao } = ocorrencia;
  const Icone = icones[situacao];

  function confirmarExclusao() {
    if (window.confirm(`Excluir o lembrete "${lembrete.titulo}"?`)) {
      onExcluir(lembrete.id);
    }
  }

  return (
    <li className="item-lembrete">
      <span className={`item-lembrete-icone situacao--${situacao}`}>
        <Icone size={18} aria-hidden="true" />
      </span>

      <div className="item-lembrete-info">
        <strong>{lembrete.titulo}</strong>
        <span>
          {formatarData(ocorrencia.data)}
          {lembrete.recorrente && " · Mensal"}
          {" · "}
          <span className={`item-lembrete-situacao situacao--${situacao}`}>
            {textoSituacao(ocorrencia)}
          </span>
        </span>
      </div>

      {lembrete.valor !== null && (
        <span className="item-lembrete-valor">
          {formatarMoeda(lembrete.valor)}
        </span>
      )}

      <button
        className={situacao === "pago" ? "botao-secundario" : ""}
        onClick={() => onAlternarPagamento(ocorrencia)}
      >
        {situacao === "pago" ? "Desfazer" : "Paguei"}
      </button>

      <button
        className="botao-excluir"
        onClick={confirmarExclusao}
        aria-label={`Excluir lembrete ${lembrete.titulo}`}
        title="Excluir"
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </li>
  );
}

export default ItemLembrete;
