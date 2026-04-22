# Plano de Implementação — GuiaHóspedes

> **Modo de execução:** Este plano deve ser executado **uma etapa por vez**. Não avance para a próxima etapa sem que a anterior esteja completa, testada e aprovada pelo usuário.
> **Última atualização:** 22/04/2026 (Etapas 16-17 + Alertas + Calendário)

**Objetivo:** Implementar as funcionalidades pendentes do GuiaHóspedes, transformando o front-end mockado em um produto funcional com dados persistentes.

**Stack:** Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui (base-ui) + Prisma ORM + PostgreSQL + JWT custom

---

## Etapa 1: Server Actions — Criar Imóvel ✅

**Status:** Concluído

**Objetivo:** Fazer o formulário de novo imóvel salvar dados reais no banco de dados.

**Arquivos afetados:**
- Criar: `src/app/actions/create-property.ts`
- Modificar: `src/app/app/imoveis/novo/page.tsx`

**Critério de aceite:** Após preencher o stepper de 8 etapas e clicar "Criar Imóvel", os dados são salvos no banco e o usuário é redirecionado para a página de detalhe do imóvel criado.

---

## Etapa 2: Server Actions — Editar Imóvel ✅

**Status:** Concluído

**Objetivo:** Permitir editar um imóvel existente com dados pré-preenchidos.

**Arquivos afetados:**
- Criar: `src/app/actions/update-property.ts`
- Criar: `src/app/app/imoveis/[id]/editar/page.tsx`

**Critério de aceite:** Ao acessar `/app/imoveis/[id]/editar`, o formulário vem preenchido com dados existentes. Ao salvar, as alterações são persistidas.

---

## Etapa 3: Server Actions — Excluir Imóvel ✅

**Status:** Concluído

**Objetivo:** Permitir excluir um imóvel com confirmação.

**Arquivos afetados:**
- Criar: `src/app/actions/delete-property.ts`
- Modificar: `src/app/app/imoveis/page.tsx`
- Modificar: `src/app/app/imoveis/[id]/page.tsx`

**Critério de aceite:** Ao clicar "Excluir" e confirmar, o imóvel e todos os dados relacionados são removidos do banco e o usuário é redirecionado para a lista.

---

## Etapa 4: Publicação/Despublicação de Guia ✅

**Status:** Concluído

**Objetivo:** Permitir publicar e despublicar um guia com toggle.

**Arquivos afetados:**
- Criar: `src/app/actions/toggle-guide-status.ts`
- Modificar: `src/app/app/imoveis/[id]/page.tsx`

**Critério de ação:** Ao clicar "Publicar", o status muda para PUBLISHED, o slug fica acessível publicamente. Ao clicar "Despublicar", o guia volta para UNPUBLISHED.

---

## Etapa 5: Compartilhamento Dinâmico ✅ (INCREMENTADO)

**Status:** Concluído + Incrementado

**Objetivo:** Tornar a página de compartilhamento funcional com dados reais do banco.

### Base implementada ✅
- `[x]` Componente client para formulário de compartilhamento
- `[x]` Seletor de imóveis (buscar propriedades com guias PUBLICADOS)
- `[x]` Link dinâmico baseado no slug: `${APP_URL}/g/${slug}`
- `[x]` Botão "Copiar Link" funcional
- `[x]` Botão WhatsApp (wa.me) com mensagem personalizada
- `[x]` Botão E-mail (mailto:) com template
- `[x]` Registrar ShareLog no banco

### Incrementos recentes (Abr/2026) ✅
- `[x]` **ShareModal reutilizável** (`components/shared/share-modal.tsx`)
  - Modal que pode ser acionado de qualquer tela (lista, detalhe, dashboard)
  - Canais: WhatsApp, E-mail, Link, QR Code
  - Personalização: template, nome do hóspede, contato, mensagem customizada
  - Preview da mensagem em mockup de celular
  - Validação: só permite compartilhar guias publicados
- `[x]` **Compartilhamento rápido na lista de imóveis**
  - Botão de compartilhamento na tabela desktop (coluna Ações)
  - Botão de compartilhamento nos cards mobile
  - Integração com ShareModal — abre direto sem redirecionar
- `[x]` **Compartilhamento rápido no detalhe do imóvel**
  - ShareModal no card "Status do Guia" (aba Resumo)
  - ShareModal nas "Ações rápidas" (aba Guia)
  - Usuário não precisa sair da página do imóvel
