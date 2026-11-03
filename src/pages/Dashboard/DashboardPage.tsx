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
import { saldoAcumuladoAte } from "../../utils/saldoAcumulado";
import { formatarMoeda } from "../../utils/formatarMoeda";
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
    saldoInicial,
    salvarSaldoInicial,
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
  const temMesAnterior =
    transacoesMesAnterior.length > 0 || investidoAnterior !== 0;
  const nomeMesAnterior = nomeDoMes(mesAnterior);

  // Saldo disponível: o que sobrou dos meses anteriores + o resultado deste
  const sobrouDoAnterior = saldoAcumuladoAte(
    mesAnterior,
    transacoes,
    movimentosInvestimento,
    saldoInicial,
  );
  const saldoDisponivel = sobrouDoAnterior + saldoAtual;

  function perguntarSaldoInicial() {
    const resposta = window.prompt(
      "Quanto você tinha na conta antes de começar a lançar no FinanSee? (ex.: 1500,00)",
      saldoInicial === 0 ? "" : String(saldoInicial).replace(".", ","),
    );

    if (resposta === null) {
      return; // clicou em Cancelar
    }

    // Aceita "1.500,00", "1500,00" e "1500.00"
    const texto = resposta.trim();
    const normalizado = texto.includes(",")
      ? texto.replace(/\./g, "").replace(",", ".")
      : texto;
    const numero = Number(normalizado === "" ? "0" : normalizado);

    if (Number.isNaN(numero)) {
      alert("Digite só o valor, por exemplo 1500,00");
      return;
    }

    salvarSaldoInicial(numero);
  }

  return (
    <>
      <div className="conteudo-topo">
        <h2>Dashboard</h2>
        <SeletorMes mes={mesSelecionado} onMudar={setMesSelecionado} />
      </div>

      <div className="cards">
        <CardFinanceiro
          titulo="Saldo disponível"
          valor={saldoDisponivel}
          variante="saldo"
        >
          <div className="card-financeiro-detalhes">
            <span>
              Este mês:{" "}
              <strong
                className={
                  saldoAtual < 0 ? "comparacao-ruim" : "comparacao-boa"
                }
              >
                {saldoAtual > 0 ? "+ " : ""}
                {formatarMoeda(saldoAtual)}
              </strong>
            </span>
            <span>
              Sobrou de {nomeMesAnterior}:{" "}
              <strong>{formatarMoeda(sobrouDoAnterior)}</strong>
            </span>
            <button className="botao-link" onClick={perguntarSaldoInicial}>
              {saldoInicial === 0
                ? "Já tinha dinheiro antes? Informe o saldo inicial"
                : `Saldo inicial: ${formatarMoeda(saldoInicial)} · alterar`}
            </button>
          </div>
        </CardFinanceiro>
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
