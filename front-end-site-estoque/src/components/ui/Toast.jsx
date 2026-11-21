import Icon from "./Icon";
import "./Toast.css";

export default function Toast({ tipo = "erro", mensagem, onFechar }) {
  const sucesso = tipo === "sucesso";

  return (
    <div
      className={`toast toast--${sucesso ? "sucesso" : "erro"}`}
      role={sucesso ? "status" : "alert"}
      aria-live={sucesso ? "polite" : "assertive"}
      aria-atomic="true"
    >
      <span className="toast__icone" aria-hidden="true">
        <Icon name={sucesso ? "check" : "alert"} size={18} />
      </span>
      <p className="toast__mensagem">{mensagem}</p>
      <button
        type="button"
        className="toast__fechar"
        onClick={onFechar}
        aria-label="Fechar aviso"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}
