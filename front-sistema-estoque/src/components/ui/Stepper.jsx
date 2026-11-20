import Icon from "./Icon";
import "./Stepper.css";

export default function Stepper({
  valor,
  onChange,
  min = 0,
  max = 9999,
  ordem = "padrao",
  rotulo = "Quantidade",
}) {
  const numero = Number(valor) || 0;

  const alterar = (delta) => {
    const proximo = Math.min(max, Math.max(min, numero + delta));
    onChange?.(proximo);
  };

  const aoDigitar = (evento) => {
    const digitos = evento.target.value.replace(/\D/g, "");
    if (!digitos) {
      onChange?.(min);
      return;
    }
    onChange?.(Math.min(max, Math.max(min, Number(digitos))));
  };

  const botaoMenos = (
    <button
      type="button"
      className="stepper__botao"
      onClick={() => alterar(-1)}
      disabled={numero <= min}
      aria-label={`Diminuir ${rotulo.toLowerCase()}`}
    >
      <Icon name="minus" size={17} strokeWidth={2} />
    </button>
  );

  const botaoMais = (
    <button
      type="button"
      className="stepper__botao"
      onClick={() => alterar(1)}
      disabled={numero >= max}
      aria-label={`Aumentar ${rotulo.toLowerCase()}`}
    >
      <Icon name="plus" size={17} strokeWidth={2} />
    </button>
  );

  return (
    <div className="stepper">
      {ordem === "aumento-primeiro" ? botaoMais : botaoMenos}
      <input
        className="stepper__valor"
        type="text"
        inputMode="numeric"
        value={numero}
        onChange={aoDigitar}
        aria-label={rotulo}
      />
      {ordem === "aumento-primeiro" ? botaoMenos : botaoMais}
    </div>
  );
}
