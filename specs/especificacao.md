# Especificação de Comportamento — Constru Móveis

Documento derivado de `md_ConstruMoveis_atualizado.md`.

Esta especificação descreve **o comportamento esperado** do sistema, sem entrar em
detalhes de implementação. Ela vale como referência para desenvolvimento, revisão e
teste: descreve o que deve ser observável por quem usa o sistema, e não como o
sistema deve ser construído por dentro.

- **Sistema:** Constru Móveis — Gestão de Estoque
- **Versão:** 1.0
- **Áreas:** Login, Estoque, Detalhes da peça, Cadastrar peça, Editar peça, Cobranças, Dashboard
- **Versão estruturada:** `specs/specs.yml`

---

## 1. Objetivos

### 1.1 Problema

A gestão de estoque de peças e o controle de cobranças de uma loja de móveis são feitos
de forma dispersa. Não existe um lugar único para consultar a quantidade disponível de
cada peça, identificar itens em nível baixo ou crítico, manter o cadastro das peças
atualizado e acompanhar o que foi vendido e o que ainda está em aberto.

Como consequência, o responsável:

- descobre a falta de uma peça tarde, quando ela já é necessária;
- perde tempo conferindo a mesma informação em fontes diferentes;
- não tem visão do andamento dos pagamentos e dos vencimentos próximos;
- não consegue enxergar quais peças giram e quais ficam paradas.

### 1.2 Resultado esperado

- Usuária autenticada acessa todas as áreas a partir de um único login.
- Estoque consultável por nome ou código, com filtro por situação e ajuste individual de quantidade.
- Peças cadastradas e editadas com validação dos dados antes de qualquer registro.
- Cobranças registradas com composição de peças, controle de parcelas, vencimento e situação de pagamento.
- Indicadores de vendas e de distribuição do estoque reunidos em um dashboard.
- Experiência utilizável em desktop e em telas pequenas.

### 1.3 Público-alvo

Perfil administrativo responsável pelo estoque e pelas cobranças.

---

## 2. Requisitos funcionais

### 2.1 Autenticação — RF-01

O sistema solicita identificação por e-mail ou CPF e senha antes de liberar as áreas
internas. Credenciais válidas levam à tela de Estoque.

- **Credenciais aceitas no protótipo:** qualquer e-mail em formato válido ou o CPF `444.333.222-11`, sempre com a senha `SENHA123`.
- O campo de identificação aceita e-mail ou CPF e aplica máscara de CPF quando a entrada contém apenas dígitos, preservando o texto quando há arroba.
- A senha diferencia maiúsculas de minúsculas.
- Credencial incorreta ou campo vazio produzem **um único aviso genérico**, sem indicar qual campo falhou.
- Os dois campos recebem marcação visual de erro no mesmo momento.
- Ao editar novamente um campo, a marcação de erro daquele campo desaparece.
- A senha pode ser exibida e ocultada durante a digitação.
- Sair encerra a sessão e retorna à tela de login.

### 2.2 Consulta de estoque — RF-02

A tela de estoque lista as peças com identificação, código, situação e quantidade.

- A pesquisa acompanha a digitação e considera **nome** e **código** da peça.
- A pesquisa ignora diferenças entre maiúsculas e minúsculas.
- Pesquisa e filtro por situação funcionam em conjunto.
- Sem resultados, a lista informa que nenhuma peça foi encontrada e a contagem indica zero.
- A contagem de itens visíveis acompanha o resultado da pesquisa e do filtro.
- Clicar no nome da peça abre a visualização de detalhes.
- A lista apresenta as colunas **peça, código, situação, quantidade e salvar**, nesta ordem, com largura e alinhamento uniformes nas três colunas intermediárias.

### 2.3 Situação da peça — RF-03

Cada peça é classificada automaticamente a partir da sua quantidade e do seu limite de
estoque.

- Situações possíveis: **em estoque**, **estoque baixo** e **crítico**.
- O filtro por situação oferece também a opção de exibir todos os status.
- A situação é recalculada sempre que a quantidade ou o limite de estoque da peça mudam.

### 2.4 Ajuste rápido de quantidade — RF-04

A quantidade de cada peça pode ser alterada diretamente na lista, com confirmação
individual.

