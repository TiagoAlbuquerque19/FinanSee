import { useState } from "react";
import { Link } from "react-router";
import TelaAuth from "../../components/auth/TelaAuth/TelaAuth";
import { useAuth } from "../../hooks/useAuth";

function EntrarPage() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // "async" porque precisa esperar a resposta do Supabase (await)
  async function enviar() {
    setErro(null);
    setEnviando(true);

    const mensagemDeErro = await entrar(email.trim(), senha);

    // Se deu certo, o AuthProvider percebe o login e a tela muda sozinha
    setErro(mensagemDeErro);
    setEnviando(false);
  }

  return (
    <TelaAuth titulo="Entrar" subtitulo="Que bom te ver de novo!">
      <form
        className="form-auth"
        onSubmit={(evento) => {
          evento.preventDefault();
          enviar();
        }}
      >
        <label className="campo">
          <span>E-mail</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />
        </label>

        <label className="campo">
          <span>Senha</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
          />
        </label>

        {erro && (
          <p className="form-auth-erro" role="alert">
            {erro}
          </p>
        )}

        <button type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="tela-auth-rodape">
        Ainda não tem conta?{" "}
        <Link to="/cadastrar" className="link">
          Criar conta
        </Link>
      </p>
    </TelaAuth>
  );
}

export default EntrarPage;
