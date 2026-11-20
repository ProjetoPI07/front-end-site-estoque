import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/ui/Card";
import Card from "../../components/ui/Card";
import { TextField, SelectField } from "../../components/ui/Fields";
import { IconButton } from "../../components/ui/Button";
import Stepper from "../../components/ui/Stepper";
import StatusPill from "../../components/ui/StatusPill";
import Icon from "../../components/ui/Icon";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { useDados } from "../../context/AppContext";
import {
  rotuloStatusPeca,
  statusPeca,
} from "../../utils/status";
import { formatarMoeda } from "../../utils/formatacao";
import "./Estoque.css";

const FILTROS = [
  { valor: "todos", rotulo: "Todos os status" },
  { valor: "estoque", rotulo: "Em estoque" },
  { valor: "baixo", rotulo: "Estoque baixo" },
  { valor: "critico", rotulo: "Crítico" },
];

export default function Estoque() {
  const { pecas, ajustarQuantidade } = useDados();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [rascunhos, setRascunhos] = useState({});
  const [detalhe, setDetalhe] = useState(null);
  const navegar = useNavigate();

  const pecasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return pecas.filter((peca) => {
      const combinaTexto =
        !termo ||
        peca.nome.toLowerCase().includes(termo) ||
        peca.codigo.toLowerCase().includes(termo);
      const combinaFiltro =
        filtro === "todos" ||
        statusPeca(peca.quantidade, peca.limiteEstoque) === filtro;
      return combinaTexto && combinaFiltro;
    });
  }, [pecas, busca, filtro]);

  const definirRascunho = (id, quantidade) => {
    setRascunhos((atuais) => ({ ...atuais, [id]: quantidade }));
  };

  const salvarQuantidade = (peca) => {
    const quantidade = rascunhos[peca.id];
    if (quantidade === undefined) return;

    ajustarQuantidade(peca.id, quantidade);
    setRascunhos((atuais) => {
      const copia = { ...atuais };
      delete copia[peca.id];
      return copia;
    });
  };

  const abrirEdicao = (peca) => {
    setDetalhe(null);
    navegar(`/pecas/editar?peca=${peca.id}`);
  };

  return (
    <div className="estoque">
      <PageHeader
        sobretitulo="Visão geral"
        titulo="Estoque"
        subtitulo="Acompanhe e gerencie todas as peças do inventário."
      />

      <div className="estoque__toolbar">
        <TextField
          icone="search"
          placeholder="Buscar por nome ou código..."
          value={busca}
          onChange={setBusca}
          aria-label="Buscar por nome ou código"
          containerClassName="estoque__busca"
        />
        <SelectField
          value={filtro}
          onChange={setFiltro}
          opcoes={FILTROS}
          aria-label="Filtrar por status"
          containerClassName="estoque__filtro"
        />
      </div>

      <Card className="estoque__card">
        <div className="tabela" role="table" aria-label="Peças em estoque">
          <div className="tabela__cabecalho" role="row">
            <span role="columnheader">Peça</span>
            <span role="columnheader">Código</span>
            <span role="columnheader">Status</span>
            <span role="columnheader">Quantidade</span>
            <span role="columnheader">Salvar</span>
          </div>

          {pecasFiltradas.map((peca) => {
            const exibida = rascunhos[peca.id] ?? peca.quantidade;
            const pendente = exibida !== peca.quantidade;
            const status = statusPeca(peca.quantidade, peca.limiteEstoque);

            return (
              <div className="tabela__linha" role="row" key={peca.id}>
                <div className="tabela__peca" role="cell">
                  <span className="tabela__icone" aria-hidden="true">
                    <Icon name="box" size={20} />
                  </span>
                  <button
                    type="button"
                    className="tabela__nome"
                    onClick={() => setDetalhe(peca)}
                  >
                    {peca.nome}
                  </button>
                </div>

                <span className="tabela__codigo" role="cell">
                  {peca.codigo}
                </span>

                <span role="cell">
                  <StatusPill tipo={status}>
                    {rotuloStatusPeca[status]}
                  </StatusPill>
                </span>

                <div className="tabela__quantidade" role="cell">
                  <Stepper
                    valor={exibida}
                    onChange={(valor) => definirRascunho(peca.id, valor)}
                    ordem="aumento-primeiro"
                    rotulo={`Quantidade de ${peca.nome}`}
                  />
                </div>

                <span role="cell">
                  <IconButton
                    icone="save"
                    rotulo={`Salvar quantidade de ${peca.nome}`}
                    disabled={!pendente}
                    className={pendente ? "tabela__salvar--ativo" : ""}
                    onClick={() => salvarQuantidade(peca)}
                  />
                </span>
              </div>
            );
          })}

          {pecasFiltradas.length === 0 ? (
            <p className="tabela__vazio">Nenhuma peça encontrada.</p>
          ) : null}
        </div>

        <div className="tabela__rodape">
          <span>
            Mostrando {pecasFiltradas.length} de {pecas.length} peças
          </span>
          <nav className="paginacao" aria-label="Paginação">
            <span className="paginacao__item paginacao__item--ativa">1</span>
            <span className="paginacao__item">2</span>
            <span className="paginacao__item">3</span>
            <span className="paginacao__reticencias">…</span>
            <span className="paginacao__item">26</span>
            <span className="paginacao__seta" aria-hidden="true">
              ›
            </span>
          </nav>
        </div>
      </Card>

      {detalhe ? (
        <Modal
          titulo="Detalhes da peça"
          subtitulo="Informações atualizadas do item selecionado."
          onFechar={() => setDetalhe(null)}
          largura="620px"
          acoes={
            <>
              <Button variante="secundaria" onClick={() => setDetalhe(null)}>
                Fechar
              </Button>
              <Button
                variante="primaria"
                icone="pencil"
                iconePosicao="esquerda"
                onClick={() => abrirEdicao(detalhe)}
              >
                Editar peça
              </Button>
            </>
          }
        >
          <div className="detalhe">
            <div className="detalhe__topo">
              <span className="detalhe__icone" aria-hidden="true">
                <Icon name="box" size={24} />
              </span>
              <div>
                <h3 className="detalhe__nome">{detalhe.nome}</h3>
                <p className="detalhe__codigo">{detalhe.codigo}</p>
              </div>
            </div>

            <p className="detalhe__descricao">{detalhe.descricao}</p>

            <dl className="detalhe__grade">
              <div>
                <dt>Categoria</dt>
                <dd>{detalhe.categoria}</dd>
              </div>
              <div>
                <dt>Quantidade atual</dt>
                <dd>{rascunhos[detalhe.id] ?? detalhe.quantidade}</dd>
              </div>
              <div>
                <dt>Limite de estoque</dt>
                <dd>{detalhe.limiteEstoque}</dd>
              </div>
              <div>
                <dt>Valor</dt>
                <dd>R$ {formatarMoeda(detalhe.valor)}</dd>
              </div>
            </dl>

            <div className="detalhe__status">
              <span>Situação</span>
              <StatusPill
                tipo={statusPeca(
                  rascunhos[detalhe.id] ?? detalhe.quantidade,
                  detalhe.limiteEstoque,
                )}
              >
                {
                  rotuloStatusPeca[
                    statusPeca(
                      rascunhos[detalhe.id] ?? detalhe.quantidade,
                      detalhe.limiteEstoque,
                    )
                  ]
                }
              </StatusPill>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
