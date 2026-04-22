# Historico de Debug

## 21/04/2026 - Deploy e login 500 no Railway

Problema resolvido:

- runtime quebrava com `TypeError: Invalid URL`
- havia `NODE_OPTIONS` apontando para `/app/url-patch.js`
- o deploy ficou estavel apos limpar `NODE_OPTIONS`, ajustar `metadataBase` e alinhar Node/runtime

Estado validado naquela correcao:

- home ok
- login ok
- dashboard ok

## 22/04/2026 - Autenticacao real implementada

Mudancas aplicadas:

- login com e-mail e senha real
- cadastro de conta real
- opcao de login com Google
- `manter conectado`
- `esqueci a senha`
- redefinicao por token
- remocao do fluxo de login demo

Banco e schema:

- `User.password` passou a ser opcional
- novo campo `googleId`
- novo campo `emailVerifiedAt`
- nova tabela `password_reset_tokens`

Observacoes:

- `npm run build` passou
- `prisma generate` foi regenerado com o schema novo
- `prisma db push` falhou no schema engine do Prisma durante esta sessao
- para nao bloquear a entrega, as alteracoes equivalentes foram aplicadas diretamente em SQL no banco atual

Pendencia operacional:

- validar em producao o fluxo de cadastro, login Google e redefinicao por e-mail depois de configurar as variaveis correspondentes
