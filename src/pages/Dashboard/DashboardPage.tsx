import { Link } from "react-router";
import CardFinanceiro from "../../components/dashboard/CardFinanceiro/CardFinanceiro";
import SeletorMes from "../../components/dashboard/SeletorMes/SeletorMes";
import GraficoCategorias from "../../components/graficos/GraficoCategorias/GraficoCategorias";
import TransacaoForm from "../../components/transacoes/TransacaoForm/TransacaoForm";
import ListaTransacoes from "../../components/transacoes/ListaTransacoes/ListaTransacoes";
import GraficoMensal from "../../components/graficos/GraficoMensal/GraficoMensal";
import ProximosVencimentos from "../../components/lembretes/ProximosVencimentos/ProximosVencimentos";
import ResumoInvestimentos from "../../components/investimentos/ResumoInvestimentos/ResumoInvestimentos";
import ResumoMetas from "../../components/metas/ResumoMetas/ResumoMetas";
import { calcularResumo } from "../../utils/calcularResumo";
import { resumoPorMes } from "../../utils/resumoPorMes";
import { investidoNoMes } from "../../utils/investimentos";
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
    lembretes,
    investimentos,
    movimentosInvestimento,
    cdi,
  } = useFinancas();

  const atual = calcularResumo(transacoesDoMes);

  // O que foi para os cofrinhos no mês não é despesa, mas sai do saldo:
  // o dinheiro não está mais na conta (está guardado)
  const investidoAtual = investidoNoMes(movimentosInvestimento, mesSelecionado);
  const saldoAtual = atual.saldo - investidoAtual;

  // Mesmo cálculo para o mês anterior, para comparar nos cards
  const mesAnterior = mudarMes(mesSelecionado, -1);
  const transacoesMesAnterior = transacoes.filter(
    (transacao) => transacao.data.slice(0, 7) === mesAnterior,
  );
  const anterior = calcularResumo(transacoesMesAnterior);
  const investidoAnterior = investidoNoMes(movimentosInvestimento, mesAnterior);
  const saldoAnterior = anterior.saldo - investidoAnterior;
  const temMesAnterior =
    transacoesMesAnterior.length > 0 || investidoAnterior !== 0;
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
          valor={saldoAtual}
          variante="saldo"
          valorAnterior={temMesAnterior ? saldoAnterior : null}
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
        <CardFinanceiro
          titulo="Investido no mês"
          valor={investidoAtual}
          variante="investimento"
          valorAnterior={temMesAnterior ? investidoAnterior : null}
          nomeMesAnterior={nomeMesAnterior}
        />
      </div>

      <div className="grade-dashboard">
        <div className="coluna">
          <TransacaoForm
            categoriasDespesa={todasCategoriasDespesa}
            onAdicionar={adicionarTransacao}
          />

          <section className="painel">
            <div className="painel-topo">
              <h3>Próximos vencimentos</h3>
              <Link to="/lembretes" className="link">
                Ver todos →
              </Link>
            </div>
            <ProximosVencimentos lembretes={lembretes} />
          </section>
        </div>

        <div className="coluna">
          <section className="painel">
            <h3>Gastos por categoria</h3>
            <GraficoCategorias transacoes={transacoesDoMes} />
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

          <section className="painel">
            <div className="painel-topo">
              <h3>Seus cofrinhos</h3>
              <Link to="/investimentos" className="link">
                Ver todos →
              </Link>
            </div>
            <ResumoInvestimentos
              investimentos={investimentos}
              movimentos={movimentosInvestimento}
              cdi={cdi}
            />
          </section>
        </div>
      </div>

      <section className="painel">
        <h3>Receitas e despesas · últimos 6 meses</h3>
        <GraficoMensal dados={resumoPorMes(transacoes, mesSelecionado, 6)} />
      </section>

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
