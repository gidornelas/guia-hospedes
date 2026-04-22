# Deploy Rapido no Railway

> Estado revisado em 22/04/2026
> URL ativa: `https://guia-hospedes-production.up.railway.app`

## 1. Variaveis minimas

Configure no Railway:

```env
DATABASE_URL=postgresql://usuario:senha@host/database?sslmode=require
AUTH_SECRET=gere-uma-chave-segura
NEXTAUTH_SECRET=gere-uma-chave-segura
NEXTAUTH_URL=https://seu-app.up.railway.app
NEXT_PUBLIC_APP_URL=https://seu-app.up.railway.app
NEXT_PUBLIC_APP_NAME=GuiaHospedes
NODE_ENV=production
```

Opcionais para auth real:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
```

## 2. Checklist do painel

- [ ] Repositorio correto
- [ ] Branch correta
- [ ] `Root Directory` correto
- [ ] `Build Command` vazio ou `npm run build`
- [ ] `Start Command` vazio ou `npm start`
- [ ] `DATABASE_URL` correta
- [ ] `AUTH_SECRET` ou `NEXTAUTH_SECRET` configurado
- [ ] `NEXTAUTH_URL` correta
- [ ] `NEXT_PUBLIC_APP_URL` correta
- [ ] `NODE_OPTIONS` ausente
- [ ] Se necessario, `NIXPACKS_NODE_VERSION=20`

## 3. Checklist tecnico

- [ ] `npm run db:generate`
- [ ] `npm run build`
- [ ] `package.json` com `engines` e `packageManager`
- [ ] `mise.toml` presente
- [ ] `.nvmrc` presente

## 4. Passo a passo rapido

1. Confirme as variaveis no Railway.
2. Garanta que `NODE_OPTIONS` nao existe.
3. Faça deploy ou redeploy.
4. Acompanhe logs de build e runtime.

## 5. Pos-deploy

Valide nesta ordem:

- [ ] `/` responde `200`
- [ ] `/cadastro` responde `200`
- [ ] `/login` responde `200`
- [ ] criacao de conta real funciona
- [ ] login por e-mail e senha funciona
- [ ] login com Google funciona, se configurado
- [ ] esqueci a senha funciona, se SMTP configurado
- [ ] `/app` abre autenticado
- [ ] logs nao mostram `TypeError: Invalid URL`

## 6. Comandos uteis

```powershell
railway status
railway variables
railway deployment list
railway logs --latest --lines 100
railway up -c
```

## 7. Observacoes

- o produto nao depende mais de usuarios demo para login
- o fluxo recomendado de cadastro inicial e `/cadastro`
- a configuracao detalhada de Google e SMTP esta em [docs/autenticacao_setup.md](docs/autenticacao_setup.md)
