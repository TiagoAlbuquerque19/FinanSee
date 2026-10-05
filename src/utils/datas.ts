// Coloca um zero na frente quando o número tem só um dígito: 5 vira "05"
function doisDigitos(numero: number): string {
  return String(numero).padStart(2, "0");
}

// Data de hoje no formato "AAAA-MM-DD", o mesmo que o <input type="date"> usa
export function hoje(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = doisDigitos(agora.getMonth() + 1);
  const dia = doisDigitos(agora.getDate());

  return `${ano}-${mes}-${dia}`;
}

// "2026-10-05" vira "05/10/2026"
export function formatarData(data: string): string {
  const [ano, mes, dia] = data.slice(0, 10).split("-");

  return `${dia}/${mes}/${ano}`;
}

// Mês de hoje no formato "AAAA-MM"
export function mesAtual(): string {
  return hoje().slice(0, 7);
}

// Anda para frente ou para trás no calendário:
// mudarMes("2026-01", -1) vira "2025-12"
export function mudarMes(mes: string, quantidade: number): string {
  const [ano, numeroMes] = mes.split("-").map(Number);

  // O new Date ajusta sozinho a virada de ano (mês 13 vira janeiro do ano seguinte)
  const novaData = new Date(ano, numeroMes - 1 + quantidade, 1);

  return `${novaData.getFullYear()}-${doisDigitos(novaData.getMonth() + 1)}`;
}

// "2026-10" vira "outubro de 2026"
export function formatarMes(mes: string): string {
  const [ano, numeroMes] = mes.split("-").map(Number);
  const data = new Date(ano, numeroMes - 1, 1);

  return data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}
