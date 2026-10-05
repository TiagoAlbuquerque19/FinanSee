import BotaoTema from "../BotaoTema/BotaoTema";
import AvisoLembretes from "../lembretes/AvisoLembretes/AvisoLembretes";
import MenuUsuario from "../MenuUsuario/MenuUsuario";
import { useAuth } from "../../hooks/useAuth";
import "./Header.css";

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

function Header() {
  const { nome } = useAuth();

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
        <AvisoLembretes />
        <BotaoTema />
        <MenuUsuario />
      </div>
    </header>
  );
}

export default Header;
