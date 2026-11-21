# Constru Móveis — Gestão de Estoque

Protótipo frontend do sistema de estoque da Constru Móveis. A aplicação permite
autenticar uma usuária, consultar e ajustar o estoque, cadastrar e editar peças,
registrar cobranças e acompanhar indicadores no dashboard.

Não há backend, API, banco de dados ou persistência: todos os dados vivem em
memória e são restaurados ao recarregar a página.

## Stack

- React 19 + JavaScript (JSX)
- Vite
- React Router
- CSS autoral com tokens de design
- ESLint (flat config)

## Como rodar

Requisitos: Node.js 20 ou superior e npm.

```bash
npm install
npm run dev
```

O Vite abre a aplicação em `http://localhost:5173`.

Outros scripts:

```bash
npm run lint     # análise estática
npm run build    # build de produção em dist/
npm run preview  # pré-visualização do build
```

## Credenciais do protótipo

- **E-mail:** qualquer e-mail em formato válido
- **CPF:** `444.333.222-11`
- **Senha:** `SENHA123`

## Telas e rotas

| Rota | Tela | Conteúdo principal |
| --- | --- | --- |
| `/login` | Login | Identificação por e-mail ou CPF, senha e aviso genérico de falha |
| `/estoque` | Estoque | Busca por nome/código, filtro por situação, ajuste de quantidade, paginação decorativa e modal de detalhes |
| `/pecas/nova` | Cadastrar peça | Formulário com dados da peça, valor opcional e quantidade inicial |
| `/pecas/editar` | Editar peça | Seleção da peça, carregamento dos dados e salvamento das alterações |
| `/cobrancas` | Cobranças | Abas de cobranças registradas e cadastro de nova cobrança |
| `/dashboard` | Dashboard | KPIs, movimentação dos últimos seis meses e distribuição por categoria |

A rota `/` redireciona para `/estoque`. Rotas internas exigem sessão ativa; ao
sair, a aplicação volta para `/login`.

## Dados em memória

O estado inicial fica em `src/data/seed.js`:

- 5 peças de exemplo nas categorias Mecânica, Elétrica e Hidráulica;
- 3 cobranças de exemplo (em aberto, vencida e paga);
- usuária do protótipo (Mariana Silva).

Cadastros, edições, ajustes de estoque e baixas de cobrança são mantidos apenas
durante a sessão atual. Recarregar a aplicação restaura a seed.

## Estrutura

```text
src/
  components/
    cobrancas/    # cartões, lista, formulário, itens e confirmação de baixa
    layout/       # sidebar, header, shell e botão de ajuda
    pecas/        # formulário compartilhado de cadastro/edição
    ui/           # campos, botões, cards, modal, tabs, toast, stepper etc.
  context/        # autenticação, dados e toasts
  data/           # seed do protótipo
  pages/          # Login, Estoque, CadastrarPeca, EditarPeca, Cobrancas, Dashboard
  styles/         # tokens e estilos base
  utils/          # formatação, máscaras, status e validações
```

## Regras e validações

- CPF e CNPJ são mascarados durante a digitação e validados por dígito
  verificador. O telefone usa o formato `(DD)-NNNNN-NNNN` na camada de dados e
  é exibido como `(DD) NNNNN-NNNN`.
- O cadastro de cobrança valida nome (mínimo de 3 caracteres), CPF/CNPJ,
  telefone com DDD, ao menos uma peça, quantidade inteira dentro do estoque,
  forma de venda, parcelas de 1 a 12 e data limite válida e não anterior a hoje.
- Campos inválidos recebem borda vermelha e a tentativa gera um único toast com
  a mensagem padronizada da especificação.
- A situação da peça é derivada da quantidade e do limite de estoque. A situação
  da cobrança considera parcelas pagas e vencimento, com janela de sete dias
  incluindo o dia atual.
- As mensagens padronizadas ficam centralizadas em `src/utils/validacao.js`.

## Critérios de aceite

Checklist revisado na implementação atual:

| Critério | Status |
| --- | --- |
| CA-01 — Login com e-mail válido ou CPF do protótipo e senha correta | OK |
| CA-02 — Falha de autenticação exibe apenas o aviso genérico | OK |
| CA-03 — Marcação de erro do login desaparece ao editar | OK |
| CA-04 — Pesquisa por nome/código sem diferenciar maiúsculas | OK |
| CA-05 — Pesquisa e filtro por situação combinados | OK |
| CA-06 — Mensagem “Nenhuma peça encontrada.” sem resultados | OK |
| CA-07 — Ajuste e salvamento individual de quantidade, sem negativos | OK |
| CA-08 — Salvamento indisponível sem alteração pendente | OK |
| CA-09 — Detalhes com quantidade vigente e ação de editar | OK |
| CA-10 — Cadastro de peça bloqueado com campos obrigatórios vazios | OK |
| CA-11 — Cadastro válido confirmado ao usuário | OK |
| CA-12 — Edição exige seleção da peça e todos os campos | OK |
| CA-13 — Cobranças acessível e sempre aberta em registradas | OK |
| CA-14 — Quantidade acima do estoque recusada com disponibilidade | OK |
| CA-15 — Peça repetida somada respeitando o estoque | OK |
| CA-16 — Vencimento em até 7 dias e vencidas sinalizados | OK |
| CA-17 — Baixa de parcela avança sem ultrapassar o total | OK |
| CA-18 — Baixa total somente após confirmação; cancelar não altera | OK |
| CA-19 — Cobranças pagas permanecem no histórico | OK |
| CA-20 — Dashboard alterna 15/30 dias com três KPIs e dois gráficos | OK |
| CA-21 — Pop-ups e avisos usam as mensagens padronizadas | OK |
| CA-22 — Telas operáveis em desktop e abaixo de 800 px | OK |
| CA-23 — Nenhuma operação depende de backend/API/banco | OK |
| CA-24 — CPF mascarado como `###.###.###-##` | OK |
| CA-25 — Telefone mascarado como `(DD)-NNNNN-NNNN` | OK |
| CA-26 — Cobrança com CPF/CNPJ, telefone ou data inválidos bloqueada | OK |
| CA-27 — Data limite não anterior ao dia atual | OK |

## Referências

- `specs/specs.yml` e `specs/especificacao.md` — regras, mensagens e critérios de aceite.
- `arquitetura/aquitetura.yml` — plano de implementação por fases e tarefas.
