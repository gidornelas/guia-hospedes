# Guia de Deploy em Produção — GuiaHóspedes

> Documento atualizado após a correção do deploy e do login em produção em `21/04/2026`.

## 1. Estado atual

- Produção ativa: `https://guia-hospedes-production.up.railway.app`
- Banco: Neon PostgreSQL
- App: Railway
- Repositório: GitHub
- Login validado em produção
- Dashboard validada em produção

## 2. Arquitetura atual

- GitHub para versionamento
- Railway para build, deploy e runtime
- Neon para banco PostgreSQL
- Prisma para acesso ao banco
- Autenticação manual JWT com `AUTH_SECRET` ou `NEXTAUTH_SECRET`

## 3. Requisitos antes do deploy

- [ ] `npm run typecheck` passando
- [ ] `npm run build` passando
- [ ] `package.json` com `engines` e `packageManager`
- [ ] `mise.toml` presente
- [ ] `.nvmrc` presente
- [ ] `DATABASE_URL` pronta no Railway
- [ ] `AUTH_SECRET` ou `NEXTAUTH_SECRET` pronta no Railway
- [ ] `NEXT_PUBLIC_APP_URL` com URL pública completa

## 4. Variáveis recomendadas no Railway

Obrigatórias:

| Variável | Observação |
|---|---|
| `DATABASE_URL` | conexão do Neon |
| `AUTH_SECRET` | segredo JWT |
| `NEXTAUTH_SECRET` | fallback compatível com o código atual |
| `NEXTAUTH_URL` | URL pública completa com `https://` |
| `NEXT_PUBLIC_APP_URL` | URL pública completa com `https://` |
| `NEXT_PUBLIC_APP_NAME` | normalmente `GuiaHóspedes` |
| `NODE_ENV` | `production` |

Opcionais:

| Variável | Quando usar |
|---|---|
| `NIXPACKS_NODE_VERSION=20` | se o Railway não respeitar a versão do Node |

Não usar:

| Variável | Motivo |
|---|---|
| `NODE_OPTIONS=--require /app/url-patch.js` | já causou quebra de build/runtime |

## 5. Fluxo recomendado de deploy

1. Atualize o código local.
2. Rode:

```bash
npm run typecheck
npm run build
```

3. Faça commit e push no GitHub.
4. No Railway, confirme:
   - repositório correto
   - branch correto
   - `Root Directory` correto
   - variáveis corretas
5. Faça o redeploy.
6. Valide produção.

## 6. Validação pós-deploy

Checklist mínimo:

- [ ] home `/` abre
- [ ] `/login` abre
- [ ] login com `joao@guiahospedes.com / senha123` funciona
- [ ] `/app` abre autenticado
- [ ] não há erro `500`
- [ ] logs não mostram `TypeError: Invalid URL`

## 7. Correções já aplicadas neste projeto

As correções que estabilizaram o deploy foram:

- fixação da versão do Node em:
  - `package.json`
  - `mise.toml`
  - `.nvmrc`
- remoção de `output: 'standalone'` em `next.config.ts`
- definição de `metadataBase` em `src/app/layout.tsx`
- melhoria do helper `ensureValidUrl()` em `src/lib/utils.ts`
- remoção da variável `NODE_OPTIONS` no Railway

## 8. Comandos úteis

```bash
npm run typecheck
npm run build
railway status
railway variables
railway deployment list
railway logs --latest --lines 100
railway up -c
```

## 9. Troubleshooting real deste projeto

### Erro: `TypeError: Invalid URL`

Causa mais provável:

- URL pública sem protocolo sendo usada internamente pelo runtime

O que conferir:

- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `metadataBase` no `src/app/layout.tsx`
- presença de qualquer workaround antigo com `NODE_OPTIONS`

### Erro no `mise install`

O que conferir:

- `mise.toml`
- `.nvmrc`
- `package.json` com `engines`
- fallback `NIXPACKS_NODE_VERSION=20`

### Erro ao subir o app

O que conferir:

- `Start Command`
- ausência de `output: 'standalone'`
- variáveis de ambiente obrigatórias

## 10. Observações finais

- Nunca versionar secrets
- Nunca recolocar `NODE_OPTIONS` para `url-patch.js`
- Sempre testar login e dashboard após deploy
- Sempre manter GitHub e Railway sincronizados para evitar drift entre produção e repositório