- `[x]` **Templates agrupados por tipo**
  - Select de templates agrupado por categoria: Boas-vindas, Pré-check-in, Durante Estadia, Pós-check-out, Personalizado, Outros
  - Usa enum `TEMPLATE_TYPES` do `lib/constants.ts`
- `[x]` **Estatísticas de compartilhamento na Dashboard**
  - Novos cards: "Compartilhamentos" (total) e "Por WhatsApp"
  - Histórico de compartilhamentos recentes na home

**Arquivos afetados:**
- `src/app/app/compartilhamento/page.tsx`
- `src/app/app/compartilhamento/sharing-client.tsx`
- `src/app/actions/share-guide.ts`
- `src/components/shared/share-modal.tsx` (NOVO)
- `src/app/app/imoveis/properties-client.tsx`
- `src/app/app/imoveis/[id]/page.tsx`
- `src/app/app/page.tsx`

---

## Etapa 6: Geração de QR Code ✅

**Status:** Concluído (implementado dentro do ShareModal)

**Objetivo:** Gerar QR Code funcional para cada guia publicado.

**O que foi feito:**
- `[x]` Usar a lib `react-qr-code` (já instalada)
- `[x]` QR Code no ShareModal (toggle para exibir)
- `[x]` QR Code na página de compartilhamento dedicada (Dialog)
- `[x]` URL impressa abaixo do QR Code
- `[x]` Botão "Copiar link" junto ao QR Code

**Arquivos afetados:**
- `src/components/shared/share-modal.tsx`
- `src/app/app/compartilhamento/sharing-client.tsx`

---

## Etapa 7: Landing Page Funcional (Links e CTAs) ✅

**Status:** Concluído

**Objetivo:** Conectar os CTAs da landing page às rotas reais do app.

**Critério de aceite:** Todos os botões da landing page levam a rotas existentes e funcionais.

---

## Etapa 8: Tela de Configurações — Salvar no Banco ✅

**Status:** Concluído

**Objetivo:** Fazer a tela de configurações salvar dados reais da organização.

**Arquivos afetados:**
- Criar: `src/app/actions/update-organization.ts`
- Modificar: `src/app/app/configuracoes/page.tsx`

**Critério de aceite:** Ao editar configurações e salvar, os dados persistem no banco e refletem na próxima visita.

---

## Etapa 9: Preparação para Deploy (Railway) ✅

**Status:** Concluído

**Objetivo:** Preparar o projeto para deploy, incluindo PostgreSQL.

**O que foi feito:**
- `[x]` Script `postinstall` no package.json
- `[x]` `output: 'standalone'` no next.config.ts
- `[x]` `nixpacks.toml` configurado
- `[x]` `.env.example` atualizado
- `[x]` `prisma/schema.prisma` com provider PostgreSQL
- `[x]` Migrations criadas

**Nota:** Projeto rodando localmente com SQLite (`dev.db`). PostgreSQL configurado para produção.

---

## Etapa 10: Melhorias do Guia Público do Hóspede ✅

**Status:** Concluído

**Objetivo:** Elevar a experiência do guia público de funcional para acolhedora.

**O que foi feito:**
- `[x]` Template unificado (`GuidePageTemplate`) com header, bottom bar sticky
- `[x]` Check-in com timeline visual, horário em destaque, botão "Abrir no Maps"
- `[x]` Check-out com checklist interativo (persiste no localStorage)
- `[x]` Contatos separados em grupos (Anfitrião, Suporte, Emergência)
- `[x]` Regras com linguagem positiva e ícones semânticos
- `[x]` Equipamentos com ícones por tipo
- `[x]` Dicas da região com botão "Como chegar"
- `[x]` Links úteis com ícones semânticos
- `[x]` Hub com barra flutuante no mobile

---

## Etapa 11: Deploy em Produção (Neon + Railway + GitHub) ✅

**Status:** Configurado e atualizado (aguardando deploy manual no Railway/Neon)

**Objetivo:** Subir a aplicação para produção com banco PostgreSQL persistente, hospedagem na Railway e CI/CD no GitHub.

