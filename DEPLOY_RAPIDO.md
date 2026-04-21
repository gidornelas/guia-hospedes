# Deploy Rápido no Railway

> Estado validado em produção em `21/04/2026`
> URL ativa: `https://guia-hospedes-production.up.railway.app`

## 1. Variáveis mínimas

Configure estas variáveis no Railway:

```env
DATABASE_URL=postgresql://guia-hospedes_owner:SENHA@ep-xxx.us-east-1.aws.neon.tech/guia-hospedes?sslmode=require
AUTH_SECRET=gere-uma-chave-segura-com-openssl-rand-base64-32
NEXTAUTH_SECRET=gere-uma-chave-segura-com-openssl-rand-base64-32
NEXTAUTH_URL=https://placeholder.up.railway.app
NEXT_PUBLIC_APP_URL=https://placeholder.up.railway.app
NEXT_PUBLIC_APP_NAME=GuiaHóspedes
NODE_ENV=production
```

Observações:

- `AUTH_SECRET` ou `NEXTAUTH_SECRET` já resolve a autenticação manual atual
- `NEXTAUTH_URL` e `NEXT_PUBLIC_APP_URL` devem ter `https://`
- não versionar secrets no repositório

## 2. Checklist do painel do Railway

- [ ] Serviço conectado ao repositório correto
- [ ] Branch de deploy correto, normalmente `main`
- [ ] `Root Directory` vazio se o `package.json` estiver na raiz do repositório
- [ ] `Build Command` vazio ou `npm run build`
- [ ] `Start Command` vazio ou `npm start`
- [ ] `DATABASE_URL` correta
- [ ] `AUTH_SECRET` ou `NEXTAUTH_SECRET` configurado
- [ ] `NEXTAUTH_URL` correta
- [ ] `NEXT_PUBLIC_APP_URL` correta
- [ ] `NODE_ENV=production`
- [ ] `NODE_OPTIONS` ausente
- [ ] Se o Railway insistir em errar versão do Node, adicionar `NIXPACKS_NODE_VERSION=20`

## 3. Checklist técnico do projeto

- [ ] `package.json` com `engines.node`, `engines.npm` e `packageManager`
- [ ] `mise.toml` presente com Node `20.19.0`
- [ ] `.nvmrc` presente com Node `20.19.0`
- [ ] Projeto sobe com `npm start`
- [ ] Projeto não depende de `output: 'standalone'`
- [ ] `npm run typecheck` passa
- [ ] `npm run build` passa

## 4. Passo a passo rápido

1. Abra o serviço no Railway.
2. Vá em **Settings** e confirme repositório, branch e `Root Directory`.
3. Vá em **Variables** e confira as variáveis mínimas.
4. Remova `NODE_OPTIONS` se existir.
5. Clique em **Deployments**.
6. Execute **Redeploy** ou faça novo deploy.
7. Acompanhe os logs até o container ficar pronto.

## 5. O que esperar nos logs

Fluxo saudável:

1. instalação do Node
2. `npm ci`
3. `postinstall` com `prisma generate`
4. `npm run build`
5. `npm start`
6. container pronto

Se falhar:

- `mise install`: problema de versão/configuração do Node
- `npm ci`: dependência
- `prisma generate`: Prisma
- `npm run build`: código ou configuração Next.js
- `npm start`: runtime ou variável de ambiente

## 6. Pós-deploy

Valide nesta ordem:

- [ ] `/` responde `200`
- [ ] `/login` responde `200`
- [ ] login com `joao@guiahospedes.com / senha123` funciona
- [ ] `/app` abre sem loop
- [ ] dashboard abre sem `500`
- [ ] logs não mostram `TypeError: Invalid URL`

## 7. Comandos úteis

```powershell
railway status
railway variables
railway deployment list
railway logs --latest --lines 100
railway up -c
```

## 8. Situação resolvida

O incidente principal de deploy/login foi resolvido com:

- remoção de `NODE_OPTIONS`
- fix de `metadataBase` no `src/app/layout.tsx`
- remoção de `output: 'standalone'`
- fixação explícita da versão do Node
