# GuiaHóspedes

Plataforma de gestão de guias digitais de boas-vindas para imóveis de hospedagem.

## Visão Geral

GuiaHóspedes é uma plataforma SaaS B2B para anfitriões e gestores de imóveis de hospedagem criarem guias digitais automáticos, padronizados e profissionais para seus hóspedes.

## Stack

- **Next.js 16** com App Router
- **TypeScript**
- **Tailwind CSS 4** + shadcn/ui
- **Prisma ORM** + SQLite (dev) / PostgreSQL (prod)
- **NextAuth.js v5** (Auth.js)
- **React Hook Form** + Zod

## Configuração

### 1. Clone e instale dependências

```bash
cd guia-hospedes
npm install --legacy-peer-deps
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo .env com suas configurações. Para desenvolvimento local, o mínimo necessário é:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="dev-secret-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

> **Nunca faça commit do arquivo .env**. Ele está no .gitignore. Em produção, configure as variáveis diretamente no dashboard da plataforma de deploy (Vercel, Railway, etc.).

### 3. Configure o banco de dados

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| 
pm run dev | Inicia servidor de desenvolvimento |
| 
pm run build | Build de produção |
| 
pm run start | Inicia servidor de produção |
| 
pm run lint | Executa ESLint |
| 
pm run lint:fix | Corrige problemas do ESLint |
| 
pm run format | Formata código com Prettier |
| 
pm run db:generate | Gera cliente Prisma |
| 
pm run db:migrate | Cria e aplica migrações |
| 
pm run db:push | Sincroniza schema com banco |
| 
pm run db:seed | Popula banco com dados demo |
| 
pm run db:studio | Abre Prisma Studio |
| 
pm run typecheck | Verifica tipos TypeScript |

## Dados de Demonstração

| E-mail | Senha | Papel |
|--------|-------|-------|
| joao@guiahospedes.com | senha123 | Admin |
| maria@exemplo.com | senha123 | Manager |
| carlos@exemplo.com | senha123 | Host |

## Segurança de Secrets

- **Desenvolvimento:** variáveis no arquivo .env local (gitignored)
- **Produção:** variáveis configuradas no dashboard da plataforma de deploy (Vercel, Railway, etc.)
- Os arquivos .cursorignore e .claudeignore impedem que ferramentas de IA leiam .env
- O .gitignore previne commit acidental de secrets
- **Nunca** inclua .env em commits, PRs ou compartilhe em chats de IA

## Documentação

- [PLAN.md](PLAN.md) — Plano original de arquitetura e implementação
- [PROGRESS.md](PROGRESS.md) — Progresso completo e planos futuros (documento vivo)
- [AGENTS.md](AGENTS.md) — Regras para agentes de IA

## Licença

MIT
