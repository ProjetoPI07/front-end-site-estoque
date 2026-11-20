import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";
import "./Modal.css";

const FOCAVEIS =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({
  titulo,
  subtitulo,
  children,
  acoes,
  onFechar,
  largura = "560px",
  fecharAoClicarFora = true,
}) {
  const idTitulo = useId();
  const caixaRef = useRef(null);
  const fecharRef = useRef(onFechar);

  useEffect(() => {
    fecharRef.current = onFechar;
  }, [onFechar]);

  useEffect(() => {
    const elementoAnterior = document.activeElement;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const caixa = caixaRef.current;
    const focaveis = caixa ? Array.from(caixa.querySelectorAll(FOCAVEIS)) : [];
    if (focaveis.length > 0) {
      focaveis[0].focus();
    } else {
      caixa?.focus();
    }

    const aoTeclar = (evento) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        fecharRef.current?.();
        return;
      }

      if (evento.key !== "Tab" || !caixa) return;

      const itens = Array.from(caixa.querySelectorAll(FOCAVEIS)).filter(
        (item) => item.offsetParent !== null,
      );
      if (itens.length === 0) return;

      const primeiro = itens[0];
      const ultimo = itens[itens.length - 1];

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener("keydown", aoTeclar);

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = overflowAnterior;
      if (elementoAnterior instanceof HTMLElement) {
        elementoAnterior.focus();
      }
    };
  }, []);

  return createPortal(
    <div
      className="modal-overlay"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget && fecharAoClicarFora) {
          onFechar?.();
        }
      }}
    >
      <div
        ref={caixaRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        style={{ "--modal-largura": largura }}
      >
        <div className="modal__cabecalho">
          <div className="modal__titulos">
            <h2 className="modal__titulo" id={idTitulo}>
              {titulo}
            </h2>
            {subtitulo ? <p className="modal__subtitulo">{subtitulo}</p> : null}
          </div>
          <button
            type="button"
            className="modal__fechar"
            onClick={onFechar}
            aria-label="Fechar"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="modal__corpo">{children}</div>

        {acoes ? <div className="modal__acoes">{acoes}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