### O que foi configurado:
- `[x]` `output: 'standalone'` no `next.config.ts`
- `[x]` `nixpacks.toml` — blueprint de build para Railway (Node 20, prisma generate, build, start)
- `[x]` `railway.toml` — configurações de deploy (restart policy, watch patterns)
- `[x]` `.github/workflows/ci.yml` — CI com typecheck e build
- `[x]` `DEPLOY_PROD.md` — guia completo de deploy com troubleshooting
- `[x]` `.env.example` atualizado (AUTH_SECRET, variáveis SMTP, integrações)
- `[x]` Prisma schema com provider PostgreSQL
- `[x]` Script `db:migrate:deploy` no package.json

### Passos manuais pendentes (usuário):
- `[ ]` Criar projeto no Neon e copiar `DATABASE_URL`
- `[ ]` Rodar `npx prisma migrate deploy` apontando para o Neon
- `[ ]` Criar projeto no Railway e conectar repo GitHub
- `[ ]` Configurar variáveis de ambiente no Railway
- `[ ]` Deploy inicial

**Critério de aceite:** A aplicação está acessível via URL pública, dados persistem entre deploys, e o guia público funciona corretamente.

---

## Etapa 12: CRUD Completo de Modelos de Mensagem ✅

**Status:** Concluído

**Objetivo:** Permitir criar, editar e excluir modelos de mensagem para compartilhamento.

**O que foi implementado:**
- `[x]` Criar template (Dialog com formulário)
- `[x]` Editar template (mesmo Dialog com dados pré-preenchidos)
- `[x]` Excluir template (Dialog de confirmação)
- `[x]` Preview ao vivo com variáveis (toggle na tela de criação/edição)
- `[x]` Inserção de variáveis com clique no corpo da mensagem
- `[x]` Busca/filtro na listagem
- `[x]` Validação de autenticação nas Server Actions
- `[x]` Templates agrupados por tipo na página de compartilhamento

**Arquivos criados/modificados:**
- `src/app/actions/message-templates.ts` (NOVO)
- `src/components/shared/template-form-dialog.tsx` (NOVO)
- `src/app/app/modelos-mensagem/templates-client.tsx` (NOVO)
- `src/app/app/modelos-mensagem/page.tsx`

---

## Etapa 13: Analytics com Dados Reais ✅

**Status:** Concluído

**Objetivo:** Substituir dados mockados por métricas reais do banco.

**O que foi implementado:**
- `[x]` Nova tabela `GuideAccess` no Prisma schema para rastrear acessos ao guia público
- `[x]` Server Action `logGuideAccess` para registrar acesso (device, userAgent, referrer)
- `[x]` Componente `GuideAccessTracker` que registra acesso automaticamente ao carregar o guia público
- `[x]` Página Analytics com dados reais do banco:
  - Total de acessos (guideAccess.count)
  - Total de compartilhamentos (shareLog.count)
  - Guias publicados (guide.count where status='PUBLISHED')
  - Taxa de abertura (acessos / compartilhamentos)
  - Canais de compartilhamento (groupBy shareLog.channel)
  - Guias mais acessados (groupBy guideAccess.guideId + property name)
  - Acessos recentes (últimos 10 com device e data)
  - Percentual mobile vs desktop
- `[x]` Insights dinâmicos baseados nos dados reais

**Arquivos criados/modificados:**
- `prisma/schema.prisma` — modelo `GuideAccess` adicionado
- `src/app/actions/log-guide-access.ts` (NOVO)
- `src/components/shared/guide-access-tracker.tsx` (NOVO)
- `src/app/app/analytics/page.tsx` (reescrito como Server Component)
- `src/app/app/analytics/analytics-client.tsx` (NOVO)
- `src/lib/guide-utils.ts` — retorna `guideId` junto com property
- `src/app/g/[slug]/page.tsx` — integra GuideAccessTracker

---

## Etapa 14: Landing Page Completa ✅

**Status:** Concluído

**Objetivo:** Refatorar a landing page em componentes separados e adicionar todas as seções.

**O que foi implementado:**
- `[x]` Header sticky com navegação e menu mobile
- `[x]` Hero com CTA e mockup do guia
- `[x]` Seção Problema (5 dores do gestor)
- `[x]` Seção Público-alvo (3 personas)
- `[x]` Seção Solução (5 features + preview do stepper)
- `[x]` Seção Como Funciona (3 passos)
- `[x]` Seção Funcionalidades (9 cards)
- `[x]` Seção Benefícios (4 métricas)
- `[x]` Seção Compartilhamento (WhatsApp + E-mail + mockup)
- `[x]` Seção Airbnb (integração + mockup)
- `[x]` Seção Preços (3 planos: Grátis, Pro, Empresa)
- `[x]` Seção Depoimentos (3 quotes)
- `[x]` Seção Contato + CTA Final
- `[x]` Footer completo
- `[x]` Sticky CTA mobile
- `[x]` Componentes extraídos para `src/components/landing/`

