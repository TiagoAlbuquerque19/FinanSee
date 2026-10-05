import { createClient } from "@supabase/supabase-js";

// As duas chaves vêm do arquivo .env.local (que NÃO vai para o GitHub).
// O Vite só entrega para o navegador as variáveis que começam com VITE_.
const url = import.meta.env.VITE_SUPABASE_URL;
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !chave) {
  throw new Error(
    "Faltam as chaves do Supabase. Crie o arquivo .env.local (veja o .env.example).",
  );
}

// O "cliente" é o objeto que conversa com o Supabase: login, banco, etc.
export const supabase = createClient(url, chave);
