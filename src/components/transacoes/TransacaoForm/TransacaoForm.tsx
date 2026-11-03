import { useState } from "react";
import type { Transacao, TipoTransacao } from "../../../types/transacao";
import type {
  Investimento,
  MovimentoInvestimento,
} from "../../../types/investimento";
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
  // Opcional: com estes dois, o Tipo ganha a opção "Investimento", que
  // guarda o valor num cofrinho (não é despesa)
  investimentos?: Investimento[];
  onInvestir?: (movimento: MovimentoInvestimento) => void;
}

// No formulário, além de despesa e receita, existe "investimento".
// Ele não é salvo como transação, e sim como um aporte no cofrinho
type TipoDoFormulario = TipoTransacao | "investimento";

function TransacaoForm({
  categoriasDespesa,
  onAdicionar,
  transacaoInicial,
  onCancelar,
  investimentos,
  onInvestir,
}: TransacaoFormProps) {
  const editando = transacaoInicial !== undefined;

  // Estes estados só servem para o formulário, então ficam aqui dentro.
  // Editando, cada campo começa com o valor da transação; senão, vazio
  const [descricao, setDescricao] = useState(transacaoInicial?.descricao ?? "");
  const [valor, setValor] = useState(
    transacaoInicial ? String(transacaoInicial.valor) : "",
  );
  const [tipo, setTipo] = useState<TipoDoFormulario>(
    transacaoInicial?.tipo ?? "despesa",
  );
  const [cofrinhoId, setCofrinhoId] = useState(investimentos?.[0]?.id ?? "");

  // A opção "Investimento" só aparece se quem usa o formulário passou os
  // cofrinhos. Na edição, ela converte a transação num aporte
  const podeInvestir = investimentos !== undefined && onInvestir !== undefined;
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

  function trocarTipo(novoTipo: TipoDoFormulario) {
    setTipo(novoTipo);

    if (novoTipo === "investimento") {
      // Se o cofrinho escolhido não existe mais, pega o primeiro da lista
      const existe = investimentos?.some((item) => item.id === cofrinhoId);
      if (!existe) {
        setCofrinhoId(investimentos?.[0]?.id ?? "");
      }
      return;
    }

    // Cada tipo tem sua lista, então volta para a primeira categoria dela
    if (novoTipo === "despesa") {
      setCategoria(categoriasDespesa[0]);
    } else {
      setCategoria(categoriasReceita[0]);
    }
  }

  function investir() {
    const valorNumerico = Number(valor);

    if (cofrinhoId === "") {
      alert("Crie um cofrinho na página Investimentos primeiro.");
      return;
    }

    if (!(valorNumerico > 0) || data === "") {
      alert("Preencha a data e um valor maior que zero.");
      return;
    }

    onInvestir?.({
      id: crypto.randomUUID(),
      investimentoId: cofrinhoId,
      tipo: "aporte",
      valor: valorNumerico,
      data,
    });
    setValor("");
  }

  function adicionarTransacao() {
    // Investimento segue outro caminho: vira um aporte no cofrinho
    if (tipo === "investimento") {
      investir();
      return;
    }

    const valorNumerico = Number(valor);

    if (descricao.trim() === "" || valorNumerico <= 0 || data === "") {
      alert("Preencha a descrição, a data e um valor maior que zero.");
      return;
    }

    const novaTransacao: Transacao = {
      // Editando, mantém o mesmo id: é assim que o banco sabe qual atualizar
      id: transacaoInicial?.id ?? crypto.randomUUID(),
      // Ao editar, mantém a hora do lançamento (e a posição na lista)
      criadoEm: transacaoInicial?.criadoEm,
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

      {/* O <label> em volta liga o texto ao campo: clicar no texto foca o campo.
          Investimento não precisa de descrição: o nome é o do cofrinho */}
      {tipo !== "investimento" && (
        <label className="campo campo-inteiro">
          <span>Descrição</span>
          <input
            type="text"
            placeholder="Ex.: Mercado, Uber, Salário..."
            value={descricao}
            onChange={(evento) => setDescricao(evento.target.value)}
          />
        </label>
      )}

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
            trocarTipo(evento.target.value as TipoDoFormulario)
          }
        >
          <option value="despesa">Despesa</option>
          <option value="receita">Receita</option>
          {podeInvestir && (
            <option value="investimento">Investimento (cofrinho)</option>
          )}
        </select>
      </label>

      {tipo === "investimento" ? (
        <label className="campo">
          <span>Cofrinho</span>
          {investimentos && investimentos.length > 0 ? (
            <select
              value={cofrinhoId}
              onChange={(evento) => setCofrinhoId(evento.target.value)}
            >
              {investimentos.map((investimento) => (
                <option key={investimento.id} value={investimento.id}>
                  {investimento.nome}
                </option>
              ))}
            </select>
          ) : (
            <span className="transacao-form-aviso">
              Nenhum cofrinho. Crie um em Investimentos.
            </span>
          )}
        </label>
      ) : (
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
      )}

      {tipo === "investimento" && (
        <p className="campo-inteiro transacao-form-dica">
          {editando
            ? "Esta transação será trocada por um aporte no cofrinho, com a mesma data e o mesmo valor."
            : "Vai para o cofrinho: sai do saldo disponível, mas não conta como despesa."}
        </p>
      )}

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
          {tipo === "investimento"
            ? "Guardar no cofrinho"
            : editando
              ? "Salvar alterações"
              : "Adicionar transação"}
        </button>
      </div>
    </form>
  );
}

export default TransacaoForm;
