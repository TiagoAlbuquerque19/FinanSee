import { useState } from "react";

type Tema = "claro" | "escuro";

// Lê o tema que o script do index.html já colocou no <html>
function temaAtual(): Tema {
  return document.documentElement.dataset.tema === "escuro"
    ? "escuro"
    : "claro";
}

export function useTema() {
  const [tema, setTema] = useState<Tema>(temaAtual);

  function alternarTema() {
    const novoTema = tema === "claro" ? "escuro" : "claro";

    setTema(novoTema);
    // Muda o atributo do <html>: o CSS troca as cores na hora
    document.documentElement.dataset.tema = novoTema;
    // Guarda a escolha para a próxima visita
    localStorage.setItem("tema", novoTema);
  }

  return { tema, alternarTema };
}
