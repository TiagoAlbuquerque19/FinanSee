import { Suspense } from "react";
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
          {/* Suspense mostra o "Carregando..." enquanto a página é baixada */}
          <Suspense fallback={<p className="texto-vazio">Carregando...</p>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
