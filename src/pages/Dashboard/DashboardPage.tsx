import { Link } from "react-router";
import CardFinanceiro from "../../components/dashboard/CardFinanceiro/CardFinanceiro";
import SeletorMes from "../../components/dashboard/SeletorMes/SeletorMes";
import RankingCategorias from "../../components/categorias/RankingCategorias/RankingCategorias";
import TransacaoForm from "../../components/transacoes/TransacaoForm/TransacaoForm";
import ListaTransacoes from "../../components/transacoes/ListaTransacoes/ListaTransacoes";
import ResumoMetas from "../../components/metas/ResumoMetas/ResumoMetas";
import { calcularResumo } from "../../utils/calcularResumo";
import { mudarMes, nomeDoMes } from "../../utils/datas";
import { useFinancas } from "../../hooks/useFinancas";

function DashboardPage() {
  const {
    transacoes,
    transacoesDoMes,
    todasCategoriasDespesa,
    mesSelecionado,
    setMesSelecionado,
    adicionarTransacao,
    excluirTransacao,
    metas,
  } = useFinancas();

  const atual = calcularResumo(transacoesDoMes);

  // Mesmo cálculo para o mês anterior, para comparar nos cards
  const mesAnterior = mudarMes(mesSelecionado, -1);
  const transacoesMesAnterior = transacoes.filter(
    (transacao) => transacao.data.slice(0, 7) === mesAnterior,
  );
  const anterior = calcularResumo(transacoesMesAnterior);
  const temMesAnterior = transacoesMesAnterior.length > 0;
  const nomeMesAnterior = nomeDoMes(mesAnterior);

  return (
    <>
      <div className="conteudo-topo">
        <h2>Dashboard</h2>
        <SeletorMes mes={mesSelecionado} onMudar={setMesSelecionado} />
      </div>

      <div className="cards">
        <CardFinanceiro
          titulo="Saldo do mês"
          valor={atual.saldo}
          variante="saldo"
          valorAnterior={temMesAnterior ? anterior.saldo : null}
          nomeMesAnterior={nomeMesAnterior}
        />
        <CardFinanceiro
          titulo="Receitas"
          valor={atual.receitas}
          variante="receita"
          valorAnterior={temMesAnterior ? anterior.receitas : null}
          nomeMesAnterior={nomeMesAnterior}
        />
        <CardFinanceiro
          titulo="Despesas"
          valor={atual.despesas}
          variante="despesa"
          valorAnterior={temMesAnterior ? anterior.despesas : null}
          nomeMesAnterior={nomeMesAnterior}
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

          <section className="painel">
            <div className="painel-topo">
              <h3>Suas metas</h3>
              <Link to="/metas" className="link">
                Ver todas →
              </Link>
            </div>
            <ResumoMetas metas={metas} />
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
