# Especificação Front-End — Constru Móveis

Documento consolidado de UI/UX, regras de negócio e interações do protótipo navegável de gestão de estoque.

---

## 1. Visão geral

- **Nome do sistema:** Constru Móveis — Gestão de Estoque
- **Plataforma:** aplicação web responsiva, desktop first
- **Tecnologia:** Vite, React, TypeScript e Tailwind CSS
- **Persistência:** dados locais do protótipo, sem backend ou APIs
- **Objetivo:** autenticar usuários, consultar e ajustar o estoque, cadastrar e editar peças, gerenciar cobranças e acompanhar indicadores em um dashboard
- **Telas:** Login, Estoque, Detalhes da peça, Cadastrar peça, Editar peça, Cobranças e Dashboard

> Como não há backend, os dados e as alterações são mantidos somente durante o uso atual do protótipo e podem ser restaurados ao recarregar a aplicação.

---

## 2. Identidade visual

### 2.1. Marca

- A identificação utilizada na sidebar e no breadcrumb do header é **Constru Móveis**.
- A sidebar apresenta “Constru” e “Móveis” em duas linhas.
- O copyright do protótipo usa o ano **2026**.

### 2.2. Paleta principal

| Categoria | Cor | Uso |
| :--- | :--- | :--- |
| Azul primário | `#2563EB` | botões, links, navegação ativa, ícones e destaques |
| Azul escuro | `#0F172A` | sidebar, títulos e textos principais |
| Fundo da aplicação | `#F8FAFC` | áreas de conteúdo e login |
| Superfície | `#FFFFFF` | cards, tabela, modal e campos |
| Borda | `#DBE3EE` | campos, divisórias e controles |
| Texto secundário | `#64748B` | descrições e metadados |
| Sucesso | `#10B981` | confirmações e feedback positivo |
| Erro | `#EF4444` | bordas, alertas e validações |

### 2.3. Tipografia

- **Família:** Inter, sans-serif
- **Fonte-base fora da sidebar:** 19 px
- **Sidebar:** mantém tamanhos próprios, com navegação em 18 px e marca em 20 px
- Os títulos, textos de apoio, tabelas, formulários, cards e modais usam uma hierarquia proporcional à fonte-base.

### 2.4. Responsividade

- Em telas menores que 800 px:
  - a sidebar fixa é substituída por um menu lateral sobreposto;
  - filtros e pesquisa ocupam 100% da largura;
  - tabelas ocultam colunas secundárias;
  - formulários passam de duas para uma coluna;
  - abas e cards de cobranças são empilhados;
  - KPIs e gráficos são empilhados;
  - pop-ups ocupam a largura disponível com margens laterais.

---

## 3. Componentes e padrões

### 3.1. Sidebar

Itens disponíveis:

1. Estoque
2. Cadastrar peça
3. Editar peça
4. Cobranças
5. Dashboard

O item da tela atual recebe fundo azul e texto branco. O rodapé contém a ação **Sair** e a versão do protótipo.

### 3.2. Header

- Breadcrumb com a marca **Constru Móveis** e o nome da tela atual.
- Informações da usuária:
  - Mariana Silva
  - Administradora
- Avatar com as iniciais `MS`.

### 3.3. Campos

- Estado padrão: fundo branco, borda neutra e cantos arredondados.
- Foco: borda azul.
- Erro: borda vermelha com halo vermelho suave.
- Campos numéricos bloqueiam caracteres incompatíveis com a regra do campo.

### 3.4. Pop-ups

- **Erro:** borda lateral vermelha, mensagem objetiva e botão de fechar.
- **Sucesso:** borda lateral verde, mensagem de confirmação e botão de fechar.
- No mobile, os pop-ups se adaptam à largura da tela.

---

## 4. Regras de negócio

## 4.1. Login

### Credenciais aceitas

- **E-mail:** qualquer endereço em formato válido.
- **CPF permitido no protótipo:** `444.333.222-11`.
- **Senha correta:** `SENHA123`.
- A senha diferencia letras maiúsculas de minúsculas.

### Segurança e validação

- Se o e-mail/CPF ou a senha estiver incorreto:
  - os dois campos recebem borda vermelha;
  - o sistema exibe somente a mensagem **“Dados inválidos”**;
  - o sistema não informa qual credencial falhou.
- Campos vazios usam o mesmo feedback genérico.
- Ao editar novamente uma credencial, o estado visual de erro é removido.
- O campo de senha possui um ícone de olho:
  - **Mostrar senha:** exibe o conteúdo digitado;
  - **Ocultar senha:** volta a mascarar o conteúdo.

---

## 4.2. Estoque

### Pesquisa

- Pesquisa em tempo real por:
  - nome da peça;
  - código da peça.
- A pesquisa não diferencia letras maiúsculas de minúsculas.
- A pesquisa funciona em conjunto com o filtro de status.
- Quando não há resultados, é exibida a mensagem **“Nenhuma peça encontrada.”**

