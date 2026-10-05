import type { DadosLocais } from "../services/banco";
import type { Transacao } from "../types/transacao";
import type { Meta } from "../types/meta";
import type { Lembrete } from "../types/lembrete";

// Antes do login, o FinanSee salvava tudo no localStorage com estas chaves
const CHAVES = ["transacoes", "categoriasPersonalizadas", "metas", "lembretes"];

// Lê uma lista do localStorage; se não existir ou estiver quebrada, devolve []
function lerLista<T>(chave: string): T[] {
  try {
    const texto = localStorage.getItem(chave);
    const valor = texto === null ? [] : JSON.parse(texto);

    return Array.isArray(valor) ? valor : [];
  } catch {
    return [];
  }
}

// O banco exige ids no formato UUID. Dados muito antigos podem ter outro
// formato; nesse caso geramos um novo
function idValido(id: string): string {
  const formatoUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  return formatoUuid.test(id) ? id : crypto.randomUUID();
}

export function lerDadosLocais(): DadosLocais {
  const transacoes = lerLista<Transacao>("transacoes")
    .filter((transacao) => transacao.valor > 0 && transacao.data)
    .map((transacao) => ({
      ...transacao,
      id: idValido(transacao.id),
      categoria: transacao.categoria || "Outros",
    }));

  const metas = lerLista<Meta>("metas")
    .filter((meta) => meta.valorAlvo > 0)
    .map((meta) => ({ ...meta, id: idValido(meta.id) }));

  const lembretes = lerLista<Lembrete>("lembretes").map((lembrete) => ({
    ...lembrete,
    id: idValido(lembrete.id),
  }));

  return {
    transacoes,
    categorias: lerLista<string>("categoriasPersonalizadas"),
    metas,
    lembretes,
  };
}

export function contarDadosLocais(dados: DadosLocais): number {
  return (
    dados.transacoes.length +
    dados.categorias.length +
    dados.metas.length +
    dados.lembretes.length
  );
}

export function apagarDadosLocais() {
  for (const chave of CHAVES) {
    localStorage.removeItem(chave);
  }
}
