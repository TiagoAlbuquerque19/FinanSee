import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import MainLayout from "./components/layout/MainLayout";
import FinancasProvider from "./context/FinancasProvider";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import EmBrevePage from "./pages/EmBreve/EmBrevePage";

function App() {
  return (
    <BrowserRouter>
      <FinancasProvider>
        <Routes>
          {/* Todas as páginas ficam dentro do MainLayout (header + sidebar) */}
          <Route element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route
              path="transacoes"
              element={<EmBrevePage titulo="Transações" />}
            />
            <Route path="metas" element={<EmBrevePage titulo="Metas" />} />
            <Route
              path="lembretes"
              element={<EmBrevePage titulo="Lembretes" />}
            />
            <Route
              path="categorias"
              element={<EmBrevePage titulo="Categorias" />}
            />
            {/* Qualquer endereço desconhecido volta para o Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </FinancasProvider>
    </BrowserRouter>
  );
}

export default App;
