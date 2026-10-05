import { useState } from "react";
import GraficoMensal from "../../components/graficos/GraficoMensal/GraficoMensal";
import GraficoSaldo from "../../components/graficos/GraficoSaldo/GraficoSaldo";
import GraficoCategorias from "../../components/graficos/GraficoCategorias/GraficoCategorias";
import { useFinancas } from "../../hooks/useFinancas";
import { resumoPorMes } from "../../utils/resumoPorMes";
import { mesAtual } from "../../utils/datas";
import { formatarMoeda } from "../../utils/formatarMoeda";
import "./RelatoriosPage.css";

// As opções do filtro de período
const periodos = [3, 6, 12];

function RelatoriosPage() {
  const { transacoes } = useFinancas();
  const [quantidadeMeses, setQuantidadeMeses] = useState(6);

  // Relatórios sempre terminam no mês atual
  const meses = resumoPorMes(transacoes, mesAtual(), quantidadeMeses);

  // Só as transações que estão dentro do período escolhido
  const primeiroMes = meses[0].mes;
  const transacoesDoPeriodo = transacoes.filter(
    (transacao) => transacao.data.slice(0, 7) >= primeiroMes,
  );

  let totalReceitas = 0;
  let totalDespesas = 0;

  for (const mes of meses) {
    totalReceitas = totalReceitas + mes.receitas;
    totalDespesas = totalDespesas + mes.despesas;
  }

  const mediaDespesas = totalDespesas / quantidadeMeses;

  return (
    <>
      <div className="conteudo-topo">
        <h2>Relatórios</h2>

        {/* Filtro de período: vale para todos os gráficos da página */}
        <div className="filtro-periodo" role="group" aria-label="Período">
          {periodos.map((quantidade) => (
            <button
              key={quantidade}
              className={
                quantidade === quantidadeMeses ? "" : "botao-secundario"
              }
              onClick={() => setQuantidadeMeses(quantidade)}
              aria-pressed={quantidade === quantidadeMeses}
            >
              {quantidade} meses
            </button>
          ))}
        </div>
      </div>

      <div className="resumo-periodo">
        <div className="painel">
          <span>Receitas no período</span>
          <strong>{formatarMoeda(totalReceitas)}</strong>
        </div>
        <div className="painel">
          <span>Despesas no período</span>
          <strong>{formatarMoeda(totalDespesas)}</strong>
        </div>
        <div className="painel">
          <span>Média de gastos por mês</span>
          <strong>{formatarMoeda(mediaDespesas)}</strong>
        </div>
      </div>

      <section className="painel">
        <h3>Receitas e despesas por mês</h3>
        <GraficoMensal dados={meses} />
      </section>

      <div className="grade-relatorios">
        <section className="painel">
          <h3>Evolução do saldo</h3>
          <GraficoSaldo dados={meses} />
        </section>

        <section className="painel">
          <h3>Gastos por categoria no período</h3>
          <GraficoCategorias transacoes={transacoesDoPeriodo} />
        </section>
      </div>

      {/* A mesma informação dos gráficos, em tabela */}
      <section className="painel">
        <h3>Mês a mês</h3>
        <div className="tabela-rolagem">
          <table className="tabela">
            <thead>
              <tr>
                <th>Mês</th>
                <th>Receitas</th>
                <th>Despesas</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {/* [...meses].reverse(): copia e inverte, mais recente primeiro */}
              {[...meses].reverse().map((mes) => (
                <tr key={mes.mes}>
                  <td className="tabela-mes">{mes.titulo}</td>
                  <td>{formatarMoeda(mes.receitas)}</td>
                  <td>{formatarMoeda(mes.despesas)}</td>
                  <td className={mes.saldo < 0 ? "valor-negativo" : ""}>
                    {formatarMoeda(mes.saldo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default RelatoriosPage;