- Cada peça possui seu próprio controle de ajuste, com aumento e redução de uma unidade por acionamento.
- A quantidade nunca fica abaixo de zero.
- O ajuste de uma peça não afeta as demais.
- A confirmação do item fica **indisponível enquanto não houver alteração pendente** e é evidenciada quando houver.
- Confirmar faz da nova quantidade a referência atual da peça.
- Ajustes não confirmados não alteram a referência da peça.

### 2.5 Detalhes da peça — RF-05

Uma visualização de detalhes apresenta os dados da peça e um atalho para editá-la.

- Exibe nome, descrição, código, quantidade atual, situação e a ação de editar.
- A quantidade exibida considera o ajuste pendente na lista, mesmo antes de confirmado.
- O atalho de edição abre a tela de edição com a peça correspondente já selecionada.

### 2.6 Cadastro de peça — RF-06

- **Campos:** nome da peça, código, categoria, descrição, valor, limite de estoque e quantidade em estoque.
- **Obrigatórios:** nome, código, categoria, descrição, quantidade em estoque e limite de estoque.
- **Valor** é opcional e aceita até duas casas decimais, com ponto ou vírgula.
- **Limite de estoque** aceita apenas números inteiros.
- **Quantidade em estoque** aceita apenas inteiros positivos, por digitação direta ou pelos botões de incremento e decremento; zero, negativos, decimais e letras são rejeitados.
- Campos numéricos recusam caracteres incompatíveis com a regra do campo.
- Campo obrigatório vazio é recusado, com marcação nos campos inválidos e aviso ao usuário.
- Cadastro válido é concluído com confirmação ao usuário.

### 2.7 Edição de peça — RF-07

- O formulário inicia **sem peça selecionada**, e a primeira opção do seletor é um convite explícito de seleção.
- Selecionar uma peça carrega automaticamente nome, código, categoria, descrição, valor, quantidade e limite de estoque.
- A identificação visual acompanha a peça selecionada.
- Na edição, **todos** os campos são obrigatórios, incluindo a seleção da peça.
- Campo vazio é recusado, com marcação nos campos inválidos e aviso ao usuário.
- Dados válidos são salvos com confirmação ao usuário.

### 2.8 Cobranças — acesso e cadastro — RF-08

- A área de cobranças é acessada pela navegação principal e possui duas visões: **cobranças registradas** e **cadastrar cobrança**.
- A visão de cobranças registradas é sempre a primeira apresentada.
- **Dados obrigatórios da nova cobrança:** nome do comprador, CPF ou CNPJ, telefone, ao menos uma peça do estoque, forma de venda, quantidade de parcelas e data limite de vencimento.
- **Nome do comprador** deve ter ao menos três caracteres.
- **CPF ou CNPJ** informado deve ser válido e é mascarado durante a digitação.
- **Telefone** informado deve ter DDD e 10 ou 11 dígitos e é mascarado durante a digitação.
- **Data limite de vencimento** deve ser válida, não pode ser anterior ao dia atual e é informada no formato dd/mm/aaaa.
- **Formas de venda:** cartão, dinheiro e pix.
- O parcelamento vai de **1 a 12 parcelas**.
- Todos os campos de entrada são obrigatórios, incluindo ao menos uma peça.
- Campo não preenchido é recusado com aviso ao usuário; campo com valor inválido é recusado com aviso de preenchimento incorreto.
- Dado obrigatório ausente é recusado com aviso ao usuário.
- Cadastro concluído é confirmado e retorna automaticamente à visão de cobranças registradas.

### 2.9 Cobranças — composição de peças — RF-09

- Cada opção de peça informa a quantidade disponível no estoque.
- A quantidade informada deve ser um inteiro positivo.
- É possível compor a cobrança com mais de uma peça e remover uma peça antes de concluir.
- Adicionar novamente a mesma peça **soma** as quantidades, em vez de criar uma segunda linha.
- A soma selecionada nunca ultrapassa o estoque disponível; quantidade inválida é recusada com a indicação da disponibilidade atual.
- A disponibilidade considerada é a quantidade **salva** na tela de estoque, e não o ajuste pendente.

### 2.10 Cobranças — situação e vencimento — RF-10

Cada cobrança registrada aparece em um cartão com nome do cliente, CPF ou CNPJ,
telefone, peças e quantidades, forma de venda, vencimento, parcelas pagas e total,
barra de progresso e situação.

