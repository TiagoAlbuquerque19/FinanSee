import { useState } from "react";
import { CircleAlert, Pencil, PiggyBank, Trash2 } from "lucide-react";
import type {
  Investimento,
  MovimentoInvestimento,
  TipoMovimento,
  Tributacao,
} from "../../../types/investimento";
import { opcoesTributacao } from "../../../data/tributacoes";
import type { ResumoInvestimento } from "../../../utils/investimentos";
import { formatarMoeda } from "../../../utils/formatarMoeda";
import { formatarData, hoje } from "../../../utils/datas";
import "./CartaoInvestimento.css";

interface CartaoInvestimentoProps {
  investimento: Investimento;
  resumo: ResumoInvestimento;
  movimentos: MovimentoInvestimento[];
  onMovimentar: (movimento: MovimentoInvestimento) => void;
  onExcluirMovimento: (id: string) => void;
  onAlterarPercentual: (id: string, percentual: number) => void;
  onAlterarTributacao: (id: string, tributacao: Tributacao) => void;
  onExcluir: (id: string) => void;
}

// Como cada tipo aparece no histórico
const nomesDosTipos: Record<TipoMovimento, string> = {
  aporte: "Guardou",
  resgate: "Retirou",
  saldo: "Saldo conferido",
};

// "+ R$ 12,30" ou "− R$ 2,00"
function comSinal(valor: number): string {
  // Menos de meio centavo conta como zero (evita aparecer "− R$ 0,00")
  if (Math.abs(valor) < 0.005) {
    return formatarMoeda(0);
  }

  return `${valor < 0 ? "−" : "+"} ${formatarMoeda(Math.abs(valor))}`;
}

