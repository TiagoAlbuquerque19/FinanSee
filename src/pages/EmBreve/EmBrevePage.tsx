interface EmBrevePageProps {
  titulo: string;
}

// Página provisória para as seções que ainda vamos construir
function EmBrevePage({ titulo }: EmBrevePageProps) {
  return (
    <>
      <div className="conteudo-topo">
        <h2>{titulo}</h2>
      </div>
      <section className="painel">
        <p className="texto-vazio">Esta seção está em construção.</p>
      </section>
    </>
  );
}

export default EmBrevePage;
