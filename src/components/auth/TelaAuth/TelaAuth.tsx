import type { ReactNode } from "react";
import "./TelaAuth.css";

interface TelaAuthProps {
  titulo: string;
  subtitulo: string;
  children: ReactNode;
}

// A "moldura" das telas de entrar e de cadastrar: um cartão no meio da tela
function TelaAuth({ titulo, subtitulo, children }: TelaAuthProps) {
  return (
    <main className="tela-auth">
      <div className="tela-auth-cartao painel">
        <div className="tela-auth-marca">
          <span className="logo">F</span>
          <strong>FinanSee</strong>
        </div>
        <h1>{titulo}</h1>
        <p className="tela-auth-subtitulo">{subtitulo}</p>
        {children}
      </div>
    </main>
  );
}

export default TelaAuth;
