import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import MainLayout from "./components/layout/MainLayout";
import RotaProtegida from "./components/auth/RotaProtegida/RotaProtegida";
import AuthProvider from "./context/AuthProvider";
import FinancasProvider from "./context/FinancasProvider";
import TelaCarregando from "./components/auth/TelaCarregando/TelaCarregando";

// lazy(): cada página vira um arquivo separado, que o navegador só baixa
// quando a pessoa abre aquela página. O site abre mais rápido, porque não
// precisa baixar tudo (inclusive a biblioteca de gráficos) logo de cara.
const EntrarPage = lazy(() => import("./pages/Entrar/EntrarPage"));
const CadastrarPage = lazy(() => import("./pages/Cadastrar/CadastrarPage"));
const DashboardPage = lazy(() => import("./pages/Dashboard/DashboardPage"));
const TransacoesPage = lazy(() => import("./pages/Transacoes/TransacoesPage"));
const CategoriasPage = lazy(() => import("./pages/Categorias/CategoriasPage"));
const MetasPage = lazy(() => import("./pages/Metas/MetasPage"));
const RelatoriosPage = lazy(() => import("./pages/Relatorios/RelatoriosPage"));
const LembretesPage = lazy(() => import("./pages/Lembretes/LembretesPage"));
const InvestimentosPage = lazy(
  () => import("./pages/Investimentos/InvestimentosPage"),
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<TelaCarregando />}>
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
              <Route path="investimentos" element={<InvestimentosPage />} />
              <Route path="relatorios" element={<RelatoriosPage />} />
              <Route path="lembretes" element={<LembretesPage />} />
              <Route path="categorias" element={<CategoriasPage />} />
              {/* Qualquer endereço desconhecido volta para o Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
