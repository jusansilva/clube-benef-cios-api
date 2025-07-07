# Clube Benefícios API (NestJS)

API RESTful para gestão de clientes, produtos e vendas, construída com NestJS, TypeORM e JWT.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Requisitos](#requisitos)
- [Instalação e Startup](#instalação-e-startup)
  - [Rodando com Docker](#rodando-com-docker)
  - [Rodando Manualmente](#rodando-manualmente)
- [Configuração de Ambiente](#configuração-de-ambiente)
- [Endpoints Principais](#endpoints-principais)
  - [Auth](#auth)
  - [Clientes](#clientes)
  - [Produtos](#produtos)
  - [Vendas](#vendas)
- [Testes](#testes)
- [Documentação Swagger](#documentação-swagger)
- [Observações](#observações)

---

## Visão Geral

Esta API permite:
- Cadastro e autenticação de clientes
- Cadastro, listagem, atualização e remoção de produtos
- Registro e consulta de vendas (compras de produtos por clientes)
- Filtros de produtos por faixa de preço

---

## Requisitos

- Node.js >= 18.x
- Docker e Docker Compose (opcional, recomendado)
- PostgreSQL (se rodar manualmente)

---

## Instalação e Startup

### Rodando com Docker

1. **Configure o arquivo `.env`** (veja [Configuração de Ambiente](#configuração-de-ambiente))
2. **Suba os containers:**
   ```sh
   docker-compose up --build
   ```
3. Acesse a API em `http://localhost:3000/api-docs`

### Rodando Manualmente

1. **Instale as dependências:**
   ```sh
   npm install
   ```
2. **Configure o arquivo `.env`** (veja abaixo)
3. **Suba o banco de dados PostgreSQL** (local ou em container)
4. **Execute as migrations (se houver):**
   ```sh
   npm run typeorm migration:run
   ```
5. **Inicie a aplicação:**
   ```sh
   npm run start:dev
   ```
6. Acesse a API em `http://localhost:3000/api-docs`

---

## Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=clube_beneficios
JWT_SECRET=sua_chave_jwt
JWT_EXPIRES_IN=3600s
```

---

## Endpoints Principais

### Auth

- **POST /auth/login**
  - Autentica um cliente e retorna um JWT.
  - **Body:** `{ "email": "user@email.com", "password": "123456" }`
  - **Response:** `{ "access_token": "..." }`

### Clientes

- **POST /client**
  - Cria um novo cliente.
  - **Body:** `{ "name": "Nome", "email": "email", "password": "senha" }`
- **GET /client**
  - Lista todos os clientes (sem senha).
- **GET /client/:id**
  - Busca cliente por ID.
- **PUT /client/:id**
  - Atualiza dados do cliente.
- **DELETE /client/:id**
  - Remove cliente.

### Produtos

- **POST /product**
  - Cria um novo produto. (Requer autenticação)
  - **Body:** `{ "name": "Produto", "description": "Desc", "price": 99.99 }`
- **GET /product**
  - Lista todos os produtos.
- **GET /product/:id**
  - Busca produto por ID.
- **PUT /product/:id**
  - Atualiza produto. (Requer autenticação)
- **DELETE /product/:id**
  - Remove produto. (Requer autenticação)
- **GET /product/filter/price?min_price=10&max_price=100**
  - Lista produtos filtrando por faixa de preço.

### Vendas

- **POST /sale**
  - Cria uma venda (compra de produtos por um cliente). (Requer autenticação)
  - **Body:** `{ "client_id": 1, "product_ids": [1,2] }`
- **GET /sale**
  - Lista todas as vendas.
- **GET /sale/:id**
  - Busca venda por ID.
- **PUT /sale/:id**
  - Atualiza venda.
- **DELETE /sale/:id**
  - Remove venda.

---

## Testes

- Para rodar todos os testes:
  ```sh
  npm test
  ```
- Para rodar um teste específico:
  ```sh
  npm run test -- src/product/product.controller.spec.ts
  ```

---

## Documentação Swagger

Acesse a documentação interativa em:  
`http://localhost:3000/api-docs`

---

## Observações

- As senhas são armazenadas com hash seguro (bcrypt).
- JWT é utilizado para autenticação e autorização.
- O projeto segue boas práticas de modularização, DTOs, validação e testes automatizados.
- Para dúvidas ou sugestões, abra uma issue no repositório.

---

## 👨‍💻 Colaborador

<a href="https://github.com/jusansilva">
 <img style="border-radius: 50%;" src="https://github.com/jusansilva.png" width="100px;" alt="Foto de Jusan Magno"/>
 <br />
 <sub><b>Jusan Magno</b></sub>
</a>
<br />

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jusanmagno/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jusansilva)