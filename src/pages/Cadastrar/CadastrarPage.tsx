import { useState } from "react";
import { Link } from "react-router";
import TelaAuth from "../../components/auth/TelaAuth/TelaAuth";
import { useAuth } from "../../hooks/useAuth";

function CadastrarPage() {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    setErro(null);
    setAviso(null);

    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setEnviando(true);

    const resultado = await cadastrar(nome.trim(), email.trim(), senha);

    setEnviando(false);

    if (resultado.erro) {
      setErro(resultado.erro);
      return;
    }

    // Se o Supabase pedir confirmação, avisamos; senão, já entra sozinho
    if (resultado.precisaConfirmar) {
      setAviso(
        "Conta criada! Enviamos um e-mail de confirmação. Clique no link e depois entre.",
      );
    }
  }

  return (
    <TelaAuth
      titulo="Criar conta"
      subtitulo="Organize suas finanças em poucos minutos."
    >
      <form
        className="form-auth"
        onSubmit={(evento) => {
          evento.preventDefault();
          enviar();
        }}
      >
        <label className="campo">
          <span>Seu nome</span>
          <input
            type="text"
            autoComplete="given-name"
            required
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
          />
        </label>

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
          <span>Senha (mínimo 6 caracteres)</span>
          <input
            type="password"
            autoComplete="new-password"
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
        {aviso && (
          <p className="form-auth-sucesso" role="status">
            {aviso}
          </p>
        )}

        <button type="submit" disabled={enviando}>
          {enviando ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="tela-auth-rodape">
        Já tem conta?{" "}
        <Link to="/entrar" className="link">
          Entrar
        </Link>
      </p>
    </TelaAuth>
  );
}

export default CadastrarPage;
