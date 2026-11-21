import "./ProgressBar.css";

export default function ProgressBar({ valor, tom = "aberto", rotulo }) {
  const percentual = Math.min(100, Math.max(0, Number(valor) || 0));

  return (
    <div
      className={`progresso progresso--${tom}`}
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={Math.round(percentual)}
      aria-label={rotulo}
    >
      <span className="progresso__preenchido" style={{ width: `${percentual}%` }} />
    </div>
  );
}