**Arquivos criados:**
- `src/components/landing/header.tsx`
- `src/components/landing/hero.tsx`
- `src/components/landing/problem.tsx`
- `src/components/landing/audience.tsx`
- `src/components/landing/solution.tsx`
- `src/components/landing/how-it-works.tsx`
- `src/components/landing/features.tsx`
- `src/components/landing/benefits.tsx`
- `src/components/landing/sharing-block.tsx`
- `src/components/landing/airbnb-integration.tsx`
- `src/components/landing/pricing.tsx`
- `src/components/landing/testimonials.tsx`
- `src/components/landing/cta-final.tsx`
- `src/components/landing/footer.tsx`
- `src/app/page.tsx` (refatorado)

---

## Etapa 15: Integração Airbnb (Sync iCal) 🚫 BLOQUEADO

**Status:** Bloqueado — requer credenciais de desenvolvedor Airbnb

**O que falta:**
- `[ ]` Parser iCal
- `[ ]` Importação de calendário
- `[ ]` Vínculo imóvel ↔ listing
- `[ ]` Logs de sincronização funcional

**Nota:** A página de integrações já busca dados reais da tabela `Integration` e exibe logs de `SyncLog`, mas a sincronização automática via API/iCal depende de credenciais Airbnb.

**Arquivos:** `src/integrations/airbnb/*`, `src/app/api/integrations/*`

---

## Etapa 16: Gerar PDF do Guia ✅

**Status:** Concluído

**Objetivo:** Permitir baixar o guia como PDF com branding.

**O que foi implementado:**
- `[x]` Service de geração de PDF com `@react-pdf/renderer` (sem headless browser)
- `[x]` Template de PDF com branding: capa com imagem, informações gerais, check-in/check-out, Wi-Fi, regras, contatos, equipamentos, dicas da região, links úteis e rodapé com nome da organização
- `[x]` Fonte Inter registrada no PDF
- `[x]` API Route `GET /api/guides/[id]/pdf` que gera e retorna o PDF como download (`Content-Disposition: attachment`)
- `[x]` Botão "Baixar PDF do guia" na aba Guia do detalhe do imóvel

**Arquivos criados:**
- `src/components/pdf/guide-pdf.tsx`
- `src/app/api/guides/[id]/pdf/route.ts`

**Arquivos modificados:**
- `src/app/app/imoveis/[id]/page.tsx` — adicionado botão de download + ícone FileDown

---

## Etapa 17: Sistema de Reservas (Booking) ✅

**Status:** Concluído

**Objetivo:** Gerenciar reservas de hóspedes com controle de check-in/check-out.

### O que foi implementado:
- `[x]` Modelo `Reservation` no Prisma schema com enums `ReservationStatus` e `ReservationSource`
- `[x]` Relação `Property` ↔ `Reservation` (1:N)
- `[x]` Server Actions: `createReservation`, `updateReservation`, `deleteReservation`, `updateReservationStatus`
- `[x]` Página de listagem `/app/reservas` com filtros (busca, status, imóvel) e estatísticas (total, ativos, próximos, finalizadas)
- `[x]` Página de nova reserva `/app/reservas/novo` com formulário completo (useActionState + validação Zod)
- `[x]` Página de edição `/app/reservas/[id]/editar` com dados pré-preenchidos
- `[x]` Página de detalhe `/app/reservas/[id]` com:
  - Cards informativos: check-in, check-out, hóspedes, noites
  - Dados do imóvel e do hóspede em seções separadas
  - Sidebar com resumo financeiro e ações rápidas
  - Botão "Enviar guia ao hóspede" integrado com ShareModal
- `[x]` Ações rápidas na lista: marcar check-in, check-out, confirmar, cancelar
- `[x]` Cards de reservas na Dashboard: total, hóspedes ativos
- `[x]` Seção "Próximos check-ins" na Dashboard
- `[x]` Item "Reservas" no menu lateral (ícone CalendarDays)

