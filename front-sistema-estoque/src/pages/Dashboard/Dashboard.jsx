import { useState } from "react";
import { PageHeader } from "../../components/ui/Card";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import { SelectField } from "../../components/ui/Fields";
import { formatarNumero } from "../../utils/formatacao";
import "./Dashboard.css";

const PERIODOS = [
  { valor: "30", rotulo: "Últimos 30 dias" },
  { valor: "15", rotulo: "Últimos 15 dias" },
];

const INDICADORES = {
  30: {
    vendidos: "1.284",
    variacao: "+8,2%",
    categoria: "Rolamento 6203",
    participacao: "46% das vendas",
    semSaida: "Engrenagem Motriz Z24",
    saidas: "0 saídas no mês",
  },
  15: {
    vendidos: "642",
    variacao: "+4,1%",
    categoria: "Rolamento 6203",
    participacao: "44% das vendas",
    semSaida: "Engrenagem Motriz Z24",
    saidas: "0 saídas no mês",
  },
};

const BARRAS = [
  { mes: "Jan", altura: 34 },
  { mes: "Fev", altura: 58 },
  { mes: "Mar", altura: 30 },
  { mes: "Abr", altura: 63 },
  { mes: "Mai", altura: 46 },
  { mes: "Jun", altura: 72 },
];

const CATEGORIAS = [
  { nome: "Mecânica", percentual: 46, cor: "#2563eb" },
  { nome: "Elétrica", percentual: 31, cor: "#38bdf8" },
  { nome: "Hidráulica", percentual: 23, cor: "#bfdbfe" },
];

const CIRCUNFERENCIA = 2 * Math.PI * 72;

const FATIAS = CATEGORIAS.reduce((fatias, categoria) => {
  const acumulado = fatias.reduce(
    (total, fatia) => total + fatia.percentual,
    0,
  );
  const tamanho = (categoria.percentual / 100) * CIRCUNFERENCIA;

  return [
    ...fatias,
    {
      ...categoria,
      dash: `${tamanho} ${CIRCUNFERENCIA - tamanho}`,
      deslocamento: -((acumulado / 100) * CIRCUNFERENCIA),
    },
  ];
}, []);

export default function Dashboard() {
  const [periodo, setPeriodo] = useState("30");
  const dados = INDICADORES[periodo];

  return (
    <div className="dashboard">
      <PageHeader
        sobretitulo="Análise do inventário"
        titulo="Dashboard"
        subtitulo="Indicadores atualizados do seu estoque."
      >
        <div className="dashboard__periodo">
          <SelectField
            value={periodo}
            onChange={setPeriodo}
            opcoes={PERIODOS}
            aria-label="Período dos indicadores"
          />
        </div>
      </PageHeader>

      <section className="dashboard__kpis" aria-label="Indicadores do período">
        <Card className="kpi">
          <div className="kpi__topo">
            <span className="kpi__icone kpi__icone--azul" aria-hidden="true">
              <Icon name="box" size={21} />
            </span>
            <span className="kpi__rotulo">Produtos vendidos</span>
          </div>
          <p className="kpi__valor">{dados.vendidos}</p>
          <p className="kpi__nota">{dados.variacao}</p>
        </Card>

        <Card className="kpi">
          <div className="kpi__topo">
            <span className="kpi__icone kpi__icone--verde" aria-hidden="true">
              <Icon name="chart" size={21} />
            </span>
            <span className="kpi__rotulo">Categoria de peças mais vendidas</span>
          </div>
          <p className="kpi__valor">{dados.categoria}</p>
          <p className="kpi__nota">{dados.participacao}</p>
        </Card>

        <Card className="kpi">
          <div className="kpi__topo">
            <span className="kpi__icone kpi__icone--vermelho" aria-hidden="true">
              <Icon name="bell" size={21} />
            </span>
            <span className="kpi__rotulo">Peça que não saiu no mês</span>
          </div>
          <p className="kpi__valor">{dados.semSaida}</p>
          <p className="kpi__nota">{dados.saidas}</p>
        </Card>
      </section>

      <div className="dashboard__graficos">
        <Card className="grafico grafico--barras">
          <div className="grafico__cabecalho">
            <div>
              <h2 className="grafico__titulo">Movimentação de estoque</h2>
              <p className="grafico__subtitulo">
                Entradas e saídas nos últimos 6 meses
              </p>
            </div>
            <span className="grafico__filtro">Mensal</span>
          </div>

          <div className="barras">
            <svg
              viewBox="0 0 680 220"
              role="img"
              aria-label="Gráfico de movimentação de estoque de janeiro a junho"
            >
              <defs>
                <linearGradient id="gradiente-barra" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f8df7" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>

              {[40, 80, 120, 160].map((y) => (
                <line
                  key={y}
                  x1="24"
                  x2="656"
                  y1={y}
                  y2={y}
                  stroke="#edf2f8"
                  strokeWidth="1"
                />
              ))}

              {BARRAS.map((barra, indice) => {
                const altura = (barra.altura / 100) * 170;
                const x = 60 + indice * 105;
                return (
                  <g key={barra.mes}>
                    <rect
                      x={x}
                      y={190 - altura}
                      width="15"
                      height={altura}
                      rx="4"
                      fill="url(#gradiente-barra)"
                    />
                    <text
                      x={x + 7.5}
                      y="212"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="12"
                    >
                      {barra.mes}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </Card>

        <Card className="grafico grafico--donut">
          <div className="grafico__cabecalho">
            <div>
              <h2 className="grafico__titulo">Estoque por categoria</h2>
              <p className="grafico__subtitulo">Distribuição atual de itens</p>
            </div>
          </div>

          <div className="donut">
            <div className="donut__area">
              <svg
                viewBox="0 0 220 220"
                role="img"
                aria-label="Estoque de 1.284 itens distribuídos em Mecânica 46%, Elétrica 31% e Hidráulica 23%"
              >
                <circle
                  cx="110"
                  cy="110"
                  r="72"
                  fill="none"
                  stroke="#eef2f8"
                  strokeWidth="26"
                />
                {FATIAS.map((categoria) => (
                  <circle
                    key={categoria.nome}
                    cx="110"
                    cy="110"
                    r="72"
                    fill="none"
                    stroke={categoria.cor}
                    strokeWidth="26"
                    strokeDasharray={categoria.dash}
                    strokeDashoffset={categoria.deslocamento}
                    transform="rotate(-90 110 110)"
                  />
                ))}
                <text
                  x="110"
                  y="105"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="25"
                  fontWeight="700"
                >
                  {formatarNumero(1284)}
                </text>
                <text
                  x="110"
                  y="126"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="12"
                >
                  itens
                </text>
              </svg>
            </div>

            <ul className="donut__legenda">
              {CATEGORIAS.map((categoria) => (
                <li key={categoria.nome}>
                  <span
                    className="donut__cor"
                    style={{ background: categoria.cor }}
                    aria-hidden="true"
                  />
                  <span className="donut__nome">{categoria.nome}</span>
                  <strong>{categoria.percentual}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
