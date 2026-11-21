import Icon from "./Icon";
import "./Button.css";

export default function Button({
  children,
  variante = "primaria",
  icone,
  iconePosicao = "direita",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`botao botao--${variante} ${className}`.trim()}
      {...props}
    >
      {icone && iconePosicao === "esquerda" ? (
        <Icon name={icone} size={19} className="botao__icone" />
      ) : null}
      <span className="botao__texto">{children}</span>
      {icone && iconePosicao === "direita" ? (
        <Icon name={icone} size={19} className="botao__icone" />
      ) : null}
    </button>
  );
}

export function IconButton({
  icone,
  rotulo,
  variante = "suave",
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`botao-icone botao-icone--${variante} ${className}`.trim()}
      aria-label={rotulo}
      title={rotulo}
      {...props}
    >
      <Icon name={icone} size={19} />
    </button>
  );
}
