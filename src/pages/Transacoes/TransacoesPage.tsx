import { useState } from "react";
import SeletorMes from "../../components/dashboard/SeletorMes/SeletorMes";
import TransacaoForm from "../../components/transacoes/TransacaoForm/TransacaoForm";
import ListaTransacoes from "../../components/transacoes/ListaTransacoes/ListaTransacoes";
import { useFinancas } from "../../hooks/useFinancas";
import { categoriasReceita } from "../../data/categorias";
import { formatarMoeda } from "../../utils/formatarMoeda";
import "./TransacoesPage.css";

function TransacoesPage() {
  const {
    transacoesDoMes,
    todasCategoriasDespesa,
    mesSelecionado,
    setMesSelecionado,
    adicionarTransacao,
    excluirTransacao,
  } = useFinancas();

  // Estados dos filtros
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");

  // Junta as duas listas sem repetir "Outros" (o Set não aceita repetidos)
  const todasCategorias = [
    ...new Set([...todasCategoriasDespesa, ...categoriasReceita]),
  ];

  // Cada transação precisa passar pelos 3 filtros para aparecer
  const transacoesFiltradas = transacoesDoMes.filter((transacao) => {
    const passaNaBusca = transacao.descricao
      .toLowerCase()
      .includes(busca.trim().toLowerCase());

    const passaNoTipo =
      tipoFiltro === "todos" || transacao.tipo === tipoFiltro;

    const passaNaCategoria =
      categoriaFiltro === "todas" || transacao.categoria === categoriaFiltro;

    return passaNaBusca && passaNoTipo && passaNaCategoria;
  });

  // Total do que está aparecendo: receitas somam, despesas subtraem
  let totalFiltrado = 0;

  for (const transacao of transacoesFiltradas) {
    if (transacao.tipo === "receita") {
      totalFiltrado = totalFiltrado + transacao.valor;
    } else {
      totalFiltrado = totalFiltrado - transacao.valor;
    }
  }

  return (
    <>
      <div className="conteudo-topo">
        <h2>Transações</h2>
        <SeletorMes mes={mesSelecionado} onMudar={setMesSelecionado} />
      </div>

      <div className="grade-transacoes">
        <TransacaoForm
          categoriasDespesa={todasCategoriasDespesa}
          onAdicionar={adicionarTransacao}
        />

        <section className="painel">
          <div className="filtros">
            <label className="campo filtros-busca">
              <span>Buscar</span>
              <input
                type="search"
                placeholder="Digite parte da descrição..."
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
              />
            </label>

            <label className="campo">
              <span>Tipo</span>
              <select
                value={tipoFiltro}
                onChange={(evento) => setTipoFiltro(evento.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="despesa">Despesas</option>
                <option value="receita">Receitas</option>
              </select>
            </label>

            <label className="campo">
              <span>Categoria</span>
              <select
                value={categoriaFiltro}
                onChange={(evento) => setCategoriaFiltro(evento.target.value)}
              >
                <option value="todas">Todas</option>
                {todasCategorias.map((nome) => (
                  <option key={nome} value={nome}>
                    {nome}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="resumo-filtro">
            {transacoesFiltradas.length} transação(ões) · total{" "}
            <strong>{formatarMoeda(totalFiltrado)}</strong>
          </p>

          <ListaTransacoes
            transacoes={transacoesFiltradas}
            onExcluir={excluirTransacao}
          />
        </section>
      </div>
    </>
  );
}

export default TransacoesPage;
