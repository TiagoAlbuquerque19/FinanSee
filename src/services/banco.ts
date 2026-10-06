import { supabase } from "../lib/supabase";
import type { Transacao, TipoTransacao } from "../types/transacao";
import type { Meta } from "../types/meta";
import type { Lembrete } from "../types/lembrete";
import type {
  ConfiguracaoCdi,
  Investimento,
  MovimentoInvestimento,
  TipoMovimento,
} from "../types/investimento";

// =============================================================
// Toda a conversa com o banco de dados fica neste arquivo.
// No banco os nomes usam "snake_case" (valor_alvo); no app usamos
// "camelCase" (valorAlvo). As funções "de..." e "para..." convertem.
// =============================================================

// Se o Supabase devolver erro, transformamos num erro do JavaScript
function verificar(error: { message: string } | null) {
  if (error) {
    throw new Error(error.message);
  }
}

// Erro de "tabela não existe": acontece se o SQL dos investimentos
// (supabase/migracoes/002_investimentos.sql) ainda não foi rodado
function tabelaNaoExiste(error: { code?: string; message: string } | null) {
  return (
    error !== null &&
    (error.code === "PGRST205" ||
      error.code === "42P01" ||
      error.message.includes("Could not find the table"))
  );
}

// ---------- Formato das linhas no banco ----------

interface LinhaTransacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoria: string;
  data: string;
}

interface LinhaMeta {
  id: string;
  nome: string;
  valor_alvo: number;
  valor_guardado: number;
  prazo: string | null;
}

interface LinhaLembrete {
  id: string;
  titulo: string;
  valor: number | null;
  vencimento: string;
  recorrente: boolean;
  pagamentos: string[];
}

interface LinhaInvestimento {
  id: string;
  nome: string;
  banco: string;
  percentual_cdi: number;
}

interface LinhaMovimento {
  id: string;
  investimento_id: string;
  tipo: TipoMovimento;
  valor: number;
  data: string;
}

interface LinhaConfiguracao {
  cdi_anual: number | null;
  cdi_atualizado_em: string | null;
}

// ---------- Conversões banco → app ----------

function deLinhaTransacao(linha: LinhaTransacao): Transacao {
  return { ...linha, valor: Number(linha.valor) };
}

function deLinhaMeta(linha: LinhaMeta): Meta {
  return {
    id: linha.id,
    nome: linha.nome,
    valorAlvo: Number(linha.valor_alvo),
    valorGuardado: Number(linha.valor_guardado),
    prazo: linha.prazo ?? "",
  };
}

function deLinhaLembrete(linha: LinhaLembrete): Lembrete {
  return {
    ...linha,
    valor: linha.valor === null ? null : Number(linha.valor),
  };
}

function deLinhaInvestimento(linha: LinhaInvestimento): Investimento {
  return {
    id: linha.id,
    nome: linha.nome,
    banco: linha.banco,
    percentualCdi: Number(linha.percentual_cdi),
  };
}

function deLinhaMovimento(linha: LinhaMovimento): MovimentoInvestimento {
  return {
    id: linha.id,
    investimentoId: linha.investimento_id,
    tipo: linha.tipo,
    valor: Number(linha.valor),
    data: linha.data,
  };
}

// ---------- Conversões app → banco ----------

export function paraLinhaTransacao(transacao: Transacao): LinhaTransacao {
  return {
    id: transacao.id,
    descricao: transacao.descricao,
    valor: transacao.valor,
    tipo: transacao.tipo,
    categoria: transacao.categoria,
    // Garante só "AAAA-MM-DD" (dados antigos tinham hora junto)
    data: transacao.data.slice(0, 10),
  };
}

export function paraLinhaMeta(meta: Meta): LinhaMeta {
  return {
    id: meta.id,
    nome: meta.nome,
    valor_alvo: meta.valorAlvo,
    valor_guardado: meta.valorGuardado,
    // Prazo vazio vira null (sem prazo)
    prazo: meta.prazo === "" ? null : meta.prazo,
  };
}

