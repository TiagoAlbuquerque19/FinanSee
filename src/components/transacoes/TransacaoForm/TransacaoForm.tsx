import { useState } from "react";
import type { Transacao, TipoTransacao } from "../../../types/transacao";
import { categoriasReceita } from "../../../data/categorias";
import { hoje } from "../../../utils/datas";
import "./TransacaoForm.css";

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
  const [data, setData] = useState(hoje());

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

    if (descricao.trim() === "" || valorNumerico <= 0 || data === "") {
      alert("Preencha a descrição, a data e um valor maior que zero.");
      return;
    }

    const novaTransacao: Transacao = {
      id: crypto.randomUUID(),
      descricao: descricao.trim(),
      valor: valorNumerico,
      tipo,
      categoria,
      data,
    };

    onAdicionar(novaTransacao);
    setDescricao("");
    setValor("");
  }

  return (
    <div className="painel transacao-form">
      <h3>Nova transação</h3>

      {/* O <label> em volta liga o texto ao campo: clicar no texto foca o campo */}
      <label className="campo campo-inteiro">
        <span>Descrição</span>
        <input
          type="text"
          placeholder="Ex.: Mercado, Uber, Salário..."
          value={descricao}
          onChange={(evento) => setDescricao(evento.target.value)}
        />
      </label>

      <label className="campo">
        <span>Valor (R$)</span>
        <input
          type="number"
          placeholder="0,00"
          min="0"
          step="0.01"
          value={valor}
          onChange={(evento) => setValor(evento.target.value)}
        />
      </label>

      <label className="campo">
        <span>Data</span>
        <input
          type="date"
          value={data}
          onChange={(evento) => setData(evento.target.value)}
        />
      </label>

      <label className="campo">
        <span>Tipo</span>
        <select
          value={tipo}
          onChange={(evento) =>
            trocarTipo(evento.target.value as TipoTransacao)
          }
        >
          <option value="despesa">Despesa</option>
          <option value="receita">Receita</option>
        </select>
      </label>

      <label className="campo">
        <span>Categoria</span>
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
      </label>

      <button className="campo-inteiro" onClick={adicionarTransacao}>
        Adicionar transação
      </button>
    </div>
  );
}

export default TransacaoForm;
