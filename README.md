# RocketAPI - FakeStore API

Uma API RESTful para Loja de Produtos construída com NestJS, Prisma e SQLite.

## 🚀 Funcionalidades

- **Autenticação**
  - Login e registro de usuários
  - Proteção de rotas com JWT
  - Roles (USER/ADMIN)

- **Produtos**
  - CRUD completo de produtos
  - Importação automática de produtos da FakeStore API
  - Busca por título
  - Controle de estoque

- **Carrinho**
  - Adicionar/remover itens
  - Visualizar carrinho atual

- **Pedidos**
  - Criar pedidos a partir do carrinho
  - Cálculo automático de total
  - Atualização automática de estoque

## 🛠️ Tecnologias

- NestJS
- Prisma ORM
- SQLite
- JWT para autenticação
- TypeScript
- Class Validator
- Axios

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- npm ou pnpm

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/RocketAPI.git
cd RocketAPI/product-api
```

2. Instale as dependências:
```bash
npm install
# ou
pnpm install
```

3. Configure o banco de dados:
```bash
npx prisma migrate dev
# ou
pnpm prisma migrate dev
```

4. Inicie o servidor:
```bash
npm run start:dev
# ou
pnpm run start:dev
```

## 🚦 Rotas da API

### Autenticação
- `POST /auth/register` - Registro de usuário
- `POST /auth/login` - Login
- `GET /auth/profile` - Perfil do usuário

### Produtos
- `GET /product` - Lista todos os produtos
- `GET /product/ids?ids` - Busca produto por ID
- `GET /product/search?title=` - Busca produtos por título
- `POST /product` - Cria novo produto (ADMIN)
- `PUT /product/:id` - Atualiza produto (ADMIN)
- `DELETE /product/:id` - Remove produto (ADMIN)
- `POST /product/import` - Importa produtos da FakeStore API (ADMIN)

### Carrinho
- `GET /cart` - Visualiza carrinho atual
- `POST /cart/add/:productId` - Adiciona item ao carrinho
- `DELETE /cart/remove/:id` - Remove item do carrinho

### Pedidos
- `POST /order` - Cria compra com itens do carrinho
- `GET /order` - Visualiza histórico de compras do usuário logado

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="seu-secret-aqui"
```

## 👥 Usuários

Por padrão, você pode criar:
- Usuários normais via `/auth/register`
- Admins via `/auth/register-admin`

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.