import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import CardFinanceiro from "../dashboard/CardFinanceiro/CardFinanceiro";
import { useState } from "react";
import "./MainLayout.css";

function MainLayout() {
  const [receitas, setReceitas] = useState(7000);
  const [despesas, setDespesas] = useState(1800);

  const saldo = receitas - despesas;
  return (
    <>
      <Header nome="Tiago"></Header>
      <div className="layout">
        <Sidebar></Sidebar>
        <main>
          <h2>Dashboard</h2>
          <div className="cards">
            <CardFinanceiro
              titulo="Saldo atual"
              valor={`R$ ${saldo}`}
            ></CardFinanceiro>
            <CardFinanceiro titulo="Receitas" valor={`R$ ${receitas}`} />
            <CardFinanceiro titulo="Despesas" valor={`R$ ${despesas}`} />
          </div>
          <button onClick={() => setReceitas(receitas + 500)}>
            Adicionar R$ 500
          </button>
        </main>
      </div>
    </>
  );
}

export default MainLayout;
