import { useState } from "react";

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
    <div>
      <h3>Nova categoria de despesa</h3>
      <input
        type="text"
        placeholder="Ex.: Pets, Academia..."
        value={novaCategoria}
        onChange={(evento) => setNovaCategoria(evento.target.value)}
      />
      <button onClick={criarCategoria}>Criar categoria</button>
    </div>
  );
}

export default NovaCategoriaForm;