### Filtro por status

Opções:

1. Todos os status
2. Em estoque
3. Estoque baixo
4. Crítico

Ao selecionar uma opção, somente os produtos correspondentes permanecem visíveis. A contagem no rodapé acompanha o resultado.

### Proporção da toolbar

- Barra de pesquisa: aproximadamente 80% da largura.
- Filtro de status: aproximadamente 20% da largura.
- No mobile, os dois controles ocupam 100% e ficam empilhados.

### Tabela

Ordem das colunas:

1. **PEÇA**
2. **CÓDIGO**
3. **STATUS**
4. **QUANTIDADE**
5. **SALVAR**

As colunas Código, Status e Quantidade possuem largura e alinhamento uniformes.

### Edição rápida de quantidade

- Cada produto possui um controle próprio:
  - botão `+` à esquerda;
  - quantidade atual no centro;
  - botão `−` à direita.
- A quantidade não pode ficar abaixo de zero.
- Alterações são independentes para cada produto.
- O botão de salvar:
  - usa um ícone azul de 22 px;
  - fica em destaque quando existe alteração pendente;
  - só pode ser acionado após a quantidade ser modificada.
- Ao salvar, a nova quantidade passa a ser a referência atual do item.

### Detalhes

- Clicar no nome da peça abre o modal de detalhes.
- O modal apresenta:
  - nome;
  - descrição;
  - código;
  - quantidade atual;
  - status;
  - ação para editar.
- A quantidade mostrada no modal considera a alteração atual da tabela.

---

## 4.3. Cadastro de peça

### Campos

1. Nome da peça
2. Código
3. Categoria
4. Descrição
5. Valor
6. Limite de estoque
7. Quantidade em estoque

### Regras

- Campos obrigatórios:
  - Nome da peça
  - Código
  - Categoria
  - Descrição
  - Quantidade em estoque
  - Limite de estoque
- O campo **Valor** é opcional no cadastro.
- Valor aceita somente números com até duas casas decimais, usando ponto ou vírgula.
- Limite de estoque aceita somente números inteiros.
- Quantidade em estoque:
  - permite digitação direta;
  - aceita somente números inteiros positivos;
  - rejeita zero, negativos, decimais e letras;
  - também pode ser alterada pelos botões `+` e `−`.

### Feedback

- Se algum campo obrigatório não estiver preenchido:
  - os campos inválidos recebem borda vermelha;
  - aparece o pop-up **“todos campos devem ser preenchidos”**.
- Quando o cadastro é válido:
  - aparece o pop-up **“peça cadastrada com sucesso”**.

---

## 4.4. Edição de peça

### Seleção da peça

- O formulário começa sem uma peça selecionada.
- A primeira opção do dropdown é **“Selecione”**.
- Peças disponíveis no protótipo:
  - Rolamento 6203
  - Broca Tamanho Médio
  - Broca Tamanho Pequeno
  - Fresa para madeira
  - Lâmina circular para MDF
- Ao selecionar uma peça, o formulário carrega automaticamente:
  - nome;
  - código;
  - categoria;
  - descrição;
  - valor;
  - quantidade;
  - limite de estoque.
- A identificação na área de imagem acompanha a peça selecionada.

### Validação

Na edição, são obrigatórios:

1. Seleção da peça
2. Nome
3. Código
4. Categoria
5. Descrição
6. Valor
7. Quantidade em estoque
8. Limite de estoque

Se houver campos vazios:

- os campos inválidos recebem borda vermelha;
- aparece o pop-up **“Todos campos devem ser preenchidos”**.

Quando todos os dados estiverem válidos e o usuário salvar:

- aparece o pop-up **“Peça atualizada com sucesso!”**.

---

## 4.5. Cobranças

### Navegação interna

- A tela é acessada pelo item **Cobranças** da sidebar.
- No topo da página existem duas abas:
  1. **Cobranças registradas**
  2. **Cadastrar cobrança**
- **Cobranças registradas** é sempre a primeira visualização apresentada ao entrar na tela.
- Após cadastrar uma nova cobrança, o sistema retorna automaticamente para a aba de cobranças registradas.

### Cadastro de nova cobrança

Dados obrigatórios:

1. Nome do comprador
2. CPF ou CNPJ
3. Telefone
4. Pelo menos uma peça do estoque
5. Forma de venda
6. Quantidade de parcelas
7. Data limite de vencimento

Formas de venda disponíveis:

- Cartão
- Dinheiro
- Pix

A quantidade de parcelas pode ser definida entre `1x` e `12x`.

### Seleção de peças

