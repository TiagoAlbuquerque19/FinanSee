import { supabase } from "../lib/supabase";
import type { Transacao, TipoTransacao } from "../types/transacao";
import type { Meta } from "../types/meta";
import type { Lembrete } from "../types/lembrete";

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
  const [transacoes, categorias, metas, lembretes] = await Promise.all([
    supabase.from("transacoes").select("*").order("data", { ascending: false }),
    supabase.from("categorias").select("nome").order("criado_em"),
    supabase.from("metas").select("*").order("criado_em"),
    supabase.from("lembretes").select("*").order("criado_em"),
  ]);

  verificar(transacoes.error);
  verificar(categorias.error);
  verificar(metas.error);
  verificar(lembretes.error);

  return {
    transacoes: (transacoes.data as LinhaTransacao[]).map(deLinhaTransacao),
    categorias: (categorias.data as { nome: string }[]).map((c) => c.nome),
    metas: (metas.data as LinhaMeta[]).map(deLinhaMeta),
    lembretes: (lembretes.data as LinhaLembrete[]).map(deLinhaLembrete),
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
