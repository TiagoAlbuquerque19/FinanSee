import { formatarMes, mesAtual, mudarMes } from "../../../utils/datas";
import "./SeletorMes.css";

interface SeletorMesProps {
  mes: string;
  onMudar: (novoMes: string) => void;
}

function SeletorMes({ mes, onMudar }: SeletorMesProps) {
  return (
    <div className="seletor-mes">
      {mes !== mesAtual() && (
        <button
          className="botao-secundario"
          onClick={() => onMudar(mesAtual())}
        >
          Hoje
        </button>
      )}
      <button
        className="botao-secundario seletor-mes-seta"
        onClick={() => onMudar(mudarMes(mes, -1))}
        aria-label="Mês anterior"
      >
        ‹
      </button>
      <strong className="seletor-mes-nome">{formatarMes(mes)}</strong>
      <button
        className="botao-secundario seletor-mes-seta"
        onClick={() => onMudar(mudarMes(mes, 1))}
        aria-label="Próximo mês"
      >
        ›
      </button>
    </div>
  );
}

export default SeletorMes;
