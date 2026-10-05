import {
  Briefcase,
  Car,
  ChartLine,
  Ellipsis,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  Laptop,
  Receipt,
  ShoppingBag,
  Tag,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TipoTransacao } from "../../../types/transacao";
import "./IconeCategoria.css";

// Ícone de cada categoria pré-definida.
// Record<string, LucideIcon> = "um objeto com textos como chave e ícones como valor"
const iconesPorCategoria: Record<string, LucideIcon> = {
  Alimentação: UtensilsCrossed,
  Transporte: Car,
  Moradia: House,
  Lazer: Gamepad2,
  Saúde: HeartPulse,
  Educação: GraduationCap,
  Compras: ShoppingBag,
  Contas: Receipt,
  Outros: Ellipsis,
  Salário: Briefcase,
  Freelance: Laptop,
  Investimentos: ChartLine,
  Presente: Gift,
};

interface IconeCategoriaProps {
  categoria: string;
  tipo: TipoTransacao;
}

function IconeCategoria({ categoria, tipo }: IconeCategoriaProps) {
  // Categorias criadas pelo usuário não estão no objeto, então usam a etiqueta
  const Icone = iconesPorCategoria[categoria] ?? Tag;

  return (
    <span className={`icone-categoria icone-categoria--${tipo}`}>
      <Icone size={18} aria-hidden="true" />
    </span>
  );
}

export default IconeCategoria;
