# Guia de Deploy em Produção — GuiaHóspedes

> Deploy completo: **Neon (PostgreSQL) + Railway (Next.js) + GitHub (CI/CD)**

---

## 1. Visão Geral da Arquitetura

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   GitHub    │ ──────► │   Railway   │ ──────► │    Neon     │
│  (código)   │  push   │  (Next.js)  │  conecta│ (PostgreSQL)│
└─────────────┘         └─────────────┘         └─────────────┘
```

| Serviço | Função | Plano |
|---|---|---|
| **Neon** | Banco de dados PostgreSQL persistente | Free tier (500MB) |
| **Railway** | Hospedagem da aplicação Next.js | Free tier (US$5/mês de crédito) |
| **GitHub** | Repositório de código + CI/CD | Gratuito (repositórios públicos) |

---

## 2. Pré-requisitos

- [ ] Conta no [Neon](https://neon.tech) (você já tem)
- [ ] Conta no [Railway](https://railway.app)
- [ ] Conta no [GitHub](https://github.com)
- [ ] Git instalado localmente
- [ ] Node.js 20+ instalado

---

## 3. Passo a Passo

### Etapa 1 — Preparar o Projeto Localmente

#### 1.1 Verificar se o build passa

```bash
npm run build
```

Se houver erros, corrija antes de prosseguir.

#### 1.2 Verificar variáveis de ambiente local

Copie `.env.example` para `.env` (se ainda não tiver):

```bash
cp .env.example .env
```

#### 1.3 Inicializar repositório Git (se ainda não for um repo)

```bash
git init
git add .
git commit -m "feat: initial commit"
```

---

### Etapa 2 — Criar Repositório no GitHub

#### 2.1 Criar repositório

1. Acesse [github.com/new](https://github.com/new)
2. Nome: `guia-hospedes` (ou o nome que preferir)
3. Visibilidade: **Público** (gratuito) ou **Privado** (precisa de conta Pro para CI/CD avançado)
4. Não inicialize com README, .gitignore ou license (já temos no projeto)
5. Clique em **Create repository**

#### 2.2 Conectar repositório local ao GitHub

```bash
# Substitua SEU_USUARIO pelo seu usuário do GitHub
git remote add origin https://github.com/SEU_USUARIO/guia-hospedes.git
git branch -M main
git push -u origin main
```

---

### Etapa 3 — Configurar Banco de Dados no Neon

#### 3.1 Criar projeto no Neon

1. Acesse [console.neon.tech](https://console.neon.tech)
2. Clique em **New Project**
3. Nome do projeto: `guia-hospedes`
4. Região: escolha a mais próxima (ex: `South America (São Paulo)` se disponível, ou `US East`)
5. Banco de dados: `guia-hospedes`
6. Clique em **Create Project**

#### 3.2 Copiar a DATABASE_URL

Após criar o projeto, o Neon mostrará a **connection string**. Copie o valor completo, que será algo como:

```
postgresql://guia-hospedes_owner:senha_aleatoria@ep-nome-da-branch.us-east-1.aws.neon.tech/guia-hospedes?sslmode=require
```

> Guarde este valor em um local seguro (bloco de notas, password manager). Você precisará dele na Etapa 5.

#### 3.3 Testar conexão local (opcional mas recomendado)

Crie um arquivo `.env.production.local` temporário:

```env
DATABASE_URL="postgresql://..."
```

Teste a conexão:

```bash
npx prisma migrate deploy
npx prisma db seed
```

Se funcionar, o banco está pronto. Delete `.env.production.local` depois.

---

### Etapa 4 — Migrar Schema Prisma para PostgreSQL

#### 4.1 Alterar o provider no schema

Edite `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### 4.2 Limpar migrations antigas (SQLite)

```bash
# Faça backup se quiser preservar
mv prisma/migrations prisma/migrations_backup_sqlite

# Crie pasta nova
mkdir prisma/migrations
```

#### 4.3 Criar nova migration para PostgreSQL

```bash
npx prisma migrate dev --name init_postgres --create-only
```

Verifique o arquivo gerado em `prisma/migrations/.../migration.sql`.

