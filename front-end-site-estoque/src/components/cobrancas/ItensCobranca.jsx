import Icon from "../ui/Icon";
import "./ItensCobranca.css";

export default function ItensCobranca({ itens, onRemover }) {
  if (itens.length === 0) return null;

  return (
    <ul className="itens-cobranca" aria-label="Peças adicionadas à cobrança">
      {itens.map((item) => (
        <li className="itens-cobranca__item" key={item.pecaId}>
          <span className="itens-cobranca__quantidade">{item.quantidade}x</span>
          <span className="itens-cobranca__nome">{item.nome}</span>
          <button
            type="button"
            className="itens-cobranca__remover"
            onClick={() => onRemover(item.pecaId)}
            aria-label={`Remover ${item.nome} da cobrança`}
          >
            <Icon name="trash" size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
}
