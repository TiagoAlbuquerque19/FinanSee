import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// const { usuario, entrar, sair } = useAuth();
export function useAuth() {
  const contexto = useContext(AuthContext);

  if (contexto === null) {
    throw new Error("useAuth precisa estar dentro do AuthProvider");
  }

  return contexto;
}