- **Aberta, sem vencimento próximo:** identificação padrão (azul/branco).
- **Vencimento em até sete dias, incluindo o dia atual:** sinalizada como próxima do vencimento (amarelo).
- **Data limite ultrapassada:** sinalizada como vencida (vermelho).
- **Totalmente paga:** sinalizada como concluída (verde).
- A situação é recalculada automaticamente enquanto a tela permanece aberta.

### 2.11 Cobranças — baixas e histórico — RF-11

- Cobranças parceladas oferecem baixa de **uma parcela por vez**.
- Cada baixa avança o progresso em uma unidade, **sem ultrapassar o total de parcelas**.
- Cobranças em aberto oferecem **baixa total**.
- A baixa total exige confirmação em modal com o nome do cliente, a informação de que o registro permanece no histórico, a ação de cancelar e a ação de confirmar.
- Cancelar não altera a cobrança; a cobrança só é considerada paga após a confirmação.
- Cobranças pagas nunca são apagadas e continuam visíveis como histórico durante a sessão.

### 2.12 Dashboard — RF-12

- **Filtro de período:** últimos 30 dias ou últimos 15 dias.
- **Produtos vendidos:** total do período com a variação.
- **Categoria de peça mais vendida:** destaque e participação nas vendas.
- **Peça que não saiu no mês:** destaque e indicação de zero saídas.
- **Gráficos:** movimentação de estoque nos últimos seis meses e distribuição atual do estoque por categoria.
- Indicadores e gráficos acompanham o período escolhido.

### 2.13 Navegação geral — RF-13

- A navegação principal oferece **estoque**, **cadastrar peça**, **editar peça**, **cobranças** e **dashboard**.
- A área em uso é destacada em relação às demais.
- O cabeçalho identifica o sistema, a área atual e a usuária conectada.
- A ação de sair está sempre disponível e leva à tela de login.

### 2.14 Máscaras de entrada e normalização — RF-14

- Campos de documento e telefone aceitam apenas dígitos e aplicam máscara durante a digitação.
- **CPF** é formatado como `###.###.###-##`.
- **CNPJ** é formatado como `##.###.###/####-##`.
- **Telefone** é formatado como `(DD)-NNNNN-NNNN`.
- O campo **E-mail ou CPF** do login preserva o texto quando há arroba e aplica a máscara de CPF quando a entrada contém apenas dígitos.
- A máscara não bloqueia a digitação nem reescreve a posição do cursor.
- O valor normalizado é o mesmo que seria enviado a um backend.

---

## 3. Requisitos não funcionais

### 3.1 Acessibilidade

- Toda ação é operável apenas com teclado, com ordem de foco coerente com a leitura da tela.
- Campos possuem rótulo associado; controles que exibem apenas ícone possuem nome acessível.
- Erros são comunicados por texto, nunca apenas por cor.
- Texto e elementos interativos mantêm contraste legível sobre o fundo em que aparecem.
- Modais e pop-ups recebem foco ao abrir, mantêm o foco contido enquanto abertos e devolvem o foco ao elemento de origem ao fechar.
- Modais e pop-ups podem ser fechados pelo teclado.

### 3.2 Desempenho

- Pesquisa e filtro respondem durante a digitação, sem ação de confirmação.
- O retorno de qualquer ação (salvar, cadastrar, dar baixa) é percebido como imediato.
- A troca entre áreas e entre as abas de cobranças não produz espera perceptível.

### 3.3 Compatibilidade e responsividade

- Utilizável nas versões atuais dos navegadores de uso comum, em desktop e em dispositivos móveis.
- Comportamento consistente em resoluções de desktop e em telas pequenas.
- A digitação de valores numéricos acompanha o formato local, aceitando ponto ou vírgula como separador decimal.
- Abaixo de **800 px** de largura:
  - a navegação lateral fixa é substituída por um menu sobreposto;
  - pesquisa e filtro ocupam toda a largura e ficam empilhados;
  - a lista de peças oculta as colunas secundárias, mantendo legível a identificação do item;
  - formulários passam de duas para uma coluna;
  - abas e cartões de cobrança são empilhados, assim como indicadores e gráficos;
  - pop-ups e modais ocupam a largura disponível com margens laterais.
- Em qualquer largura, a barra de pesquisa ocupa cerca de 80% da linha de filtros e o filtro de situação cerca de 20%.

### 3.4 Usabilidade e consistência

