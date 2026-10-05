import { NavLink } from "react-router";
import "./Sidebar.css";

// O NavLink sabe se o endereço atual é o dele (isActive)
// e assim a classe "ativo" muda sozinha de item
function classeDoLink({ isActive }: { isActive: boolean }) {
  return isActive ? "ativo" : "";
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        {/* "end" faz o Dashboard só ficar ativo exatamente em "/" */}
        <NavLink to="/" end className={classeDoLink}>
          Dashboard
        </NavLink>
        <NavLink to="/transacoes" className={classeDoLink}>
          Transações
        </NavLink>
        <NavLink to="/metas" className={classeDoLink}>
          Metas
        </NavLink>
        <NavLink to="/lembretes" className={classeDoLink}>
          Lembretes
        </NavLink>
        <NavLink to="/categorias" className={classeDoLink}>
          Categorias
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
