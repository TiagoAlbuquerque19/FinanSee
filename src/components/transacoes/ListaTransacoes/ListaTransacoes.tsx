import type { Transacao } from "../../../types/transacao";
import type { MovimentoInvestimento } from "../../../types/investimento";
import { formatarMoeda } from "../../../utils/formatarMoeda";
import { formatarData } from "../../../utils/datas";
import { useState } from "react";
import { Pencil, PiggyBank, Trash2 } from "lucide-react";
import EditarTransacao from "../EditarTransacao/EditarTransacao";
import IconeCategoria from "../../categorias/IconeCategoria/IconeCategoria";
import { useFinancas } from "../../../hooks/useFinancas";
import "./ListaTransacoes.css";

interface ListaTransacoesProps {
  transacoes: Transacao[];
  onExcluir: (id: string) => void;
  // O "?" deixa a prop opcional: se não vier, mostra todas
  limite?: number;
  // Opcional: dinheiro guardado/retirado dos cofrinhos, mostrado junto
  movimentos?: MovimentoInvestimento[];
}

// A lista mistura dois tipos de item. O campo "origem" diz qual é qual,
// e o TypeScript entende qual dos dois formatos cada item tem
type Item =
  | { origem: "transacao"; data: string; transacao: Transacao }
  | { origem: "cofrinho"; data: string; movimento: MovimentoInvestimento };

function ListaTransacoes({
  transacoes,
  onExcluir,
  limite,
  movimentos = [],
}: ListaTransacoesProps) {
  const { investimentos, excluirMovimento } = useFinancas();

  // A transação que está sendo editada (null = nenhuma janela aberta)
  const [emEdicao, setEmEdicao] = useState<Transacao | null>(null);

  // Só aportes e resgates: o "saldo conferido" não é dinheiro entrando ou saindo
  const movimentosDeDinheiro = movimentos.filter(
    (movimento) => movimento.tipo !== "saldo",
  );

  const itens: Item[] = [
    ...transacoes.map((transacao) => ({
      origem: "transacao" as const,
      data: transacao.data,
      transacao,
    })),
    ...movimentosDeDinheiro.map((movimento) => ({
      origem: "cofrinho" as const,
      data: movimento.data,
      movimento,
    })),
  ];

  if (itens.length === 0) {
    return <p className="texto-vazio">Nenhuma transação encontrada.</p>;
  }

  // Mais recentes primeiro
  itens.sort((a, b) => b.data.localeCompare(a.data));

  // Com limite, mostra só as primeiras (as mais recentes)
  const itensVisiveis = limite === undefined ? itens : itens.slice(0, limite);

  function nomeDoCofrinho(id: string): string {
    return investimentos.find((item) => item.id === id)?.nome ?? "cofrinho";
  }

  return (
    <>
      <ul className="lista-transacoes">
        {itensVisiveis.map((item) => {
          if (item.origem === "cofrinho") {
            const { movimento } = item;
            const nome = nomeDoCofrinho(movimento.investimentoId);
            const titulo =
              movimento.tipo === "aporte"
                ? `Guardou em ${nome}`
                : `Retirou de ${nome}`;

            return (
              <li key={movimento.id} className="transacao">
                <span className="icone-categoria icone-categoria--investimento">
                  <PiggyBank size={18} aria-hidden="true" />
                </span>

                <div className="transacao-info">
                  <strong>{titulo}</strong>
                  <span>Investimento · {formatarData(movimento.data)}</span>
                </div>

                {/* Não é despesa nem receita: aparece na cor normal */}
                <span className="transacao-valor">
                  {movimento.tipo === "aporte" ? "→ " : "← "}
                  {formatarMoeda(movimento.valor)}
                </span>

                {/* Investimento não é editado aqui; o espaço mantém o alinhamento */}
                <span className="transacao-espaco-botao" aria-hidden="true" />

                <button
                  className="botao-excluir"
                  onClick={() => {
                    if (window.confirm(`Apagar "${titulo}"?`)) {
                      excluirMovimento(movimento.id);
                    }
                  }}
                  aria-label={`Excluir ${titulo}`}
                  title="Excluir"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </li>
            );
          }

          const { transacao } = item;

          return (
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
                className="botao-editar"
                onClick={() => setEmEdicao(transacao)}
                aria-label={`Editar ${transacao.descricao}`}
                title="Editar"
              >
                <Pencil size={16} aria-hidden="true" />
              </button>

              <button
                className="botao-excluir"
                onClick={() => onExcluir(transacao.id)}
                aria-label={`Excluir ${transacao.descricao}`}
                title="Excluir"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>

      {/* A janela de edição só existe enquanto alguma transação é editada */}
      {emEdicao && (
        <EditarTransacao
          transacao={emEdicao}
          onFechar={() => setEmEdicao(null)}
        />
      )}
    </>
  );
}

export default ListaTransacoes;
