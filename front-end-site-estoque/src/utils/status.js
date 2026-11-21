export function dataIsoParaDate(iso) {
  if (!iso) return null;
  const [ano, mes, dia] = String(iso).split("-").map(Number);
  if (!ano || !mes || !dia) return null;
  return new Date(ano, mes - 1, dia);
}

export function diasAte(iso) {
  const data = dataIsoParaDate(iso);
  if (!data) return 0;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  data.setHours(0, 0, 0, 0);

  return Math.round((data.getTime() - hoje.getTime()) / 86400000);
}

export function statusPeca(quantidade, limite) {
  const qtd = Number(quantidade) || 0;
  const lim = Number(limite) || 0;

  if (qtd <= Math.floor(lim / 2)) return "critico";
  if (qtd <= lim) return "baixo";
  return "estoque";
}

export const rotuloStatusPeca = {
  estoque: "Em estoque",
  baixo: "Estoque baixo",
  critico: "Crítico",
};

export const JANELA_VENCIMENTO_DIAS = 7;

export function statusCobranca(cobranca) {
  if (cobranca.parcelasPagas >= cobranca.parcelas) return "pago";

  const dias = diasAte(cobranca.vencimento);
  if (dias < 0) return "vencida";
  if (dias <= JANELA_VENCIMENTO_DIAS) return "vencendo";
  return "aberta";
}

export function rotuloCobranca(cobranca) {
  const status = statusCobranca(cobranca);
  if (status === "pago") return "Pago";
  if (status === "vencida") return "Vencida";
  if (status === "aberta") return "Em aberto";

  const dias = diasAte(cobranca.vencimento);
  if (dias === 0) return "Vence hoje";
  if (dias === 1) return "Vence amanhã";
  return `Vence em ${dias} dias`;
}
