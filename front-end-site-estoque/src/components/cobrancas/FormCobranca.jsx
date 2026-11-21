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
import { MENSAGENS, dataBrParaIso } from "../../utils/validacao";
import {
  FORMAS_DE_VENDA,
  validarCobranca,
  validarItemCobranca,
} from "../../utils/validacaoCobranca";
import "./FormCobranca.css";

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
    const resultado = validarItemCobranca({ peca, quantidade, itens });

    if (!resultado.valido) {
      setErroItem(resultado.mensagem);
      return;
    }

    const existente = itens.find((item) => item.pecaId === peca.id);

    if (existente) {
      setItens((atuais) =>
        atuais.map((item) =>
          item.pecaId === peca.id
            ? { ...item, quantidade: item.quantidade + resultado.quantidade }
            : item,
        ),
      );
    } else {
      setItens((atuais) => [
        ...atuais,
        {
          pecaId: peca.id,
          nome: peca.nome,
          quantidade: resultado.quantidade,
        },
      ]);
    }

    setPecaId("");
    setQuantidade("1");
    setErroItem("");
    limparErro("itens");
  };

  const removerPeca = (id) => {
    setItens((atuais) => atuais.filter((item) => item.pecaId !== id));
    setErroItem("");
    limparErro("itens");
  };

  const enviar = (evento) => {
    evento.preventDefault();
    setErroItem("");

    const resultado = validarCobranca(
      {
        cliente,
        documento,
        telefone,
        itens,
        formaVenda,
        parcelas,
        dataLimite,
      },
      pecas,
    );

    const marcarErros = () => {
      setErros(
        Object.fromEntries(
          [...resultado.vazios, ...resultado.invalidos].map((campo) => [
            campo,
            true,
          ]),
        ),
      );
      if (resultado.mensagemItens) setErroItem(resultado.mensagemItens);
    };

    if (resultado.vazios.length > 0) {
      marcarErros();
      mostrarToast("erro", MENSAGENS.cobrancaVazio);
      focarPrimeiroErro();
      return;
    }

    if (resultado.invalidos.length > 0) {
      marcarErros();
      mostrarToast("erro", MENSAGENS.cobrancaInvalido);
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
      vencimento: dataBrParaIso(dataLimite),
    });

    mostrarToast("sucesso", MENSAGENS.cobrancaSucesso);
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
              {MENSAGENS.cobrancaItensVazio}
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
              onChange={(valor) => {
                setParcelas(valor);
                limparErro("parcelas");
              }}
              erro={Boolean(erros.parcelas)}
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
