# Deploy Rápido no Railway
# Siga os passos abaixo

## 1. Login no Railway (FAÇA NO BROWSER)

1. Acesse: https://railway.app/new
2. Clique em **"Deploy from GitHub repo"**
3. Autorize o Railway a acessar seu GitHub
4. Selecione o repositório: **gidornelas/guia-hospedes**

## 2. Configure as Variáveis de Ambiente

No Railway, vá em seu projeto → **Variables** e adicione estas:

```
DATABASE_URL=postgresql://guia-hospedes_owner:SENHA@ep-xxx.us-east-1.aws.neon.tech/guia-hospedes?sslmode=require
NEXTAUTH_SECRET=/+UD0xCZVfwlnZpB9PGIJmVEwkOBzSWByLn563/6/gM=
NEXTAUTH_URL=https://placeholder.up.railway.app
NEXT_PUBLIC_APP_URL=https://placeholder.up.railway.app
NEXT_PUBLIC_APP_NAME=GuiaHóspedes
NODE_ENV=production
```

> **Importante:** Substitua `DATABASE_URL` pela sua connection string real do Neon!

## 3. Deploy Inicial

O Railway fará deploy automaticamente.

## 4. Obtenha a URL Pública

1. No Railway, clique no nome do serviço (ex: `guia-hospedes`)
2. Procure pela URL pública (ex: `https://guia-hospedes-production.up.railway.app`)

## 5. Atualize as URLs

Volte em **Variables** e atualize:

```
NEXTAUTH_URL=https://SUA-URL-REAL.up.railway.app
NEXT_PUBLIC_APP_URL=https://SUA-URL-REAL.up.railway.app
```

O Railway fará redeploy automaticamente.

## 6. Aplique Migration e Seed no Banco

No terminal local (com sua DATABASE_URL do Neon):

```powershell
$env:DATABASE_URL="postgresql://..."
npx prisma migrate deploy
npx prisma db seed
```

## 7. Teste

Acesse a URL do Railway e teste:
- Login: admin@guiahospedes.com / demo123
- Criar imóvel
- Publicar guia
- Acessar guia público

---
Gerado em: 21/04/2026
NEXTAUTH_SECRET: /+UD0xCZVfwlnZpB9PGIJmVEwkOBzSWByLn563/6/gM=
