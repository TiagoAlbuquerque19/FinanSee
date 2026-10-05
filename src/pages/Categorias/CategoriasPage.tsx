import { Trash2 } from "lucide-react";
import IconeCategoria from "../../components/categorias/IconeCategoria/IconeCategoria";
import NovaCategoriaForm from "../../components/categorias/NovaCategoriaForm/NovaCategoriaForm";
import SeletorMes from "../../components/dashboard/SeletorMes/SeletorMes";
import { useFinancas } from "../../hooks/useFinancas";
import { categoriasReceita } from "../../data/categorias";
import { formatarMoeda } from "../../utils/formatarMoeda";
import type { TipoTransacao } from "../../types/transacao";
import "./CategoriasPage.css";

function CategoriasPage() {
  const {
    transacoesDoMes,
    todasCategoriasDespesa,
    categoriasPersonalizadas,
    mesSelecionado,
    setMesSelecionado,
    criarCategoria,
    excluirCategoria,
  } = useFinancas();

  // Soma quanto entrou ou saiu numa categoria, no mês escolhido
  function totalDaCategoria(nome: string, tipo: TipoTransacao): number {
    let total = 0;

    for (const transacao of transacoesDoMes) {
      if (transacao.categoria === nome && transacao.tipo === tipo) {
        total = total + transacao.valor;
      }
    }

    return total;
  }

  function confirmarExclusao(nome: string) {
    // window.confirm abre uma caixa com "OK" e "Cancelar" e devolve true ou false
    const confirmou = window.confirm(
      `Excluir a categoria "${nome}"? As transações dela continuam salvas.`,
    );

    if (confirmou) {
      excluirCategoria(nome);
    }
  }

  return (
    <>
      <div className="conteudo-topo">
        <h2>Categorias</h2>
        <SeletorMes mes={mesSelecionado} onMudar={setMesSelecionado} />
      </div>

      <NovaCategoriaForm
        categoriasExistentes={todasCategoriasDespesa}
        onCriar={criarCategoria}
      />

      <div className="grade-categorias">
        <section className="painel">
          <h3>Despesas</h3>
          <ul className="lista-categorias">
            {todasCategoriasDespesa.map((nome) => (
              <li key={nome}>
                <IconeCategoria categoria={nome} tipo="despesa" />
                <span className="lista-categorias-nome">
                  {nome}
                  {categoriasPersonalizadas.includes(nome) && (
                    <span className="etiqueta">Personalizada</span>
                  )}
                </span>
                <span className="lista-categorias-valor">
                  {formatarMoeda(totalDaCategoria(nome, "despesa"))}
                </span>
                {categoriasPersonalizadas.includes(nome) ? (
                  <button
                    className="botao-excluir"
                    onClick={() => confirmarExclusao(nome)}
                    aria-label={`Excluir categoria ${nome}`}
                    title="Excluir"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                ) : (
                  // Espaço vazio do tamanho do botão, para alinhar os valores
                  <span className="lista-categorias-espaco" />
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="painel">
          <h3>Receitas</h3>
          <ul className="lista-categorias">
            {categoriasReceita.map((nome) => (
              <li key={nome}>
                <IconeCategoria categoria={nome} tipo="receita" />
                <span className="lista-categorias-nome">{nome}</span>
                <span className="lista-categorias-valor">
                  {formatarMoeda(totalDaCategoria(nome, "receita"))}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

export default CategoriasPage;
