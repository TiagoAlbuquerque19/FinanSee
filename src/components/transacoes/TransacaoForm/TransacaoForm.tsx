import { useState } from "react";
import type { Transacao, TipoTransacao } from "../../../types/transacao";
import { categoriasReceita } from "../../../data/categorias";
import { hoje } from "../../../utils/datas";
import "./TransacaoForm.css";

interface TransacaoFormProps {
  categoriasDespesa: string[];
  onAdicionar: (transacao: Transacao) => void;
  // Opcional: se vier, o formulário abre preenchido (modo edição)
  transacaoInicial?: Transacao;
  // Opcional: aparece um botão "Cancelar" (usado na janela de edição)
  onCancelar?: () => void;
}

function TransacaoForm({
  categoriasDespesa,
  onAdicionar,
  transacaoInicial,
  onCancelar,
}: TransacaoFormProps) {
  const editando = transacaoInicial !== undefined;

  // Estes estados só servem para o formulário, então ficam aqui dentro.
  // Editando, cada campo começa com o valor da transação; senão, vazio
  const [descricao, setDescricao] = useState(transacaoInicial?.descricao ?? "");
  const [valor, setValor] = useState(
    transacaoInicial ? String(transacaoInicial.valor) : "",
  );
  const [tipo, setTipo] = useState<TipoTransacao>(
    transacaoInicial?.tipo ?? "despesa",
  );
  const [categoria, setCategoria] = useState(
    transacaoInicial?.categoria ?? categoriasDespesa[0],
  );
  const [data, setData] = useState(
    transacaoInicial?.data.slice(0, 10) ?? hoje(),
  );

  const listaDoTipo =
    tipo === "despesa" ? categoriasDespesa : categoriasReceita;

  // Se a categoria atual não está na lista (ex.: uma categoria personalizada
  // que foi excluída), ela entra no fim para não sumir do select
  const categoriasDoTipo = listaDoTipo.includes(categoria)
    ? listaDoTipo
    : [...listaDoTipo, categoria];

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
      // Editando, mantém o mesmo id: é assim que o banco sabe qual atualizar
      id: transacaoInicial?.id ?? crypto.randomUUID(),
      descricao: descricao.trim(),
      valor: valorNumerico,
      tipo,
      categoria,
      data,
    };

    onAdicionar(novaTransacao);

    if (!editando) {
      setDescricao("");
      setValor("");
    }
  }

  return (
    <form
      className="painel transacao-form"
      onSubmit={(evento) => {
        // Sem isso, o navegador recarregaria a página ao enviar o formulário
        evento.preventDefault();
        adicionarTransacao();
      }}
    >
      <h3>{editando ? "Editar transação" : "Nova transação"}</h3>

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

      <div className="campo-inteiro transacao-form-botoes">
        {onCancelar && (
          <button
            type="button"
            className="botao-secundario"
            onClick={onCancelar}
          >
            Cancelar
          </button>
        )}
        <button type="submit">
          {editando ? "Salvar alterações" : "Adicionar transação"}
        </button>
      </div>
    </form>
  );
}

export default TransacaoForm;