- O usuário seleciona uma peça e informa uma quantidade inteira positiva.
- Cada opção mostra a quantidade disponível no estoque.
- É possível adicionar mais de uma peça na mesma cobrança.
- Uma peça adicionada pode ser removida antes de concluir o cadastro.
- Se a mesma peça for adicionada novamente, as quantidades são somadas.
- O sistema impede que a soma selecionada ultrapasse o estoque disponível.
- Quando a quantidade é inválida, o sistema informa a disponibilidade atual.
- A validação usa as quantidades salvas na tela de estoque.

### Feedback de cadastro

- Se algum dado obrigatório estiver ausente, aparece o pop-up:
  - **“Preencha todos os dados da cobrança.”**
- Quando o cadastro é concluído, aparece o pop-up:
  - **“Cobrança cadastrada com sucesso!”**

### Cards de cobranças

Cada cobrança registrada aparece em um card contendo:

- nome do cliente;
- CPF ou CNPJ;
- telefone;
- peças e quantidades;
- forma de venda;
- vencimento;
- parcelas pagas e total de parcelas;
- barra de progresso do pagamento;
- situação atual.

### Cores e vencimento

- **Azul / branco:** cobrança em aberto, sem vencimento próximo.
- **Amarelo:** vencimento em até sete dias, incluindo cobranças que vencem no dia atual.
- **Vermelho:** data limite vencida.
- **Verde:** cobrança totalmente paga.
- A situação é recalculada automaticamente enquanto a tela permanece aberta.

### Baixas e histórico

- Cobranças parceladas possuem a ação **Baixar parcela**.
- Cada baixa de parcela incrementa o progresso em uma unidade, sem ultrapassar o total de parcelas.
- Cobranças em aberto possuem a ação **Baixa total**.
- Antes da baixa total, o sistema abre um modal de confirmação contendo:
  - nome do cliente;
  - explicação de que o registro permanecerá no histórico;
  - botão **Cancelar**;
  - botão **Confirmar baixa total**.
- A cobrança só é marcada como totalmente paga após a confirmação.
- Cobranças pagas não são apagadas e continuam visíveis como histórico.
- O histórico é mantido durante a sessão atual do protótipo.

---

## 4.6. Dashboard

### Filtro de período

Opções:

1. Últimos 30 dias
2. Últimos 15 dias

### KPIs

1. **Produtos vendidos**
   - Valor: `1.284`
   - Variação: `+8,2%`
2. **Categoria de peças mais vendidas**
   - Destaque: `Rolamento 6203`
   - Participação: `46% das vendas`
3. **Peça que não saiu no mês**
   - Destaque: `Engrenagem Motriz Z24`
   - Resultado: `0 saídas no mês`

### Gráficos

- Movimentação de estoque nos últimos seis meses.
- Distribuição atual do estoque por categoria:
  - Mecânica: 46%
  - Elétrica: 31%
  - Hidráulica: 23%

---

## 5. Fluxo de navegação

```text
[Login]
   |
   |-- Credenciais válidas
   v
[Estoque]
   |-- Pesquisa por nome ou código
   |-- Filtro por status
   |-- Ajuste e salvamento de quantidade
   |-- Clique no nome da peça --> [Modal de detalhes]
   |
   |-- Sidebar --> [Cadastrar peça]
   |-- Sidebar --> [Editar peça]
   |-- Sidebar --> [Cobranças]
   |                    |-- [Cobranças registradas] (visão inicial)
   |                    |-- [Cadastrar cobrança]
   |                    |-- Baixar parcela
   |                    |-- Baixa total --> [Modal de confirmação]
   |-- Sidebar --> [Dashboard]
   |-- Sidebar --> [Sair] --> [Login]
```

---

## 6. Dados locais usados no protótipo

Produtos exibidos no estoque:

- Rolamento 6203
- Correia Industrial A32
- Filtro Hidráulico HF-10
- Engrenagem Motriz Z24
- Sensor de Proximidade

Categorias disponíveis nos formulários:

- Mecânica
- Elétrica
- Hidráulica

---

## 7. Critérios de aceite

- Login aceita e-mail válido ou o CPF definido, sempre com a senha correta.
- Erros de autenticação não revelam qual credencial falhou.
- Pesquisa e filtro de status podem ser usados simultaneamente.
- Quantidades do estoque podem ser alteradas e salvas individualmente.
- Cadastro bloqueia envio quando algum campo obrigatório está vazio.
- Edição exige seleção da peça e preenchimento de todos os campos.
- A sidebar contém o item Cobranças.
- A tela de cobranças abre inicialmente no histórico de registros.
- O cadastro de cobrança impede quantidades superiores ao estoque salvo.
- Cards próximos do vencimento ficam amarelos e cards vencidos ficam vermelhos.
- Cobranças pagas permanecem no histórico.
- A baixa por parcela atualiza o progresso sem ultrapassar o total.
- A baixa total exige confirmação em modal antes de concluir o pagamento.
- Pop-ups de erro e sucesso usam as mensagens definidas nesta especificação.
- Layout permanece navegável em desktop e mobile.
- Nenhuma operação depende de backend, API ou banco de dados.
