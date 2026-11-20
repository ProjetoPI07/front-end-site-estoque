import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import "./ConfirmacaoBaixaTotal.css";

export default function ConfirmacaoBaixaTotal({
  cobranca,
  onCancelar,
  onConfirmar,
}) {
  if (!cobranca) return null;

  return (
    <Modal
      titulo="Confirmar baixa total"
      subtitulo="Registre o pagamento integral desta cobrança."
      onFechar={onCancelar}
      largura="520px"
      acoes={
        <>
          <Button variante="secundaria" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button variante="primaria" onClick={onConfirmar}>
            Confirmar baixa total
          </Button>
        </>
      }
    >
      <div className="confirmacao-baixa">
        <span className="confirmacao-baixa__icone" aria-hidden="true">
          <Icon name="card" size={24} />
        </span>

        <p className="confirmacao-baixa__texto">
          Você está dando baixa total na cobrança de{" "}
          <strong>{cobranca.cliente}</strong>.
        </p>

        <div className="confirmacao-baixa__resumo">
          <span>Parcelas</span>
          <strong>
            {cobranca.parcelasPagas} de {cobranca.parcelas} pagas
          </strong>
        </div>

        <p className="confirmacao-baixa__nota">
          Todas as parcelas serão marcadas como pagas. O registro permanece no
          histórico e continua visível na lista de cobranças.
        </p>
      </div>
    </Modal>
  );
}
