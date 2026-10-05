import MainLayout from "./components/layout/MainLayout";
import FinancasProvider from "./context/FinancasProvider";

function App() {
  return (
    <FinancasProvider>
      <MainLayout />
    </FinancasProvider>
  );
}

export default App;