**Arquivos criados:**
- `src/app/actions/reservations.ts`
- `src/app/app/reservas/page.tsx`
- `src/app/app/reservas/reservations-client.tsx`
- `src/app/app/reservas/novo/page.tsx`
- `src/app/app/reservas/novo/new-reservation-form.tsx`
- `src/app/app/reservas/[id]/page.tsx` (detalhe/view)
- `src/app/app/reservas/[id]/editar/page.tsx`
- `src/app/app/reservas/[id]/editar/edit-reservation-form.tsx`

**Arquivos modificados:**
- `prisma/schema.prisma` — modelo `Reservation`, enums `ReservationStatus`/`ReservationSource`, relação
- `src/lib/constants.ts` — `DASHBOARD_NAV` atualizado com "Reservas"
- `src/components/dashboard/sidebar.tsx` — ícone `CalendarDays` mapeado
- `src/app/app/page.tsx` — stats de reservas, hóspedes ativos, próximos check-ins

---

## Polimentos Realizados (Abr/2026)

### Dashboard: Alertas de Hoje
- `[x]` Cards de alerta para check-ins e check-outs do dia atual (condicional — só aparecem quando há reservas)
- `[x]` Links diretos para a página da reserva
- `[x]` Cálculo de `checkInsToday` e `checkOutsToday` via Prisma (`gte: today, lt: tomorrow`)

### Reservas: Página de Detalhe (View Mode)
- `[x]` Página de visualização `/app/reservas/[id]` em Server Component
- `[x]` Cards informativos: check-in, check-out, hóspedes, noites
- `[x]` Dados do imóvel e do hóspede em seções separadas com link para o imóvel
- `[x]` Sidebar com resumo financeiro (valor total, datas de criação/atualização)
- `[x]` Ações rápidas: "Enviar guia ao hóspede" (ShareModal), "Abrir guia público", "Editar reserva"
- `[x]` Edição movida de `/app/reservas/[id]` para `/app/reservas/[id]/editar`
- `[x]` Lista de reservas atualizada: botão "Ver" leva ao detalhe, "Editar" está no dropdown/menu

### Integrações: Dados Reais
- `[x]` Página convertida de Client Component para Server Component
- `[x]` Busca integrações reais da tabela `Integration` via Prisma
- `[x]` Busca logs de sincronização reais da tabela `SyncLog`
- `[x]` Status dinâmico baseado no banco de dados (`CONNECTED`, `DISCONNECTED`, `ERROR`)
- `[x]` Checklist dinâmico baseado no status real das integrações
- `[x]` Abas: Airbnb, WhatsApp, E-mail, Armazenamento

### Deploy: Configurações Atualizadas
- `[x]` `.env.example` atualizado:
  - Removeu `NEXTAUTH_URL`/`NEXTAUTH_SECRET` como obrigatórios (projeto usa JWT custom)
  - Priorizou `AUTH_SECRET` como variável de sessão JWT
  - Manteve variáveis opcionais (Google OAuth, SMTP, integrações)
