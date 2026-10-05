import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { AuthContext } from "./AuthContext";

// Traduz as mensagens de erro mais comuns do Supabase
function traduzirErro(mensagem: string): string {
  if (mensagem.includes("Invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }

  if (mensagem.includes("User already registered")) {
    return "Já existe uma conta com este e-mail.";
  }

  if (mensagem.includes("Password should be at least")) {
    return "A senha precisa ter pelo menos 6 caracteres.";
  }

  if (mensagem.includes("Email not confirmed")) {
    return "Confirme seu e-mail antes de entrar (veja sua caixa de entrada).";
  }

  if (mensagem.includes("rate limit")) {
    return "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.";
  }

  return `Algo deu errado: ${mensagem}`;
}

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // 1. Ao abrir o site, pergunta ao Supabase se já existe uma sessão salva
    supabase.auth.getSession().then(({ data }) => {
      setUsuario(data.session?.user ?? null);
      setCarregando(false);
    });

    // 2. Fica "escutando" quando alguém entra ou sai
    const { data } = supabase.auth.onAuthStateChange((_evento, sessao) => {
      setUsuario(sessao?.user ?? null);
    });

    // 3. Quando o componente sair da tela, para de escutar
    return () => data.subscription.unsubscribe();
  }, []);

  async function entrar(email: string, senha: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    return error ? traduzirErro(error.message) : null;
  }

  async function cadastrar(nome: string, email: string, senha: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      // Dados extras do usuário ficam em "user_metadata"
      options: { data: { nome } },
    });

    if (error) {
      return { erro: traduzirErro(error.message), precisaConfirmar: false };
    }

    // Sem sessão = o Supabase está esperando a confirmação por e-mail
    return { erro: null, precisaConfirmar: data.session === null };
  }

  async function sair() {
    await supabase.auth.signOut();
  }

  // O nome digitado no cadastro; se não tiver, a parte do e-mail antes do @
  const nome: string =
    usuario?.user_metadata?.nome ?? usuario?.email?.split("@")[0] ?? "";

  return (
    <AuthContext.Provider
      value={{ usuario, carregando, nome, entrar, cadastrar, sair }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