- Interface em português do Brasil, com mensagens objetivas e **mesmo texto para o mesmo evento** em toda a aplicação.
- Estrutura e vocabulário consistentes entre as áreas.
- Mensagens de erro não expõem qual credencial falhou nem detalhes internos.
- O estado atual (área, aba, filtro, seleção) é sempre visível.
- Máscaras de entrada preservam a posição do cursor e não impedem a digitação.

### 3.5 Identidade visual

- Marca **Constru Móveis**, grafada em duas linhas na navegação lateral e presente no cabeçalho; copyright com o ano **2026**.
- Paleta com azul primário para ações e destaques, azul escuro para navegação e títulos, fundo claro para conteúdo, superfície branca para cartões e campos, e cores próprias para sucesso e erro.
- Tipografia sem serifa com hierarquia proporcional entre títulos, textos de apoio, listas, formulários, cartões e modais.
- Campos em estado padrão, com destaque visual de foco e marcação visual de erro.
- Pop-ups de erro e de sucesso diferenciados visualmente, com mensagem e ação de fechar.

---

## 4. Restrições

### 4.1 Escopo

- Entrega limitada a uma aplicação web responsiva, com prioridade para desktop.
- **Não há** integração com backend, API, serviço externo ou banco de dados.
- **Não há** múltiplos perfis de acesso nem gestão de usuários.
- **Não há** emissão fiscal, cálculo de imposto ou envio de cobrança ao cliente.
- **Não há** importação ou exportação de arquivos.
- **Não há** cadastro de novas categorias além das disponíveis.

### 4.2 Dados

- Os dados existem apenas durante a sessão atual e são descartados ao recarregar a aplicação.
- O conjunto inicial de peças, categorias e cobranças é fixo no protótipo.
- O histórico de cobranças é mantido somente durante a sessão atual.
- O ajuste de quantidade passa a valer como referência após a confirmação do salvamento.
- A disponibilidade usada na composição de cobranças é a quantidade salva no estoque.

### 4.3 Base de referência do protótipo

- **Peças exibidas no estoque:** Rolamento 6203, Correia Industrial A32, Filtro Hidráulico HF-10, Engrenagem Motriz Z24, Sensor de Proximidade.
- **Peças selecionáveis na edição:** Rolamento 6203, Broca Tamanho Médio, Broca Tamanho Pequeno, Fresa para madeira, Lâmina circular para MDF.
- **Categorias:** Mecânica, Elétrica, Hidráulica.
- **Indicadores do dashboard:** 1.284 produtos vendidos com variação de +8,2%; Rolamento 6203 como categoria mais vendida com 46% das vendas; Engrenagem Motriz Z24 com 0 saídas no mês.
- **Distribuição do estoque:** Mecânica 46%, Elétrica 31%, Hidráulica 23%.

### 4.4 Técnicas

- Execução no navegador, sem dependência de servidor de aplicação próprio.
- Valores monetários e datas no formato local brasileiro.
- O layout precisa permanecer operável nas duas faixas de largura previstas (acima e abaixo de 800 px).

---

## 5. Critérios de aceite

### 5.1 Mensagens padronizadas

| Contexto | Mensagem |
| :--- | :--- |
| Falha de autenticação (credencial ou senha incorreta, campo vazio) | “Dados inválidos” |
| Pesquisa ou filtro de estoque sem resultado | “Nenhuma peça encontrada.” |
| Cadastro de peça com campo obrigatório vazio | “todos campos devem ser preenchidos” |
| Cadastro de peça concluído | “peça cadastrada com sucesso” |
| Edição de peça com campo obrigatório vazio | “Todos campos devem ser preenchidos” |
| Edição de peça concluída | “Peça atualizada com sucesso!” |
| Cadastro de cobrança com campo obrigatório não preenchido | “Preencha todos os dados da cobrança.” |
| Cadastro de cobrança com campo preenchido de forma inválida | “Preencha os campos destacados corretamente.” |
| Cadastro de cobrança concluído | “Cobrança cadastrada com sucesso” |

### 5.2 Condições de “pronto”

