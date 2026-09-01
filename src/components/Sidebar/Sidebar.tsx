import "./Sidebar.css";
function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <a href="#">Dashboard</a>
        <a href="#">Transações</a>
        <a href="#">Metas</a>
        <a href="#">Lembretes</a>
        <a href="#">Categorias</a>
      </nav>
    </aside>
  );
}

export default Sidebar;
