# Guia de Deploy em Producao

> Atualizado em 22/04/2026

## 1. Estado atual

- Stack: Next.js 16 + TypeScript + Tailwind CSS 4 + Prisma + PostgreSQL
- Deploy: Railway (com `output: 'standalone'`)
- Banco: Neon PostgreSQL
- Auth: JWT manual em cookie HTTP-only
- CI: GitHub Actions (`.github/workflows/ci.yml`)

## 2. Arquivos de deploy

| Arquivo | Proposito |
|---------|-----------|
| `nixpacks.toml` | Blueprint do Railway (Node 20, build, start) |
| `railway.toml` | Configuracoes de deploy do Railway |
| `next.config.ts` | `output: 'standalone'` habilitado |
| `.github/workflows/ci.yml` | CI no GitHub (typecheck + build) |

## 3. Variaveis obrigatorias no Railway

| Variavel | Valor de exemplo |
|---|---|
| `DATABASE_URL` | `postgresql://usuario:senha@host.neon.tech/database?sslmode=require` |
| `AUTH_SECRET` | `minha-chave-secreta-forte-de-32-chars` |
| `NEXT_PUBLIC_APP_URL` | `https://meu-app.up.railway.app` |
| `NEXT_PUBLIC_APP_NAME` | `GuiaHospedes` |
| `NODE_ENV` | `production` |

## 4. Variaveis opcionais

| Variavel | Descricao |
|---|---|
| `GOOGLE_CLIENT_ID` | OAuth Web do Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth Web do Google Cloud Console |
| `SMTP_HOST` | Servidor SMTP (ex: smtp.gmail.com) |
| `SMTP_PORT` | Porta SMTP (ex: 587) |
| `SMTP_USER` | Usuario SMTP |
| `SMTP_PASS` | Senha de app SMTP |
| `EMAIL_FROM` | E-mail de envio (ex: noreply@guiahospedes.com) |

## 5. Passo a passo do deploy

### 5.1 Neon (PostgreSQL)

1. Crie um projeto no [Neon](https://neon.tech)
2. Copie a `DATABASE_URL` de conexao
3. Adicione a `DATABASE_URL` nas variaveis do Railway

### 5.2 Migration no banco

Rode localmente (com `DATABASE_URL` apontando para o Neon):

```bash
npm run db:migrate:deploy
```

Ou, se for a primeira vez:

```bash
npx prisma migrate dev --name init
```

### 5.3 Seed (opcional)

```bash
npm run db:seed
```

### 5.4 Railway

1. Crie um projeto no [Railway](https://railway.app)
2. Conecte o repositorio GitHub
3. Adicione todas as variaveis de ambiente obrigatorias
4. O Railway vai detectar o `nixpacks.toml` e fazer o build automatico
5. Apos o deploy, copie a URL publica e atualize `NEXT_PUBLIC_APP_URL`

## 6. Validacao pos-deploy

- [ ] `/` abre (landing page)
- [ ] `/cadastro` funciona
- [ ] `/login` funciona
- [ ] `/app` abre autenticado
- [ ] CRUD de imoveis funciona
- [ ] CRUD de reservas funciona
- [ ] Guia publico `/g/[slug]` acessivel
- [ ] Compartilhamento registra no banco
- [ ] Analytics mostra dados reais
- [ ] PDF do guia gera corretamente

## 7. Troubleshooting

**Erro: `prisma/client` nao encontrado**
- O `postinstall` ja roda `prisma generate`
- Se persistir, adicione `npx prisma generate` no build command do Railway

**Erro: `DATABASE_URL` nao encontrado**
- Verifique se a variavel esta nas configuracoes do Railway (Environment Variables)
- O `prisma.config.ts` le do `.env` apenas localmente; em producao, do ambiente

**Build falha no CI**
- Verifique se `npm run typecheck` passa localmente
- Verifique se `npm run build` passa localmente

**Erro: `AUTH_SECRET` nao configurado**
- A autenticacao JWT requer `AUTH_SECRET` (ou `NEXTAUTH_SECRET` como fallback)
- Gere um secret forte: `openssl rand -base64 32`
