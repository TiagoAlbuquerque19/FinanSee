import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import CardFinanceiro from "../dashboard/CardFinanceiro/CardFinanceiro";
import SeletorMes from "../dashboard/SeletorMes/SeletorMes";
import NovaCategoriaForm from "../categorias/NovaCategoriaForm/NovaCategoriaForm";
import RankingCategorias from "../categorias/RankingCategorias/RankingCategorias";
import TransacaoForm from "../transacoes/TransacaoForm/TransacaoForm";
import ListaTransacoes from "../transacoes/ListaTransacoes/ListaTransacoes";
import "./MainLayout.css";
import { formatarMoeda } from "../../utils/formatarMoeda";
import { useFinancas } from "../../hooks/useFinancas";

function MainLayout() {
  const {
    transacoesDoMes,
    todasCategoriasDespesa,
    mesSelecionado,
    setMesSelecionado,
    adicionarTransacao,
    excluirTransacao,
    criarCategoria,
  } = useFinancas();

  let receitas = 0;
  let despesas = 0;

  for (const transacao of transacoesDoMes) {
    if (transacao.tipo === "receita") {
      receitas = receitas + transacao.valor;
    } else {
      despesas = despesas + transacao.valor;
    }
  }

  const saldo = receitas - despesas;

  return (
    <>
      <Header nome="Tiago" />
      <div className="layout">
        <Sidebar />
        <main className="conteudo">
          <div className="conteudo-topo">
            <h2>Dashboard</h2>
            <SeletorMes mes={mesSelecionado} onMudar={setMesSelecionado} />
          </div>

          <div className="cards">
            <CardFinanceiro
              titulo="Saldo do mês"
              valor={formatarMoeda(saldo)}
              variante={saldo < 0 ? "despesa" : "saldo"}
            />
            <CardFinanceiro
              titulo="Receitas"
              valor={formatarMoeda(receitas)}
              variante="receita"
            />
            <CardFinanceiro
              titulo="Despesas"
              valor={formatarMoeda(despesas)}
              variante="despesa"
            />
          </div>

          <div className="grade-dashboard">
            <div className="coluna">
              <TransacaoForm
                categoriasDespesa={todasCategoriasDespesa}
                onAdicionar={adicionarTransacao}
              />

              <NovaCategoriaForm
                categoriasExistentes={todasCategoriasDespesa}
                onCriar={criarCategoria}
              />
            </div>

            <div className="coluna">
              <section className="painel">
                <h3>Onde você mais gasta</h3>
                <RankingCategorias transacoes={transacoesDoMes} />
              </section>
            </div>
          </div>

          <section className="painel">
            <h3>Transações do mês</h3>
            <ListaTransacoes
              transacoes={transacoesDoMes}
              onExcluir={excluirTransacao}
            />
          </section>
        </main>
      </div>
    </>
  );
}

export default MainLayout;
