import LembreteForm from "../../components/lembretes/LembreteForm/LembreteForm";
import ItemLembrete from "../../components/lembretes/ItemLembrete/ItemLembrete";
import { useFinancas } from "../../hooks/useFinancas";
import { ocorrenciasOrdenadas } from "../../utils/lembretes";
import type { Ocorrencia } from "../../utils/lembretes";

function LembretesPage() {
  const { lembretes, criarLembrete, excluirLembrete, alternarPagamento } =
    useFinancas();

  const ocorrencias = ocorrenciasOrdenadas(lembretes);

  // Separa em 3 grupos, cada um com seu título
  const urgentes = ocorrencias.filter(
    (item) =>
      item.situacao === "atrasado" ||
      item.situacao === "hoje" ||
      item.situacao === "proximo",
  );
  const futuros = ocorrencias.filter((item) => item.situacao === "futuro");
  const pagos = ocorrencias.filter((item) => item.situacao === "pago");

  function alternar(ocorrencia: Ocorrencia) {
    alternarPagamento(ocorrencia.lembrete.id, ocorrencia.mes);
  }

  // Um "pedaço de tela" reaproveitado para os 3 grupos
  function grupo(titulo: string, itens: Ocorrencia[], textoVazio: string) {
    return (
      <section className="painel">
        <h3>
          {titulo} ({itens.length})
        </h3>
        {itens.length === 0 ? (
          <p className="texto-vazio">{textoVazio}</p>
        ) : (
          <ul className="lista-simples">
            {itens.map((ocorrencia) => (
              <ItemLembrete
                key={ocorrencia.lembrete.id}
                ocorrencia={ocorrencia}
                onAlternarPagamento={alternar}
                onExcluir={excluirLembrete}
              />
            ))}
          </ul>
        )}
      </section>
    );
  }

  return (
    <>
      <div className="conteudo-topo">
        <h2>Lembretes</h2>
      </div>

      <LembreteForm onCriar={criarLembrete} />

      {grupo(
        "Precisa de atenção",
        urgentes,
        "Nada atrasado nem vencendo nos próximos 7 dias.",
      )}
      {grupo("Mais adiante", futuros, "Nenhuma conta mais para frente.")}
      {grupo("Pagos", pagos, "Nenhuma conta paga ainda.")}
    </>
  );
}

export default LembretesPage;
