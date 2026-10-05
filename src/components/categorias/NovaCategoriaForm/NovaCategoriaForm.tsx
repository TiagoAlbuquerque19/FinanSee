import { useState } from "react";
import "./NovaCategoriaForm.css";

interface NovaCategoriaFormProps {
  categoriasExistentes: string[];
  onCriar: (nome: string) => void;
}

function NovaCategoriaForm({
  categoriasExistentes,
  onCriar,
}: NovaCategoriaFormProps) {
  // O texto digitado só interessa a este formulário, então fica aqui dentro
  const [novaCategoria, setNovaCategoria] = useState("");

  function criarCategoria() {
    const nome = novaCategoria.trim();

    if (nome === "") {
      alert("Digite o nome da categoria.");
      return;
    }

    if (categoriasExistentes.includes(nome)) {
      alert("Essa categoria já existe.");
      return;
    }

    onCriar(nome);
    setNovaCategoria("");
  }

  return (
    <div className="painel">
      <h3>Nova categoria de despesa</h3>
      <form
        className="nova-categoria-linha"
        onSubmit={(evento) => {
          evento.preventDefault();
          criarCategoria();
        }}
      >
        <input
          type="text"
          placeholder="Ex.: Pets, Academia..."
          aria-label="Nome da nova categoria"
          value={novaCategoria}
          onChange={(evento) => setNovaCategoria(evento.target.value)}
        />
        <button type="submit" className="botao-secundario">
          Criar
        </button>
      </form>
    </div>
  );
}

export default NovaCategoriaForm;
