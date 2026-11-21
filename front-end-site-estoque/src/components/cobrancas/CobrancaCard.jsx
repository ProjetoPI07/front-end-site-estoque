import StatusPill from "../ui/StatusPill";
import ProgressBar from "../ui/ProgressBar";
import Button from "../ui/Button";
import {
  rotuloCobranca,
  statusCobranca,
} from "../../utils/status";
import { dataIsoParaBr, formatarTelefoneExibicao } from "../../utils/formatacao";
import "./CobrancaCard.css";

export default function CobrancaCard({
  cobranca,
  onBaixarParcela,
  onBaixaTotal,
}) {
  const status = statusCobranca(cobranca);
  const pago = status === "pago";
  const progresso = (cobranca.parcelasPagas / cobranca.parcelas) * 100;
  const podeBaixarParcela =
    !pago &&
    cobranca.parcelas > 1 &&
    cobranca.parcelasPagas < cobranca.parcelas;

  return (
    <article className={`cobranca-card cobranca-card--${status}`}>
      <div className="cobranca-card__corpo">
        <div className="cobranca-card__topo">
          <div className="cobranca-card__cliente">
            <p className="cobranca-card__rotulo">Cliente</p>
            <h3 className="cobranca-card__nome">{cobranca.cliente}</h3>
            <p className="cobranca-card__contato">
              {cobranca.documento} · {formatarTelefoneExibicao(cobranca.telefone)}
            </p>
          </div>
          <StatusPill tipo={status}>{rotuloCobranca(cobranca)}</StatusPill>
        </div>

        <ul className="cobranca-card__itens">
          {cobranca.itens.map((item) => (
            <li
              className="cobranca-card__item"
              key={`${item.pecaId}-${item.nome}`}
            >
              <strong>{item.quantidade}x</strong> {item.nome}
            </li>
          ))}
        </ul>

        <div className="cobranca-card__info">
          <div>
            <span>Forma de venda</span>
            <strong>{cobranca.formaVenda}</strong>
          </div>
          <div>
            <span>Vencimento</span>
            <strong>{dataIsoParaBr(cobranca.vencimento)}</strong>
          </div>
        </div>

        <div className="cobranca-card__progresso">
          <div className="cobranca-card__progresso-topo">
            <span>Parcelas pagas</span>
            <strong>
              {cobranca.parcelasPagas} de {cobranca.parcelas}
            </strong>
          </div>
          <ProgressBar
            valor={progresso}
            tom={pago ? "pago" : "aberto"}
            rotulo={`Parcelas pagas de ${cobranca.cliente}`}
          />
        </div>
      </div>

      {pago ? (
        <p className="cobranca-card__historico">
          Pagamento concluído · mantido no histórico
        </p>
      ) : (
        <div className="cobranca-card__acoes">
          {podeBaixarParcela ? (
            <Button
              variante="secundaria"
              className="botao--compacto"
              onClick={() => onBaixarParcela?.(cobranca)}
            >
              Baixar parcela
            </Button>
          ) : null}
          <Button
            variante="primaria"
            className="botao--compacto"
            onClick={() => onBaixaTotal?.(cobranca)}
          >
            Baixa total
          </Button>
        </div>
      )}
    </article>
  );
}
