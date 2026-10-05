import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import MainLayout from "./components/layout/MainLayout";
import RotaProtegida from "./components/auth/RotaProtegida/RotaProtegida";
import AuthProvider from "./context/AuthProvider";
import EntrarPage from "./pages/Entrar/EntrarPage";
import CadastrarPage from "./pages/Cadastrar/CadastrarPage";
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
      <AuthProvider>
        <Routes>
          {/* Telas para quem ainda não entrou */}
          <Route
            path="entrar"
            element={
              <RotaProtegida precisaEstarLogado={false}>
                <EntrarPage />
              </RotaProtegida>
            }
          />
          <Route
            path="cadastrar"
            element={
              <RotaProtegida precisaEstarLogado={false}>
                <CadastrarPage />
              </RotaProtegida>
            }
          />

          {/* Todas as outras páginas: só para quem está logado,
              dentro do MainLayout (header + sidebar) */}
          <Route
            element={
              <RotaProtegida precisaEstarLogado>
                <FinancasProvider>
                  <MainLayout />
                </FinancasProvider>
              </RotaProtegida>
            }
          >
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
