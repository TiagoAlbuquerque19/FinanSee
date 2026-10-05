import type { Transacao } from "../../../types/transacao";
import { formatarMoeda } from "../../../utils/formatarMoeda";

interface ListaTransacoesProps {
  transacoes: Transacao[];
  onExcluir: (id: string) => void;
}

function ListaTransacoes({ transacoes, onExcluir }: ListaTransacoesProps) {
  if (transacoes.length === 0) {
    return <p>Nenhuma transação cadastrada ainda.</p>;
  }

  return (
    <ul>
      {transacoes.map((transacao) => (
        <li key={transacao.id}>
          {transacao.descricao} ({transacao.categoria}) —{" "}
          {transacao.tipo === "despesa" ? "-" : "+"}
          {formatarMoeda(transacao.valor)}
          <button onClick={() => onExcluir(transacao.id)}>Excluir</button>
        </li>
      ))}
    </ul>
  );
}

export default ListaTransacoes;
