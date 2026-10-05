import { useState } from "react";
import type { Transacao, TipoTransacao } from "../../../types/transacao";
import { categoriasReceita } from "../../../data/categorias";

interface TransacaoFormProps {
  categoriasDespesa: string[];
  onAdicionar: (transacao: Transacao) => void;
}

function TransacaoForm({ categoriasDespesa, onAdicionar }: TransacaoFormProps) {
  // Estes estados só servem para o formulário, então ficam aqui dentro
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<TipoTransacao>("despesa");
  const [categoria, setCategoria] = useState(categoriasDespesa[0]);

  const categoriasDoTipo =
    tipo === "despesa" ? categoriasDespesa : categoriasReceita;

  function trocarTipo(novoTipo: TipoTransacao) {
    setTipo(novoTipo);

    // Cada tipo tem sua lista, então volta para a primeira categoria dela
    if (novoTipo === "despesa") {
      setCategoria(categoriasDespesa[0]);
    } else {
      setCategoria(categoriasReceita[0]);
    }
  }

  function adicionarTransacao() {
    const valorNumerico = Number(valor);

    if (descricao.trim() === "" || valorNumerico <= 0) {
      alert("Preencha a descrição e um valor maior que zero.");
      return;
    }

    const novaTransacao: Transacao = {
      id: crypto.randomUUID(),
      descricao: descricao.trim(),
      valor: valorNumerico,
      tipo,
      categoria,
      data: new Date().toISOString(),
    };

    onAdicionar(novaTransacao);
    setDescricao("");
    setValor("");
  }

  return (
    <div>
      <h3>Nova transação</h3>
      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(evento) => setDescricao(evento.target.value)}
      />
      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(evento) => setValor(evento.target.value)}
      />
      <select
        value={tipo}
        onChange={(evento) => trocarTipo(evento.target.value as TipoTransacao)}
      >
        <option value="despesa">Despesa</option>
        <option value="receita">Receita</option>
      </select>
      <select
        value={categoria}
        onChange={(evento) => setCategoria(evento.target.value)}
      >
        {categoriasDoTipo.map((nome) => (
          <option key={nome} value={nome}>
            {nome}
          </option>
        ))}
      </select>
      <button onClick={adicionarTransacao}>Adicionar transação</button>
    </div>
  );
}

export default TransacaoForm;