| ID | Critério |
| :--- | :--- |
| CA-01 | Login é aceito com e-mail válido ou com o CPF do protótipo, sempre acompanhado da senha correta. |
| CA-02 | Falha de autenticação exibe apenas o aviso genérico e não revela qual credencial está incorreta. |
| CA-03 | A marcação de erro dos campos de login desaparece quando a credencial é editada. |
| CA-04 | Pesquisa por nome e pesquisa por código localizam a peça, sem distinção de maiúsculas e minúsculas. |
| CA-05 | Pesquisa e filtro por situação aplicados em conjunto retornam somente as peças que atendem aos dois critérios. |
| CA-06 | Sem correspondência, a lista informa que nenhuma peça foi encontrada. |
| CA-07 | A quantidade de estoque pode ser ajustada e salva individualmente, sem afetar outras peças e sem assumir valor negativo. |
| CA-08 | O salvamento de quantidade permanece indisponível enquanto não houver alteração pendente. |
| CA-09 | A visualização de detalhes apresenta os dados da peça com a quantidade vigente na lista e oferece a ação de editar. |
| CA-10 | Cadastro com campo obrigatório vazio é bloqueado, com marcação nos campos e aviso ao usuário. |
| CA-11 | Cadastro válido é concluído com confirmação ao usuário. |
| CA-12 | A edição exige a seleção da peça e o preenchimento de todos os campos antes de salvar. |
| CA-13 | A área de cobranças é acessível pela navegação e abre sempre na visão de cobranças registradas. |
| CA-14 | A composição de cobrança recusa quantidade superior ao estoque salvo e informa a disponibilidade. |
| CA-15 | A mesma peça adicionada duas vezes aparece somada e respeita o limite do estoque. |
| CA-16 | Cartões com vencimento em até sete dias são sinalizados como próximos do vencimento e cartões vencidos como vencidos. |
| CA-17 | A baixa de parcela avança o progresso em uma unidade e não ultrapassa o total de parcelas. |
| CA-18 | A baixa total só é aplicada após confirmação no modal, e o cancelamento não altera a cobrança. |
| CA-19 | Cobranças pagas continuam visíveis no histórico. |
| CA-20 | O dashboard alterna entre os períodos de 15 e 30 dias e apresenta os três indicadores e os dois gráficos previstos. |
| CA-21 | Pop-ups e avisos usam exatamente as mensagens definidas nesta especificação. |
| CA-22 | Todas as telas permanecem navegáveis e operáveis em desktop e em telas menores que 800 px. |
| CA-23 | Nenhuma operação depende de backend, API ou banco de dados. |
| CA-24 | CPF digitado sem pontuação é formatado como ###.###.###-## no login e no cadastro de cobrança. |
| CA-25 | Telefone digitado sem pontuação é formatado como (DD)-NNNNN-NNNN. |
| CA-26 | Cadastro de cobrança com valor inválido (CPF/CNPJ, telefone ou data) é bloqueado, com borda vermelha nos campos e pop-up de preenchimento incorreto. |
| CA-27 | Data limite de cobrança não pode ser anterior ao dia atual. |

---

## 6. Cenários de comportamento

### CN-01 — Login com credenciais válidas

**Dado** que estou na tela de login
**Quando** informo um e-mail em formato válido ou o CPF do protótipo, informo a senha correta e aciono a entrada
**Então** sou levada à tela de estoque e o cabeçalho identifica a área atual e a usuária conectada

### CN-02 — Login com credencial incorreta

**Dado** que estou na tela de login
**Quando** informo uma credencial ou uma senha incorreta e aciono a entrada
**Então** os dois campos recebem marcação de erro, vejo apenas o aviso de dados inválidos, nenhuma indicação revela qual credencial falhou e permaneço na tela de login

### CN-03 — Correção do erro de login

**Dado** que os campos de login estão marcados como inválidos
**Quando** edito qualquer um dos campos
**Então** a marcação de erro do campo editado é removida

### CN-04 — Exibição da senha

**Dado** que digitei uma senha no campo de senha
**Quando** aciono o controle de exibir senha
**Então** o conteúdo digitado fica visível
**E quando** aciono novamente o controle
**Então** o conteúdo volta a ser mascarado

### CN-05 — Pesquisa de peça por nome ou código

**Dado** que estou na tela de estoque com peças listadas
**Quando** digito parte do nome ou do código de uma peça
**Então** a lista mostra somente as peças correspondentes durante a digitação, a correspondência ignora maiúsculas e minúsculas e a contagem de itens acompanha o resultado

### CN-06 — Pesquisa sem resultados

**Dado** que estou na tela de estoque
**Quando** digito um termo que não corresponde a nenhuma peça
**Então** vejo a mensagem de que nenhuma peça foi encontrada e a contagem indica zero itens

