import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import CardFinanceiro from "../dashboard/CardFinanceiro/CardFinanceiro";
import SeletorMes from "../dashboard/SeletorMes/SeletorMes";
import NovaCategoriaForm from "../categorias/NovaCategoriaForm/NovaCategoriaForm";
import RankingCategorias from "../categorias/RankingCategorias/RankingCategorias";
import TransacaoForm from "../transacoes/TransacaoForm/TransacaoForm";
import ListaTransacoes from "../transacoes/ListaTransacoes/ListaTransacoes";
import { useState, useEffect } from "react";
import "./MainLayout.css";
import { formatarMoeda } from "../../utils/formatarMoeda";
import type { Transacao } from "../../types/transacao";
import { categoriasDespesa } from "../../data/categorias";
import { mesAtual } from "../../utils/datas";

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
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual());

  // Só as transações do mês escolhido. "2026-10-05".slice(0, 7) é "2026-10"
  const transacoesDoMes = transacoes.filter(
    (transacao) => transacao.data.slice(0, 7) === mesSelecionado,
  );

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

  for (const transacao of transacoesDoMes) {
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
        <Sidebar />
        <main className="conteudo">
          <div className="conteudo-topo">
            <h2>Dashboard</h2>
            <SeletorMes mes={mesSelecionado} onMudar={setMesSelecionado} />
          </div>

          <div className="cards">
            <CardFinanceiro
              titulo="Saldo do mês"
              valor={formatarMoeda(saldo)}
              variante={saldo < 0 ? "despesa" : "saldo"}
            />
            <CardFinanceiro
              titulo="Receitas"
              valor={formatarMoeda(receitas)}
              variante="receita"
            />
            <CardFinanceiro
              titulo="Despesas"
              valor={formatarMoeda(despesas)}
              variante="despesa"
            />
          </div>

          <div className="grade-dashboard">
            <div className="coluna">
              <TransacaoForm
                categoriasDespesa={todasCategoriasDespesa}
                onAdicionar={adicionarTransacao}
              />

              <NovaCategoriaForm
                categoriasExistentes={todasCategoriasDespesa}
                onCriar={criarCategoria}
              />
            </div>

            <div className="coluna">
              <section className="painel">
                <h3>Onde você mais gasta</h3>
                <RankingCategorias transacoes={transacoesDoMes} />
              </section>
            </div>
          </div>

          <section className="painel">
            <h3>Transações do mês</h3>
            <ListaTransacoes
              transacoes={transacoesDoMes}
              onExcluir={excluirTransacao}
            />
          </section>
        </main>
      </div>
    </>
  );
}

export default MainLayout;
