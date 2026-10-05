import type { Transacao } from "../../../types/transacao";
import { formatarMoeda } from "../../../utils/formatarMoeda";
import { formatarData } from "../../../utils/datas";

interface ListaTransacoesProps {
  transacoes: Transacao[];
  onExcluir: (id: string) => void;
}

function ListaTransacoes({ transacoes, onExcluir }: ListaTransacoesProps) {
  if (transacoes.length === 0) {
    return <p>Nenhuma transação neste mês.</p>;
  }

  // Copia a lista antes de ordenar, para não mexer na lista original
  const transacoesOrdenadas = [...transacoes];

  // Mais recentes primeiro
  transacoesOrdenadas.sort((a, b) => b.data.localeCompare(a.data));

  return (
    <ul>
      {transacoesOrdenadas.map((transacao) => (
        <li key={transacao.id}>
          {formatarData(transacao.data)} · {transacao.descricao} ({transacao.categoria}) —{" "}
          {transacao.tipo === "despesa" ? "-" : "+"}
          {formatarMoeda(transacao.valor)}
          <button onClick={() => onExcluir(transacao.id)}>Excluir</button>
        </li>
      ))}
    </ul>
  );
}

export default ListaTransacoes;
