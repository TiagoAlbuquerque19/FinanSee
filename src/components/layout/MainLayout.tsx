import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import CardFinanceiro from "../dashboard/CardFinanceiro/CardFinanceiro";
import { useState } from "react";
import "./MainLayout.css";
import { formatarMoeda } from "../../utils/formatarMoeda";
import type { Transacao, TipoTransacao } from "../../types/transacao";

function MainLayout() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [tipo, setTipo] = useState<TipoTransacao>("despesa");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  let receitas = 0;
  let despesas = 0;

  for (const transacao of transacoes) {
    if (transacao.tipo === "receita") {
      receitas = receitas + transacao.valor;
    } else {
      despesas = despesas + transacao.valor;
    }
  }

  const saldo = receitas - despesas;

  function adicionarTransacao() {
    const valorNumerico = Number(valor);

    if (descricao.trim() === "" || valorNumerico <= 0) {
      alert("Preencha a descrição e um valor maior que zero.");
      return;
    }

    const novaTransacao: Transacao = {
      id: crypto.randomUUID(),
      descricao: descricao.trim(),
      valor: valorNumerico,
      tipo,
      data: new Date().toISOString(),
    };

    setTransacoes([novaTransacao, ...transacoes]);
    setDescricao("");
    setValor("");
  }
  function excluirTransacao(id: string) {
    const novaLista = transacoes.filter((transacao) => transacao.id !== id);
    setTransacoes(novaLista);
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
          <select
            value={tipo}
            onChange={(evento) => setTipo(evento.target.value as TipoTransacao)}
          >
            <option value="despesa">Despesa</option>
            <option value="receita">Receita</option>
          </select>
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
          <h3>Transações</h3>
          {transacoes.length === 0 ? (
            <p>Nenhuma transação cadastrada ainda.</p>
          ) : (
            <ul>
              {transacoes.map((transacao) => (
                <li key={transacao.id}>
                  {transacao.descricao} —{" "}
                  {transacao.tipo === "despesa" ? "-" : "+"}
                  {formatarMoeda(transacao.valor)}
                  <button onClick={() => excluirTransacao(transacao.id)}>
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </>
  );
}

export default MainLayout;
