import { useState } from "react";
import { Info } from "lucide-react";
import type { ConfiguracaoCdi } from "../../../types/investimento";
import { formatarData, hoje } from "../../../utils/datas";
import "./PainelCdi.css";

interface PainelCdiProps {
  cdi: ConfiguracaoCdi;
  onSalvar: (cdiAnual: number) => void;
}

// Diferença em dias entre uma data "AAAA-MM-DD" e hoje
function diasDesde(data: string): number {
  const umDia = 24 * 60 * 60 * 1000;
  const inicio = new Date(`${data}T00:00:00`).getTime();
  const fim = new Date(`${hoje()}T00:00:00`).getTime();

  return Math.round((fim - inicio) / umDia);
}

function PainelCdi({ cdi, onSalvar }: PainelCdiProps) {
  const [valor, setValor] = useState(
    cdi.cdiAnual === null ? "" : String(cdi.cdiAnual),
  );

  // O CDI muda quando o Banco Central muda a Selic; 30 dias é um bom lembrete
  const desatualizado =
    cdi.atualizadoEm !== null && diasDesde(cdi.atualizadoEm) > 30;

  function salvar() {
    const numero = Number(valor.replace(",", "."));

    if (!(numero > 0 && numero < 100)) {
      alert("Digite o CDI ao ano, por exemplo 14.9");
      return;
    }

    onSalvar(numero);
  }

  return (
    <section className="painel painel-cdi">
      <div className="painel-cdi-texto">
        <h3>CDI (% ao ano)</h3>
        {cdi.cdiAnual === null ? (
          <p className="painel-cdi-aviso">
            Informe o CDI para ver quanto seus cofrinhos rendem por dia.
          </p>
        ) : (
          <p className={desatualizado ? "painel-cdi-aviso" : "texto-vazio"}>
            {cdi.cdiAnual.toLocaleString("pt-BR")}% ao ano · atualizado em{" "}
            {formatarData(cdi.atualizadoEm ?? hoje())}
            {desatualizado && " · confira se mudou"}
          </p>
        )}
        <p className="painel-cdi-dica">
          <Info size={14} aria-hidden="true" />
          Pesquise “CDI hoje” no Google e use a taxa anual. Ele muda quando o
          Banco Central mexe na Selic.
        </p>
      </div>

      <form
        className="painel-cdi-form"
        onSubmit={(evento) => {
          evento.preventDefault();
          salvar();
        }}
      >
        <input
          type="text"
          inputMode="decimal"
          placeholder="Ex.: 14,9"
          aria-label="CDI ao ano, em %"
          value={valor}
          onChange={(evento) => setValor(evento.target.value)}
        />
        <button type="submit">Salvar</button>
      </form>
    </section>
  );
}

export default PainelCdi;
