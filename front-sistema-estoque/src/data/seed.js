export const categorias = ["Mecânica", "Elétrica", "Hidráulica"];

export const pecasSelecionaveis = [
  "Rolamento 6203",
  "Correia Industrial A32",
  "Filtro Hidráulico HF-10",
  "Engrenagem Motriz Z24",
  "Sensor de Proximidade",
];

export const seedPecas = [
  {
    id: 1,
    nome: "Rolamento 6203",
    codigo: "ROL-6203",
    categoria: "Mecânica",
    descricao:
      "Rolamento rígido de esferas com blindagem metálica, indicado para eixos de 17 mm.",
    valor: 129.9,
    limiteEstoque: 10,
    quantidade: 84,
  },
  {
    id: 2,
    nome: "Correia Industrial A32",
    codigo: "COR-A32",
    categoria: "Mecânica",
    descricao:
      "Correia em V perfil A32 para transmissão de força em máquinas industriais.",
    valor: 89.5,
    limiteEstoque: 15,
    quantidade: 12,
  },
  {
    id: 3,
    nome: "Filtro Hidráulico HF-10",
    codigo: "FIL-HF10",
    categoria: "Hidráulica",
    descricao:
      "Elemento filtrante de 10 micras para sistemas hidráulicos de alta pressão.",
    valor: 245,
    limiteEstoque: 12,
    quantidade: 38,
  },
  {
    id: 4,
    nome: "Engrenagem Motriz Z24",
    codigo: "ENG-Z24",
    categoria: "Mecânica",
    descricao:
      "Engrenagem de aço com 24 dentes para conjunto de transmissão.",
    valor: 320,
    limiteEstoque: 20,
    quantidade: 6,
  },
  {
    id: 5,
    nome: "Sensor de Proximidade",
    codigo: "SEN-PRX",
    categoria: "Elétrica",
    descricao:
      "Sensor indutivo de proximidade com alcance de 8 mm e saída PNP.",
    valor: 156.8,
    limiteEstoque: 12,
    quantidade: 26,
  },
];

export const seedCobrancas = [
  {
    id: 1,
    cliente: "Ana Martins",
    documento: "123.456.789-00",
    telefone: "(11)-99912-3400",
    itens: [{ pecaId: 1, nome: "Rolamento 6203", quantidade: 4 }],
    formaVenda: "Cartão",
    parcelas: 3,
    parcelasPagas: 1,
    vencimento: "2026-11-23",
  },
  {
    id: 2,
    cliente: "Carlos Oliveira",
    documento: "987.654.321-00",
    telefone: "(11)-98841-2200",
    itens: [{ pecaId: 2, nome: "Correia Industrial A32", quantidade: 2 }],
    formaVenda: "Pix",
    parcelas: 1,
    parcelasPagas: 0,
    vencimento: "2026-11-18",
  },
  {
    id: 3,
    cliente: "Marina Souza",
    documento: "456.789.123-00",
    telefone: "(11)-97720-1188",
    itens: [{ pecaId: 3, nome: "Filtro Hidráulico HF-10", quantidade: 3 }],
    formaVenda: "Dinheiro",
    parcelas: 1,
    parcelasPagas: 1,
    vencimento: "2026-11-10",
  },
];

export const usuarioPrototipo = {
  nome: "Mariana Silva",
  primeiroNome: "Mariana",
  perfil: "Administradora",
  email: "mariana.silva@construmoveis.com.br",
};
