import { useRef, useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import { DateField, SelectField, TextField } from "../ui/Fields";
import ItensCobranca from "./ItensCobranca";
import { useDados } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import {
  apenasDigitos,
  formatarDocumento,
  formatarTelefone,
} from "../../utils/mascaras";
import {
  dataBrParaIso,
  dataNaoAnteriorHoje,
  documentoValido,
  nomeValido,
  telefoneValido,
} from "../../utils/validacao";
import "./FormCobranca.css";

const FORMAS_DE_VENDA = ["Cartão", "Dinheiro", "Pix"];
const PARCELAS = Array.from({ length: 12 }, (_, indice) => ({
  valor: String(indice + 1),
  rotulo: `${indice + 1}x`,
}));

export default function FormCobranca({ onCadastrada }) {
  const { pecas, cadastrarCobranca } = useDados();
  const { mostrarToast } = useToast();
  const formularioRef = useRef(null);

  const [cliente, setCliente] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [pecaId, setPecaId] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [itens, setItens] = useState([]);
  const [formaVenda, setFormaVenda] = useState("");
  const [parcelas, setParcelas] = useState("1");
  const [dataLimite, setDataLimite] = useState("");
  const [erros, setErros] = useState({});
  const [erroItem, setErroItem] = useState("");

  const limparErro = (campo) => {
    setErros((atuais) => {
      if (!atuais[campo]) return atuais;
      const copia = { ...atuais };
      delete copia[campo];
      return copia;
    });
  };

  const focarPrimeiroErro = () => {
    requestAnimationFrame(() => {
      const campo = formularioRef.current?.querySelector('[aria-invalid="true"]');
      campo?.focus();
    });
  };

  const adicionarPeca = () => {
    const peca = pecas.find((item) => item.id === Number(pecaId));

    if (!peca) {
      setErroItem("Selecione uma peça para adicionar à cobrança.");
      return;
    }

    const quantidadeNumero = Number(quantidade);
    if (!Number.isInteger(quantidadeNumero) || quantidadeNumero < 1) {
      setErroItem("Informe uma quantidade inteira maior que zero.");
      return;
    }

    const existente = itens.find((item) => item.pecaId === peca.id);
    const soma = (existente?.quantidade ?? 0) + quantidadeNumero;

    if (soma > peca.quantidade) {
      setErroItem(
        `Quantidade indisponível. Há ${peca.quantidade} ${
          peca.quantidade === 1 ? "unidade" : "unidades"
        } desta peça em estoque.`,
      );
      return;
    }

    if (existente) {
      setItens((atuais) =>
        atuais.map((item) =>
          item.pecaId === peca.id
            ? { ...item, quantidade: item.quantidade + quantidadeNumero }
            : item,
        ),
      );
    } else {
      setItens((atuais) => [
        ...atuais,
        { pecaId: peca.id, nome: peca.nome, quantidade: quantidadeNumero },
      ]);
    }

    setPecaId("");
    setQuantidade("1");
    setErroItem("");
    limparErro("itens");
  };

  const removerPeca = (id) => {
    setItens((atuais) => atuais.filter((item) => item.pecaId !== id));
  };

  const enviar = (evento) => {
    evento.preventDefault();

    const vazios = {};
    if (!cliente.trim()) vazios.cliente = true;
    if (!documento) vazios.documento = true;
    if (!telefone) vazios.telefone = true;
    if (!formaVenda) vazios.formaVenda = true;
    if (!dataLimite) vazios.dataLimite = true;
    if (itens.length === 0) vazios.itens = true;

    if (Object.keys(vazios).length > 0) {
      setErros(vazios);
      mostrarToast("erro", "Preencha todos os dados da cobrança.");
      focarPrimeiroErro();
      return;
    }

    const invalidos = {};
    if (!nomeValido(cliente)) invalidos.cliente = true;
    if (!documentoValido(documento)) invalidos.documento = true;
    if (!telefoneValido(telefone)) invalidos.telefone = true;

    const vencimento = dataBrParaIso(dataLimite);
    if (!vencimento || !dataNaoAnteriorHoje(vencimento)) {
      invalidos.dataLimite = true;
    }

    if (Object.keys(invalidos).length > 0) {
      setErros(invalidos);
      mostrarToast("erro", "Preencha os campos destacados corretamente.");
      focarPrimeiroErro();
      return;
    }

    cadastrarCobranca({
      cliente: cliente.trim(),
      documento,
      telefone,
      itens,
      formaVenda,
      parcelas: Number(parcelas),
      vencimento,
    });

    mostrarToast("sucesso", "Cobrança cadastrada com sucesso");
    onCadastrada?.();
  };

  return (
    <Card className="form-cobranca">
      <div className="form-cobranca__topo">
        <span className="form-cobranca__icone" aria-hidden="true">
          <Icon name="card" size={24} />
        </span>
        <div>
          <h2 className="form-cobranca__titulo">Nova cobrança</h2>
          <p className="form-cobranca__subtitulo">
            Informe o comprador e os dados da venda.
          </p>
        </div>
      </div>

      <form ref={formularioRef} onSubmit={enviar} noValidate>
        <section className="form-cobranca__secao">
          <h3 className="form-cobranca__secao-titulo">Dados do cliente</h3>

          <div className="form-cobranca__campos">
            <TextField
              label="Nome do comprador"
              placeholder="Ex.: João da Silva"
              value={cliente}
              onChange={(valor) => {
                setCliente(valor);
                limparErro("cliente");
              }}
              erro={Boolean(erros.cliente)}
              autoComplete="name"
            />

            <div className="form-cobranca__grade">
              <TextField
                label="CPF ou CNPJ"
                placeholder="Digite o documento"
                value={documento}
                onChange={(valor) => {
                  setDocumento(valor);
                  limparErro("documento");
                }}
                mask={formatarDocumento}
                erro={Boolean(erros.documento)}
                inputMode="numeric"
              />

              <TextField
                label="Telefone"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={(valor) => {
                  setTelefone(valor);
                  limparErro("telefone");
                }}
                mask={formatarTelefone}
                erro={Boolean(erros.telefone)}
                inputMode="tel"
              />
            </div>
          </div>
        </section>

        <section className="form-cobranca__secao">
          <h3 className="form-cobranca__secao-titulo">Peças da venda</h3>

          <div className="form-cobranca__peca">
            <SelectField
              label="Peça"
              placeholder="Selecione"
              value={pecaId}
              onChange={(valor) => {
                setPecaId(valor);
                setErroItem("");
                limparErro("itens");
              }}
              erro={Boolean(erros.itens)}
              opcoes={pecas.map((peca) => ({
                valor: peca.id,
                rotulo: `${peca.nome} · ${peca.quantidade} disponíveis`,
              }))}
              containerClassName="form-cobranca__peca-select"
            />

            <TextField
              label="Quantidade"
              value={quantidade}
              onChange={(valor) => {
                setQuantidade(valor);
                setErroItem("");
              }}
              mask={(valor) => apenasDigitos(valor).slice(0, 4)}
              erro={Boolean(erros.itens)}
              inputMode="numeric"
              containerClassName="form-cobranca__quantidade"
            />

            <Button
              variante="secundaria"
              icone="plus"
              iconePosicao="esquerda"
              className="form-cobranca__adicionar"
              onClick={adicionarPeca}
            >
              Adicionar
            </Button>
          </div>

          {erroItem ? (
            <p className="form-cobranca__erro" role="alert">
              {erroItem}
            </p>
          ) : null}

          {erros.itens && itens.length === 0 ? (
            <p className="form-cobranca__erro" role="alert">
              Adicione ao menos uma peça à cobrança.
            </p>
          ) : null}

          <ItensCobranca itens={itens} onRemover={removerPeca} />
        </section>

        <section className="form-cobranca__secao">
          <h3 className="form-cobranca__secao-titulo">Condições de pagamento</h3>

          <div className="form-cobranca__grade">
            <SelectField
              label="Forma de venda"
              placeholder="Selecione"
              value={formaVenda}
              onChange={(valor) => {
                setFormaVenda(valor);
                limparErro("formaVenda");
              }}
              erro={Boolean(erros.formaVenda)}
              opcoes={FORMAS_DE_VENDA}
            />

            <SelectField
              label="Quantidade de parcelas"
              value={parcelas}
              onChange={setParcelas}
              opcoes={PARCELAS}
            />
          </div>

          <DateField
            label="Data limite (vencimento)"
            value={dataLimite}
            onChange={(valor) => {
              setDataLimite(valor);
              limparErro("dataLimite");
            }}
            erro={Boolean(erros.dataLimite)}
            containerClassName="form-cobranca__data"
          />
        </section>

        <Button
          type="submit"
          variante="primaria"
          icone="arrowRight"
          className="form-cobranca__enviar"
        >
          Cadastrar cobrança
        </Button>
      </form>
    </Card>
  );
}
