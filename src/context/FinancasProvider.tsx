import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FinancasContext } from "./FinancasContext";
import type { Transacao } from "../types/transacao";
import type { Meta } from "../types/meta";
import { categoriasDespesa } from "../data/categorias";
import { mesAtual } from "../utils/datas";

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

function carregarMetas(): Meta[] {
  const dadosSalvos = localStorage.getItem("metas");

  if (dadosSalvos === null) {
    return [];
  }

  return JSON.parse(dadosSalvos);
}

interface FinancasProviderProps {
  children: ReactNode;
}

// Guarda os dados num lugar só e entrega para qualquer componente que pedir
function FinancasProvider({ children }: FinancasProviderProps) {
  const [transacoes, setTransacoes] = useState<Transacao[]>(carregarTransacoes);
  const [categoriasPersonalizadas, setCategoriasPersonalizadas] = useState<
    string[]
  >(carregarCategoriasPersonalizadas);
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual());
  const [metas, setMetas] = useState<Meta[]>(carregarMetas);

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

  useEffect(() => {
    localStorage.setItem("metas", JSON.stringify(metas));
  }, [metas]);

  function adicionarTransacao(novaTransacao: Transacao) {
    setTransacoes([novaTransacao, ...transacoes]);
  }

  function excluirTransacao(id: string) {
    const novaLista = transacoes.filter((transacao) => transacao.id !== id);
    setTransacoes(novaLista);
  }

  function criarCategoria(nome: string) {
    setCategoriasPersonalizadas([...categoriasPersonalizadas, nome]);
  }

  function excluirCategoria(nome: string) {
    const novaLista = categoriasPersonalizadas.filter(
      (categoria) => categoria !== nome,
    );
    setCategoriasPersonalizadas(novaLista);
  }

  function criarMeta(novaMeta: Meta) {
    setMetas([...metas, novaMeta]);
  }

  function excluirMeta(id: string) {
    setMetas(metas.filter((meta) => meta.id !== id));
  }

  function movimentarMeta(id: string, valor: number) {
    // O map cria uma lista nova: a meta com esse id ganha o valor novo,
    // e as outras continuam iguais
    const novaLista = metas.map((meta) => {
      if (meta.id !== id) {
        return meta;
      }

      // Math.max impede que o valor guardado fique negativo
      const novoValor = Math.max(0, meta.valorGuardado + valor);

      // { ...meta } copia a meta inteira; depois trocamos só o valorGuardado
      return { ...meta, valorGuardado: novoValor };
    });

    setMetas(novaLista);
  }

  return (
    <FinancasContext.Provider
      value={{
        transacoes,
        transacoesDoMes,
        todasCategoriasDespesa,
        categoriasPersonalizadas,
        mesSelecionado,
        setMesSelecionado,
        adicionarTransacao,
        excluirTransacao,
        criarCategoria,
        excluirCategoria,
        metas,
        criarMeta,
        excluirMeta,
        movimentarMeta,
      }}
    >
      {children}
    </FinancasContext.Provider>
  );
}

export default FinancasProvider;
