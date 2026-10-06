import { useState } from "react";
import type {
  Investimento,
  MovimentoInvestimento,
} from "../../../types/investimento";
import { bancos } from "../../../data/bancos";
import { hoje } from "../../../utils/datas";
import "./InvestimentoForm.css";

interface InvestimentoFormProps {
  // O valor inicial (opcional) vira o primeiro "saldo conferido" do
  // cofrinho: é dinheiro que já estava lá, então não conta como investido
  // no mês nem como rendimento
  onCriar: (
    investimento: Investimento,
    saldoInicial: MovimentoInvestimento | null,
  ) => void;
}

function InvestimentoForm({ onCriar }: InvestimentoFormProps) {
  const [nome, setNome] = useState("");
  const [banco, setBanco] = useState(bancos[0]);
  const [outroBanco, setOutroBanco] = useState("");
  const [percentual, setPercentual] = useState("100");
  const [valorInicial, setValorInicial] = useState("");
  const [data, setData] = useState(hoje());

  function criar() {
    const nomeDoBanco = banco === "Outro" ? outroBanco.trim() : banco;
    const percentualNumero = Number(percentual.replace(",", "."));
    const valorNumero = valorInicial === "" ? 0 : Number(valorInicial);

    if (nome.trim() === "" || nomeDoBanco === "") {
      alert("Preencha o nome do cofrinho e o banco.");
      return;
    }

    if (!(percentualNumero >= 0)) {
      alert("O % do CDI precisa ser um número, por exemplo 100.");
      return;
    }

    if (valorNumero < 0) {
      alert("O valor inicial não pode ser negativo.");
      return;
    }

    const investimento: Investimento = {
      id: crypto.randomUUID(),
      nome: nome.trim(),
      banco: nomeDoBanco,
      percentualCdi: percentualNumero,
    };

    const saldoInicial: MovimentoInvestimento | null =
      valorNumero > 0
        ? {
            id: crypto.randomUUID(),
            investimentoId: investimento.id,
            tipo: "saldo",
            valor: valorNumero,
            data,
          }
        : null;

    onCriar(investimento, saldoInicial);
    setNome("");
    setValorInicial("");
  }

  return (
    <form
      className="painel investimento-form"
      onSubmit={(evento) => {
        evento.preventDefault();
        criar();
      }}
    >
      <h3>Novo cofrinho</h3>

      <label className="campo">
        <span>Nome</span>
        <input
          type="text"
          placeholder="Ex.: Reserva de emergência"
          value={nome}
          onChange={(evento) => setNome(evento.target.value)}
        />
      </label>

      <label className="campo">
        <span>Banco</span>
        <select
          value={banco}
          onChange={(evento) => setBanco(evento.target.value)}
        >
          {bancos.map((nomeBanco) => (
            <option key={nomeBanco} value={nomeBanco}>
              {nomeBanco}
            </option>
          ))}
        </select>
      </label>

      {/* O campo do nome do banco só aparece se escolher "Outro" */}
      {banco === "Outro" && (
        <label className="campo">
          <span>Nome do banco</span>
          <input
            type="text"
            placeholder="Ex.: Banco XP"
            value={outroBanco}
            onChange={(evento) => setOutroBanco(evento.target.value)}
          />
        </label>
      )}

      <label className="campo">
        <span>Rende quanto % do CDI?</span>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Ex.: 100"
          value={percentual}
          onChange={(evento) => setPercentual(evento.target.value)}
        />
      </label>

      <label className="campo">
        <span>Quanto tem nele hoje (opcional)</span>
        <input
          type="number"
          placeholder="0,00"
          min="0"
          step="0.01"
          value={valorInicial}
          onChange={(evento) => setValorInicial(evento.target.value)}
        />
      </label>

      <label className="campo">
        <span>Data desse valor</span>
        <input
          type="date"
          value={data}
          onChange={(evento) => setData(evento.target.value)}
        />
      </label>

      <p className="investimento-form-dica">
        O % do CDI aparece no app do banco, na tela do cofrinho (ex.: “rende
        100% do CDI”).
      </p>

      <button type="submit">Criar cofrinho</button>
    </form>
  );
}

export default InvestimentoForm;
