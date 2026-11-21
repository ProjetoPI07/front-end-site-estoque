import { useEffect, useState } from "react";
import { PageHeader } from "../../components/ui/Card";
import Tabs from "../../components/ui/Tabs";
import ListaCobrancas from "../../components/cobrancas/ListaCobrancas";
import FormCobranca from "../../components/cobrancas/FormCobranca";
import ConfirmacaoBaixaTotal from "../../components/cobrancas/ConfirmacaoBaixaTotal";
import { useDados } from "../../context/AppContext";
import "./Cobrancas.css";

const ABAS = [
  { id: "registradas", rotulo: "Cobranças registradas", icone: "card" },
  { id: "cadastro", rotulo: "Cadastrar cobrança", icone: "plus" },
];

export default function Cobrancas() {
  const { cobrancas, baixarParcela, baixarTotal } = useDados();
  const [aba, setAba] = useState("registradas");
  const [confirmacao, setConfirmacao] = useState(null);
  const [, setRelogio] = useState(0);

  useEffect(() => {
    const intervalo = window.setInterval(
      () => setRelogio((valor) => valor + 1),
      60000,
    );

    return () => window.clearInterval(intervalo);
  }, []);

  const confirmarBaixaTotal = () => {
    if (!confirmacao) return;
    baixarTotal(confirmacao.id);
    setConfirmacao(null);
  };

  return (
    <div className="cobrancas">
      <PageHeader
        sobretitulo="Gestão financeira"
        titulo="Cobranças"
        subtitulo="Cadastre vendas, acompanhe vencimentos e registre pagamentos."
      />

      <Tabs
        itens={ABAS}
        ativa={aba}
        onChange={setAba}
        rotulo="Visões de cobrança"
      />

      <div
        className="cobrancas__conteudo"
        role="tabpanel"
        id={`painel-${aba}`}
        aria-labelledby={`aba-${aba}`}
      >
        {aba === "registradas" ? (
          <ListaCobrancas
            cobrancas={cobrancas}
            onBaixarParcela={(cobranca) => baixarParcela(cobranca.id)}
            onBaixaTotal={setConfirmacao}
          />
        ) : (
          <FormCobranca onCadastrada={() => setAba("registradas")} />
        )}
      </div>

      {confirmacao ? (
        <ConfirmacaoBaixaTotal
          cobranca={confirmacao}
          onCancelar={() => setConfirmacao(null)}
          onConfirmar={confirmarBaixaTotal}
        />
      ) : null}
    </div>
  );
}
