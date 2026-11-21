import {
  MENSAGENS,
  campoVazio,
  dataBrParaIso,
  dataNaoAnteriorHoje,
  documentoValido,
  inteiroPositivo,
  nomeValido,
  telefoneValido,
} from "./validacao";

export const FORMAS_DE_VENDA = ["Cartão", "Dinheiro", "Pix"];
export const PARCELAS_MIN = 1;
export const PARCELAS_MAX = 12;

function mensagemDisponibilidade(peca, disponivel) {
  return `Quantidade indisponível. Há ${disponivel} ${
    disponivel === 1 ? "unidade" : "unidades"
  } desta peça em estoque.`;
}

export function validarItemCobranca({ peca, quantidade, itens = [] }) {
  if (!peca) {
    return {
      valido: false,
      tipo: "vazio",
      mensagem: MENSAGENS.cobrancaItemPeca,
    };
  }

  const quantidadeNumero = Number(quantidade);
  if (!inteiroPositivo(quantidadeNumero)) {
    return {
      valido: false,
      tipo: "invalido",
      mensagem: MENSAGENS.cobrancaItemQuantidade,
    };
  }

  const existente = itens.find(
    (item) => Number(item.pecaId) === Number(peca.id),
  );
  const soma = (existente?.quantidade ?? 0) + quantidadeNumero;
  const disponivel = Number(peca.quantidade) || 0;

  if (soma > disponivel) {
    return {
      valido: false,
      tipo: "invalido",
      mensagem: mensagemDisponibilidade(peca, disponivel),
      disponivel,
    };
  }

  return {
    valido: true,
    quantidade: quantidadeNumero,
    soma,
  };
}

export function validarCobranca(dados, pecas = []) {
  const vazios = [];
  const invalidos = [];
  const erros = {};

  const apontar = (campo, tipo) => {
    if (erros[campo]) return;
    erros[campo] = tipo;
    if (tipo === "vazio") vazios.push(campo);
    else invalidos.push(campo);
  };

  const verificar = (campo, valor, validador) => {
    if (campoVazio(valor)) {
      apontar(campo, "vazio");
      return;
    }
    if (!validador(valor)) apontar(campo, "invalido");
  };

  verificar("cliente", dados.cliente, nomeValido);
  verificar("documento", dados.documento, documentoValido);
  verificar("telefone", dados.telefone, telefoneValido);
  verificar("formaVenda", dados.formaVenda, (valor) =>
    FORMAS_DE_VENDA.includes(valor),
  );
  verificar("parcelas", dados.parcelas, (valor) => {
    const numero = Number(valor);
    return (
      Number.isInteger(numero) &&
      numero >= PARCELAS_MIN &&
      numero <= PARCELAS_MAX
    );
  });
  verificar("dataLimite", dados.dataLimite, (valor) => {
    const iso = dataBrParaIso(valor);
    return Boolean(iso && dataNaoAnteriorHoje(iso));
  });

  const itens = Array.isArray(dados.itens) ? dados.itens : [];
  let mensagemItens = "";

  if (itens.length === 0) {
    apontar("itens", "vazio");
    mensagemItens = MENSAGENS.cobrancaItensVazio;
  } else {
    const quantidadesPorPeca = new Map();

    for (const item of itens) {
      const peca = pecas.find(
        (candidata) => Number(candidata.id) === Number(item.pecaId),
      );
      const quantidade = Number(item.quantidade);

      if (!peca) {
        apontar("itens", "invalido");
        mensagemItens = MENSAGENS.cobrancaItemIndisponivel;
        break;
      }

      if (!inteiroPositivo(quantidade)) {
        apontar("itens", "invalido");
        mensagemItens = MENSAGENS.cobrancaItemQuantidade;
        break;
      }

      const soma =
        (quantidadesPorPeca.get(peca.id) ?? 0) + quantidade;
      quantidadesPorPeca.set(peca.id, soma);

      const disponivel = Number(peca.quantidade) || 0;
      if (soma > disponivel) {
        apontar("itens", "invalido");
        mensagemItens = mensagemDisponibilidade(peca, disponivel);
        break;
      }
    }
  }

  const valido = vazios.length === 0 && invalidos.length === 0;

  return {
    valido,
    vazios,
    invalidos,
    erros,
    mensagem: vazios.length
      ? MENSAGENS.cobrancaVazio
      : invalidos.length
        ? MENSAGENS.cobrancaInvalido
        : MENSAGENS.cobrancaSucesso,
    mensagemItens,
  };
}