#### 4.4 Aplicar migration no Neon

```bash
# Use a DATABASE_URL do Neon
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

#### 4.5 Rodar seed no Neon

```bash
DATABASE_URL="postgresql://..." npx prisma db seed
```

Verifique se os dados foram inseridos:

```bash
DATABASE_URL="postgresql://..." npx prisma studio
```

#### 4.6 Commit das mudanças

```bash
git add prisma/
git commit -m "chore: migrate database from SQLite to PostgreSQL"
git push origin main
```

---

### Etapa 5 — Configurar Railway

#### 5.1 Criar projeto no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em **New Project**
3. Selecione **Deploy from GitHub repo**
4. Escolha o repositório `guia-hospedes`
5. O Railway detectará automaticamente o `nixpacks.toml`

#### 5.2 Configurar variáveis de ambiente

No painel do Railway, vá em **Variables** e adicione:

| Variável | Valor | Origem |
|---|---|---|
| `DATABASE_URL` | `postgresql://...` | Connection string do Neon |
| `NEXTAUTH_SECRET` | `sua-chave-secreta-aqui` | `openssl rand -base64 32` no terminal |
| `NEXTAUTH_URL` | `https://seu-app.up.railway.app` | URL que o Railway vai gerar |
| `NEXT_PUBLIC_APP_URL` | `https://seu-app.up.railway.app` | Mesma URL acima |
| `NEXT_PUBLIC_APP_NAME` | `GuiaHóspedes` | Nome do app |
| `NODE_ENV` | `production` | Ambiente |

> A URL exata do Railway só aparece após o primeiro deploy. Você pode deixar `NEXTAUTH_URL` e `NEXT_PUBLIC_APP_URL` com um placeholder por enquanto e atualizar depois.

#### 5.3 Gerar NEXTAUTH_SECRET

No terminal local:

```bash
openssl rand -base64 32
```

Copie o resultado e cole no Railway como `NEXTAUTH_SECRET`.

#### 5.4 Deploy inicial

1. O Railway faz deploy automaticamente ao detectar o push no GitHub
2. Ou clique em **Deploy** no painel
3. Acompanhe os logs em **Deployments** > **Logs**

#### 5.5 Obter a URL pública

Após o deploy bem-sucedido:

1. No Railway, vá em **Settings** > **Environment** > **Public Domain**
2. Copie a URL (ex: `https://guia-hospedes-production.up.railway.app`)
3. Atualize `NEXTAUTH_URL` e `NEXT_PUBLIC_APP_URL` com esta URL
4. O Railway fará um novo deploy automaticamente

---

### Etapa 6 — Configurar CI/CD no GitHub (Opcional)

#### 6.1 Criar workflow de CI

Crie o arquivo `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type check
        run: npm run typecheck

      - name: Build
        run: npm run build
```

