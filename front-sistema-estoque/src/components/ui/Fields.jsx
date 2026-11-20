import { useId, useRef, useState } from "react";
import Icon from "./Icon";
import { dataIsoParaBr } from "../../utils/formatacao";
import { formatarDataDigitada } from "../../utils/mascaras";
import { dataBrParaIso } from "../../utils/validacao";
import "./Fields.css";

function Campo({
  id,
  label,
  erro,
  dica,
  className = "",
  children,
  rotuloOpcional,
}) {
  return (
    <div className={`campo ${erro ? "campo--erro" : ""} ${className}`.trim()}>
      {label ? (
        <label className="campo__rotulo" htmlFor={id}>
          {label}
          {rotuloOpcional ? (
            <span className="campo__opcional"> {rotuloOpcional}</span>
          ) : null}
        </label>
      ) : null}
      {children}
      {dica ? <p className="campo__dica">{dica}</p> : null}
    </div>
  );
}

function reposicionarCursor(input, textoFormatado, digitosAntes) {
  let posicao = textoFormatado.length;
  let contados = 0;

  if (digitosAntes === 0) {
    posicao = 0;
  } else {
    for (let i = 0; i < textoFormatado.length; i += 1) {
      if (/\d/.test(textoFormatado[i])) {
        contados += 1;
        if (contados === digitosAntes) {
          posicao = i + 1;
          break;
        }
      }
    }
  }

  input.setSelectionRange(posicao, posicao);
}

export function TextField({
  label,
  id,
  erro = false,
  dica,
  mask,
  icone,
  revelavel = false,
  className = "",
  containerClassName = "",
  value,
  onChange,
  ...props
}) {
  const idGerado = useId();
  const campoId = id || idGerado;
  const inputRef = useRef(null);
  const [revelado, setRevelado] = useState(false);

  const aoDigitar = (evento) => {
    const input = evento.target;
    const bruto = input.value;

    if (!mask) {
      onChange?.(bruto);
      return;
    }

    const cursor = input.selectionStart ?? bruto.length;
    const digitosAntes = bruto.slice(0, cursor).replace(/\D/g, "").length;
    const formatado = mask(bruto);

    onChange?.(formatado);

    if (formatado !== bruto) {
      requestAnimationFrame(() => {
        if (inputRef.current) {
          reposicionarCursor(inputRef.current, formatado, digitosAntes);
        }
      });
    }
  };

  const tipoFinal = revelavel ? (revelado ? "text" : "password") : props.type;

  return (
    <Campo
      id={campoId}
      label={label}
      erro={erro}
      dica={dica}
      className={containerClassName}
    >
      <div
        className={`campo__controle ${icone ? "campo__controle--com-icone" : ""} ${
          revelavel ? "campo__controle--com-acao" : ""
        }`.trim()}
      >
        {icone ? (
          <span className="campo__icone" aria-hidden="true">
            <Icon name={icone} size={20} />
          </span>
        ) : null}
        <input
          {...props}
          id={campoId}
          ref={inputRef}
          className={`campo__input ${className}`.trim()}
          value={value}
          onChange={aoDigitar}
          aria-invalid={erro || undefined}
          type={tipoFinal}
        />
        {revelavel ? (
          <button
            type="button"
            className="campo__acao"
            onClick={() => setRevelado((atual) => !atual)}
            aria-label={revelado ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={revelado}
          >
            <Icon name={revelado ? "eyeOff" : "eye"} size={20} />
          </button>
        ) : null}
      </div>
    </Campo>
  );
}

export function SelectField({
  label,
  id,
  erro = false,
  dica,
  placeholder,
  opcoes = [],
  className = "",
  containerClassName = "",
  value,
  onChange,
  children,
  ...props
}) {
  const idGerado = useId();
  const campoId = id || idGerado;

  return (
    <Campo
      id={campoId}
      label={label}
      erro={erro}
      dica={dica}
      className={containerClassName}
    >
      <div className="campo__controle campo__controle--select">
        <select
          {...props}
          id={campoId}
          className={`campo__input campo__select ${className}`.trim()}
          value={value}
          onChange={(evento) => onChange?.(evento.target.value)}
          aria-invalid={erro || undefined}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {opcoes.map((opcao) =>
            typeof opcao === "string" ? (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ) : (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.rotulo}
              </option>
            ),
          )}
          {children}
        </select>
        <span className="campo__seta" aria-hidden="true">
          <Icon name="chevronDown" size={18} />
        </span>
      </div>
    </Campo>
  );
}

export function TextArea({
  label,
  id,
  erro = false,
  dica,
  className = "",
  containerClassName = "",
  ...props
}) {
  const idGerado = useId();
  const campoId = id || idGerado;

  return (
    <Campo
      id={campoId}
      label={label}
      erro={erro}
      dica={dica}
      className={containerClassName}
    >
      <textarea
        {...props}
        id={campoId}
        className={`campo__input campo__textarea ${className}`.trim()}
        aria-invalid={erro || undefined}
      />
    </Campo>
  );
}

export function DateField({
  label,
  id,
  erro = false,
  dica,
  value = "",
  onChange,
  containerClassName = "",
}) {
  const idGerado = useId();
  const campoId = id || idGerado;
  const inputRef = useRef(null);
  const nativeRef = useRef(null);

  const aoDigitar = (evento) => {
    const input = evento.target;
    const bruto = input.value;
    const cursor = input.selectionStart ?? bruto.length;
    const digitosAntes = bruto.slice(0, cursor).replace(/\D/g, "").length;
    const formatado = formatarDataDigitada(bruto);
    onChange?.(formatado);

    if (formatado !== bruto) {
      requestAnimationFrame(() => {
        if (inputRef.current) {
          reposicionarCursor(inputRef.current, formatado, digitosAntes);
        }
      });
    }
  };

  const abrirCalendario = () => {
    const nativo = nativeRef.current;
    if (!nativo) return;
    if (typeof nativo.showPicker === "function") {
      try {
        nativo.showPicker();
        return;
      } catch {
        // Navegadores sem permissão para showPicker caem no foco padrão.
      }
    }
    nativo.focus();
    nativo.click();
  };

  return (
    <Campo
      id={campoId}
      label={label}
      erro={erro}
      dica={dica}
      className={containerClassName}
    >
      <div className="campo__controle campo__controle--com-acao">
        <input
          ref={inputRef}
          id={campoId}
          className="campo__input"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="dd/mm/aaaa"
          value={value}
          onChange={aoDigitar}
          aria-invalid={erro || undefined}
        />
        <input
          ref={nativeRef}
          className="campo__data-nativa"
          type="date"
          tabIndex={-1}
          aria-hidden="true"
          value={dataBrParaIso(value) || ""}
          onChange={(evento) => {
            onChange?.(dataIsoParaBr(evento.target.value));
          }}
        />
        <button
          type="button"
          className="campo__acao"
          onClick={abrirCalendario}
          aria-label="Abrir calendário"
        >
          <Icon name="calendar" size={20} />
        </button>
      </div>
    </Campo>
  );
}

export { Campo };
