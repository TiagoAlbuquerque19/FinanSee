import type { Transacao } from "../../../types/transacao";
import { formatarMoeda } from "../../../utils/formatarMoeda";
import { formatarData } from "../../../utils/datas";
import "./ListaTransacoes.css";

interface ListaTransacoesProps {
  transacoes: Transacao[];
  onExcluir: (id: string) => void;
}

function ListaTransacoes({ transacoes, onExcluir }: ListaTransacoesProps) {
  if (transacoes.length === 0) {
    return <p className="texto-vazio">Nenhuma transação neste mês.</p>;
  }

  // Copia a lista antes de ordenar, para não mexer na lista original
  const transacoesOrdenadas = [...transacoes];

  // Mais recentes primeiro
  transacoesOrdenadas.sort((a, b) => b.data.localeCompare(a.data));

  return (
    <ul className="lista-transacoes">
      {transacoesOrdenadas.map((transacao) => (
        <li key={transacao.id} className="transacao">
          <div className="transacao-info">
            <strong>{transacao.descricao}</strong>
            <span>
              {transacao.categoria} · {formatarData(transacao.data)}
            </span>
          </div>

          <span className={`transacao-valor transacao-valor--${transacao.tipo}`}>
            {transacao.tipo === "despesa" ? "- " : "+ "}
            {formatarMoeda(transacao.valor)}
          </span>

          <button
            className="transacao-excluir"
            onClick={() => onExcluir(transacao.id)}
            aria-label={`Excluir ${transacao.descricao}`}
            title="Excluir"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ListaTransacoes;
