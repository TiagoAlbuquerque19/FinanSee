import { Link } from "react-router";
import CardFinanceiro from "../../components/dashboard/CardFinanceiro/CardFinanceiro";
import SeletorMes from "../../components/dashboard/SeletorMes/SeletorMes";
import RankingCategorias from "../../components/categorias/RankingCategorias/RankingCategorias";
import TransacaoForm from "../../components/transacoes/TransacaoForm/TransacaoForm";
import ListaTransacoes from "../../components/transacoes/ListaTransacoes/ListaTransacoes";
import { formatarMoeda } from "../../utils/formatarMoeda";
import { useFinancas } from "../../hooks/useFinancas";

function DashboardPage() {
  const {
    transacoesDoMes,
    todasCategoriasDespesa,
    mesSelecionado,
    setMesSelecionado,
    adicionarTransacao,
    excluirTransacao,
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
        </div>

        <div className="coluna">
          <section className="painel">
            <h3>Onde você mais gasta</h3>
            <RankingCategorias transacoes={transacoesDoMes} />
          </section>
        </div>
      </div>

      <section className="painel">
        <div className="painel-topo">
          <h3>Últimas transações</h3>
          <Link to="/transacoes" className="link">
            Ver todas →
          </Link>
        </div>
        <ListaTransacoes
          transacoes={transacoesDoMes}
          onExcluir={excluirTransacao}
          limite={5}
        />
      </section>
    </>
  );
}

export default DashboardPage;
