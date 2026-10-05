import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import "./MenuUsuario.css";

// Clicar no avatar abre um menu com o e-mail e o botão "Sair".
// <details> e <summary> são do próprio HTML: abrem e fecham sem useState
function MenuUsuario() {
  const { usuario, nome, sair } = useAuth();

  return (
    <details className="menu-usuario">
      <summary className="header-avatar" aria-label="Menu da conta">
        {nome[0]?.toUpperCase()}
      </summary>

      <div className="menu-usuario-caixa painel">
        <strong>{nome}</strong>
        <span>{usuario?.email}</span>
        <button className="botao-secundario" onClick={sair}>
          <LogOut size={16} aria-hidden="true" />
          Sair
        </button>
      </div>
    </details>
  );
}

export default MenuUsuario;
