import { Link } from "react-router";
import { CircleAlert } from "lucide-react";
import type {
  ConfiguracaoCdi,
  Investimento,
  MovimentoInvestimento,
} from "../../../types/investimento";
import { calcularInvestimento } from "../../../utils/investimentos";
import { formatarMoeda } from "../../../utils/formatarMoeda";
import { hoje } from "../../../utils/datas";
import "./ResumoInvestimentos.css";

interface ResumoInvestimentosProps {
  investimentos: Investimento[];
  movimentos: MovimentoInvestimento[];
  cdi: ConfiguracaoCdi;
}

// Versão compacta para o Dashboard: total, quanto rende por dia e o aviso
// de conferir o saldo no começo do mês
function ResumoInvestimentos({
  investimentos,
  movimentos,
  cdi,
}: ResumoInvestimentosProps) {
  if (investimentos.length === 0) {
    return (
      <p className="texto-vazio">
        Nenhum cofrinho ainda.{" "}
        <Link to="/investimentos" className="link">
          Criar cofrinho
        </Link>
      </p>
    );
  }

  let total = 0;
  let porDia = 0;
  const paraAtualizar: string[] = [];

  for (const investimento of investimentos) {
    const resumo = calcularInvestimento(
      movimentos.filter((m) => m.investimentoId === investimento.id),
      investimento.percentualCdi,
      cdi.cdiAnual,
      hoje(),
    );

    total = total + (resumo.saldoEstimado ?? resumo.saldoConhecido);
    porDia = porDia + (resumo.rendimentoPorDia ?? 0);

    if (resumo.precisaAtualizar) {
      paraAtualizar.push(investimento.nome);
    }
  }

  return (
    <div className="resumo-investimentos">
      <div className="resumo-investimentos-numeros">
        <div>
          <span>Total nos cofrinhos</span>
          <strong>{formatarMoeda(total)}</strong>
        </div>
        {porDia > 0 && (
          <div>
            <span>Rendendo por dia útil</span>
            <strong className="resumo-investimentos-rende">
              ~ {formatarMoeda(porDia)}
            </strong>
          </div>
        )}
      </div>

      {paraAtualizar.length > 0 && (
        <Link to="/investimentos" className="resumo-investimentos-aviso">
          <CircleAlert size={16} aria-hidden="true" />
          <span>
            Mês novo! Confira o saldo de{" "}
            <strong>{paraAtualizar.join(", ")}</strong> para ver quanto rendeu.
          </span>
        </Link>
      )}
    </div>
  );
}

export default ResumoInvestimentos;
