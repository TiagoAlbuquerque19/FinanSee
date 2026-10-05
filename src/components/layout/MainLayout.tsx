import { Outlet } from "react-router";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import "./MainLayout.css";

// A "moldura" do site: header e sidebar ficam fixos,
// e o <Outlet /> mostra a página da rota atual
function MainLayout() {
  return (
    <>
      <Header nome="Tiago" />
      <div className="layout">
        <Sidebar />
        <main className="conteudo">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default MainLayout;
