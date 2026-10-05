import { useState } from "react";
import { CircleCheck, Minus, Plus, Target, Trash2 } from "lucide-react";
import type { Meta } from "../../../types/meta";
import { calcularPlanoMeta } from "../../../utils/metas";
import { formatarMoeda } from "../../../utils/formatarMoeda";
import { formatarData } from "../../../utils/datas";
import "./CartaoMeta.css";

interface CartaoMetaProps {
  meta: Meta;
  onExcluir: (id: string) => void;
  onMovimentar: (id: string, valor: number) => void;
}

function CartaoMeta({ meta, onExcluir, onMovimentar }: CartaoMetaProps) {
  const plano = calcularPlanoMeta(meta);
  const [valor, setValor] = useState("");

  // sinal = 1 para guardar, -1 para retirar
  function movimentar(sinal: number) {
    const valorNumerico = Number(valor);

    if (valorNumerico <= 0) {
      alert("Digite um valor maior que zero.");
      return;
    }

    if (sinal === -1 && valorNumerico > meta.valorGuardado) {
      alert("Você não pode retirar mais do que já guardou.");
      return;
    }

    onMovimentar(meta.id, valorNumerico * sinal);
    setValor("");
  }

  function confirmarExclusao() {
    if (window.confirm(`Excluir a meta "${meta.nome}"?`)) {
      onExcluir(meta.id);
    }
  }

  return (
    <article className="painel cartao-meta">
      <div className="cartao-meta-topo">
        <span
          className={`cartao-meta-icone ${plano.concluida ? "cartao-meta-icone--concluida" : ""}`}
        >
          {plano.concluida ? (
            <CircleCheck size={20} aria-hidden="true" />
          ) : (
            <Target size={20} aria-hidden="true" />
          )}
        </span>
        <div className="cartao-meta-titulo">
          <h3>{meta.nome}</h3>
          <span>
            {meta.prazo === ""
              ? "Sem prazo"
              : `Até ${formatarData(meta.prazo)}`}
          </span>
        </div>
        <button
          className="botao-excluir"
          onClick={confirmarExclusao}
          aria-label={`Excluir meta ${meta.nome}`}
          title="Excluir"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="cartao-meta-valores">
        <strong>{formatarMoeda(meta.valorGuardado)}</strong>
        <span>de {formatarMoeda(meta.valorAlvo)}</span>
      </div>

      <div
        className="barra-progresso"
        role="progressbar"
        aria-valuenow={plano.porcentagem}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progresso da meta ${meta.nome}`}
      >
        <div
          className={`barra-progresso-preenchimento ${plano.concluida ? "barra-progresso-preenchimento--concluida" : ""}`}
          style={{ width: `${plano.porcentagem}%` }}
        />
      </div>

      <p className="cartao-meta-dica">
        <strong>{plano.porcentagem}%</strong> · <MensagemPlano meta={meta} />
      </p>

      <form
        className="cartao-meta-movimentar"
        onSubmit={(evento) => {
          evento.preventDefault();
          movimentar(1);
        }}
      >
        <input
          type="number"
          placeholder="Quanto? (R$)"
          aria-label={`Valor para guardar ou retirar da meta ${meta.nome}`}
          min="0"
          step="0.01"
          value={valor}
          onChange={(evento) => setValor(evento.target.value)}
        />
        <button type="submit" title="Guardar">
          <Plus size={16} aria-hidden="true" />
          Guardar
        </button>
        <button
          type="button"
          className="botao-secundario"
          onClick={() => movimentar(-1)}
          title="Retirar"
        >
          <Minus size={16} aria-hidden="true" />
          Retirar
        </button>
      </form>
    </article>
  );
}

// A frase de baixo muda conforme a situação da meta
function MensagemPlano({ meta }: { meta: Meta }) {
  const plano = calcularPlanoMeta(meta);

  if (plano.concluida) {
    return <>Meta concluída!</>;
  }

  if (plano.vencida) {
    return <>O prazo passou. Faltam {formatarMoeda(plano.falta)}</>;
  }

  if (plano.valorPorMes !== null && plano.mesesRestantes !== null) {
    const meses = plano.mesesRestantes === 1 ? "mês" : "meses";

    return (
      <>
        Guarde {formatarMoeda(plano.valorPorMes)} por mês (
        {plano.mesesRestantes} {meses})
      </>
    );
  }

  return <>Faltam {formatarMoeda(plano.falta)}</>;
}

export default CartaoMeta;
