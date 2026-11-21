export function apenasDigitos(valor) {
  return String(valor ?? "").replace(/\D/g, "");
}

export function formatarCpf(valor) {
  const d = apenasDigitos(valor).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function formatarCnpj(valor) {
  const d = apenasDigitos(valor).slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) {
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  }
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

export function formatarDocumento(valor) {
  const d = apenasDigitos(valor);
  return d.length > 11 ? formatarCnpj(d) : formatarCpf(d);
}

export function formatarTelefone(valor) {
  const d = apenasDigitos(valor).slice(0, 11);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;

  const ddd = d.slice(0, 2);
  const resto = d.slice(2);

  if (d.length <= 10) {
    if (resto.length <= 4) return `(${ddd})-${resto}`;
    return `(${ddd})-${resto.slice(0, 4)}-${resto.slice(4)}`;
  }

  return `(${ddd})-${resto.slice(0, 5)}-${resto.slice(5)}`;
}

export function formatarTelefoneExibicao(valor) {
  return String(valor ?? "").replace(/^\((\d{2})\)-/, "($1) ");
}

export function formatarDataDigitada(valor) {
  const d = apenasDigitos(valor).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export function dataIsoParaBr(iso) {
  if (!iso) return "";
  const [ano, mes, dia] = String(iso).split("-");
  if (!ano || !mes || !dia) return "";
  return `${dia}/${mes}/${ano}`;
}

export function formatarMoeda(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return "0,00";
  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatarNumero(valor) {
  return Number(valor).toLocaleString("pt-BR");
}
