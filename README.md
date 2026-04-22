# GuiaHóspedes

Plataforma de gestão de guias digitais de boas-vindas para imóveis de hospedagem.

## Visão Geral

GuiaHóspedes é uma plataforma SaaS B2B para anfitriões e gestores de imóveis de hospedagem criarem guias digitais automáticos, padronizados e profissionais para seus hóspedes.

## Stack

- **Next.js 16** com App Router
- **TypeScript**
- **Tailwind CSS 4** + shadcn/ui
- **Prisma ORM** + PostgreSQL
- **Autenticacao custom** com sessao JWT em cookie
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

Edite o arquivo `.env` com suas configuracoes. Para desenvolvimento local, o minimo necessario e:

```env
DATABASE_URL="postgresql://usuario:senha@host/database?sslmode=require"
AUTH_SECRET="troque-por-um-secret-forte-de-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **Nunca faça commit do arquivo .env**. Em producao, configure as variaveis diretamente no dashboard da plataforma de deploy.

### 3. Configure o banco de dados

```bash
npx prisma generate
npx prisma db push
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
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint |
| `npm run lint:fix` | Corrige problemas do ESLint |
| `npm run format` | Formata código com Prettier |
| `npm run db:generate` | Gera cliente Prisma |
| `npm run db:migrate` | Cria e aplica migrações |
| `npm run db:push` | Sincroniza schema com banco |
| `npm run db:seed` | Popula banco com dados iniciais do produto |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run typecheck` | Verifica tipos TypeScript |

## Autenticacao

- Acesse `/cadastro` para criar sua primeira conta real
- Acesse `/login` para entrar com senha ou Google
- Acesse `/esqueci-senha` para solicitar redefinicao
- Veja [docs/autenticacao_setup.md](docs/autenticacao_setup.md) para configurar Google e SMTP

## Segurança de Secrets

- **Desenvolvimento:** variáveis no arquivo .env local (gitignored)
- **Produção:** variáveis configuradas no dashboard da plataforma de deploy (Vercel, Railway, etc.)
- Os arquivos .cursorignore e .claudeignore impedem que ferramentas de IA leiam .env
- O .gitignore previne commit acidental de secrets
- **Nunca** inclua .env em commits, PRs ou compartilhe em chats de IA

## Funcionalidades Principais

- **Gestão de Imóveis**: cadastro completo com informações, Wi-Fi, regras, equipamentos, contatos e dicas da região
- **Guias Digitais**: publicação automática de guia com slug público para hóspedes
- **Compartilhamento**: envio via WhatsApp, E-mail, Link direto ou QR Code
- **Reservas**: controle de check-in/check-out, hóspedes, status e origem da reserva
- **PDF do Guia**: geração e download do guia em PDF com branding
- **Multilinguismo**: guias em português, inglês e espanhol com tradução automática (DeepL/Google) e editor manual
- **Analytics**: métricas reais de acessos, compartilhamentos e canais
- **Modelos de Mensagem**: templates personalizáveis para envio aos hóspedes
- **Landing Page**: página de vendas completa com 13 seções

## Documentação

- [docs/implementation-plan.md](docs/implementation-plan.md) — Plano de implementação e status de todas as etapas
- [AGENTS.md](AGENTS.md) — Regras para agentes de IA
- [DEPLOY_PROD.md](DEPLOY_PROD.md) — Guia de deploy em produção (Railway + Neon)
- [DEPLOY_I18N.md](DEPLOY_I18N.md) — Guia de deploy da funcionalidade de multilinguismo

## Licença

MIT
