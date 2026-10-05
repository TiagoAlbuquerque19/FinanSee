import { Moon, Sun } from "lucide-react";
import { useTema } from "../../hooks/useTema";

function BotaoTema() {
  const { tema, alternarTema } = useTema();
  const textoBotao = tema === "claro" ? "Ativar tema escuro" : "Ativar tema claro";

  return (
    <button
      className="botao-secundario botao-icone"
      onClick={alternarTema}
      aria-label={textoBotao}
      title={textoBotao}
    >
      {/* Mostra a lua no tema claro e o sol no escuro */}
      {tema === "claro" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}

export default BotaoTema;
