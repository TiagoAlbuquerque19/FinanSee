import "./CardFinanceiro.css";

interface CardFinanceiroProps {
  titulo: string;
  valor: string;
  variante: "saldo" | "receita" | "despesa";
}

function CardFinanceiro({ titulo, valor, variante }: CardFinanceiroProps) {
  // A variante vira uma classe CSS: "card-financeiro card-financeiro--receita"
  return (
    <div className={`card-financeiro card-financeiro--${variante}`}>
      <span className="card-financeiro-titulo">{titulo}</span>
      <strong className="card-financeiro-valor">{valor}</strong>
    </div>
  );
}

export default CardFinanceiro;