export function paraLinhaLembrete(lembrete: Lembrete): LinhaLembrete {
  return { ...lembrete };
}

// ---------- Ler tudo de uma vez ----------

export async function buscarDados() {
  // Promise.all faz as 4 buscas ao mesmo tempo, em vez de uma depois da outra.
  // Não precisamos filtrar por usuário: o RLS do banco já só devolve os dados
  // de quem está logado.
  const [
    transacoes,
    categorias,
    metas,
    lembretes,
    investimentos,
    movimentos,
    configuracao,
  ] = await Promise.all([
    supabase.from("transacoes").select("*").order("data", { ascending: false }),
    supabase.from("categorias").select("nome").order("criado_em"),
    supabase.from("metas").select("*").order("criado_em"),
    supabase.from("lembretes").select("*").order("criado_em"),
    supabase.from("investimentos").select("*").order("criado_em"),
    supabase.from("movimentos_investimento").select("*").order("criado_em"),
    // maybeSingle: no máximo uma linha (ou nenhuma, se ainda não salvou)
    supabase
      .from("configuracoes")
      .select("cdi_anual, cdi_atualizado_em")
      .maybeSingle(),
  ]);

  verificar(transacoes.error);
  verificar(categorias.error);
  verificar(metas.error);
  verificar(lembretes.error);
  // Se as tabelas de investimentos ainda não existem, o resto do app
  // continua funcionando e a página de Investimentos avisa o que fazer
  const faltaMigracaoInvestimentos =
    tabelaNaoExiste(investimentos.error) ||
    tabelaNaoExiste(movimentos.error) ||
    tabelaNaoExiste(configuracao.error);

  if (!faltaMigracaoInvestimentos) {
    verificar(investimentos.error);
    verificar(movimentos.error);
    verificar(configuracao.error);
  }

  const linhaConfiguracao = configuracao.data as LinhaConfiguracao | null;

  return {
    transacoes: (transacoes.data as LinhaTransacao[]).map(deLinhaTransacao),
    categorias: (categorias.data as { nome: string }[]).map((c) => c.nome),
    metas: (metas.data as LinhaMeta[]).map(deLinhaMeta),
    lembretes: (lembretes.data as LinhaLembrete[]).map(deLinhaLembrete),
    faltaMigracaoInvestimentos,
    investimentos: ((investimentos.data ?? []) as LinhaInvestimento[]).map(
      deLinhaInvestimento,
    ),
    movimentos: ((movimentos.data ?? []) as LinhaMovimento[]).map(
      deLinhaMovimento,
    ),
    cdi: {
      cdiAnual:
        linhaConfiguracao?.cdi_anual == null
          ? null
          : Number(linhaConfiguracao.cdi_anual),
      atualizadoEm: linhaConfiguracao?.cdi_atualizado_em ?? null,
    } as ConfiguracaoCdi,
  };
}

// ---------- Transações ----------

export async function inserirTransacao(transacao: Transacao) {
  const { error } = await supabase
    .from("transacoes")
    .insert(paraLinhaTransacao(transacao));
  verificar(error);
}

export async function apagarTransacao(id: string) {
  const { error } = await supabase.from("transacoes").delete().eq("id", id);
  verificar(error);
}

// ---------- Categorias ----------

export async function inserirCategoria(nome: string) {
  const { error } = await supabase.from("categorias").insert({ nome });
  verificar(error);
}

export async function apagarCategoria(nome: string) {
  const { error } = await supabase.from("categorias").delete().eq("nome", nome);
  verificar(error);
}

// ---------- Metas ----------

export async function inserirMeta(meta: Meta) {
  const { error } = await supabase.from("metas").insert(paraLinhaMeta(meta));
  verificar(error);
}

export async function atualizarValorGuardado(
  id: string,
  valorGuardado: number,
) {
  const { error } = await supabase
    .from("metas")
    .update({ valor_guardado: valorGuardado })
    .eq("id", id);
  verificar(error);
}

