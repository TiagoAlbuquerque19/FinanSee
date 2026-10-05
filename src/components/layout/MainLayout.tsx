import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import CardFinanceiro from "../dashboard/CardFinanceiro/CardFinanceiro";
import NovaCategoriaForm from "../categorias/NovaCategoriaForm/NovaCategoriaForm";
import RankingCategorias from "../categorias/RankingCategorias/RankingCategorias";
import TransacaoForm from "../transacoes/TransacaoForm/TransacaoForm";
import ListaTransacoes from "../transacoes/ListaTransacoes/ListaTransacoes";
import { useState, useEffect } from "react";
import "./MainLayout.css";
import { formatarMoeda } from "../../utils/formatarMoeda";
import type { Transacao } from "../../types/transacao";
import { categoriasDespesa } from "../../data/categorias";

function carregarTransacoes(): Transacao[] {
  const dadosSalvos = localStorage.getItem("transacoes");

  if (dadosSalvos === null) {
    return [];
  }

  const lista: Transacao[] = JSON.parse(dadosSalvos);

  // Transações salvas antes de existir categoria ganham "Outros"
  for (const transacao of lista) {
    if (!transacao.categoria) {
      transacao.categoria = "Outros";
    }
  }

  return lista;
}

function carregarCategoriasPersonalizadas(): string[] {
  const dadosSalvos = localStorage.getItem("categoriasPersonalizadas");

  if (dadosSalvos === null) {
    return [];
  }

  return JSON.parse(dadosSalvos);
}

function MainLayout() {
  const [transacoes, setTransacoes] = useState<Transacao[]>(carregarTransacoes);
  const [categoriasPersonalizadas, setCategoriasPersonalizadas] = useState<
    string[]
  >(carregarCategoriasPersonalizadas);

  // As categorias criadas pelo usuário entram junto com as de despesa
  const todasCategoriasDespesa = [
    ...categoriasDespesa,
    ...categoriasPersonalizadas,
  ];

  useEffect(() => {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
  }, [transacoes]);

  useEffect(() => {
    localStorage.setItem(
      "categoriasPersonalizadas",
      JSON.stringify(categoriasPersonalizadas),
    );
  }, [categoriasPersonalizadas]);

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

  function adicionarTransacao(novaTransacao: Transacao) {
    setTransacoes([novaTransacao, ...transacoes]);
  }

  function criarCategoria(nome: string) {
    setCategoriasPersonalizadas([...categoriasPersonalizadas, nome]);
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

          <TransacaoForm
            categoriasDespesa={todasCategoriasDespesa}
            onAdicionar={adicionarTransacao}
          />

          <NovaCategoriaForm
            categoriasExistentes={todasCategoriasDespesa}
            onCriar={criarCategoria}
          />

          <h3>Onde você mais gasta</h3>
          <RankingCategorias transacoes={transacoes} />

          <h3>Transações</h3>
          <ListaTransacoes
            transacoes={transacoes}
            onExcluir={excluirTransacao}
          />
        </main>
      </div>
    </>
  );
}

export default MainLayout;
