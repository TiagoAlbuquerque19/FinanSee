import PainelCdi from "../../components/investimentos/PainelCdi/PainelCdi";
import InvestimentoForm from "../../components/investimentos/InvestimentoForm/InvestimentoForm";
import CartaoInvestimento from "../../components/investimentos/CartaoInvestimento/CartaoInvestimento";
import { useFinancas } from "../../hooks/useFinancas";
import { calcularInvestimento } from "../../utils/investimentos";
import { formatarMoeda } from "../../utils/formatarMoeda";
import { hoje } from "../../utils/datas";
import type {
  Investimento,
  MovimentoInvestimento,
} from "../../types/investimento";
import "./InvestimentosPage.css";

function InvestimentosPage() {
  const {
    faltaMigracaoInvestimentos,
    investimentos,
    movimentosInvestimento,
    cdi,
    salvarCdi,
    criarInvestimento,
    alterarPercentualCdi,
    alterarTributacao,
    excluirInvestimento,
    adicionarMovimento,
    excluirMovimento,
  } = useFinancas();

  if (faltaMigracaoInvestimentos) {
    return (
      <>
        <div className="conteudo-topo">
          <h2>Investimentos</h2>
        </div>
        <section className="painel">
          <h3>Falta um passo no Supabase</h3>
          <p className="texto-vazio">
            Rode o arquivo <code>supabase/migracoes/002_investimentos.sql</code>{" "}
            no SQL Editor do Supabase e recarregue a página.
          </p>
        </section>
      </>
    );
  }

  // Calcula o resumo de cada cofrinho com os movimentos dele
  const cofrinhos = investimentos.map((investimento) => {
    const movimentos = movimentosInvestimento.filter(
      (movimento) => movimento.investimentoId === investimento.id,
    );

    return {
      investimento,
      movimentos,
      resumo: calcularInvestimento(
        movimentos,
        investimento,
        cdi.cdiAnual,
        hoje(),
      ),
    };
  });

  let total = 0;
  let rendendoPorDia = 0;

  for (const { resumo } of cofrinhos) {
    total = total + (resumo.saldoEstimado ?? resumo.saldoConhecido);
    rendendoPorDia = rendendoPorDia + (resumo.rendimentoPorDia ?? 0);
  }

  // Cria o cofrinho e, se tiver valor inicial, registra o saldo inicial
  async function criar(
    investimento: Investimento,
    saldoInicial: MovimentoInvestimento | null,
  ) {
    await criarInvestimento(investimento);

    if (saldoInicial) {
      await adicionarMovimento(saldoInicial);
    }
  }

  return (
    <>
      <div className="conteudo-topo">
        <h2>Investimentos</h2>
        {cofrinhos.length > 0 && (
          <div className="investimentos-total">
            <span>Total investido</span>
            <strong>{formatarMoeda(total)}</strong>
            {rendendoPorDia > 0 && (
              <span className="investimentos-por-dia">
                rendendo ~ {formatarMoeda(rendendoPorDia)} por dia útil
              </span>
            )}
          </div>
        )}
      </div>

      <PainelCdi cdi={cdi} onSalvar={salvarCdi} />

      <InvestimentoForm onCriar={criar} />

      {cofrinhos.length === 0 ? (
        <section className="painel">
          <p className="texto-vazio">
            Nenhum cofrinho ainda. Crie o primeiro acima: o dinheiro guardado
            aqui não conta como despesa.
          </p>
        </section>
      ) : (
        <div className="grade-investimentos">
          {cofrinhos.map(({ investimento, movimentos, resumo }) => (
            <CartaoInvestimento
              key={investimento.id}
              investimento={investimento}
              resumo={resumo}
              movimentos={movimentos}
              onMovimentar={adicionarMovimento}
              onExcluirMovimento={excluirMovimento}
              onAlterarPercentual={alterarPercentualCdi}
              onAlterarTributacao={alterarTributacao}
              onExcluir={excluirInvestimento}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default InvestimentosPage;
