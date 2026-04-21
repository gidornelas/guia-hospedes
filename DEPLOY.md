# Deploy no Railway (Legacy — SQLite)

> **Aviso:** Este guia é para deploy com SQLite. Para deploy em produção com PostgreSQL persistente, use o **[DEPLOY_PROD.md](DEPLOY_PROD.md)**.

## Visão Geral

Este documento descreve como fazer o deploy do GuiaHóspedes no Railway com SQLite (apenas para demonstração).

## Pré-requisitos

- Conta no [Railway](https://railway.app)
- Repositório Git com o código do projeto

## Variáveis de Ambiente

Configure as seguintes variáveis no painel do Railway:

```env
# Database (SQLite - filesystem efêmero, dados serão perdidos em cada redeploy)
DATABASE_URL="file:./dev.db"

# Auth
NEXTAUTH_URL="https://seu-app.up.railway.app"
NEXTAUTH_SECRET="sua-chave-secreta-aqui-minimo-32-caracteres"

# Email (opcional)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
EMAIL_FROM=""

# App
NEXT_PUBLIC_APP_URL="https://seu-app.up.railway.app"
NEXT_PUBLIC_APP_NAME="GuiaHóspedes"
```

> **Atenção:** O Railway usa filesystem efêmero. Isso significa que o banco SQLite será perdido a cada redeploy. Isso é aceitável para demonstração. Para produção, migre para PostgreSQL.

## Passos para Deploy

1. **Crie um novo projeto** no Railway
2. **Conecte seu repositório Git**
3. **Adicione as variáveis de ambiente** listadas acima
4. **Deploy automático**: O Railway detectará o `nixpacks.toml` e executará:
   - `npm install` (que roda `prisma generate` via `postinstall`)
   - `npm run build`
   - `prisma migrate deploy`
   - `prisma db seed` (se houver seed)
   - `npm run start`

## Scripts Importantes

| Script | Descrição |
|--------|-----------|
| `postinstall` | Gera o Prisma Client após `npm install` |
| `build` | Build do Next.js |
| `db:migrate:deploy` | Aplica migrações em produção |
| `db:seed` | Popula o banco com dados demo |
| `start` | Inicia o servidor Next.js |

## Migração para PostgreSQL (Futuro)

Para produção persistente, substitua o SQLite por PostgreSQL:

1. Adicione um serviço PostgreSQL no Railway
2. Atualize `DATABASE_URL` para a URL do PostgreSQL
3. Rode `prisma migrate deploy`
4. O schema Prisma já é compatível com PostgreSQL

## Solução de Problemas

### Erro: "Prisma Client not found"
- Verifique se a variável `NIXPACKS_NODE_VERSION` está definida como `20`
- Verifique se o script `postinstall` está no package.json

### Erro: "Database not found"
- O SQLite é efêmero no Railway. Após cada deploy, o banco é recriado.
- Para persistência, use PostgreSQL.

### Erro: "Build failed"
- Verifique os logs de build no Railway
- Rode `npm run build` localmente para identificar erros
