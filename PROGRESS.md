# Progresso do Projeto

> Ultima atualizacao: 22/04/2026

## Status geral

O produto esta com a base principal pronta:

- landing publica refinada
- dashboard responsivo
- fluxo completo de imoveis, guias e compartilhamento
- deploy funcional no Railway
- autenticacao real implementada

## O que ja foi entregue

### Produto

- landing com CTA, planos, prova visual e navegacao funcional
- dashboard com modulos de visao geral, imoveis, guias, compartilhamento, analytics, integracoes e configuracoes
- guia publico do hospede com secoes dedicadas
- compartilhamento por WhatsApp, e-mail, link e QR Code

### Frontend / UX

- nova direcao visual com base clara e acentos rosa
- shell do dashboard responsiva
- sidebar e topbar melhoradas
- preview do guia adaptativo
- stepper de imovel e telas densas refinadas
- estados vazios e headers padronizados

### Banco e dominio

- schema Prisma consolidado em PostgreSQL
- seed com dados de produto
- multi-tenant por organizacao
- logs de compartilhamento e estrutura de integracoes

### Autenticacao real

- login por e-mail e senha
- cadastro de conta real
- Google OAuth
- lembrar sessao
- esqueci a senha
- redefinicao por token
- remocao de usuarios demo para login

## Pendente prioritario

- configurar Google OAuth em producao
- configurar SMTP real para recuperacao de senha por e-mail
- atualizar docs historicas restantes se surgirem novas referencias antigas
- migrar `middleware` para `proxy` quando for feita a proxima limpeza tecnica do Next 16

## Validacao recente

- `npm run build`: ok
- rotas de auth novas geradas no build: ok
- schema Prisma expandido para auth real: ok

## Proximos passos sugeridos

1. Ajustar variaveis de auth no Railway.
2. Fazer deploy da nova autenticacao.
3. Testar cadastro, login, Google e redefinicao em producao.
4. Consolidar qualquer migracao Prisma formal caso o fluxo de `db push` volte a ser revisitado.
