import "./TelaCarregando.css";

interface TelaCarregandoProps {
  texto?: string;
}

function TelaCarregando({ texto = "Carregando..." }: TelaCarregandoProps) {
  return (
    <div className="tela-carregando" role="status">
      <span className="logo">F</span>
      <p>{texto}</p>
    </div>
  );
}

export default TelaCarregando;
