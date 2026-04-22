# Guia de Deploy em Producao

> Atualizado em 22/04/2026 apos a implementacao da autenticacao real.

## 1. Estado atual

- Producao ativa: `https://guia-hospedes-production.up.railway.app`
- App: Railway
- Banco: Neon PostgreSQL
- Sessao: JWT manual em cookie
- Auth adicional: Google OAuth opcional
- Recuperacao de senha: SMTP opcional

## 2. Requisitos antes do deploy

- [ ] `npm run db:generate`
- [ ] `npm run build`
- [ ] `DATABASE_URL` pronta no Railway
- [ ] `AUTH_SECRET` ou `NEXTAUTH_SECRET` pronta
- [ ] `NEXTAUTH_URL` pronta
- [ ] `NEXT_PUBLIC_APP_URL` pronta

## 3. Variaveis recomendadas

Obrigatorias:

| Variavel | Observacao |
|---|---|
| `DATABASE_URL` | conexao PostgreSQL |
| `AUTH_SECRET` | segredo JWT |
| `NEXTAUTH_SECRET` | compatibilidade com o codigo atual |
| `NEXTAUTH_URL` | URL publica completa |
| `NEXT_PUBLIC_APP_URL` | URL publica completa |
| `NEXT_PUBLIC_APP_NAME` | normalmente `GuiaHospedes` |
| `NODE_ENV` | `production` |

Opcionais:

| Variavel | Quando usar |
|---|---|
| `GOOGLE_CLIENT_ID` | habilitar login Google |
| `GOOGLE_CLIENT_SECRET` | habilitar login Google |
| `SMTP_HOST` | redefinicao por e-mail |
| `SMTP_PORT` | redefinicao por e-mail |
| `SMTP_USER` | redefinicao por e-mail |
| `SMTP_PASS` | redefinicao por e-mail |
| `EMAIL_FROM` | remetente da redefinicao |
| `NIXPACKS_NODE_VERSION=20` | fallback de Node no Railway |

Nao usar:

| Variavel | Motivo |
|---|---|
| `NODE_OPTIONS=--require /app/url-patch.js` | ja quebrou build e runtime |

## 4. Fluxo recomendado

1. Atualize o codigo local.
2. Rode:

```bash
npm run db:generate
npm run build
```

3. Faça commit e push.
4. No Railway, confirme variaveis e configuracao do servico.
5. Faça o deploy.
6. Valide o app em producao.

## 5. Validacao pos-deploy

- [ ] `/` abre
- [ ] `/cadastro` abre
- [ ] `/login` abre
- [ ] cadastro de conta real funciona
- [ ] login por senha funciona
- [ ] login Google funciona, se configurado
- [ ] esqueci a senha funciona, se SMTP configurado
- [ ] `/app` abre autenticado
- [ ] nao ha erro `500`

## 6. Observacoes importantes

- usuarios demo nao sao mais o fluxo oficial de autenticacao
- o seed continua util para dados de produto, mas nao cria acessos prontos
- veja [docs/autenticacao_setup.md](docs/autenticacao_setup.md) para configurar Google e SMTP
