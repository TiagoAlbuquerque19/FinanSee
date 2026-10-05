import "./Header.css";

interface HeaderProps {
  nome: string;
}

function Header({ nome }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-marca">
        <span className="header-logo">F</span>
        <div>
          <h1>FinanSee</h1>
          <span className="header-subtitulo">Finanças pessoais</span>
        </div>
      </div>

      <div className="header-usuario">
        <span>Olá, {nome}</span>
        {/* A primeira letra do nome vira o "avatar" */}
        <span className="header-avatar">{nome[0]}</span>
      </div>
    </header>
  );
}

export default Header;
