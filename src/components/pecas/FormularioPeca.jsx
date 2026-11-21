import { useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import {
  SelectField,
  TextArea,
  TextField,
} from "../ui/Fields";
import Stepper from "../ui/Stepper";
import { useDados } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { apenasDigitos } from "../../utils/mascaras";
import { formatarMoeda } from "../../utils/formatacao";
import {
  MENSAGENS,
  converterDecimal,
  inteiroPositivo,
} from "../../utils/validacao";
import { categorias } from "../../data/seed";
import "./FormularioPeca.css";

function valorNumerico(texto) {
  const limpo = String(texto ?? "").trim();
  if (!limpo) return null;
  return converterDecimal(limpo);
}

function dadosIniciais(peca, edicao) {
  if (!peca) {
    return {
      nome: "",
      codigo: "",
      categoria: "",
      descricao: "",
      valor: "",
      limiteEstoque: "",
      quantidade: edicao ? 0 : 1,
    };
  }

  return {
    nome: peca.nome,
    codigo: peca.codigo,
    categoria: peca.categoria,
    descricao: peca.descricao,
    valor: formatarMoeda(peca.valor),
    limiteEstoque: String(peca.limiteEstoque),
    quantidade: peca.quantidade,
  };
}

export default function FormularioPeca({ modo = "cadastro" }) {
  const edicao = modo === "edicao";
  const { pecas, cadastrarPeca, editarPeca } = useDados();
  const { mostrarToast } = useToast();
  const navegar = useNavigate();
  const [parametros] = useSearchParams();
  const formularioRef = useRef(null);

  const idInicial = Number(parametros.get("peca")) || "";
  const [pecaId, setPecaId] = useState(idInicial);
  const [dados, setDados] = useState(() =>
    dadosIniciais(
      pecas.find((peca) => peca.id === Number(idInicial)),
      edicao,
    ),
  );
  const [erros, setErros] = useState({});

  const pecaSelecionada = useMemo(
    () => pecas.find((peca) => peca.id === Number(pecaId)),
    [pecas, pecaId],
  );

  const alterar = (campo, valor) => {
    setDados((atuais) => ({ ...atuais, [campo]: valor }));
    setErros((atuais) => {
      if (!atuais[campo]) return atuais;
      const copia = { ...atuais };
      delete copia[campo];
      return copia;
    });
  };

  const selecionarPeca = (valor) => {
    setPecaId(valor);
    const peca = pecas.find((item) => item.id === Number(valor));
    setDados(dadosIniciais(peca, true));
    setErros({});
  };

  const focarPrimeiroErro = () => {
    requestAnimationFrame(() => {
      const campo = formularioRef.current?.querySelector('[aria-invalid="true"]');
      campo?.focus();
    });
  };

  const enviar = (evento) => {
    evento.preventDefault();

    const novosErros = {};

    if (edicao && !pecaId) novosErros.selecao = true;
    if (!dados.nome.trim()) novosErros.nome = true;
    if (!dados.codigo.trim()) novosErros.codigo = true;
    if (!dados.categoria) novosErros.categoria = true;
    if (!dados.descricao.trim()) novosErros.descricao = true;
    if (!dados.limiteEstoque) novosErros.limiteEstoque = true;

    const valor = valorNumerico(dados.valor);
    if (edicao ? valor === null : dados.valor.trim() && valor === null) {
      novosErros.valor = true;
    }

    if (edicao && !Number.isInteger(dados.quantidade)) {
      novosErros.quantidade = true;
    }
    if (!edicao && quantidadeInvalidaCadastro(dados.quantidade)) {
      novosErros.quantidade = true;
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      mostrarToast(
        "erro",
        edicao ? MENSAGENS.pecaEdicaoVazio : MENSAGENS.pecaCadastroVazio,
      );
      focarPrimeiroErro();
      return;
    }

    const registro = {
      nome: dados.nome.trim(),
      codigo: dados.codigo.trim().toUpperCase(),
      categoria: dados.categoria,
      descricao: dados.descricao.trim(),
      valor: valor ?? 0,
      limiteEstoque: Number(dados.limiteEstoque),
      quantidade: Number(dados.quantidade),
    };

    if (edicao) {
      editarPeca(Number(pecaId), registro);
      mostrarToast("sucesso", MENSAGENS.pecaEdicaoSucesso);
    } else {
      cadastrarPeca(registro);
      mostrarToast("sucesso", MENSAGENS.pecaCadastroSucesso);
    }
  };

  const imagemTitulo = edicao
    ? pecaSelecionada
      ? pecaSelecionada.nome
      : "Selecione uma peça"
    : "Adicionar imagem";
  const imagemAjuda = edicao
    ? pecaSelecionada
      ? "Clique para substituir"
      : "Clique para substituir"
    : "PNG ou JPG, até 5 MB";

  return (
    <Card className="form-peca__card">
      <form ref={formularioRef} onSubmit={enviar} noValidate>
        <div className="form-peca__conteudo">
          <div className="form-peca__imagem" aria-label={imagemTitulo}>
            <span className="form-peca__imagem-icone" aria-hidden="true">
              <Icon name={edicao && !pecaSelecionada ? "box" : "upload"} size={26} />
            </span>
            <strong>{imagemTitulo}</strong>
            <small>{imagemAjuda}</small>
          </div>

          <div className="form-peca__campos">
            {edicao ? (
              <SelectField
                label="Escolha a peça que deseja editar"
                placeholder="Selecione"
                value={pecaId}
                onChange={selecionarPeca}
                erro={Boolean(erros.selecao)}
                opcoes={pecas.map((peca) => ({
                  valor: peca.id,
                  rotulo: peca.nome,
                }))}
                containerClassName="form-peca__selecionar"
              />
            ) : null}

            <TextField
              label="Nome da peça"
              placeholder="Ex.: Rolamento 6203"
              value={dados.nome}
              onChange={(valor) => alterar("nome", valor)}
              erro={Boolean(erros.nome)}
            />

            <div className="form-peca__linha">
              <TextField
                label="Código"
                placeholder="Ex.: ROL-6203"
                value={dados.codigo}
                onChange={(valor) => alterar("codigo", valor.toUpperCase())}
                erro={Boolean(erros.codigo)}
              />

              <SelectField
                label="Categoria"
                placeholder="Selecione"
                value={dados.categoria}
                onChange={(valor) => alterar("categoria", valor)}
                erro={Boolean(erros.categoria)}
                opcoes={categorias}
              />
            </div>

            <TextArea
              label="Descrição"
              placeholder="Descreva as principais características da peça..."
              value={dados.descricao}
              onChange={(evento) => alterar("descricao", evento.target.value)}
              erro={Boolean(erros.descricao)}
            />

            <div className="form-peca__linha">
              <TextField
                label="Valor"
                placeholder="Ex.: 129,90"
                value={dados.valor}
                onChange={(valor) => alterar("valor", valor)}
                erro={Boolean(erros.valor)}
                inputMode="decimal"
              />

              <TextField
                label="Limite de estoque"
                placeholder="Ex.: 10"
                value={dados.limiteEstoque}
                onChange={(valor) => alterar("limiteEstoque", valor)}
                erro={Boolean(erros.limiteEstoque)}
                mask={apenasDigitos}
                inputMode="numeric"
              />
            </div>

            <div className="form-peca__quantidade">
              <span className="form-peca__quantidade-rotulo">
                Quantidade em estoque
              </span>
              <Stepper
                valor={dados.quantidade}
                onChange={(valor) => alterar("quantidade", valor)}
                min={edicao ? 0 : 1}
              />
            </div>
          </div>
        </div>

        <div className="form-peca__rodape">
          <Button variante="secundaria" onClick={() => navegar("/estoque")}>
            Cancelar
          </Button>
          <Button type="submit" variante="primaria">
            {edicao ? "Salvar alterações" : "Cadastrar peça"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function quantidadeInvalidaCadastro(quantidade) {
  return !inteiroPositivo(quantidade);
}
