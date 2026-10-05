import { createContext } from "react";
import type { User } from "@supabase/supabase-js";

export interface AuthContextValor {
  usuario: User | null;
  // true enquanto o app ainda está descobrindo se há alguém logado
  carregando: boolean;
  nome: string;
  // As funções devolvem uma mensagem de erro, ou null se deu certo
  entrar: (email: string, senha: string) => Promise<string | null>;
  cadastrar: (
    nome: string,
    email: string,
    senha: string,
  ) => Promise<{ erro: string | null; precisaConfirmar: boolean }>;
  sair: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValor | null>(null);
