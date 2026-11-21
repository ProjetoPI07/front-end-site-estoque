import Card from "../ui/Card";
import { Badge } from "../ui/StatusPill";
import CobrancaCard from "./CobrancaCard";
import "./ListaCobrancas.css";

export default function ListaCobrancas({
  cobrancas,
  onBaixarParcela,
  onBaixaTotal,
}) {
  const total = cobrancas.length;

  return (
    <Card className="lista-cobrancas">
      <div className="lista-cobrancas__cabecalho">
        <div>
          <h2 className="lista-cobrancas__titulo">Cobranças registradas</h2>
          <p className="lista-cobrancas__subtitulo">
            Histórico completo de vendas e recebimentos.
          </p>
        </div>
        <Badge>
          {total} {total === 1 ? "registro" : "registros"}
        </Badge>
      </div>

      {total === 0 ? (
        <p className="lista-cobrancas__vazio">
          Nenhuma cobrança registrada até o momento.
        </p>
      ) : (
        <div className="lista-cobrancas__itens">
          {cobrancas.map((cobranca) => (
            <CobrancaCard
              key={cobranca.id}
              cobranca={cobranca}
              onBaixarParcela={onBaixarParcela}
              onBaixaTotal={onBaixaTotal}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
