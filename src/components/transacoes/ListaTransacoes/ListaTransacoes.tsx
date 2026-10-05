import type { Transacao } from "../../../types/transacao";
import { formatarMoeda } from "../../../utils/formatarMoeda";
import { formatarData } from "../../../utils/datas";
import { Trash2 } from "lucide-react";
import IconeCategoria from "../../categorias/IconeCategoria/IconeCategoria";
import "./ListaTransacoes.css";

interface ListaTransacoesProps {
  transacoes: Transacao[];
  onExcluir: (id: string) => void;
  // O "?" deixa a prop opcional: se não vier, mostra todas
  limite?: number;
}

function ListaTransacoes({
  transacoes,
  onExcluir,
  limite,
}: ListaTransacoesProps) {
  if (transacoes.length === 0) {
    return <p className="texto-vazio">Nenhuma transação encontrada.</p>;
  }

  // Copia a lista antes de ordenar, para não mexer na lista original
  const transacoesOrdenadas = [...transacoes];

  // Mais recentes primeiro
  transacoesOrdenadas.sort((a, b) => b.data.localeCompare(a.data));

  // Com limite, mostra só as primeiras (as mais recentes)
  const transacoesVisiveis =
    limite === undefined
      ? transacoesOrdenadas
      : transacoesOrdenadas.slice(0, limite);

  return (
    <ul className="lista-transacoes">
      {transacoesVisiveis.map((transacao) => (
        <li key={transacao.id} className="transacao">
          <IconeCategoria
            categoria={transacao.categoria}
            tipo={transacao.tipo}
          />

          <div className="transacao-info">
            <strong>{transacao.descricao}</strong>
            <span>
              {transacao.categoria} · {formatarData(transacao.data)}
            </span>
          </div>

          <span
            className={`transacao-valor transacao-valor--${transacao.tipo}`}
          >
            {transacao.tipo === "despesa" ? "− " : "+ "}
            {formatarMoeda(transacao.valor)}
          </span>

          <button
            className="botao-excluir"
            onClick={() => onExcluir(transacao.id)}
            aria-label={`Excluir ${transacao.descricao}`}
            title="Excluir"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ListaTransacoes;
