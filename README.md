# 📦 Front-end - E-commerce & Painel Administrativo

Este é o **front-end** do sistema de Gestão de E-commerce e Painel Administrativo. O projeto foi desenvolvido para fornecer um ambiente administrativo completo para gerenciar produtos, categorias, clientes e pedidos, além de preparar a base para o e-commerce voltado ao cliente final.

---

## 🚀 Funcionalidades

### 🔑 Painel Administrativo

- **Dashboard**
  - Visão geral de vendas
  - Produtos com estoque baixo
  - Pedidos pendentes
  - Clientes ativos

- **Gerenciamento de Produtos**
  - Cadastro, edição e exclusão
  - Listagem com filtros (categoria, preço, estoque)
  - Upload de imagens

- **Gerenciamento de Categorias**
  - Cadastro, edição e exclusão
  - Listagem com contagem de produtos

- **Gerenciamento de Clientes**
  - Cadastro, edição e exclusão
  - Histórico de compras

- **Gerenciamento de Pedidos**
  - Listagem com filtros (status, data, cliente)
  - Detalhes do pedido (itens, cliente, status)
  - Atualização de status
  - Relatórios de vendas

---

### 🛒 E-commerce (planejado)

- Página Inicial: destaques, promoções, categorias
- Catálogo de Produtos: listagem com filtros
- Página de Produto: detalhes, avaliações, botão de compra
- Carrinho: resumo, quantidades, descontos
- Checkout: entrega, pagamento, resumo final
- Minha Conta: histórico, dados pessoais, favoritos

---

## 🧩 Componentes Essenciais

- **Card** → produtos, categorias, clientes, pedidos  
- **Tabela** → listagem de dados  
- **Formulários** → cadastro, edição, busca  
- **Botões** → ações rápidas (adicionar, editar, excluir, comprar)  
- **Modal** → exibir detalhes e confirmações  
- **Gráficos** → relatórios e estatísticas  

---

## 🛠️ Tecnologias

- **Framework**: NextJS  
- **UI Library**: Material UI  
- **Gerenciamento de Estado**: Context API  
- **Estilização**: CSS  

---

## 📋 Considerações Adicionais

- **Responsividade** → compatível com desktop, tablet e mobile  
- **Performance** → otimização de assets e build  

---

## ▶️ Como Rodar o Projeto (Modo Tradicional)

```bash
# Clone o repositório
git clone https://github.com/Viniciusm15/cadastro-pedidos-frontend.git

# Instale as dependências
npm install

# Rode o projeto
npm run dev
```

### 🔧 Configuração do Ambiente

Crie um arquivo .env na raiz do projeto.

```bash
# URL do backend
NEXT_PUBLIC_BACK_END_URL=https://localhost:5001 (use https para evitar problema de CORS)
```
---

## 🐳 Docker & Docker Compose

O projeto está containerizado com Docker para facilitar o desenvolvimento e o deploy.

### ▶️ Como Rodar com Docker Compose

```bash
# Clone o repositório
git clone https://github.com/Viniciusm15/cadastro-pedidos-frontend.git

# Navegue até o diretório do projeto
cd cadastro-pedidos-frontend

# Execute o docker compose
docker compose -f docker-compose.yml up --build

# Rode a aplicação
docker compose up
```

### 🔧 Configuração do Docker

Dockerfile:

```bash
# Imagem Node.js oficial
FROM node:18-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de package para instalar dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia todo o projeto para dentro do container
COPY . .

# Expondo a porta padrão do Next.js
EXPOSE 3000

# Comando para rodar em modo desenvolvimento
CMD ["npm", "run", "dev"]
```

### 📝 Arquivo docker-compose.yml

```bash
version: "3.9"

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: order-registration-web-application
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BACK_END_URL=${NEXT_PUBLIC_BACK_END_URL}
    volumes:
      - .:/app
      - /app/node_modules
    restart: unless-stopped
```
