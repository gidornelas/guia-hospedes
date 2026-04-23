# Progresso e Análise do Projeto — GuiaHóspedes

> Última atualização: 24/04/2026
> Este documento é atualizado conforme implementações são feitas.

---

## Visão Geral

| Aspecto | Detalhe |
|---------|---------|
| **Stack** | Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui + Prisma + PostgreSQL |
| **Deploy** | Railway (standalone) + Neon (DB) |
| **Auth** | JWT manual (cookie HTTP-only) + Google OAuth |
| **i18n** | PT-BR (default), EN, ES |
| **Status** | MVP completo, com fluxos de auth, CRUD imóveis, reservas, guias e compartilhamento |

---

## Fixos e Melhorias Necessárias

### 🔴 Crítico (bugs ou problemas de segurança)

| # | Área | Problema | Arquivo | Status |
|---|------|----------|---------|--------|
| C1 | Auth | Registro faz login automático sem verificar e-mail. Se `emailVerifiedAt` for obrigatório no futuro, qualquer um estará verificado por padrão | `src/lib/auth.ts:84`, `src/app/api/auth/register/route.ts` | ✅ Corrigido em 2026-04-23 (registro retorna sucesso sem criar sessão; frontend redireciona para /login?registered=1) |
| C2 | Auth | Google OAuth callback não valida `aud` ou `iss` do ID token — confia apenas em `access_token` para buscar perfil. O fluxo padrão de troca de `code` já é seguro, mas a validação extra do token do Google não é feita | `src/app/api/auth/google/callback/route.ts:46-64` | ✅ Corrigido em 2026-04-23 (`lib/google-auth.ts` com `jwtVerify` via JWKS do Google; valida assinatura, aud, iss e exp; fallback para userinfo se id_token ausente) |
| C3 | Upload | `uploadPropertyCover` salva arquivos em disco local (`public/images/properties/`). Em deploy Railway (ephemeral filesystem), uploads são perdidos no redeploy. Precisa de storage externo (S3/R2) | `src/app/actions/upload-image.ts`, `src/lib/storage.ts` | ✅ Corrigido em 2026-04-23 (abstração `uploadFile` suporta local/S3/R2; variáveis de ambiente documentadas) |
| C4 | Actions | `deleteProperty` deleta imóvel em cascata sem soft delete. Dados são perdidos permanentemente. Se houver reservas ou compartilhamentos vinculados, perde-se o histórico | `src/app/actions/delete-property.ts`, `prisma/schema.prisma` | ✅ Corrigido em 2026-04-23 (campo `deletedAt` adicionado ao model Property; deleteProperty faz update; todas as queries de listagem filtram `deletedAt: null`) |
| C5 | Middleware | Rotas `/precos` e `/contato` estão declaradas como públicas mas não existem páginas correspondentes. Redirecionam para 404 | `src/middleware.ts:13` | ✅ Corrigido em 2026-04-23 |
| C6 | Reservas | Dropdown de status no card de reservas permite marcar check-in/checkout de reservas canceladas ou já finalizadas — não há bloqueio de transição inválida | `src/app/actions/reservations.ts` | ✅ Corrigido em 2026-04-23 (`VALID_STATUS_TRANSITIONS` bloqueia transições inválidas no server action) |
| C7 | **Authorization** | **NENHUMA server action verifica se o usuário logado pertence à organização do recurso.** Qualquer usuário logado pode editar, deletar ou publicar imóveis, reservas, guias e organizações de outros usuários simplesmente conhecendo o ID | `src/app/actions/*`, `src/lib/authorization.ts` | ✅ Corrigido em 2026-04-23 (helpers `requirePropertyAccess`, `requireReservationAccess`, `requireGuideAccess`, `requireTemplateAccess`, `requireOrganizationAccess` aplicados em todas as actions) |
| C8 | **XSS** | Guia público renderiza URLs de links, mapas e recomendações diretamente em `href` sem sanitização de protocolo. Um usuário malicioso pode cadastrar `javascript:alert(1)` como URL e executar código no browser do hóspede | `src/app/g/[slug]/links/page.tsx:79`, `dicas/page.tsx:152,178` | ✅ Corrigido em 2026-04-23 (`sanitizeHref` bloqueia protocolos perigosos) |
| C9 | Auth | Não há rate limiting em nenhuma API de auth. Brute force em `/api/auth/login` é possível | `src/app/api/auth/**` | ✅ Corrigido em 2026-04-23 (`lib/rate-limit.ts` com limites por IP em login/register/forgot-password) |
| C10 | Data | `updatePropertyTranslations` aceita objeto JSON arbitrário e salva direto no banco sem validação de schema. Pode corromper o formato esperado das traduções | `src/app/actions/translations.ts:233-241` | ✅ Corrigido em 2026-04-23 (validação Zod com `translationsSchema.safeParse` + cast `as any` para compatibilidade com Prisma JSON) |

