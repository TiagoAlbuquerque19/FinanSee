import "./Header.css";
interface HeaderProps {
  nome: string;
}

function Header({ nome }: HeaderProps) {
  return (
    <header className="header">
      <div>
        <h1>FinanSee</h1>
        <span>Finanças Pessoais</span>
      </div>
      <div>
        <span>Olá, {nome} </span>
        <button>Perfil</button>
      </div>
    </header>
  );
}

export default Header;
