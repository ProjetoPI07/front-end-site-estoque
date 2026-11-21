import { apenasDigitos } from "./formatacao";

export const SENHA_PROTOTIPO = "SENHA123";
export const CPF_PROTOTIPO = "44433322211";

export const MENSAGENS = Object.freeze({
  loginInvalido: "Dados inválidos",
  estoqueSemResultado: "Nenhuma peça encontrada.",
  pecaCadastroVazio: "todos campos devem ser preenchidos",
  pecaCadastroSucesso: "peça cadastrada com sucesso",
  pecaEdicaoVazio: "Todos campos devem ser preenchidos",
  pecaEdicaoSucesso: "Peça atualizada com sucesso!",
  cobrancaVazio: "Preencha todos os dados da cobrança.",
  cobrancaInvalido: "Preencha os campos destacados corretamente.",
  cobrancaSucesso: "Cobrança cadastrada com sucesso",
  cobrancaItemPeca: "Selecione uma peça para adicionar à cobrança.",
  cobrancaItemQuantidade: "Informe uma quantidade inteira maior que zero.",
  cobrancaItensVazio: "Adicione ao menos uma peça à cobrança.",
  cobrancaItemIndisponivel: "Uma das peças da cobrança não está mais disponível no estoque.",
});

export function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(valor ?? "").trim());
}

export function cpfValido(valor) {
  const digitos = apenasDigitos(valor);

  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) return false;

  const calcularDigito = (base) => {
    let soma = 0;
    for (let indice = 0; indice < base.length; indice += 1) {
      soma += Number(base[indice]) * (base.length + 1 - indice);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const primeiro = calcularDigito(digitos.slice(0, 9));
  const segundo = calcularDigito(digitos.slice(0, 10));

  return digitos === `${digitos.slice(0, 9)}${primeiro}${segundo}`;
}

export function cnpjValido(valor) {
  const digitos = apenasDigitos(valor);

  if (digitos.length !== 14 || /^(\d)\1{13}$/.test(digitos)) return false;

  const calcularDigito = (base) => {
    const pesos =
      base.length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let soma = 0;
    for (let indice = 0; indice < base.length; indice += 1) {
      soma += Number(base[indice]) * pesos[indice];
    }

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const primeiro = calcularDigito(digitos.slice(0, 12));
  const segundo = calcularDigito(digitos.slice(0, 13));

  return digitos === `${digitos.slice(0, 12)}${primeiro}${segundo}`;
}

export function documentoValido(valor) {
  const digitos = apenasDigitos(valor);

  if (digitos.length === 11) return cpfValido(digitos);
  if (digitos.length === 14) return cnpjValido(digitos);
  return false;
}

export function telefoneValido(valor) {
  const digitos = apenasDigitos(valor);
  if (digitos.length !== 10 && digitos.length !== 11) return false;

  const ddd = Number(digitos.slice(0, 2));
  return ddd >= 11 && ddd <= 99;
}

export function nomeValido(valor) {
  return String(valor ?? "").trim().length >= 3;
}

export function inteiroPositivo(valor) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0;
}

export function decimalValido(valor) {
  return /^\d+(?:[.,]\d{1,2})?$/.test(String(valor ?? "").trim());
}

export function converterDecimal(valor) {
  if (!decimalValido(valor)) return null;
  return Number(String(valor).trim().replace(",", "."));
}

export function campoVazio(valor) {
  if (Array.isArray(valor)) return valor.length === 0;
  return String(valor ?? "").trim() === "";
}

export function validarCampo(valor, validador = () => true) {
  if (campoVazio(valor)) return "vazio";
  return validador(valor) ? "valido" : "invalido";
}

export function hojeIso() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function dataBrParaIso(valor) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(valor ?? "").trim());
  if (!match) return null;

  const [, dia, mes, ano] = match;
  const data = new Date(Number(ano), Number(mes) - 1, Number(dia));

  if (
    data.getFullYear() !== Number(ano) ||
    data.getMonth() !== Number(mes) - 1 ||
    data.getDate() !== Number(dia)
  ) {
    return null;
  }

  return `${ano}-${mes}-${dia}`;
}

export function dataValida(valor) {
  return Boolean(dataBrParaIso(valor));
}

export function dataNaoAnteriorHoje(iso) {
  if (!iso) return false;
  return iso >= hojeIso();
}

export function credenciaisValidas(identificador, senha) {
  if (senha !== SENHA_PROTOTIPO) return false;

  const texto = String(identificador ?? "").trim();
  if (!texto) return false;

  if (texto.includes("@")) return emailValido(texto);

  return apenasDigitos(texto) === CPF_PROTOTIPO;
}
