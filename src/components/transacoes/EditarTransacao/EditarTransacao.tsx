import { useEffect, useRef } from "react";
import type { Transacao } from "../../../types/transacao";
import type { MovimentoInvestimento } from "../../../types/investimento";
import { useFinancas } from "../../../hooks/useFinancas";
import TransacaoForm from "../TransacaoForm/TransacaoForm";
import "./EditarTransacao.css";

interface EditarTransacaoProps {
  transacao: Transacao;
  onFechar: () => void;
}

// Janela por cima da página (o <dialog> do próprio HTML) com o formulário
// já preenchido. Esc ou "Cancelar" fecham sem salvar
function EditarTransacao({ transacao, onFechar }: EditarTransacaoProps) {
  const {
    todasCategoriasDespesa,
    editarTransacao,
    investimentos,
    converterEmInvestimento,
  } = useFinancas();

  // useRef guarda uma "referência" ao elemento <dialog> da tela, para
  // podermos chamar funções dele (showModal) depois que ele aparecer
  const janela = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // showModal() abre a janela com o fundo escurecido e prende o foco nela
    janela.current?.showModal();
  }, []);

  async function salvar(transacaoEditada: Transacao) {
    await editarTransacao(transacaoEditada);
    onFechar();
  }

  // Trocou o tipo para "Investimento": a transação vira aporte no cofrinho
  async function converter(movimento: MovimentoInvestimento) {
    await converterEmInvestimento(transacao.id, movimento);
    onFechar();
  }

  return (
    <dialog
      ref={janela}
      className="editar-transacao"
      // "close" acontece quando aperta Esc
      onClose={onFechar}
      // Clicar no fundo escuro (fora do formulário) também fecha
      onClick={(evento) => {
        if (evento.target === janela.current) {
          onFechar();
        }
      }}
    >
      <TransacaoForm
        categoriasDespesa={todasCategoriasDespesa}
        transacaoInicial={transacao}
        onAdicionar={salvar}
        onCancelar={onFechar}
        investimentos={investimentos}
        onInvestir={converter}
      />
    </dialog>
  );
}

export default EditarTransacao;
