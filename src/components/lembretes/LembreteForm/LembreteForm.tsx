import { useState } from "react";
import type { Lembrete } from "../../../types/lembrete";
import { hoje } from "../../../utils/datas";
import "./LembreteForm.css";

interface LembreteFormProps {
  onCriar: (lembrete: Lembrete) => void;
}

function LembreteForm({ onCriar }: LembreteFormProps) {
  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [vencimento, setVencimento] = useState(hoje());
  const [recorrente, setRecorrente] = useState(true);

  function criarLembrete() {
    if (titulo.trim() === "" || vencimento === "") {
      alert("Preencha o nome da conta e a data de vencimento.");
      return;
    }

    // Valor vazio vira null (opcional); preenchido precisa ser maior que zero
    const valorNumerico = valor === "" ? null : Number(valor);

    if (valorNumerico !== null && valorNumerico <= 0) {
      alert("O valor precisa ser maior que zero (ou deixe em branco).");
      return;
    }

    onCriar({
      id: crypto.randomUUID(),
      titulo: titulo.trim(),
      valor: valorNumerico,
      vencimento,
      recorrente,
      pagamentos: [],
    });

    setTitulo("");
    setValor("");
  }

  return (
    <form
      className="painel lembrete-form"
      onSubmit={(evento) => {
        evento.preventDefault();
        criarLembrete();
      }}
    >
      <h3>Novo lembrete</h3>

      <label className="campo lembrete-form-titulo">
        <span>Conta</span>
        <input
          type="text"
          placeholder="Ex.: Aluguel, Internet, Cartão de crédito..."
          value={titulo}
          onChange={(evento) => setTitulo(evento.target.value)}
        />
      </label>

      <label className="campo">
        <span>Valor (opcional)</span>
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
        <span>Vencimento</span>
        <input
          type="date"
          value={vencimento}
          onChange={(evento) => setVencimento(evento.target.value)}
        />
      </label>

      {/* Checkbox: o valor fica em "checked", não em "value" */}
      <label className="lembrete-form-checkbox">
        <input
          type="checkbox"
          checked={recorrente}
          onChange={(evento) => setRecorrente(evento.target.checked)}
        />
        <span>Repete todo mês</span>
      </label>

      <button type="submit">Criar lembrete</button>
    </form>
  );
}

export default LembreteForm;
