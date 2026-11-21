import { useRef } from "react";
import Icon from "./Icon";
import "./Tabs.css";

export default function Tabs({ itens, ativa, onChange, rotulo = "Seções" }) {
  const botoes = useRef([]);

  const aoTeclar = (evento, indice) => {
    let destino = null;

    if (evento.key === "ArrowRight") {
      destino = (indice + 1) % itens.length;
    } else if (evento.key === "ArrowLeft") {
      destino = (indice - 1 + itens.length) % itens.length;
    } else if (evento.key === "Home") {
      destino = 0;
    } else if (evento.key === "End") {
      destino = itens.length - 1;
    }

    if (destino === null) return;

    evento.preventDefault();
    onChange(itens[destino].id);
    botoes.current[destino]?.focus();
  };

  return (
    <div className="tabs" role="tablist" aria-label={rotulo}>
      {itens.map((item, indice) => {
        const selecionada = item.id === ativa;

        return (
          <button
            key={item.id}
            ref={(elemento) => {
              botoes.current[indice] = elemento;
            }}
            type="button"
            role="tab"
            id={`aba-${item.id}`}
            aria-selected={selecionada}
            aria-controls={`painel-${item.id}`}
            tabIndex={selecionada ? 0 : -1}
            className={`tabs__item ${selecionada ? "tabs__item--ativa" : ""}`}
            onClick={() => onChange(item.id)}
            onKeyDown={(evento) => aoTeclar(evento, indice)}
          >
            <Icon name={item.icone} size={18} />
            <span>{item.rotulo}</span>
          </button>
        );
      })}
    </div>
  );
}