#### 6.2 Commit e push

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow"
git push origin main
```

#### 6.3 Verificar no GitHub

1. Acesse seu repositório no GitHub
2. Vá em **Actions**
3. Confirme que o workflow rodou com sucesso

---

### Etapa 7 — Validação Pós-Deploy

#### 7.1 Testar a aplicação

1. Acesse a URL do Railway no navegador
2. Teste o login com usuário de demo:
   - E-mail: `admin@guiahospedes.com`
   - Senha: `demo123`
3. Crie um imóvel pelo stepper
4. Publique o guia
5. Acesse o guia público (`/g/...`)

#### 7.2 Verificar persistência

1. Crie um imóvel
2. Faça um novo commit/push qualquer
3. Aguarde o novo deploy
4. Verifique se o imóvel ainda existe

Se persistir, o PostgreSQL está funcionando corretamente.

#### 7.3 Verificar logs

No Railway:
- **Deployments** > **Logs** — logs da aplicação
- **Metrics** — uso de CPU/memória

---

## 4. Troubleshooting

### Erro: "Database connection failed"

**Causa:** Railway não consegue conectar ao Neon.

**Solução:**
1. Verifique se a `DATABASE_URL` está correta
2. No Neon, vá em **Dashboard** > **Connection Details** > copie a string completa
3. Verifique se o Neon está em modo "Active" (não "Idle")

### Erro: "Prisma Client not found"

**Causa:** `prisma generate` não rodou.

**Solução:**
1. Verifique se `postinstall` está no `package.json`
2. No Railway, vá em **Variables** e adicione:
   - `NIXPACKS_NODE_VERSION = 20`
3. Re-deploy

### Erro: "Migration failed"

**Causa:** Conflito de migrations.

**Solução:**
1. No Neon, delete todas as tabelas (ou crie um novo banco)
2. Localmente, delete `prisma/migrations` e gere novamente:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Commit e push

### Erro: "Build failed"

**Causa:** Erro de TypeScript ou dependência.

**Solução:**
1. Rode localmente: `npm run build`
2. Corrija os erros
3. Commit e push

---

## 5. Variáveis de Ambiente — Referência Completa

### Obrigatórias (MVP)

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | Connection string do Neon PostgreSQL | `postgresql://...` |
| `NEXTAUTH_SECRET` | Chave secreta para JWT (32+ chars) | `abc123...` |
| `NEXTAUTH_URL` | URL pública do app | `https://meu-app.up.railway.app` |
| `NEXT_PUBLIC_APP_URL` | URL pública (usada no frontend) | `https://meu-app.up.railway.app` |
| `NEXT_PUBLIC_APP_NAME` | Nome exibido na interface | `GuiaHóspedes` |
| `NODE_ENV` | Ambiente | `production` |

### Opcionais (pós-MVP)

| Variável | Descrição | Quando usar |
|---|---|---|
| `SMTP_HOST` | Servidor SMTP | Quando ativar e-mail |
| `SMTP_PORT` | Porta SMTP | Quando ativar e-mail |
| `SMTP_USER` | Usuário SMTP | Quando ativar e-mail |
| `SMTP_PASS` | Senha SMTP | Quando ativar e-mail |
| `EMAIL_FROM` | E-mail de envio | Quando ativar e-mail |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | ID da conta WhatsApp Business | Quando ativar WhatsApp API |
| `WHATSAPP_PHONE_NUMBER_ID` | ID do número de telefone | Quando ativar WhatsApp API |
| `WHATSAPP_ACCESS_TOKEN` | Token de acesso | Quando ativar WhatsApp API |

---

## 6. Comandos Úteis

### Local

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Migrações (PostgreSQL local via Docker)
npx prisma migrate dev

# Seed
npx prisma db seed

# Studio (visualizar banco)
npx prisma studio
```

### Produção (via Railway CLI — opcional)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Linkar projeto
railway link

# Ver logs em tempo real
railway logs

# Variáveis de ambiente
railway variables
```

---

## 7. Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Código pushado para `main`
- [ ] Projeto criado no Neon com PostgreSQL
- [ ] `DATABASE_URL` copiada e guardada
- [ ] Schema Prisma alterado para `postgresql`
- [ ] Migrations recriadas para PostgreSQL
- [ ] Seed aplicado no Neon
- [ ] Projeto criado no Railway
- [ ] Repositório GitHub conectado ao Railway
- [ ] Variáveis de ambiente configuradas no Railway
- [ ] Primeiro deploy realizado com sucesso
- [ ] URL pública obtida e atualizada nas variáveis
- [ ] Login testado com usuário de demo
- [ ] CRUD de imóvel testado
- [ ] Guia público testado
- [ ] Persistência validada (dados sobrevivem a novo deploy)
- [ ] CI/CD no GitHub configurado (opcional)

---

**Última atualização:** 21/04/2026

---

## Notas Importantes

1. **Nunca commit o `.env`** — ele está no `.gitignore`, mantenha assim.
2. **Nunca exponha `NEXTAUTH_SECRET`** — é a chave mestra da autenticação.
3. **Backup do Neon** — o Neon faz backups automáticos, mas para segurança extra, exporte dumps periodicamente:
   ```bash
   pg_dump "DATABASE_URL" > backup.sql
   ```
4. **Migrações em produção** — sempre use `prisma migrate deploy`, nunca `prisma migrate dev` em produção.
