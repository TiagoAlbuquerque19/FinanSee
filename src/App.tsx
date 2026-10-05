import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import MainLayout from "./components/layout/MainLayout";
import FinancasProvider from "./context/FinancasProvider";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import TransacoesPage from "./pages/Transacoes/TransacoesPage";
import CategoriasPage from "./pages/Categorias/CategoriasPage";
import MetasPage from "./pages/Metas/MetasPage";
import RelatoriosPage from "./pages/Relatorios/RelatoriosPage";
import LembretesPage from "./pages/Lembretes/LembretesPage";

function App() {
  return (
    <BrowserRouter>
      <FinancasProvider>
        <Routes>
          {/* Todas as páginas ficam dentro do MainLayout (header + sidebar) */}
          <Route element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="transacoes" element={<TransacoesPage />} />
            <Route path="metas" element={<MetasPage />} />
            <Route path="relatorios" element={<RelatoriosPage />} />
            <Route path="lembretes" element={<LembretesPage />} />
            <Route path="categorias" element={<CategoriasPage />} />
            {/* Qualquer endereço desconhecido volta para o Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </FinancasProvider>
    </BrowserRouter>
  );
}

export default App;
