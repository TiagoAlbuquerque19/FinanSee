import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        {/* "ativo" marca a página atual. Quando houver rotas, isso vai mudar sozinho */}
        <a href="#" className="ativo">
          Dashboard
        </a>
        <a href="#">Transações</a>
        <a href="#">Metas</a>
        <a href="#">Lembretes</a>
        <a href="#">Categorias</a>
      </nav>
    </aside>
  );
}

export default Sidebar;
