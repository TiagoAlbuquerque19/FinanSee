import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FinancasContext } from "./FinancasContext";
import type { Transacao } from "../types/transacao";
import type { Meta } from "../types/meta";
import type { Lembrete } from "../types/lembrete";
import type {
  ConfiguracaoCdi,
  Investimento,
  MovimentoInvestimento,
  Tributacao,
} from "../types/investimento";
import { categoriasDespesa } from "../data/categorias";
import { hoje, mesAtual } from "../utils/datas";
import * as banco from "../services/banco";
import {
  apagarDadosLocais,
  contarDadosLocais,
  lerDadosLocais,
} from "../utils/dadosLocais";
import TelaCarregando from "../components/auth/TelaCarregando/TelaCarregando";

// Mostra um aviso quando o banco recusa ou a internet cai
function avisarErro(erro: unknown) {
  const detalhe = erro instanceof Error ? erro.message : String(erro);

  alert(
    `Não foi possível salvar. Verifique sua internet e tente de novo.\n\n(${detalhe})`,
  );
}

interface FinancasProviderProps {
  children: ReactNode;
}

// Guarda os dados do usuário logado e conversa com o banco (Supabase)
function FinancasProvider({ children }: FinancasProviderProps) {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [categoriasPersonalizadas, setCategoriasPersonalizadas] = useState<
    string[]
  >([]);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [movimentosInvestimento, setMovimentosInvestimento] = useState<
    MovimentoInvestimento[]
  >([]);
  const [cdi, setCdi] = useState<ConfiguracaoCdi>({
    cdiAnual: null,
    atualizadoEm: null,
  });
  const [faltaMigracaoInvestimentos, setFaltaMigracaoInvestimentos] =
    useState(false);
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual());

  const [carregando, setCarregando] = useState(true);
  const [erroAoCarregar, setErroAoCarregar] = useState<string | null>(null);

  // Dados da época em que tudo ficava só no navegador (antes do login)
  const [quantidadeDadosLocais, setQuantidadeDadosLocais] = useState(() =>
    contarDadosLocais(lerDadosLocais()),
  );

  function recarregarDoBanco() {
    return banco.buscarDados().then((dados) => {
      setTransacoes(dados.transacoes);
      setCategoriasPersonalizadas(dados.categorias);
      setMetas(dados.metas);
      setLembretes(dados.lembretes);
      setInvestimentos(dados.investimentos);
      setMovimentosInvestimento(dados.movimentos);
      setCdi(dados.cdi);
      setFaltaMigracaoInvestimentos(dados.faltaMigracaoInvestimentos);
    });
  }

  // Ao abrir, busca todos os dados do usuário no banco (uma vez só: [])
  useEffect(() => {
    recarregarDoBanco()
      .catch((erro: Error) => setErroAoCarregar(erro.message))
      .finally(() => setCarregando(false));
  }, []);

  async function importarDadosLocais() {
    try {
      await banco.importarDados(lerDadosLocais());
      await recarregarDoBanco();
      // Depois de importar, apaga do navegador para não oferecer de novo
      apagarDadosLocais();
      setQuantidadeDadosLocais(0);
    } catch (erro) {
      avisarErro(erro);
    }
  }

  function descartarDadosLocais() {
    apagarDadosLocais();
    setQuantidadeDadosLocais(0);
  }

  // Só as transações do mês escolhido. "2026-10-05".slice(0, 7) é "2026-10"
  const transacoesDoMes = transacoes.filter(
    (transacao) => transacao.data.slice(0, 7) === mesSelecionado,
  );

  // As categorias criadas pelo usuário entram junto com as de despesa
  const todasCategoriasDespesa = [
    ...categoriasDespesa,
    ...categoriasPersonalizadas,
  ];

  // Todas as ações seguem o mesmo roteiro:
  // 1. salva no banco (await espera a resposta)
  // 2. se deu certo, atualiza a tela
  // 3. se deu errado, avisa e a tela continua como estava
  //
  // Usamos set...((listaAtual) => ...) porque, durante o await, a lista
  // pode ter mudado; assim sempre partimos da versão mais nova.

  async function adicionarTransacao(novaTransacao: Transacao) {
    try {
      await banco.inserirTransacao(novaTransacao);
      setTransacoes((lista) => [novaTransacao, ...lista]);
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function excluirTransacao(id: string) {
    try {
      await banco.apagarTransacao(id);
      setTransacoes((lista) =>
        lista.filter((transacao) => transacao.id !== id),
      );
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function criarCategoria(nome: string) {
    try {
      await banco.inserirCategoria(nome);
      setCategoriasPersonalizadas((lista) => [...lista, nome]);
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function excluirCategoria(nome: string) {
    try {
      await banco.apagarCategoria(nome);
      setCategoriasPersonalizadas((lista) =>
        lista.filter((categoria) => categoria !== nome),
      );
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function criarMeta(novaMeta: Meta) {
    try {
      await banco.inserirMeta(novaMeta);
      setMetas((lista) => [...lista, novaMeta]);
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function excluirMeta(id: string) {
    try {
      await banco.apagarMeta(id);
      setMetas((lista) => lista.filter((meta) => meta.id !== id));
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function movimentarMeta(id: string, valor: number) {
    const meta = metas.find((item) => item.id === id);

    if (!meta) {
      return;
    }

    // Math.max impede que o valor guardado fique negativo
    const novoValor = Math.max(0, meta.valorGuardado + valor);

    try {
      await banco.atualizarValorGuardado(id, novoValor);
      // { ...item } copia a meta inteira; depois trocamos só o valorGuardado
      setMetas((lista) =>
        lista.map((item) =>
          item.id === id ? { ...item, valorGuardado: novoValor } : item,
        ),
      );
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function criarLembrete(novoLembrete: Lembrete) {
    try {
      await banco.inserirLembrete(novoLembrete);
      setLembretes((lista) => [...lista, novoLembrete]);
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function excluirLembrete(id: string) {
    try {
      await banco.apagarLembrete(id);
      setLembretes((lista) => lista.filter((lembrete) => lembrete.id !== id));
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function alternarPagamento(id: string, mes: string) {
    const lembrete = lembretes.find((item) => item.id === id);

    if (!lembrete) {
      return;
    }

    // Se o mês já está pago, tira da lista; se não está, adiciona
    const pagamentos = lembrete.pagamentos.includes(mes)
      ? lembrete.pagamentos.filter((mesPago) => mesPago !== mes)
      : [...lembrete.pagamentos, mes];

    try {
      await banco.atualizarPagamentos(id, pagamentos);
      setLembretes((lista) =>
        lista.map((item) => (item.id === id ? { ...item, pagamentos } : item)),
      );
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function criarInvestimento(novo: Investimento) {
    try {
      await banco.inserirInvestimento(novo);
      setInvestimentos((lista) => [...lista, novo]);
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function alterarPercentualCdi(id: string, percentual: number) {
    try {
      await banco.atualizarPercentualCdi(id, percentual);
      setInvestimentos((lista) =>
        lista.map((item) =>
          item.id === id ? { ...item, percentualCdi: percentual } : item,
        ),
      );
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function alterarTributacao(id: string, tributacao: Tributacao) {
    try {
      await banco.atualizarTributacao(id, tributacao);
      setInvestimentos((lista) =>
        lista.map((item) => (item.id === id ? { ...item, tributacao } : item)),
      );
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function excluirInvestimento(id: string) {
    try {
      await banco.apagarInvestimento(id);
      setInvestimentos((lista) => lista.filter((item) => item.id !== id));
      // O banco já apagou o histórico; aqui tiramos da tela também
      setMovimentosInvestimento((lista) =>
        lista.filter((movimento) => movimento.investimentoId !== id),
      );
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function adicionarMovimento(movimento: MovimentoInvestimento) {
    try {
      await banco.inserirMovimento(movimento);
      setMovimentosInvestimento((lista) => [...lista, movimento]);
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function excluirMovimento(id: string) {
    try {
      await banco.apagarMovimento(id);
      setMovimentosInvestimento((lista) =>
        lista.filter((movimento) => movimento.id !== id),
      );
    } catch (erro) {
      avisarErro(erro);
    }
  }

  async function salvarCdi(cdiAnual: number) {
    try {
      await banco.salvarCdi(cdiAnual, hoje());
      setCdi({ cdiAnual, atualizadoEm: hoje() });
    } catch (erro) {
      avisarErro(erro);
    }
  }

  if (carregando) {
    return <TelaCarregando texto="Carregando seus dados..." />;
  }

  if (erroAoCarregar) {
    return (
      <div className="tela-carregando">
        <span className="logo">F</span>
        <p>Não foi possível carregar seus dados.</p>
        <p className="texto-vazio">{erroAoCarregar}</p>
        <button onClick={() => window.location.reload()}>Tentar de novo</button>
      </div>
    );
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
        lembretes,
        criarLembrete,
        excluirLembrete,
        alternarPagamento,
        faltaMigracaoInvestimentos,
        investimentos,
        movimentosInvestimento,
        cdi,
        criarInvestimento,
        alterarPercentualCdi,
        alterarTributacao,
        excluirInvestimento,
        adicionarMovimento,
        excluirMovimento,
        salvarCdi,
        quantidadeDadosLocais,
        importarDadosLocais,
        descartarDadosLocais,
      }}
    >
      {children}
    </FinancasContext.Provider>
  );
}

export default FinancasProvider;