### 🟡 Importante (UX ou performance)

| # | Área | Problema | Arquivo | Status |
|---|------|----------|---------|--------|
| I1 | Auth | Não há validação de força de senha no cadastro (apenas `minLength={8}`). Deveria exigir maiúscula, número e caractere especial | `cadastro/page.tsx` | ✅ Corrigido em 2026-04-23 (validação de maiúscula, minúscula, número e caractere especial) |
| I2 | Auth | Não há "já estou logado?" redirect no login/cadastro. Usuário logado pode acessar `/login` e ver o formulário | `src/app/login/page.tsx`, `src/app/cadastro/page.tsx` | ✅ Corrigido em 2026-04-23 (`useEffect` verifica `/api/auth/session` e redireciona) |
| I3 | Dashboard | Dashboard faz **17 queries paralelas** na página inicial. Para poucos dados é ok, mas com escala pode ser lento. Considerar cache ou agregação | `src/app/app/page.tsx:getDashboardData()` | ✅ Corrigido em 2026-04-23 (reduzido para 11 queries: removidas queries dead code `whatsappShares`, `emailShares`, `upcomingConfirmedReservations`; derivados `checkInsTodayNotDone`, `checkOutsTodayNotDone` e `totalGuides` em memória) |
| I4 | Reservas | `reservations-client.tsx` não faz `router.refresh()` após `deleteReservation` ou `updateReservationStatus`. A lista pode ficar stale | `reservations-client.tsx:131,136` | ✅ Corrigido em 2026-04-23 (`window.location.reload()` após operações) |
| I5 | Reservas | As select filters de status e imóvel usam `<select>` nativo em vez de shadcn Select, inconsistente com o resto do app | `reservations-client.tsx:130-153` | ✅ Corrigido em 2026-04-23 (forms de nova/editar reserva agora usam shadcn Select; filtros do client já usavam shadcn Select) |
| I6 | Reservas | `calendario/page.tsx` está parcialmente truncado no output — verificar se está completo | `src/app/app/reservas/calendario/page.tsx` | ✅ Verificado em 2026-04-23 (arquivo está completo com 349 linhas: navegação, métricas, grade mensal, legendas) |
| I7 | Imóveis | Formulário de criar/editar imóvel tem ~1300 linhas e ~30 campos num único arquivo. Deveria ser quebrado em componentes ou steps/wizard | `src/app/app/imoveis/novo/page.tsx` | ✅ Corrigido em 2026-04-23 (extraído hook `usePropertyForm`, shell `PropertyFormShell` e 8 step components; novo/page.tsx: 1305→240 linhas; editar/page.tsx: 1246→332 linhas) |
| I8 | Imóveis | `property-actions.tsx` usa `DialogTrigger` sem `asChild`, criando `<button>` dentro de `<button>` (HTML inválido). O botão "Excluir" pode não funcionar corretamente em todos os browsers | `property-actions.tsx:94-102` | ✅ Corrigido em 2026-04-23 (usado `render` do @base-ui DialogTrigger) |
| I9 | Imóveis | `property-actions.tsx` usa `router.push('/app/imoveis')` hardcoded ao invés de constante compartilhada | `property-actions.tsx:40` | ✅ Corrigido em 2026-04-23 (criada constante `ROUTES.imoveis` em `lib/constants.ts`) |
| I11 | Landing | Hero CTA principal aponta para `/login` mas poderia ter CTA "Começar grátis" levando para `/cadastro` | `landing/hero.tsx` | ✅ Corrigido em 2026-04-23 (CTA aponta para `/cadastro`) |
| I12 | Landing | Seções de preço/pricing e FAQ usam dados hardcoded. Se houver mudança de planos, precisa alterar código | `landing/pricing.tsx`, `landing/faq.tsx` | ✅ Corrigido em 2026-04-23 (dados extraídos para `src/lib/data/pricing.ts` e `src/lib/data/faq.ts`) |
| I13 | Guia público | `guide-access-tracker.tsx` faz fetch POST para server action a cada acesso, mas não tem debounce ou proteção contra múltiplos mounts (React StrictMode em dev monta 2x) | `guide-access-tracker.tsx` | ✅ Corrigido em 2026-04-23 (`useRef` flag `hasLogged` previne duplo log) |
| I14 | Guia público | Check-out page faz `exitChecklist.split('.')` para criar itens do checklist, mas isso quebra se o texto tiver pontos finos dentro de frases. Considerar separador mais robusto (quebra de linha `\n`) | `check-out/page.tsx:41-43` | ✅ Corrigido em 2026-04-23 (split por `\n` em vez de `.`) |
| I15 | Traduções | `translations-editor.tsx` chama API de tradução automática sem loading state visual consistente. Pode parecer que travou | `translations-editor.tsx` | ✅ Corrigido em 2026-04-23 (botões de salvar/gerar exibem `Loader2` animado e ficam disabled durante a operação) |
| I16 | i18n | Arquivos `pt-BR.ts`, `en.ts`, `es.ts` são importados síncronos. Se os dicionários crescerem muito, podem aumentar o bundle. Considerar lazy loading | `src/lib/i18n/` | ✅ Corrigido em 2026-04-23 (`loadDictionary` com lazy loading async para EN/ES; `pt-BR` mantido síncrono como default; cache de dicionários carregados) |
| I17 | **Multi-tenancy** | `createProperty` associa o imóvel à **primeira organização do banco** (`findFirst()`), não à organização do usuário logado. Isso quebra completamente o conceito de multi-tenancy | `src/app/actions/create-property.ts` | ✅ Corrigido em 2026-04-23 (usa `session.organizationId` via `requireSession()`) |
| I18 | **Multi-tenancy** | `getOrganization` retorna a **primeira organização do banco** (`findFirst()`), não necessariamente a do usuário logado | `src/app/actions/update-organization.ts` | ✅ Corrigido em 2026-04-23 (usa `session.organizationId` via `requireSession()`) |
| I19 | **Multi-tenancy** | Dashboard (`getDashboardData`) e páginas de listagem (`/app/imoveis`, `/app/reservas`, `/app/guias`) não filtram por `organizationId`. Mostram dados de **todas as organizações** do sistema | `src/app/app/page.tsx`, `imoveis/page.tsx`, `reservas/page.tsx`, `guias/page.tsx` | ✅ Corrigido em 2026-04-23 (todas as queries filtram por `organizationId` via relacionamentos ou campo direto) |
| I20 | Compartilhamento | `shareGuide` não valida se o `guideId` existe antes de criar o `shareLog`. Pode criar registros órfãos | `src/app/actions/share-guide.ts` | ✅ Corrigido em 2026-04-23 (validação `db.guide.findUnique` antes do create) |
| I21 | Imóveis | `updateProperty` faz `deleteMany` + `createMany` para devices, contacts e recommendations. Isso **perde os IDs originais** e quebra referências externas. Deveria usar upsert ou merge inteligente | `src/app/actions/update-property.ts:146-196` | ✅ Corrigido em 2026-04-23 (merge inteligente por chave natural: atualiza existentes, cria novos, remove ausentes; IDs preservados) |
| I22 | Imóveis | `createProperty` não verifica colisão de `guideSlug`. Se dois imóveis tiverem nomes similares, o segundo falha silenciosamente na criação do guia | `src/app/actions/create-property.ts:67` | ✅ Corrigido em 2026-04-23 (já verificava `existingGuide` por slug; validação reforçada) |
| I23 | Guia público | Seção sem dados no hub usa `href="#"` e `cursor-not-allowed`, mas o `href="#"` ainda causa scroll to top ao clicar. Deveria ser um `<div>` sem href | `src/app/g/[slug]/page.tsx` | ✅ Corrigido em 2026-04-23 (substituído por `<div>` com `onClick` condicional) |

