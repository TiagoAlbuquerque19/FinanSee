import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import CardFinanceiro from "../dashboard/CardFinanceiro/CardFinanceiro";
import { useState } from "react";
import "./MainLayout.css";
import { formatarMoeda } from "../../utils/formatarMoeda";

function MainLayout() {
  const [receitas, setReceitas] = useState(7000);
  const [despesas, setDespesas] = useState(1800);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const saldo = receitas - despesas;

  function adicionarTransacao() {
    console.log(descricao);
    console.log(valor);
  }
  return (
    <>
      <Header nome="Tiago" />
      <div className="layout">
        <Sidebar></Sidebar>
        <main>
          <h2>Dashboard</h2>
          <div className="cards">
            <CardFinanceiro titulo="Saldo atual" valor={formatarMoeda(saldo)} />
            <CardFinanceiro titulo="Receitas" valor={formatarMoeda(receitas)} />
            <CardFinanceiro titulo="Despesas" valor={formatarMoeda(despesas)} />
          </div>
          <button onClick={() => setReceitas((valorAtual) => valorAtual + 500)}>
            Adicionar R$ 500
          </button>
          <button onClick={() => setDespesas((valorAtual) => valorAtual + 100)}>
            Adicionar 100 reais de despesa
          </button>
          <h3>Nova transação</h3>
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(evento) => setDescricao(evento.target.value)}
          />
          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(evento) => setValor(evento.target.value)}
          />
          <button onClick={adicionarTransacao}>Adicionar transação</button>
        </main>
      </div>
    </>
  );
}

export default MainLayout;
