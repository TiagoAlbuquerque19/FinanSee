import { Link } from "react-router";
import { Bell } from "lucide-react";
import { useFinancas } from "../../../hooks/useFinancas";
import { contarPendentesUrgentes } from "../../../utils/lembretes";
import "./AvisoLembretes.css";

// Sino no topo: mostra quantas contas estão atrasadas ou vencendo logo
function AvisoLembretes() {
  const { lembretes } = useFinancas();
  const quantidade = contarPendentesUrgentes(lembretes);

  const texto =
    quantidade === 0
      ? "Nenhuma conta pedindo atenção"
      : `${quantidade} conta(s) atrasada(s) ou vencendo em 7 dias`;

  return (
    <Link
      to="/lembretes"
      className="aviso-lembretes botao-secundario botao-icone"
      aria-label={texto}
      title={texto}
    >
      <Bell size={18} aria-hidden="true" />
      {quantidade > 0 && (
        <span className="aviso-lembretes-numero">{quantidade}</span>
      )}
    </Link>
  );
}

export default AvisoLembretes;