### CN-07 — Pesquisa combinada com filtro de situação

**Dado** que estou na tela de estoque
**Quando** seleciono uma situação no filtro e mantenho ou informo um termo de pesquisa
**Então** vejo somente as peças que atendem à situação e ao termo ao mesmo tempo, com a contagem acompanhando o resultado combinado

### CN-08 — Ajuste de quantidade com limite inferior

**Dado** que uma peça está com quantidade zero
**Quando** aciono a redução de quantidade
**Então** a quantidade permanece em zero
**E quando** aciono o aumento de quantidade
**Então** a quantidade aumenta em uma unidade

### CN-09 — Salvamento de quantidade ajustada

**Dado** que alterei a quantidade de uma peça na lista e ainda não confirmei o ajuste
**Quando** aciono a confirmação daquele item
**Então** a nova quantidade passa a ser a referência atual da peça, a situação é recalculada, a confirmação volta a ficar indisponível até um novo ajuste e as demais peças permanecem inalteradas

### CN-10 — Detalhes da peça com ajuste pendente

**Dado** que alterei a quantidade de uma peça sem confirmar
**Quando** aciono o nome da peça
**Então** a visualização de detalhes apresenta nome, descrição, código, quantidade, situação e a ação de editar, com a quantidade refletindo o ajuste pendente
**E quando** aciono a ação de editar
**Então** a tela de edição é aberta com a peça correspondente selecionada

### CN-11 — Cadastro com campo obrigatório vazio

**Dado** que estou no formulário de cadastro de peça
**Quando** deixo vazio ao menos um campo obrigatório (nome, código, categoria, descrição, limite de estoque ou quantidade) e aciono o cadastro
**Então** os campos inválidos recebem marcação de erro, vejo o aviso de que todos os campos devem ser preenchidos e nenhuma peça é registrada

### CN-12 — Valor opcional e formatos numéricos

**Dado** que estou no formulário de cadastro de peça
**Quando** deixo o campo de valor sem preenchimento, informo os demais campos obrigatórios e aciono o cadastro
**Então** o cadastro é aceito
**E quando** informo valor com mais de duas casas decimais, limite de estoque com decimais ou quantidade com zero, valor negativo ou letras
**Então** o campo recusa os caracteres ou valores incompatíveis com sua regra

### CN-13 — Cadastro válido de peça

**Dado** que preenchi todos os campos obrigatórios com dados válidos
**Quando** aciono o cadastro
**Então** vejo a confirmação de que a peça foi cadastrada com sucesso e a peça passa a ser considerada nas demais áreas

### CN-14 — Edição sem peça selecionada

**Dado** que abri o formulário de edição
**Quando** tento salvar sem selecionar uma peça
**Então** vejo o convite de seleção como primeira opção do seletor, os campos inválidos recebem marcação de erro, vejo o aviso de que todos os campos devem ser preenchidos e nenhuma alteração é salva

### CN-15 — Carregamento de peça para edição

**Dado** que estou no formulário de edição
**Quando** seleciono uma peça no seletor
**Então** nome, código, categoria, descrição, valor, quantidade e limite de estoque são preenchidos com os dados da peça e a identificação visual acompanha a seleção
**E quando** preencho os campos e salvo
**Então** vejo a confirmação de peça atualizada com sucesso e os dados passam a valer nas demais áreas

### CN-16 — Abertura da área de cobranças

**Dado** que estou autenticada
**Quando** aciono cobranças na navegação
**Então** a visão de cobranças registradas é apresentada primeiro e cada cobrança aparece em seu cartão com os dados do cliente, itens, vencimento, progresso e situação

### CN-17 — Cadastro de cobrança incompleto

**Dado** que estou no cadastro de cobrança
**Quando** deixo ausente algum dado obrigatório, incluindo ao menos uma peça, e aciono a conclusão
**Então** vejo o aviso para preencher todos os dados da cobrança e a cobrança não é registrada

### CN-18 — Composição de cobrança acima do estoque

**Dado** que uma peça possui quantidade disponível no estoque
**Quando** informo uma quantidade maior que a disponível para essa peça
**Então** a inclusão é recusada e o sistema informa a disponibilidade atual
**E quando** adiciono a mesma peça novamente respeitando o limite
**Então** as quantidades aparecem somadas em uma única linha e a soma não ultrapassa o estoque disponível

### CN-19 — Remoção de peça da cobrança

