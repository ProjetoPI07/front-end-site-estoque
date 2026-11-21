import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "./Layout";
import HelpButton from "./HelpButton";

export default function PageShell() {
  const [menuAberto, setMenuAberto] = useState(false);
  const botaoMenuRef = useRef(null);
  const menuAbertoAnterior = useRef(false);

  useEffect(() => {
    if (!menuAberto) return undefined;

    const aoTeclar = (evento) => {
      if (evento.key === "Escape") setMenuAberto(false);
    };

    document.addEventListener("keydown", aoTeclar);

    const foco = window.requestAnimationFrame(() => {
      const primeiro = document.querySelector(
        "#menu-lateral a, #menu-lateral button",
      );
      primeiro?.focus();
    });

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      window.cancelAnimationFrame(foco);
    };
  }, [menuAberto]);

  useEffect(() => {
    if (menuAbertoAnterior.current && !menuAberto) {
      botaoMenuRef.current?.focus();
    }
    menuAbertoAnterior.current = menuAberto;
  }, [menuAberto]);

  return (
    <div className="app-shell">
      <Sidebar aberto={menuAberto} onFechar={() => setMenuAberto(false)} />

      {menuAberto ? (
        <button
          type="button"
          className="app-shell__overlay"
          aria-label="Fechar menu de navegação"
          onClick={() => setMenuAberto(false)}
        />
      ) : null}

      <div className="app-shell__principal">
        <Header
          menuAberto={menuAberto}
          onAbrirMenu={() => setMenuAberto(true)}
          botaoMenuRef={botaoMenuRef}
        />
        <main className="app-conteudo">
          <Outlet />
        </main>
      </div>

      <HelpButton />
    </div>
  );
}
