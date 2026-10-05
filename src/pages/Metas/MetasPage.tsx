import MetaForm from "../../components/metas/MetaForm/MetaForm";
import CartaoMeta from "../../components/metas/CartaoMeta/CartaoMeta";
import { useFinancas } from "../../hooks/useFinancas";
import { formatarMoeda } from "../../utils/formatarMoeda";
import "./MetasPage.css";

function MetasPage() {
  const { metas, criarMeta, excluirMeta, movimentarMeta } = useFinancas();

  // Quanto já foi guardado somando todas as metas
  let totalGuardado = 0;

  for (const meta of metas) {
    totalGuardado = totalGuardado + meta.valorGuardado;
  }

  return (
    <>
      <div className="conteudo-topo">
        <h2>Metas</h2>
        {metas.length > 0 && (
          <span className="metas-total">
            Total guardado: <strong>{formatarMoeda(totalGuardado)}</strong>
          </span>
        )}
      </div>

      <MetaForm onCriar={criarMeta} />

      {metas.length === 0 ? (
        <section className="painel">
          <p className="texto-vazio">
            Você ainda não tem metas. Crie a primeira acima: uma viagem, uma
            reserva de emergência, um celular novo...
          </p>
        </section>
      ) : (
        <div className="grade-metas">
          {metas.map((meta) => (
            <CartaoMeta
              key={meta.id}
              meta={meta}
              onExcluir={excluirMeta}
              onMovimentar={movimentarMeta}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default MetasPage;