**Dado** que adicionei peças ao cadastro de cobrança
**Quando** removo uma das peças antes de concluir
**Então** a peça sai da composição e as demais peças e quantidades permanecem como estavam

### CN-20 — Cobrança cadastrada

**Dado** que informei todos os dados obrigatórios e ao menos uma peça com quantidade válida
**Quando** concluo o cadastro
**Então** vejo a confirmação de cobrança cadastrada com sucesso, sou levada de volta à visão de cobranças registradas e a nova cobrança aparece em aberto

### CN-21 — Situação por vencimento

**Dado** que uma cobrança está em aberto
**Quando** a data limite está a até sete dias, incluindo o dia atual, ou já foi ultrapassada
**Então** o cartão é sinalizado como próximo do vencimento no primeiro caso e como vencido no segundo, com a situação atualizada automaticamente enquanto a tela permanece aberta

### CN-22 — Baixa de parcela

**Dado** que uma cobrança parcelada está em aberto
**Quando** aciono a baixa de uma parcela
**Então** o progresso avança uma unidade e o número de parcelas pagas é atualizado no cartão
**E quando** todas as parcelas forem baixadas
**Então** a cobrança é sinalizada como concluída e novas baixas não ultrapassam o total de parcelas

### CN-23 — Baixa total com confirmação

**Dado** que uma cobrança em aberto permite baixa total
**Quando** aciono a baixa total
**Então** vejo um modal com o nome do cliente, a informação de que o registro permanece no histórico, a ação de cancelar e a ação de confirmar
**E quando** aciono cancelar
**Então** a cobrança permanece em aberto e sem alteração
**E quando** aciono confirmar baixa total
**Então** a cobrança é marcada como totalmente paga e continua visível no histórico

### CN-24 — Filtro de período no dashboard

**Dado** que estou no dashboard
**Quando** seleciono últimos 15 dias ou últimos 30 dias
**Então** os indicadores e os gráficos passam a refletir o período escolhido, mantendo visíveis o total de produtos vendidos, a categoria mais vendida e a peça sem saída

### CN-25 — Uso em tela pequena

**Dado** que a janela tem menos de 800 px de largura
**Quando** navego pelas áreas do sistema
**Então** a navegação é acessada por menu sobreposto, pesquisa e filtro ficam empilhados ocupando toda a largura, a lista oculta as colunas secundárias mantendo a identificação do item, formulários, abas, cartões, indicadores e gráficos são empilhados, e pop-ups e modais ocupam a largura disponível com margens laterais

### CN-26 — Encerramento da sessão

**Dado** que estou autenticada em uma área interna
**Quando** aciono a ação de sair
**Então** a sessão é encerrada, sou levada à tela de login e as áreas internas deixam de estar acessíveis até nova autenticação

### CN-27 — Recarga da aplicação

**Dado** que cadastrei peças, ajustei quantidades e registrei cobranças
**Quando** recarrego a aplicação
**Então** os dados voltam ao conjunto inicial do protótipo e nenhuma informação é recuperada de backend, API ou banco de dados

### CN-28 — Máscara de CPF no login

**Dado** que estou na tela de login
**Quando** digito apenas dígitos no campo de identificação
**Então** o valor é formatado como ###.###.###-##
**E** a digitação não é bloqueada
**E quando** digito um e-mail com arroba
**Então** o texto é preservado sem máscara

### CN-29 — Máscara de telefone no cadastro de cobrança

**Dado** que estou no cadastro de cobrança
**Quando** digito apenas dígitos no campo de telefone
**Então** o valor é formatado como (DD)-NNNNN-NNNN
**E** a digitação não é bloqueada

### CN-30 — Cadastro de cobrança com campo inválido

**Dado** que estou no cadastro de cobrança
**Quando** preencho todos os campos, mas um deles tem valor inválido, como CPF com dígitos verificadores errados, telefone incompleto ou data anterior ao dia atual, e aciono a conclusão
**Então** os campos inválidos recebem borda vermelha
**E** vejo o pop-up de preenchimento incorreto
**E** a cobrança não é registrada

### CN-31 — Data limite inválida na cobrança

**Dado** que estou no cadastro de cobrança
**Quando** informo uma data limite anterior ao dia atual ou em formato inválido
**Então** o campo de data recebe borda vermelha
**E** vejo o pop-up de preenchimento incorreto
**E** a cobrança não é registrada
