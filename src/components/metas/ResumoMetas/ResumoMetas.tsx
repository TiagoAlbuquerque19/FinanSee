import { Link } from "react-router";
import type { Meta } from "../../../types/meta";
import { calcularPlanoMeta } from "../../../utils/metas";
import { formatarMoeda } from "../../../utils/formatarMoeda";
import "./ResumoMetas.css";

interface ResumoMetasProps {
  metas: Meta[];
}

// Versão compacta das metas para o Dashboard: só as 3 que ainda não terminaram
function ResumoMetas({ metas }: ResumoMetasProps) {
  const metasEmAndamento = metas
    .filter((meta) => !calcularPlanoMeta(meta).concluida)
    .slice(0, 3);

  if (metasEmAndamento.length === 0) {
    return (
      <p className="texto-vazio">
        Nenhuma meta em andamento.{" "}
        <Link to="/metas" className="link">
          Criar meta
        </Link>
      </p>
    );
  }

  return (
    <ul className="resumo-metas">
      {metasEmAndamento.map((meta) => {
        const { porcentagem } = calcularPlanoMeta(meta);

        return (
          <li key={meta.id}>
            <div className="resumo-metas-linha">
              <span>{meta.nome}</span>
              <span className="resumo-metas-valor">
                {formatarMoeda(meta.valorGuardado)} de{" "}
                {formatarMoeda(meta.valorAlvo)}
              </span>
            </div>
            <div className="barra-progresso">
              <div
                className="barra-progresso-preenchimento"
                style={{ width: `${porcentagem}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default ResumoMetas;
