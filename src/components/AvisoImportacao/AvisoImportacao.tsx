import { useState } from "react";
import { CloudUpload } from "lucide-react";
import { useFinancas } from "../../hooks/useFinancas";
import "./AvisoImportacao.css";

// Faixa no topo oferecendo levar para a conta os dados que estavam
// salvos só neste navegador (de antes de existir login)
function AvisoImportacao() {
  const { quantidadeDadosLocais, importarDadosLocais, descartarDadosLocais } =
    useFinancas();
  const [importando, setImportando] = useState(false);

  if (quantidadeDadosLocais === 0) {
    return null;
  }

  async function importar() {
    setImportando(true);
    await importarDadosLocais();
    setImportando(false);
  }

  function descartar() {
    const confirmou = window.confirm(
      "Apagar os dados antigos deste navegador sem importar? Isso não pode ser desfeito.",
    );

    if (confirmou) {
      descartarDadosLocais();
    }
  }

  return (
    <div className="aviso-importacao" role="status">
      <CloudUpload size={22} aria-hidden="true" />
      <p>
        Encontramos <strong>{quantidadeDadosLocais} item(ns)</strong> salvos só
        neste navegador, de antes do login. Quer levar para a sua conta?
      </p>
      <div className="aviso-importacao-botoes">
        <button onClick={importar} disabled={importando}>
          {importando ? "Importando..." : "Importar"}
        </button>
        <button className="botao-secundario" onClick={descartar}>
          Descartar
        </button>
      </div>
    </div>
  );
}

export default AvisoImportacao;
