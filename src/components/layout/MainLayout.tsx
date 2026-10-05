import { Outlet } from "react-router";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import AvisoImportacao from "../AvisoImportacao/AvisoImportacao";
import "./MainLayout.css";

// A "moldura" do site: sidebar à esquerda e, à direita, o header em cima
// e o <Outlet />, que mostra a página da rota atual
function MainLayout() {
  return (
    <div className="app">
      <Sidebar />
      <div className="app-principal">
        <Header />
        <main className="conteudo">
          <AvisoImportacao />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