function CartaoInvestimento({
  investimento,
  resumo,
  movimentos,
  onMovimentar,
  onExcluirMovimento,
  onAlterarPercentual,
  onAlterarTributacao,
  onExcluir,
}: CartaoInvestimentoProps) {
  const [tipo, setTipo] = useState<TipoMovimento>("aporte");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(hoje());

  // Com CDI, mostramos o saldo com rendimento estimado; sem CDI, o conhecido
  const saldo = resumo.saldoEstimado ?? resumo.saldoConhecido;
  const ultimoFechamento = resumo.fechamentos[0];

  function registrar() {
    const numero = Number(valor);

    if (!(numero > 0) && !(tipo === "saldo" && numero === 0 && valor !== "")) {
      alert("Digite um valor maior que zero.");
      return;
    }

    if (tipo === "resgate" && numero > saldo + 0.01) {
      alert("Você não pode retirar mais do que tem no cofrinho.");
      return;
    }

    onMovimentar({
      id: crypto.randomUUID(),
      investimentoId: investimento.id,
      tipo,
      valor: numero,
      data,
    });
    setValor("");
  }

  function editarPercentual() {
    const resposta = window.prompt(
      "Quanto % do CDI este cofrinho rende agora?",
      String(investimento.percentualCdi),
    );

    if (resposta === null) {
      return; // clicou em Cancelar
    }

    const numero = Number(resposta.replace(",", "."));

    if (numero >= 0) {
      onAlterarPercentual(investimento.id, numero);
    }
  }

  function confirmarExclusao() {
    if (
      window.confirm(
        `Excluir o cofrinho "${investimento.nome}" e todo o histórico dele?`,
      )
    ) {
      onExcluir(investimento.id);
    }
  }

  // Histórico do mais recente para o mais antigo
  const historico = [...movimentos].sort((a, b) =>
    b.data.localeCompare(a.data),
  );

  const textoDoBotao: Record<TipoMovimento, string> = {
    aporte: "Guardar",
    resgate: "Retirar",
    saldo: "Salvar saldo",
  };

  return (
    <article className="painel cartao-investimento">
      <div className="cartao-investimento-topo">
        <span className="cartao-investimento-icone">
          <PiggyBank size={22} aria-hidden="true" />
        </span>
        <div className="cartao-investimento-titulo">
          <h3>{investimento.nome}</h3>
          <span>
            {investimento.banco} ·{" "}
            {investimento.percentualCdi.toLocaleString("pt-BR")}% do CDI{" "}
            <button
              className="botao-link"
              onClick={editarPercentual}
              aria-label={`Editar % do CDI de ${investimento.nome}`}
              title="Editar % do CDI"
            >
              <Pencil size={13} aria-hidden="true" />
            </button>
          </span>
        </div>
        <button
          className="botao-excluir"
          onClick={confirmarExclusao}
          aria-label={`Excluir cofrinho ${investimento.nome}`}
          title="Excluir cofrinho"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>

      <div>
        <strong className="cartao-investimento-saldo">
          {formatarMoeda(saldo)}
        </strong>
        <span className="cartao-investimento-legenda">
          {resumo.saldoEstimado === null
            ? "Saldo (informe o CDI para estimar o rendimento)"
            : investimento.tributacao === "nenhuma"
              ? "Saldo estimado hoje"
              : "Saldo líquido estimado hoje (já sem o imposto)"}
        </span>
      </div>

      {resumo.rendimentoPorDia !== null && (
        <ul className="cartao-investimento-numeros">
          <li>
            <span>
              Rendendo por dia útil
              {investimento.tributacao !== "nenhuma" && " (líquido)"}
            </span>
            <strong>~ {formatarMoeda(resumo.rendimentoPorDia)}</strong>
          </li>
          {resumo.ultimoSaldoEm &&
            resumo.rendimentoDesdeUltimoSaldo !== null && (
              <li>
                <span>
                  Desde {formatarData(resumo.ultimoSaldoEm).slice(0, 5)}{" "}
                  (estimado)
                </span>
                <strong>{comSinal(resumo.rendimentoDesdeUltimoSaldo)}</strong>
              </li>
            )}
          {investimento.tributacao !== "nenhuma" && (
            <li>
              <span>Imposto se resgatasse hoje</span>
              <strong className="cartao-investimento-imposto">
                {formatarMoeda(resumo.impostoEstimado)}
              </strong>
            </li>
          )}
        </ul>
      )}

      {/* Imposto de renda: muda na hora como o saldo é calculado */}
      <label className="campo cartao-investimento-tributacao">
        <span>Imposto de renda</span>
        <select
          value={investimento.tributacao}
          onChange={(evento) =>
            onAlterarTributacao(
              investimento.id,
              evento.target.value as Tributacao,
            )
          }
        >
          {opcoesTributacao.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.nome}
            </option>
          ))}
        </select>
      </label>

      {/* Comparação do último mês: o que o banco disse x o que o app estimou */}
      {ultimoFechamento && (
        <div className="cartao-investimento-comparacao">
          <span>Rendeu até {formatarData(ultimoFechamento.data)}</span>
          <div>
            <span>
              Real: <strong>{comSinal(ultimoFechamento.real)}</strong>
            </span>
            {ultimoFechamento.estimado !== null && (
              <span>
                Estimado: {comSinal(ultimoFechamento.estimado)} · diferença{" "}
                {comSinal(ultimoFechamento.real - ultimoFechamento.estimado)}
              </span>
            )}
          </div>
        </div>
      )}

      {resumo.precisaAtualizar && (
        <p className="cartao-investimento-aviso" role="status">
          <CircleAlert size={16} aria-hidden="true" />
          Confira o saldo no app do banco e use “Atualizar saldo” para ver
          quanto rendeu.
        </p>
      )}

      {/* Registrar: guardar, retirar ou informar o saldo real */}
      <form
        className="cartao-investimento-form"
        onSubmit={(evento) => {
          evento.preventDefault();
          registrar();
        }}
      >
        <div
          className="cartao-investimento-tipos"
          role="radiogroup"
          aria-label="O que você quer registrar"
        >
          {(["aporte", "resgate", "saldo"] as TipoMovimento[]).map((opcao) => (
            <label key={opcao} className={tipo === opcao ? "ativo" : ""}>
              <input
                type="radio"
                name={`tipo-${investimento.id}`}
                value={opcao}
                checked={tipo === opcao}
                onChange={() => setTipo(opcao)}
              />
              {opcao === "aporte"
                ? "Guardar"
                : opcao === "resgate"
                  ? "Retirar"
                  : "Atualizar saldo"}
            </label>
          ))}
        </div>

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder={
            tipo === "saldo" ? "Saldo que o banco mostra" : "Valor (R$)"
          }
          aria-label={`Valor para ${textoDoBotao[tipo].toLowerCase()} em ${investimento.nome}`}
          value={valor}
          onChange={(evento) => setValor(evento.target.value)}
        />
        <input
          type="date"
          aria-label="Data"
          value={data}
          onChange={(evento) => setData(evento.target.value)}
        />
        <button type="submit">{textoDoBotao[tipo]}</button>
      </form>

      {/* <details>: o histórico fica escondido até clicar */}
      {historico.length > 0 && (
        <details className="cartao-investimento-historico">
          <summary>Histórico ({historico.length})</summary>
          <ul className="lista-simples">
            {historico.map((movimento) => (
              <li key={movimento.id}>
                <span>{formatarData(movimento.data)}</span>
                <span className="cartao-investimento-historico-tipo">
                  {nomesDosTipos[movimento.tipo]}
                </span>
                <strong>{formatarMoeda(movimento.valor)}</strong>
                <button
                  className="botao-excluir"
                  onClick={() => {
                    if (window.confirm("Apagar este registro do histórico?")) {
                      onExcluirMovimento(movimento.id);
                    }
                  }}
                  aria-label="Apagar registro"
                  title="Apagar registro"
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}

export default CartaoInvestimento;
