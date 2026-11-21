import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AppContext";
import Icon from "../ui/Icon";
import "./Layout.css";

const ITENS = [
  { para: "/estoque", rotulo: "Estoque", icone: "box" },
  { para: "/pecas/nova", rotulo: "Cadastrar peça", icone: "plus" },
  { para: "/pecas/editar", rotulo: "Editar peça", icone: "pencil" },
  { para: "/cobrancas", rotulo: "Cobranças", icone: "card" },
  { para: "/dashboard", rotulo: "Dashboard", icone: "chart" },
];

export function Sidebar({ aberto, onFechar }) {
  const { usuario, sair } = useAuth();
  const navegar = useNavigate();

  const encerrarSessao = () => {
    sair();
    navegar("/login", { replace: true });
  };

  return (
    <aside
      id="menu-lateral"
      className={`sidebar ${aberto ? "sidebar--aberta" : ""}`.trim()}
      aria-label="Navegação principal"
    >
      <div className="sidebar__marca">
        <span className="sidebar__logo">
          <img src="/brand/logo-mark-white.png" alt="" />
        </span>
        <span className="sidebar__nome">
          Constru
          <span className="sidebar__nome-menor">Móveis</span>
        </span>
      </div>

      <div className="sidebar__saudacao">
        <span>Olá,</span>
        <strong>{usuario?.nome ?? "Mariana Silva"}</strong>
      </div>

      <nav className="sidebar__nav">
        {ITENS.map((item) => (
          <NavLink
            key={item.para}
            to={item.para}
            className={({ isActive }) =>
              `sidebar__item ${isActive ? "sidebar__item--ativo" : ""}`.trim()
            }
            onClick={onFechar}
          >
            <Icon name={item.icone} size={21} />
            <span>{item.rotulo}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__rodape">
        <button type="button" className="sidebar__sair" onClick={encerrarSessao}>
          <Icon name="logout" size={20} />
          <span>Sair</span>
        </button>
        <span className="sidebar__versao">v1.0.0</span>
      </div>
    </aside>
  );
}

const TITULOS = {
  "/estoque": "Estoque",
  "/pecas/nova": "Cadastrar peça",
  "/pecas/editar": "Editar peça",
  "/cobrancas": "Cobranças",
  "/dashboard": "Dashboard",
};

export function Header({ onAbrirMenu, menuAberto = false, botaoMenuRef }) {
  const { usuario } = useAuth();
  const { pathname } = useLocation();

  return (
    <header className="cabecalho">
      <div className="cabecalho__esquerda">
        <button
          ref={botaoMenuRef}
          type="button"
          className="cabecalho__menu"
          onClick={onAbrirMenu}
          aria-label="Abrir menu de navegação"
          aria-expanded={menuAberto}
          aria-controls="menu-lateral"
        >
          <Icon name="menu" size={22} />
        </button>
        <nav className="breadcrumb" aria-label="Você está em">
          <span className="breadcrumb__inicio">Constru Móveis</span>
          <span className="breadcrumb__separador" aria-hidden="true">
            /
          </span>
          <span className="breadcrumb__atual">{TITULOS[pathname] ?? "Estoque"}</span>
        </nav>
      </div>

      <div className="cabecalho__direita">
        <button
          type="button"
          className="cabecalho__sino"
          aria-label="Notificações"
          title="Notificações"
        >
          <Icon name="bell" size={22} />
          <span className="cabecalho__indicador" aria-hidden="true" />
        </button>

        <div className="usuario">
          <span className="usuario__avatar" aria-hidden="true">
            MS
          </span>
          <span className="usuario__dados">
            <strong>{usuario?.nome ?? "Mariana Silva"}</strong>
            <small>{usuario?.perfil ?? "Administradora"}</small>
          </span>
        </div>
      </div>
    </header>
  );
}
