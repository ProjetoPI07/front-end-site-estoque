import "./Avatar.css";

export default function Avatar({ nome, tamanho = 36 }) {
  const iniciais = String(nome ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className="avatar"
      style={{ width: tamanho, height: tamanho, fontSize: Math.round(tamanho * 0.38) }}
      aria-hidden="true"
    >
      {iniciais || "MS"}
    </span>
  );
}
