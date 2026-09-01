import "./CardFinanceiro.css";
interface CardFinanceiroProps {
  titulo: string;
  valor: string;
}

function CardFinanceiro({ titulo, valor }: CardFinanceiroProps) {
  return (
    <div className="card-financeiro">
      <h3>{titulo}</h3>
      <strong>{valor}</strong>
    </div>
  );
}

export default CardFinanceiro;
