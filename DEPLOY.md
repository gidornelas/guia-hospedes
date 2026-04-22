# Deploy no Railway

> Este documento legado agora serve apenas como ponte.

O fluxo recomendado atual esta em:

- [DEPLOY_RAPIDO.md](DEPLOY_RAPIDO.md)
- [DEPLOY_PROD.md](DEPLOY_PROD.md)
- [docs/autenticacao_setup.md](docs/autenticacao_setup.md)

## Estado atual

- deploy alvo: Railway
- banco: PostgreSQL
- autenticacao: JWT manual + Google OAuth opcional
- recuperacao de senha: SMTP opcional

## Nao use mais este caminho

Os fluxos antigos baseados em:

- SQLite efemero como padrao
- usuarios demo para login
- validacao com credenciais fixas

nao representam mais o estado atual do projeto.

## Checklist minimo atual

```bash
npm run db:generate
npm run build
```

Depois:

1. confirme variaveis no Railway
2. deploy/redeploy
3. valide `/cadastro`, `/login` e `/app`
