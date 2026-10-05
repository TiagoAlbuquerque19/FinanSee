import BotaoTema from "../BotaoTema/BotaoTema";
import "./Header.css";

interface HeaderProps {
  nome: string;
}

// "Bom dia", "Boa tarde" ou "Boa noite", conforme a hora
function saudacao(): string {
  const hora = new Date().getHours();

  if (hora < 12) {
    return "Bom dia";
  }

  if (hora < 18) {
    return "Boa tarde";
  }

  return "Boa noite";
}

function Header({ nome }: HeaderProps) {
  const dataDeHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="header">
      {/* O logo só aparece aqui no celular, onde a sidebar fica embaixo */}
      <span className="logo header-logo">F</span>

      <div className="header-saudacao">
        <strong>
          {saudacao()}, {nome}
        </strong>
        <span>{dataDeHoje}</span>
      </div>

      <div className="header-acoes">
        <BotaoTema />
        {/* A primeira letra do nome vira o "avatar" */}
        <span className="header-avatar">{nome[0]}</span>
      </div>
    </header>
  );
}

export default Header;
