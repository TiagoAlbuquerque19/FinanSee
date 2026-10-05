import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import CardFinanceiro from "../dashboard/CardFinanceiro/CardFinanceiro";
import ListaTransacoes from "../transacoes/ListaTransacoes/ListaTransacoes";
import { useState, useEffect } from "react";
import "./MainLayout.css";
import { formatarMoeda } from "../../utils/formatarMoeda";
import type { Transacao, TipoTransacao } from "../../types/transacao";
import { categoriasDespesa, categoriasReceita } from "../../data/categorias";

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
  const [tipo, setTipo] = useState<TipoTransacao>("despesa");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState(categoriasDespesa[0]);
  const [categoriasPersonalizadas, setCategoriasPersonalizadas] = useState<
    string[]
  >(carregarCategoriasPersonalizadas);
  const [novaCategoria, setNovaCategoria] = useState("");

  // As categorias criadas pelo usuário entram junto com as de despesa
  const todasCategoriasDespesa = [
    ...categoriasDespesa,
    ...categoriasPersonalizadas,
  ];

  const categoriasDoTipo =
    tipo === "despesa" ? todasCategoriasDespesa : categoriasReceita;

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

  // Soma as despesas de cada categoria, para saber onde você mais gasta
  const gastosPorCategoria: { categoria: string; total: number }[] = [];

  for (const transacao of transacoes) {
    if (transacao.tipo === "receita") {
      continue;
    }

    const itemExistente = gastosPorCategoria.find(
      (item) => item.categoria === transacao.categoria,
    );

    if (itemExistente) {
      itemExistente.total = itemExistente.total + transacao.valor;
    } else {
      gastosPorCategoria.push({
        categoria: transacao.categoria,
        total: transacao.valor,
      });
    }
  }

  // Ordena do maior gasto para o menor
  gastosPorCategoria.sort((a, b) => b.total - a.total);

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
      categoria,
      data: new Date().toISOString(),
    };

    setTransacoes([novaTransacao, ...transacoes]);
    setDescricao("");
    setValor("");
  }

  function trocarTipo(novoTipo: TipoTransacao) {
    setTipo(novoTipo);

    // Cada tipo tem sua lista, então volta para a primeira categoria dela
    if (novoTipo === "despesa") {
      setCategoria(categoriasDespesa[0]);
    } else {
      setCategoria(categoriasReceita[0]);
    }
  }

  function criarCategoria() {
    const nome = novaCategoria.trim();

    if (nome === "") {
      alert("Digite o nome da categoria.");
      return;
    }

    if (todasCategoriasDespesa.includes(nome)) {
      alert("Essa categoria já existe.");
      return;
    }

    setCategoriasPersonalizadas([...categoriasPersonalizadas, nome]);
    setNovaCategoria("");

    // Já deixa a categoria nova selecionada no formulário
    setTipo("despesa");
    setCategoria(nome);
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
          <select
            value={tipo}
            onChange={(evento) =>
              trocarTipo(evento.target.value as TipoTransacao)
            }
          >
            <option value="despesa">Despesa</option>
            <option value="receita">Receita</option>
          </select>
          <select
            value={categoria}
            onChange={(evento) => setCategoria(evento.target.value)}
          >
            {categoriasDoTipo.map((nome) => (
              <option key={nome} value={nome}>
                {nome}
              </option>
            ))}
          </select>
          <button onClick={adicionarTransacao}>Adicionar transação</button>

          <h3>Nova categoria de despesa</h3>
          <input
            type="text"
            placeholder="Ex.: Pets, Academia..."
            value={novaCategoria}
            onChange={(evento) => setNovaCategoria(evento.target.value)}
          />
          <button onClick={criarCategoria}>Criar categoria</button>

          <h3>Onde você mais gasta</h3>
          {gastosPorCategoria.length === 0 ? (
            <p>Nenhuma despesa cadastrada ainda.</p>
          ) : (
            <ol>
              {gastosPorCategoria.map((item) => (
                <li key={item.categoria}>
                  {item.categoria}: {formatarMoeda(item.total)} (
                  {Math.round((item.total / despesas) * 100)}%)
                </li>
              ))}
            </ol>
          )}

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
