import "./Card.css";

export default function Card({ children, className = "", as: Tag = "section", ...props }) {
  return (
    <Tag className={`card ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}

export function PageHeader({ sobretitulo, titulo, subtitulo, children }) {
  return (
    <header className="page-header">
      <div className="page-header__texto">
        {sobretitulo ? <p className="page-header__sobretitulo">{sobretitulo}</p> : null}
        <h1 className="page-header__titulo">{titulo}</h1>
        {subtitulo ? <p className="page-header__subtitulo">{subtitulo}</p> : null}
      </div>
      {children ? <div className="page-header__acoes">{children}</div> : null}
    </header>
  );
}
