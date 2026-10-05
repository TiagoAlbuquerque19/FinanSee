import { useState } from "react";
import type { Meta } from "../../../types/meta";
import "./MetaForm.css";

interface MetaFormProps {
  onCriar: (meta: Meta) => void;
}

function MetaForm({ onCriar }: MetaFormProps) {
  const [nome, setNome] = useState("");
  const [valorAlvo, setValorAlvo] = useState("");
  const [prazo, setPrazo] = useState("");

  function criarMeta() {
    const valorNumerico = Number(valorAlvo);

    if (nome.trim() === "" || valorNumerico <= 0) {
      alert("Preencha o nome e um valor maior que zero.");
      return;
    }

    onCriar({
      id: crypto.randomUUID(),
      nome: nome.trim(),
      valorAlvo: valorNumerico,
      valorGuardado: 0,
      prazo,
    });

    setNome("");
    setValorAlvo("");
    setPrazo("");
  }

  return (
    <form
      className="painel meta-form"
      onSubmit={(evento) => {
        evento.preventDefault();
        criarMeta();
      }}
    >
      <h3>Nova meta</h3>

      <label className="campo meta-form-nome">
        <span>Nome</span>
        <input
          type="text"
          placeholder="Ex.: Viagem, Reserva de emergência..."
          value={nome}
          onChange={(evento) => setNome(evento.target.value)}
        />
      </label>

      <label className="campo">
        <span>Quanto quer juntar (R$)</span>
        <input
          type="number"
          placeholder="0,00"
          min="0"
          step="0.01"
          value={valorAlvo}
          onChange={(evento) => setValorAlvo(evento.target.value)}
        />
      </label>

      <label className="campo">
        <span>Prazo (opcional)</span>
        <input
          type="date"
          value={prazo}
          onChange={(evento) => setPrazo(evento.target.value)}
        />
      </label>

      <button type="submit">Criar meta</button>
    </form>
  );
}

export default MetaForm;
