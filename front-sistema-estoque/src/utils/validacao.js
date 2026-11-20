import { apenasDigitos } from "./formatacao";

export const SENHA_PROTOTIPO = "SENHA123";
export const CPF_PROTOTIPO = "44433322211";

export function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(valor ?? "").trim());
}

export function documentoValido(valor) {
  const d = apenasDigitos(valor);
  if (d.length !== 11 && d.length !== 14) return false;
  if (/^(\d)\1+$/.test(d)) return false;
  return true;
}

export function telefoneValido(valor) {
  const d = apenasDigitos(valor);
  if (d.length !== 10 && d.length !== 11) return false;
  const ddd = Number(d.slice(0, 2));
  return ddd >= 11 && ddd <= 99;
}

export function nomeValido(valor) {
  return String(valor ?? "").trim().length >= 3;
}

export function inteiroPositivo(valor) {
  const n = Number(valor);
  return Number.isInteger(n) && n > 0;
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
