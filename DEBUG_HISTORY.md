# Histórico de Debug — Railway / Login 500

## Status final

- Problema resolvido em produção em `21/04/2026`
- URL validada: `https://guia-hospedes-production.up.railway.app`
- Home: `200`
- Login: `200`
- Dashboard `/app`: `200`

## Sintoma observado

O deploy subia parcialmente, mas a aplicação falhava em runtime com erro:

```txt
TypeError: Invalid URL
input: 'guia-hospedes-production.up.railway.app'
```

Em paralelo, alguns deploys falhavam ainda na preparação do ambiente com Railpack/mise.

## Causas reais identificadas

### 1. URL sem protocolo no ambiente do Railway

O Railway injeta `RAILWAY_PUBLIC_DOMAIN` sem protocolo. O Next.js 16, em algumas rotinas internas, acabava tentando construir URL a partir desse valor cru.

### 2. `NODE_OPTIONS` quebrado no Railway

Existia no Railway a variável:

```txt
NODE_OPTIONS=--require /app/url-patch.js
```

Isso fazia o container tentar carregar `/app/url-patch.js` antes do build/start. Em alguns deploys o arquivo não estava presente no artefato final, e o processo morria com:

```txt
Error: Cannot find module '/app/url-patch.js'
```

### 3. Configuração de runtime desalinhada

O projeto estava com `output: 'standalone'` no `next.config.ts`, mas a aplicação era iniciada com `npm start` / `next start`. Isso deixava o deploy mais frágil no Railway.

### 4. Versão de Node não fixada de forma robusta

O Railpack oscilava entre tentativas de instalar Node sem configuração suficiente. A estabilização veio com:

- `package.json` com `engines`
- `packageManager`
- `mise.toml`
- `.nvmrc`

## O que foi corrigido

### Código

- adicionado `metadataBase: new URL(env.appUrl)` em `src/app/layout.tsx`
- removido `output: 'standalone'` de `next.config.ts`
- melhorada a função `ensureValidUrl()` em `src/lib/utils.ts`
- adicionados `engines.node`, `engines.npm` e `packageManager` em `package.json`
- criado/ajustado `mise.toml` com Node `20.19.0`
- criado/ajustado `.nvmrc` com Node `20.19.0`

### Railway

- removido `NODE_OPTIONS`
- mantidas URLs públicas com protocolo completo:
  - `NEXTAUTH_URL`
  - `NEXT_PUBLIC_APP_URL`
- deploy executado com sucesso via `railway up`

## Validação feita após a correção

- `npm run typecheck`: ok
- `npm run build`: ok
- deploy Railway: ok
- teste HTTP na home: ok
- teste de login em produção com `joao@guiahospedes.com / senha123`: ok
- teste de acesso à dashboard autenticada: ok

## Estado atual recomendado

### Variáveis importantes no Railway

- `DATABASE_URL`
- `AUTH_SECRET` ou `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `NODE_ENV=production`

### Variáveis que não devem voltar

- `NODE_OPTIONS=--require /app/url-patch.js`

## Observações

- O projeto atual usa autenticação manual com JWT, não o fluxo antigo de NextAuth em runtime.
- O nome de algumas variáveis (`NEXTAUTH_*`) foi mantido por compatibilidade e continuidade do ambiente.
- O próximo passo recomendado é manter o GitHub sincronizado com o estado que já está rodando no Railway.
