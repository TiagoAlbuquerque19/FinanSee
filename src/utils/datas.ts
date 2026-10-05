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
