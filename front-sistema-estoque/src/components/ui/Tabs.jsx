import Icon from "./Icon";
import "./Tabs.css";

export default function Tabs({ itens, ativa, onChange, rotulo = "Seções" }) {
  return (
    <div className="tabs" role="tablist" aria-label={rotulo}>
      {itens.map((item) => {
        const selecionada = item.id === ativa;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selecionada}
            className={`tabs__item ${selecionada ? "tabs__item--ativa" : ""}`}
            onClick={() => onChange(item.id)}
          >
            <Icon name={item.icone} size={18} />
            <span>{item.rotulo}</span>
          </button>
        );
      })}
    </div>
  );
}