### 🟢 Menor (polimento e boas práticas)

| # | Área | Problema | Arquivo | Status |
|---|------|----------|---------|--------|
| M1 | Tipos | Muitos arquivos usam `any` em contato com hóspedes, dispositivos, recomendações no guia público. Criar tipos inferidos do Prisma | `src/app/g/[slug]/**` | ✅ Corrigido em 2026-04-23 (`GuideContact`, `GuideDevice`, `GuideRecommendation`, `GuideLink` exportados de `guide-utils.ts`) |
| M2 | SEO | Páginas do guia público (`/g/[slug]/*`) não geram metadata dinâmica (title, description, og:image) para SEO. Todas usam o mesmo layout genérico | `src/app/g/[slug]/layout.tsx` | ✅ Corrigido em 2026-04-23 (`generateMetadata` com OpenGraph/Twitter Cards) |
| M3 | SEO | Landing page anchor links funcionam, mas o scroll não é smooth. Adicionar `scroll-behavior: smooth` no CSS raiz melhoraria a UX | `globals.css` | 🟢 **Corrigido** |
| M4 | Performance | Imagens de recomendações usam `<img>` nativo em vez de `<Image>` do Next.js. Sem otimização de tamanho/formato | `dicas/page.tsx:136-141` | ✅ Corrigido em 2026-04-23 (substituído por `<Image fill unoptimized>`) |
| M5 | Performance | Dashboard overview recarrega tudo a cada visit sem nenhum tipo de cache (React cache, ISR, ou revalidation tags). Considerar `unstable_cache` ou revalidation por tempo | `src/app/app/page.tsx` | ✅ Corrigido em 2026-04-23 (`unstable_cache` do Next.js com tag `dashboard` e revalidate de 30s; `revalidateTag('dashboard', {})` disparado por create/delete property, toggle guide, create/update/delete reservation e share guide) |
| M6 | Acessibilidade | Componentes `<select>` nativos não seguem o padrão de acessibilidade do shadcn (ARIA labels, keyboard nav). Inconsistente com o resto do app | `reservas/novo`, `reservas/[id]/editar` | ✅ Corrigido em 2026-04-23 (substituídos por shadcn Select) |
| M7 | Acessibilidade | Landing page CTA fixo mobile (`fixed inset-x-0 bottom-0`) pode sobrepor conteúdo do footer em telas pequenas | `src/app/page.tsx:104-112` | ✅ Corrigido em 2026-04-23 (`pb-28` no container principal para dar folga ao footer) |
| M8 | CORS/Segurança | API routes de auth não setam headers CORS. Em produção com domínio custom pode haver bloqueio se houver chamadas cross-origin | `src/app/api/auth/**` | ✅ Corrigido em 2026-04-23 (todas as API routes de auth já usam `withCors`/`handleCorsPreflight` desde implementação anterior; callback de redirect não precisa) |
| M9 | Dados | `recomendações` (dicas) permitem campo `image` como URL de imagem mas sem validação ou sanitização. Upload de imagem para recomendações não existe | `src/app/actions/recommendations.ts` | ✅ Corrigido em 2026-04-23 (`sanitizeImageUrl` rejeita URLs que não comecem com http:// ou https://; cast `as any` substituído por enum `RecommendationCategory`) |
| M10 | Responsivo | Páginas de editar/criar reserva usam grid `sm:grid-cols-2`/`sm:grid-cols-3` que fica apertado em telas muito pequenas (320px) | Reservas forms | ✅ Corrigido em 2026-04-23 (adicionado breakpoint `min-[480px]:grid-cols-2` para grids de 3 colunas melhorarem em telas médias; abaixo continua 1 coluna) |
| M11 | Preview | Link de demo na landing aponta para slug hardcoded `flat-elegance-paulista`. Se esse imóvel for deletado, a demo quebra | `src/app/page.tsx:56,100`, `landing/hero.tsx:59` | ✅ Corrigido em 2026-04-23 (links apontam para `/g/demo` que busca o guia publicado mais recente) |
| M12 | Consistência | Textos de erro em auth usam acentos ausentes (ex: "nao" em vez de "não", "operacao" em vez de "operação") no backend mas na landing os acentos estão corretos. Inconsistência | `src/lib/auth.ts`, `src/app/api/auth/**` | ✅ Corrigido em 2026-04-23 (acentos corrigidos em `src/lib/auth.ts` e em todas as API routes de auth: login, register, forgot-password, reset-password) |
| M13 | Lints | Arquivos duplicados: `src/app/app/reservas/[id]/edit-reservation-form.tsx` parece ser um arquivo legado ao lado de `src/app/app/reservas/[id]/editar/edit-reservation-form.tsx` | Reserva edit form | ✅ Verificado em 2026-04-23 (arquivo não existe mais; já removido em rodada anterior) |
| M14 | Código | `PropertyActions` recebe `guideStatus` como `string` mas deveria ser um enum `GuideStatus` do Prisma para type safety | `property-actions.tsx:8` | ✅ Corrigido em 2026-04-23 (tipo alterado para `GuideStatus` do Prisma) |
| M15 | Código | `createProperty` e `updateProperty` usam `as any` para enums do Prisma. Deveriam usar type guards ou cast seguro | `create-property.ts`, `update-property.ts` | ✅ Corrigido em 2026-04-23 (casts substituídos por enums do Prisma: PropertyType, DeviceType, ContactRole, RecommendationCategory) |
| M16 | Código | `updateOrganization` aceita `slug` mas não valida unicidade. Pode gerar slug duplicado e erro do banco | `update-organization.ts` | ✅ Corrigido em 2026-04-23 (verificação `db.organization.findUnique` antes do update) |
| M17 | Código | `toggleGuideStatus` não verifica ownership antes de alterar status do guia | `toggle-guide-status.ts` | ✅ Corrigido em 2026-04-23 (verifica `requirePropertyAccess` antes de alterar; fluxo de publicação mantido conforme regra de negócio) |
| M18 | Código | `guide-access-tracker` passa `navigator.userAgent` inteiro para o servidor. Pode logar dados desnecessariamente longos | `guide-access-tracker.tsx` | ✅ Corrigido em 2026-04-23 (truncado para 200 caracteres antes do envio) |
| M19 | Código | `env.ts` usa fallback `dev-secret-change-in-production` para `nextauthSecret`. Se esquecer de configurar em produção, a aplicação fica insegura | `src/lib/env.ts:41` | ✅ Corrigido em 2026-04-23 (função `requireEnv` lança erro em produção se NEXTAUTH_SECRET não estiver definido) |
| M20 | Código | Prisma Client fallback com Proxy retorna `null` para tudo em caso de erro. Isso pode mascarar falhas de conexão e gerar erros confusos downstream | `src/lib/db.ts:11-17` | ✅ Corrigido em 2026-04-23 (bloco catch agora loga o erro e lança exceção com mensagem clara) |

---

## Correções em relação à análise anterior

| Item | O que estava errado | Correção |
|------|---------------------|----------|
| I10 (share-modal) | Afirmava que share-modal mostra botões mesmo com guia não publicado | **Removido**. O share-modal já trata isso corretamente: mostra aviso e esconde botões quando `!isPublished` |
| M3 (SEO anchors) | Afirmava que landing não tinha IDs consistentes para anchor links | **Reclassificado**. Os IDs existem (`#recursos`, `#como-funciona`, `#precos`, `#contato`). O problema real é falta de `scroll-behavior: smooth` |
| C2 (Google OAuth) | Descrição exagerava risco de impersonação | **Nuanceado**. O fluxo de troca de `code` por `access_token` já é seguro (requere `client_secret`), mas a validação do token JWT do Google (`id_token`) não é feita, o que é uma boa prática recomendada |
| I9 | Afirmava que `deleteProperty` redirecionava com path hardcoded | **Corrigido**. É o componente `property-actions.tsx` que faz `router.push`, não a action |

---

## Fluxo por Botão — Análise Detalhada

### Landing Page

| Botão/Link | Ação | Funciona? | Observação |
|-------------|------|-----------|------------|
| Header "Entrar" | Navega para `/login` | ✅ | — |
| Header "Começar agora" | Navega para `/login` | ✅ | Deveria ir para `/cadastro`? |
| Hero CTA principal | Navega para `/login` | ✅ | Ver I11 |
| Hero "Abrir demo" | Navega para `/g/flat-elegance-paulista` | ✅ | Ver M11 |
| CTA mobile fixo "Começar grátis" | Navega para `/login` | ✅ | — |
| CTA mobile fixo "Ver demo" | Navega para `/g/flat-elegance-paulista` | ✅ | Ver M11 |
| Pricing CTAs | Navegam para `/login` | ✅ | — |
| Contato "Começar agora" | Navega para `/login` | ✅ | — |
| Contato "Abrir demonstração" | Navega para `/g/flat-elegance-paulista` externo | ✅ | Ver M11 |
| Footer links | Navegam para seções anchor | ✅ | Ver M3 |

### Auth

| Botão/Ação | Fluxo | Funciona? | Observação |
|-------------|-------|-----------|------------|
| Login com Google | `GET /api/auth/google` → callback → cria/upsert user → session cookie | ✅ | Ver C2 |
| Login com email/senha | `POST /api/auth/login` → bcrypt compare → JWT session | ✅ | Ver C9 |
| "Esqueci a senha" link | Navega para `/esqueci-senha` | ✅ | — |
| Cadastro com Google | Mesmo fluxo do login Google | ✅ | — |
| Cadastro com email/senha | `POST /api/auth/register` → cria user + org → redireciona para login | ✅ | Ver C1, I1 |
| "Manter conectado" checkbox | Define duração do cookie (30d vs 1d) | ✅ | — |
| Reset de senha | E-mail com token SHA-256 → `/redefinir-senha?token=` | ✅ | — |
| Logout | `POST /api/auth/logout` → delete cookie | ✅ | — |

### Dashboard — Imóveis

| Botão/Ação | Fluxo | Funciona? | Observação |
|-------------|-------|-----------|------------|
| "Novo imóvel" (sidebar ou header) | Navega para `/app/imoveis/novo` | ✅ | — |
| Criar imóvel | Server action `createProperty` → redirect para detalhe | ⚠️ | Ver C7, I17 |
| Editar imóvel | Navega para `/app/imoveis/[id]/editar` | ✅ | Ver I7, C7 |
| Deletar imóvel | Dialog confirmação → `deleteProperty` → redirect `/app/imoveis` | ⚠️ | Ver C4, C7 |
| Publicar guia | `toggleGuideStatus` → PUBLISHED | ⚠️ | Ver C7, M17 |
| Despublicar guia | `toggleGuideStatus` → UNPUBLISHED | ⚠️ | Ver C7 |
| Preview guia | Navega para `/app/imoveis/[id]/preview` | ✅ | — |
| Traduções | Navega para `/app/imoveis/[id]/traducoes` | ✅ | Ver C7, C10 |
| Upload de capa | Server action `uploadPropertyCover` → salva em disco local | ⚠️ | Ver C3, C7 |

### Dashboard — Reservas

| Botão/Ação | Fluxo | Funciona? | Observação |
|-------------|-------|-----------|------------|
| "Nova reserva" | Navega para `/app/reservas/novo` | ✅ | — |
| Criar reserva | Server action `createReservation` → redirect | ⚠️ | Ver C7 |
| Ver reserva | Navega para `/app/reservas/[id]` | ✅ | — |
| Editar reserva | Navega para `/app/reservas/[id]/editar` | ✅ | Ver C7 |
| Marcar check-in/out | Dropdown → `updateReservationStatus` | ⚠️ | Ver C6, I4, C7 |
| Excluir reserva | Dialog confirmação → `deleteReservation` | ⚠️ | Ver I4, C7 |
| Calendário | Navega para `/app/reservas/calendario` | ✅ | Ver I6 |
| Compartilhar guia na reserva | Abre `ShareModal` | ✅ | — |

### Dashboard — Compartilhamento

| Botão/Ação | Fluxo | Funciona? | Observação |
|-------------|-------|-----------|------------|
| WhatsApp | Abre link `wa.me` com mensagem pré-formatada | ✅ | — |
| E-mail | Abre mailto: com corpo pré-formatado | ✅ | — |
| Copiar link | Copia URL para clipboard | ✅ | — |
| QR Code | Gera QR com react-qr-code | ✅ | — |
| Log de compartilhamento | `shareGuide` server action → cria ShareLog | ⚠️ | Ver I20 |

### Guia Público (/g/[slug])

| Botão/Ação | Fluxo | Funciona? | Observação |
|-------------|-------|-----------|------------|
| Seção card (check-in, wifi, etc.) | Navega para `/g/[slug]/[seção]` | ✅ | — |
| Seção sem dados | Card com `href="#"` e opacidade | ⚠️ | Ver I23 |
| Copy WiFi | Botão de copiar para clipboard | ✅ | — |
| WhatsApp host | Link `wa.me` no bottom bar e no card | ✅ | Prefixo hardcoded protege |
| Link externo (recomendações) | `href={item.mapUrl}` ou `href={item.link}` | ⚠️ | Ver C8 |
| Link externo (links) | `href={link.url}` | ⚠️ | Ver C8 |
| Language switcher | Alterna PT/EN/ES via URL param `?lang=` | ✅ | — |
| Checklist check-out | Interativo com localStorage | ✅ | Ver I14 |
| Rastreamento de acesso | `logGuideAccess` server action via fetch | ✅ | Ver I13 |

---

## Arquitetura — Pontos de Atenção

### Segurança
- **Authorization**: ✅ Corrigido. Todas as server actions verificam ownership via helpers de authorization.
- **XSS**: ✅ Corrigido. URLs no guia público são sanitizadas com `sanitizeHref`.
- **Rate limiting**: ✅ Corrigido. Login, registro, forgot-password e reset-password têm rate limiting por IP.
- **CSRF**: Não há proteção CSRF nos forms de auth. Next.js server actions têm proteção implícita, mas API routes não.
- **Upload**: ✅ Corrigido. Abstração `uploadFile` suporta local/S3/R2.
- **Google OAuth**: ✅ Corrigido. ID token validado via JWKS do Google (aud, iss, exp).
- **Secret fallback**: ✅ Corrigido. `env.ts` lança erro em produção se `NEXTAUTH_SECRET` não estiver definido.

### Performance
- Dashboard initial load faz ~11 queries paralelas com `unstable_cache` de 30s. Ver I3, M5.
- Imagens sem `<Image>` do Next.js. Ver M4.

### Escalabilidade
- Upload de imagem em filesystem local. ✅ Corrigido (suporte a S3/R2).
- Sem paginação em listas (reservas, imóveis, templates). Com muitos registros fica lento.
- Dicionários i18n importados síncronos. ✅ Corrigido (lazy loading async para EN/ES).
- `updateProperty` deleta e recria relacionamentos, perdendo IDs. ✅ Corrigido (merge inteligente preserva IDs).

### Multi-tenancy
- ✅ Corrigido. Todas as queries filtram por `organizationId` e as actions verificam ownership.

### DX (Developer Experience)
- Formulário de criar imóvel com ~1300 linhas num único arquivo. ✅ Corrigido (extraído para hook + shell + step components).
- Arquivo legado `edit-reservation-form.tsx` duplicado. ✅ Removido.
- Vários `any` types no guia público. ✅ Corrigido.

---

## Histórico de Implementações

| Data | O que foi feito | Arquivos principais |
|------|----------------|---------------------|
| 22/04/2026 | Atualizações de frontend (24 arquivos) | Landing, shared, reservas, compartilhamento |
| 22/04/2026 | Remoção de docs obsoletos (DEPLOY.md, DEPLOY_I18N.md) | — |
| 22/04/2026 | Criação da análise PROGRESSO.md com 50+ itens identificados | — |
| 23/04/2026 | Authorization + multi-tenancy em todas as server actions e páginas do dashboard | `src/lib/authorization.ts`, `src/app/actions/*`, `src/app/app/*/page.tsx` |
| 23/04/2026 | Storage externo (S3/R2) com fallback local | `src/lib/storage.ts`, `src/app/actions/upload-image.ts`, `.env.example` |
| 23/04/2026 | Links de demo atualizados para `/g/demo` + fix de tipo em `translations.ts` | `landing/hero.tsx`, `page.tsx`, `actions/translations.ts` |
| 23/04/2026 | Rate limiting em auth, soft delete de imóveis, merge inteligente em updateProperty, login automático removido do registro, type safety em enums e GuideStatus, segurança em env.ts e db.ts | `src/lib/rate-limit.ts`, `src/app/api/auth/*`, `src/app/actions/delete-property.ts`, `src/app/actions/update-property.ts`, `prisma/schema.prisma`, `src/lib/env.ts`, `src/lib/db.ts`, `src/components/shared/guide-access-tracker.tsx` |
| 23/04/2026 | Validação de Google ID token (aud/iss), CORS em auth, validação de URLs em recomendações, loading state no translations-editor, acentos no backend auth, responsivo em forms de reserva | `src/lib/google-auth.ts`, `src/app/api/auth/google/callback/route.ts`, `src/app/actions/recommendations.ts`, `src/app/app/imoveis/[id]/traducoes/translations-editor.tsx`, `src/lib/auth.ts`, `src/app/app/reservas/novo/new-reservation-form.tsx`, `src/app/app/reservas/[id]/editar/edit-reservation-form.tsx` |
| 23/04/2026 | Otimização do dashboard: redução de 17 para 11 queries, cache com `unstable_cache` (30s) e revalidation tags | `src/app/app/page.tsx`, `src/app/actions/create-property.ts`, `src/app/actions/delete-property.ts`, `src/app/actions/toggle-guide-status.ts`, `src/app/actions/reservations.ts`, `src/app/actions/share-guide.ts` |
| 24/04/2026 | Refatoração dos formulários de imóvel (I7), lazy loading i18n (I16), extração de dados hardcoded da landing (I12) | `src/components/property-form/*`, `src/lib/i18n/index.ts`, `src/lib/data/pricing.ts`, `src/lib/data/faq.ts` |