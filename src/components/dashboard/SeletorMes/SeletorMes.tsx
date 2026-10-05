import { formatarMes, mesAtual, mudarMes } from "../../../utils/datas";

interface SeletorMesProps {
  mes: string;
  onMudar: (novoMes: string) => void;
}

function SeletorMes({ mes, onMudar }: SeletorMesProps) {
  return (
    <div>
      <button onClick={() => onMudar(mudarMes(mes, -1))}>◀ Anterior</button>
      <strong> {formatarMes(mes)} </strong>
      <button onClick={() => onMudar(mudarMes(mes, 1))}>Próximo ▶</button>
      {mes !== mesAtual() && (
        <button onClick={() => onMudar(mesAtual())}>Voltar para hoje</button>
      )}
    </div>
  );
}

export default SeletorMes;