- `[x]` `DEPLOY_PROD.md` atualizado:
  - Variáveis obrigatórias simplificadas (`DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `NODE_ENV`)
  - Seção de variáveis opcionais separada
  - Validação pós-deploy atualizada com CRUD de reservas e geração de PDF
  - Troubleshooting de `AUTH_SECRET` adicionado

---

## Funcionalidades Adicionais (Pós-Plano)

### Alertas Automatizados na Dashboard ✅

**Status:** Concluído

**O que foi implementado:**
- `[x]` Cálculo dinâmico de alertas na Server Component da dashboard (sem persistência no banco)
- `[x]` Tipos de alerta:
  - `CHECKIN_TOMORROW` — reserva com check-in amanhã → sugerir enviar guia
  - `CHECKIN_TODAY_NOT_DONE` — reserva com check-in hoje ainda não marcada
  - `CHECKOUT_TODAY_NOT_DONE` — reserva com check-out hoje ainda não marcada
  - `GUIDE_NOT_PUBLISHED` — imóveis com guia em rascunho
- `[x]` Componente client `DashboardAlerts` com dismiss via `localStorage`
- `[x]` Severidade por cor: info (azul), warning (âmbar), error (rosa)
- `[x]` Cada alerta tem link direto para ação

**Arquivos criados/modificados:**
- `src/components/dashboard/dashboard-alerts.tsx` (NOVO)
- `src/app/app/page.tsx` — cálculo de alertas + renderização

---

### Calendário Visual de Reservas ✅

**Status:** Concluído

**O que foi implementado:**
- `[x]` Página `/app/reservas/calendario` em Server Component
- `[x]` Grid mensal 7 colunas (Dom-Sáb) com navegação entre meses via query params
- `[x]` Reservas exibidas em cada dia com nome do hóspede e imóvel
- `[x]` Cores por status: CONFIRMED (azul), CHECKED_IN (verde), CHECKED_OUT (cinza), PENDING (âmbar), CANCELLED (rosa riscado)
- `[x]` Destaque do dia atual
- `[x]` Legenda de cores no rodapé
- `[x]` Link de alternância entre visualização de lista e calendário
- `[x]` Total de reservas por dia indicado no canto superior

**Arquivos criados/modificados:**
- `src/app/app/reservas/calendario/page.tsx` (NOVO)
- `src/app/app/reservas/page.tsx` — botão "Calendário" no header

---

### Multilinguismo nas Guias (Inglês + Espanhol) ✅

**Status:** Concluído

**Objetivo:** Permitir que hóspedes visualizem a guia em português, inglês ou espanhol, com tradução automática via API e edição manual pelo anfitrião.

**O que foi implementado:**
- `[x]` Campo `translations Json?` no modelo `Property` (Prisma)
- `[x]` Sistema de i18n com dicionários para `pt-BR`, `en`, `es`
- `[x]` `LanguageProvider` (React Context) + hook `useLanguage()`
- `[x]` `LanguageSwitcher` com bandeirinhas retangulares (🇧🇷 🇬🇧 🇪🇸) no header fixo
- `[x]` Persistência de idioma via localStorage + URL param `?lang=`
- `[x]` Todas as 9 páginas públicas (`/g/[slug]/...`) traduzidas:
  - Labels da UI via dicionário
  - Conteúdo do anfitrião via `translateField()` com fallback PT
- `[x]` PDF multilíngue: aceita `?lang=` na rota API, renderiza labels + conteúdo no idioma
- `[x]` API de tradução automática:
  - **LibreTranslate** como provedor padrão (gratuito, open-source, sem chave)
  - Suporte a DeepL (free/pro) e Google Translate (requer chave)
  - Env vars: `TRANSLATION_API_PROVIDER`, `TRANSLATION_API_KEY`
  - Server Action `generateTranslations(propertyId)`
- `[x]` Dashboard — Editor de traduções:
  - Página `/app/imoveis/[id]/traducoes`
  - Tabs EN / ES com inputs lado a lado com o PT original
  - Botão "Gerar traduções automaticamente"
  - Botão "Salvar traduções"
  - Indicadores de preenchimento por idioma

**Arquivos criados:**
- `src/lib/i18n/index.ts`
- `src/lib/i18n/types.ts`
- `src/lib/i18n/pt-BR.ts`
- `src/lib/i18n/en.ts`
- `src/lib/i18n/es.ts`
- `src/components/shared/language-provider.tsx`
- `src/components/shared/language-switcher.tsx`
- `src/lib/translate.ts`
- `src/lib/translation-api.ts`
- `src/app/actions/translations.ts`
- `src/app/app/imoveis/[id]/traducoes/page.tsx`
- `src/app/app/imoveis/[id]/traducoes/translations-editor.tsx`
- `src/app/g/[slug]/layout.tsx`

**Arquivos modificados:**
- `prisma/schema.prisma` — campo `translations Json?` em `Property`
- `src/components/shared/guide-page-template.tsx` — LanguageSwitcher no header
- `src/app/g/[slug]/page.tsx` — i18n + translateField
- `src/app/g/[slug]/check-in/page.tsx` — i18n + translateField
- `src/app/g/[slug]/check-out/page.tsx` — i18n + translateField
- `src/app/g/[slug]/wifi/page.tsx` — i18n + translateField
- `src/app/g/[slug]/regras/page.tsx` — i18n + translateField
- `src/app/g/[slug]/equipamentos/page.tsx` — i18n + translateField
- `src/app/g/[slug]/contatos/page.tsx` — i18n + translateField
- `src/app/g/[slug]/dicas/page.tsx` — i18n + translateField
- `src/app/g/[slug]/links/page.tsx` — i18n + translateField
- `src/components/pdf/guide-pdf.tsx` — labels e conteúdo multilíngue
- `src/app/api/guides/[id]/pdf/route.ts` — aceita `?lang=`
- `src/lib/guide-utils.ts` — helper `buildGuideQuery`
- `src/app/app/imoveis/[id]/page.tsx` — link para Traduções na aba Guia

### Esquema de Traduções (Documentação Técnica)

#### Estrutura JSON no banco

O campo `Property.translations` armazena um objeto JSON com a seguinte estrutura:

```json
{
  "pt-BR": {},
  "en": {
    "welcomeMessage": "Welcome!",
    "shortDescription": "Cozy apartment",
    "checkIn": {
      "instructions": "...",
      "accessMethod": "...",
      "notes": "..."
    },
    "checkOut": {
      "instructions": "...",
      "exitChecklist": "..."
    },
    "wifi": {
      "notes": "..."
    },
    "rules": {
      "silence": "...",
      "visits": "...",
      "trash": "...",
      "equipmentUse": "...",
      "notes": "..."
    },
    "devices": {
      "[device-id]": {
        "name": "...",
        "instructions": "..."
      }
    },
    "contacts": {
      "[contact-id]": {
        "name": "..."
      }
    },
    "recommendations": {
      "[rec-id]": {
        "name": "...",
        "description": "..."
      }
    },
    "links": {
      "[link-id]": {
        "label": "..."
      }
    }
  },
  "es": { ... }
}
```

#### Campos traduzíveis por entidade

| Entidade | Campos traduzíveis |
|---|---|
| **Property** | `welcomeMessage`, `shortDescription` |
| **PropertyCheckIn** | `instructions`, `accessMethod`, `notes` |
| **PropertyCheckOut** | `instructions`, `exitChecklist` |
| **PropertyWiFi** | `notes` |
| **PropertyRules** | `silence`, `visits`, `trash`, `equipmentUse`, `notes` |
| **PropertyDevice** | `name`, `instructions` |
| **PropertyContact** | `name` |
| **LocalRecommendation** | `name`, `description` |
| **PropertyLink** | `label` |

#### Fallback de idioma

1. Hóspede acessa a guia → idioma default é **PT-BR**
2. Hóspede clica em bandeirinha → idioma salvo no **localStorage** + refletido na URL (`?lang=en`)
3. Ao renderizar, o sistema busca a tradução no campo `translations[locale]`
4. Se não houver tradução para o campo, usa o valor original em **português**
5. Isso permite publicar uma guia parcialmente traduzida sem quebrar a experiência

#### Fluxo de tradução automática

```
Anfitrião clica "Gerar traduções" no dashboard
  ↓
Server Action extractTranslatableTexts(property)
  ↓
Para cada campo em PT, chama translateText(text, 'PT', 'EN')
  ↓
Para cada campo em PT, chama translateText(text, 'PT', 'ES')
  ↓
Resultados salvos em Property.translations
  ↓
Revalidação das páginas afetadas
```

#### Provedores de tradução

| Provedor | Custo | Precisa chave? | Configuração |
|---|---|---|---|
| **LibreTranslate** (padrão) | Grátis | Não | `TRANSLATION_API_PROVIDER=libretranslate` |
| DeepL API Free | Grátis (500k chars/mês) | Sim | `TRANSLATION_API_PROVIDER=deepl` + `TRANSLATION_API_KEY` |
| DeepL API Pro | Pago | Sim | Mesma configuração com chave pro |
| Google Translate | Pago (free tier) | Sim | `TRANSLATION_API_PROVIDER=google` + `TRANSLATION_API_KEY` |

---

## Ordem de Execução

```
Etapa 1 → Etapa 2 → Etapa 3 → Etapa 4 → Etapa 5 → Etapa 6 → Etapa 7 → Etapa 8 → Etapa 9 → Etapa 10 → Etapa 11 → Etapa 12 → Etapa 13 → Etapa 14 → Etapa 16 → Etapa 17
```

Etapas futuras (sem ordem fixa):
- Etapa 15: Airbnb (bloqueada — requer credenciais de desenvolvedor Airbnb)

---

## Decisão Arquitetural: Server Actions

Todas as mutações de dados (criar, editar, excluir) usam **Next.js Server Actions** ao invés de API routes tradicionais. Vantagens:
- Menos código boilerplate (não precisa criar route handlers)
- Validação com Zod no server
- Progressive enhancement
- Integração nativa com Next.js App Router

Estrutura de pastas:
```
src/app/actions/
  create-property.ts
  update-property.ts
  delete-property.ts
  toggle-guide-status.ts
  share-guide.ts
  update-organization.ts
  message-templates.ts
  log-guide-access.ts
  reservations.ts
  translations.ts         ← gera/atualiza traduções de imóvel
```

Cada Server Action segue o padrão:
```typescript
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
// ... zod schemas, ação, retorno tipado
```

---

## Inventário de Componentes Reutilizáveis

### Compartilhamento
- `ShareModal` — modal completo de compartilhamento (WhatsApp, E-mail, Link, QR Code)
- `CopyButton` — botão com feedback visual de "copiado"

### PDF
- `GuidePdfDocument` — documento PDF do guia com capa e seções

### Tracker
- `GuideAccessTracker` — componente invisível que registra acesso ao guia público

### Alertas
- `DashboardAlerts` — componente client que exibe alertas dinâmicos com dismiss via localStorage

### UI Custom
- `PageHeader` — header padronizado com eyebrow, title, description, meta, actions
- `EmptyState` — estado vazio com ícone, título, descrição, hints e ações
- `ImageUpload` — upload de imagem com preview
- `InteractiveChecklist` — checklist com persistência no localStorage
- `TemplateFormDialog` — formulário de template com preview ao vivo

---

## Inventário de Páginas da Dashboard

| Rota | Descrição | Tipo |
|---|---|---|
| `/app` | Visão geral com stats, atalhos, compartilhamentos recentes, próximos check-ins | Server |
| `/app/imoveis` | Lista de imóveis com filtros e busca | Server + Client |
| `/app/imoveis/novo` | Formulário de criação de imóvel (8 etapas) | Server |
| `/app/imoveis/[id]` | Detalhe do imóvel com abas (Resumo, Guia, Equipamentos, Contatos, Região) | Server |
| `/app/imoveis/[id]/editar` | Edição de imóvel | Server |
| `/app/imoveis/[id]/traducoes` | Editor de traduções EN/ES do imóvel | Server + Client |
| `/app/imoveis/[id]/preview` | Preview do guia como o hóspede vê | Server |
| `/app/guias` | Lista de guias com status e compartilhamentos | Server |
| `/app/compartilhamento` | Página dedicada de compartilhamento | Server |
| `/app/reservas` | Lista de reservas com filtros e stats | Server + Client |
| `/app/reservas/novo` | Nova reserva | Server |
| `/app/reservas/[id]` | Detalhe da reserva | Server |
| `/app/reservas/[id]/editar` | Edição de reserva | Server + Client |
| `/app/reservas/calendario` | Calendário visual de ocupação mensal | Server |
| `/app/modelos-mensagem` | CRUD de templates de mensagem | Server + Client |
| `/app/analytics` | Métricas e analytics com dados reais | Server + Client |
| `/app/integracoes` | Integrações com plataformas externas | Server |
| `/app/configuracoes` | Configurações da organização | Server + Client |

---

## Inventário de Páginas Públicas

| Rota | Descrição |
|---|---|
| `/` | Landing page |
| `/login` | Login com e-mail/senha e Google OAuth |
| `/cadastro` | Cadastro de nova conta |
| `/esqueci-senha` | Solicitação de redefinição de senha |
| `/redefinir-senha` | Redefinição de senha via token |
| `/g/[slug]` | Guia público do hóspede (hub) |
| `/g/[slug]/check-in` | Check-in do hóspede |
| `/g/[slug]/check-out` | Check-out do hóspede |
| `/g/[slug]/wifi` | Wi-Fi do hóspede |
| `/g/[slug]/regras` | Regras da estadia |
| `/g/[slug]/equipamentos` | Equipamentos |
| `/g/[slug]/contatos` | Contatos |
| `/g/[slug]/dicas` | Dicas da região |
| `/g/[slug]/links` | Links úteis |

---

## Inventário de API Routes

| Rota | Método | Descrição |
|---|---|---|
| `/api/auth/register` | POST | Cadastro de usuário |
| `/api/auth/login` | POST | Login com e-mail/senha |
| `/api/auth/logout` | POST | Logout (limpa cookie) |
| `/api/auth/session` | GET | Verifica sessão atual |
| `/api/auth/forgot-password` | POST | Solicita redefinição de senha |
| `/api/auth/reset-password` | POST | Redefine senha com token |
| `/api/auth/google` | GET | Inicia login com Google |
| `/api/auth/google/callback` | GET | Callback do Google OAuth |
| `/api/properties/[id]` | GET/PUT/DELETE | API do imóvel |
| `/api/guides/[id]/pdf` | GET | Gera PDF do guia (aceita `?lang=en\|es`) |