export async function apagarMeta(id: string) {
  const { error } = await supabase.from("metas").delete().eq("id", id);
  verificar(error);
}

// ---------- Lembretes ----------

export async function inserirLembrete(lembrete: Lembrete) {
  const { error } = await supabase
    .from("lembretes")
    .insert(paraLinhaLembrete(lembrete));
  verificar(error);
}

export async function atualizarPagamentos(id: string, pagamentos: string[]) {
  const { error } = await supabase
    .from("lembretes")
    .update({ pagamentos })
    .eq("id", id);
  verificar(error);
}

export async function apagarLembrete(id: string) {
  const { error } = await supabase.from("lembretes").delete().eq("id", id);
  verificar(error);
}

// ---------- Investimentos ----------

export async function inserirInvestimento(investimento: Investimento) {
  const { error } = await supabase.from("investimentos").insert({
    id: investimento.id,
    nome: investimento.nome,
    banco: investimento.banco,
    percentual_cdi: investimento.percentualCdi,
  });
  verificar(error);
}

export async function atualizarPercentualCdi(id: string, percentual: number) {
  const { error } = await supabase
    .from("investimentos")
    .update({ percentual_cdi: percentual })
    .eq("id", id);
  verificar(error);
}

export async function apagarInvestimento(id: string) {
  // O histórico (movimentos) é apagado junto pelo "on delete cascade"
  const { error } = await supabase.from("investimentos").delete().eq("id", id);
  verificar(error);
}

export async function inserirMovimento(movimento: MovimentoInvestimento) {
  const { error } = await supabase.from("movimentos_investimento").insert({
    id: movimento.id,
    investimento_id: movimento.investimentoId,
    tipo: movimento.tipo,
    valor: movimento.valor,
    data: movimento.data,
  });
  verificar(error);
}

export async function apagarMovimento(id: string) {
  const { error } = await supabase
    .from("movimentos_investimento")
    .delete()
    .eq("id", id);
  verificar(error);
}

export async function salvarCdi(cdiAnual: number, data: string) {
  // upsert: cria a linha de configuração se não existir, ou atualiza
  const { error } = await supabase
    .from("configuracoes")
    .upsert(
      { cdi_anual: cdiAnual, cdi_atualizado_em: data },
      { onConflict: "user_id" },
    );
  verificar(error);
}

// ---------- Importar dados antigos (do localStorage) ----------

export interface DadosLocais {
  transacoes: Transacao[];
  categorias: string[];
  metas: Meta[];
  lembretes: Lembrete[];
}

// Envia tudo de uma vez. "upsert" com ignoreDuplicates: se o item já
// existir no banco (mesmo id), ele é pulado em vez de dar erro.
// Assim, importar duas vezes não duplica nada.
export async function importarDados(dados: DadosLocais) {
  if (dados.transacoes.length > 0) {
    const { error } = await supabase
      .from("transacoes")
      .upsert(dados.transacoes.map(paraLinhaTransacao), {
        onConflict: "id",
        ignoreDuplicates: true,
      });
    verificar(error);
  }

  if (dados.categorias.length > 0) {
    const { error } = await supabase.from("categorias").upsert(
      dados.categorias.map((nome) => ({ nome })),
      { onConflict: "user_id,nome", ignoreDuplicates: true },
    );
    verificar(error);
  }

  if (dados.metas.length > 0) {
    const { error } = await supabase
      .from("metas")
      .upsert(dados.metas.map(paraLinhaMeta), {
        onConflict: "id",
        ignoreDuplicates: true,
      });
    verificar(error);
  }

  if (dados.lembretes.length > 0) {
    const { error } = await supabase
      .from("lembretes")
      .upsert(dados.lembretes.map(paraLinhaLembrete), {
        onConflict: "id",
        ignoreDuplicates: true,
      });
    verificar(error);
  }
}
