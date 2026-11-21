import "./StatusPill.css";

const CLASSES = {
  estoque: "status-pill--estoque",
  baixo: "status-pill--baixo",
  critico: "status-pill--critico",
  aberta: "status-pill--aberta",
  vencendo: "status-pill--vencendo",
  vencida: "status-pill--vencida",
  pago: "status-pill--pago",
};

export default function StatusPill({ tipo, children }) {
  return (
    <span className={`status-pill ${CLASSES[tipo] || CLASSES.estoque}`}>
      {children}
    </span>
  );
}

export function Badge({ children, className = "" }) {
  return <span className={`badge ${className}`.trim()}>{children}</span>;
}
