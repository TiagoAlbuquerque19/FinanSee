import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatarMoeda } from "../../../utils/formatarMoeda";
import "./CardFinanceiro.css";

type Variante = "saldo" | "receita" | "despesa" | "investimento";

interface CardFinanceiroProps {
  titulo: string;
  valor: number;
  variante: Variante;
  // null quando o mês anterior não tem nenhuma transação
  valorAnterior: number | null;
  nomeMesAnterior: string;
}

// Um ícone para cada variante
const icones = {
  saldo: Wallet,
  receita: TrendingUp,
  despesa: TrendingDown,
  investimento: PiggyBank,
};

function CardFinanceiro({
  titulo,
  valor,
  variante,
  valorAnterior,
  nomeMesAnterior,
}: CardFinanceiroProps) {
  const Icone = icones[variante];

  // Saldo negativo deixa o ícone vermelho
  const corDoIcone = variante === "saldo" && valor < 0 ? "despesa" : variante;

  return (
    <div className="card-financeiro">
      <div className="card-financeiro-topo">
        <span className="card-financeiro-titulo">{titulo}</span>
        <span
          className={`card-financeiro-icone card-financeiro-icone--${corDoIcone}`}
        >
          <Icone size={18} aria-hidden="true" />
        </span>
      </div>

      <strong className="card-financeiro-valor">{formatarMoeda(valor)}</strong>

      <Comparacao
        diferenca={valorAnterior === null ? null : valor - valorAnterior}
        // Para despesas, aumentar é ruim; para receitas e saldo, é bom
        subirEhBom={variante !== "despesa"}
        nomeMesAnterior={nomeMesAnterior}
      />
    </div>
  );
}

interface ComparacaoProps {
  diferenca: number | null;
  subirEhBom: boolean;
  nomeMesAnterior: string;
}

// A linha de baixo do card: "↑ R$ 300,00 vs. setembro"
function Comparacao({
  diferenca,
  subirEhBom,
  nomeMesAnterior,
}: ComparacaoProps) {
  if (diferenca === null) {
    return (
      <span className="card-financeiro-comparacao">
        Sem dados de {nomeMesAnterior}
      </span>
    );
  }

  if (diferenca === 0) {
    return (
      <span className="card-financeiro-comparacao">
        Igual a {nomeMesAnterior}
      </span>
    );
  }

  const subiu = diferenca > 0;
  const ehBom = subiu === subirEhBom;
  const Seta = subiu ? ArrowUpRight : ArrowDownRight;

  return (
    <span className="card-financeiro-comparacao">
      {/* A seta e o texto mostram a direção; a cor só reforça */}
      <span className={ehBom ? "comparacao-boa" : "comparacao-ruim"}>
        <Seta size={14} aria-hidden="true" />
        {formatarMoeda(Math.abs(diferenca))}
      </span>{" "}
      {subiu ? "a mais que" : "a menos que"} {nomeMesAnterior}
    </span>
  );
}

export default CardFinanceiro;
