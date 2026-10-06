import { NavLink } from "react-router";
import {
  ArrowLeftRight,
  Bell,
  ChartColumn,
  LayoutDashboard,
  PiggyBank,
  Tags,
  Target,
} from "lucide-react";
import "./Sidebar.css";

// Os itens do menu ficam numa lista: para criar uma página nova no menu,
// basta adicionar uma linha aqui
const itensMenu = [
  { caminho: "/", nome: "Dashboard", Icone: LayoutDashboard },
  { caminho: "/transacoes", nome: "Transações", Icone: ArrowLeftRight },
  { caminho: "/metas", nome: "Metas", Icone: Target },
  { caminho: "/investimentos", nome: "Investimentos", Icone: PiggyBank },
  { caminho: "/relatorios", nome: "Relatórios", Icone: ChartColumn },
  { caminho: "/lembretes", nome: "Lembretes", Icone: Bell },
  { caminho: "/categorias", nome: "Categorias", Icone: Tags },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-marca">
        <span className="logo">F</span>
        <strong>FinanSee</strong>
      </div>

      <nav className="sidebar-nav">
        {itensMenu.map(({ caminho, nome, Icone }) => (
          <NavLink
            key={caminho}
            to={caminho}
            // "end" faz o Dashboard só ficar ativo exatamente em "/"
            end={caminho === "/"}
            className={({ isActive }) => (isActive ? "ativo" : "")}
          >
            <Icone size={20} aria-hidden="true" />
            <span>{nome}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
