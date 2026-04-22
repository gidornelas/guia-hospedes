# Documentação do GuiaHóspedes

## 1. Visão Geral do Projeto

**GuiaHóspedes** é uma plataforma SaaS (Software as a Service) de hospitalidade de luxo que permite anfitriões e gestores de imóveis de hospedagem criarem **guias digitais automáticos** para seus hóspedes. A aplicação substitui manuais impressos e PDFs por uma experiência digital moderna, acessível via QR Code, WhatsApp ou link direto.

### Funcionalidades principais
- Cadastro e gestão de imóveis (apartamentos, casas, chalés, sítios, etc.)
- Geração automática de guias digitais com informações de check-in, Wi-Fi, regras, equipamentos, contatos e dicas locais
- Compartilhamento via WhatsApp, e-mail, link e QR Code
- Dashboard administrativo com analytics e controle de status dos guias
- Integração com Airbnb (ical/importação)
- Templates de mensagens automáticas
- Multi-tenancy por organização (várias empresas/usuários isolados)

### Estado atual do frontend
- A landing pública já foi reestruturada com CTA persistente no mobile, links funcionais e microcopy mais orientada à conversão.
- O dashboard já usa uma shell responsiva com drawer em notebook pequeno e tablet, evitando sidebar fixa cedo demais.
- Os módulos de imóveis, preview, compartilhamento, analytics, integrações, configurações, guias e modelos de mensagem passaram por uma rodada ampla de refinamento visual e de UX.
- O status detalhado da evolução está em `docs/plano_frontend.md`.
- O checklist de revisão visual antes de cada entrega está em `docs/frontend_qa_checklist.md`.

---

## 2. Stack Tecnológica e Decisões Arquiteturais

### 2.1 Framework e Runtime
| Tecnologia | Versão | Decisão |
|-----------|--------|---------|
| **Next.js** | 16.2.4 | Framework full-stack com App Router. Escolhido pelo suporte a Server Components, Server Actions e roteamento declarativo. |
| **React** | 19.2.4 | Biblioteca UI mais recente, com suporte a novos hooks e melhorias de performance. |
| **TypeScript** | 5.x | Tipagem estática obrigatória em todo o projeto. Elimina erros em runtime e documenta automaticamente as interfaces. |
| **Node.js** | 20.x | Versão LTS recomendada. Especificada no `package.json` via `engines`. |

### 2.2 Estilização e Design System
| Tecnologia | Versão | Decisão |
|-----------|--------|---------|
| **Tailwind CSS** | 4.x | Utility-first CSS. Usado com a nova sintaxe `@import "tailwindcss"` e `@theme inline`. Permite total controle visual sem folhas de estilo convencionais. |
| **tw-animate-css** | 1.2.8 | Animações CSS pré-configuradas para componentes shadcn/ui. |
| **tailwind-merge** | 3.2.0 | Utilitário para mesclar classes Tailwind sem conflitos (usado na função `cn()`). |
| **clsx** | 2.1.1 | Construtor condicional de classes CSS (usado junto com `tailwind-merge`). |
| **class-variance-authority** | 0.7.1 | Sistema de variantes para componentes (Button, Badge, etc.). |

### 2.3 Componentes UI
| Tecnologia | Versão | Decisão |
|-----------|--------|---------|
| **shadcn/ui** | (via CLI) | Biblioteca de componentes headless construída sobre Radix UI. Copiados para `src/components/ui/`, permitindo total customização sem dependência de pacote externo. |
| **Radix UI** | Várias | Primitivos acessíveis (Dialog, Dropdown, Tabs, etc.). Garantem comportamento correto de teclado, foco e screen readers. |
| **Base UI** | 1.4.1 | Usado nos componentes de Sheet e DropdownMenu recentes. Alternativa mais moderna da MUI para primitivos headless. |
| **Lucide React** | 0.503.0 | Biblioteca de ícones moderna, tree-shakeable, com suporte a acessibilidade. |

### 2.4 Banco de Dados e ORM
| Tecnologia | Versão | Decisão |
|-----------|--------|---------|
| **Prisma ORM** | 6.7.0 | ORM type-safe. Schema declarativo em `prisma/schema.prisma`. Gera tipos TypeScript automaticamente. |
| **SQLite** | (built-in) | Banco de desenvolvimento local (`dev.db`). Zero configuração de infraestrutura. |
| **PostgreSQL** | (produção) | Banco de produção via Railway. O schema Prisma usa `provider = "postgresql"` para compatibilidade. |

**Decisão importante:** O schema Prisma está configurado com `provider = "postgresql"` mesmo no desenvolvimento. Isso significa que o SQLite local funciona via `DATABASE_URL=file:./dev.db`, mas o schema é 100% compatível com PostgreSQL, evitando surpresas no deploy.

### 2.5 Autenticação e Segurança
| Tecnologia | Versão | Decisão |
|-----------|--------|---------|
| **jose** | 6.2.2 | Biblioteca para JWT (JSON Web Tokens). Significa "JavaScript Object Signing and Encryption". |
| **bcryptjs** | 3.0.2 | Hash de senhas. Versão puramente JavaScript (sem dependências nativas), funcionando em qualquer plataforma. |

**Decisão arquitetural:** Em vez de usar NextAuth.js v5 (Auth.js), o projeto implementa autenticação manual com JWT. Essa decisão foi tomada para:
1. Reduzir complexidade (NextAuth tem muita mágica e overhead)
2. Ter controle total sobre o payload da sessão (organizationId, role, etc.)
3. Suportar usuários de demonstração hardcoded sem necessidade de banco
4. Sessões stateless via cookie HTTP-only

### 2.6 Formulários e Validação
| Tecnologia | Versão | Decisão |
|-----------|--------|---------|
| **React Hook Form** | 7.56.2 | Gerenciamento de formulários com performance otimizada (re-renderizações controladas). |
| **Zod** | 3.24.4 | Validação de schemas TypeScript-first. Usado com `@hookform/resolvers` para integração com React Hook Form. |

### 2.7 Deploy e Infraestrutura
| Plataforma | Uso |
|-----------|-----|
| **Railway** | Hospedagem de produção (Node.js + PostgreSQL). Deploy automático via CLI. |
| **GitHub** | Versionamento de código e integração contínua. |

---

## 3. Estrutura de Diretórios

```
guia-hospedes/
├── prisma/                    # Schema, migrations e seed do banco
│   ├── schema.prisma          # Modelos de dados e enums
│   ├── seed.ts                # Dados de demonstração
│   └── migrations/            # Migrações do Prisma
├── public/                    # Assets estáticos (imagens, SVGs)
├── src/
│   ├── app/                   # App Router do Next.js
│   │   ├── actions/           # Server Actions (mutações de dados)
│   │   ├── api/               # API Routes (autenticação, etc.)
│   │   ├── app/               # Área logada (dashboard)
│   │   ├── g/                 # Guia público para hóspedes
│   │   ├── login/             # Página de login
│   │   ├── globals.css        # Design system e variáveis CSS
│   │   ├── layout.tsx         # Layout raiz (fontes, providers)
│   │   └── page.tsx           # Landing page pública
│   ├── components/
│   │   ├── dashboard/         # Componentes da área admin
│   │   ├── shared/            # Componentes compartilhados
│   │   └── ui/                # Componentes shadcn/ui (primitivos)
│   ├── lib/                   # Utilitários e configurações
│   └── types/                 # Tipagens TypeScript globais
├── .env.example               # Template de variáveis de ambiente
├── next.config.ts             # Configuração do Next.js
├── package.json
└── tsconfig.json
```

---

## 4. Documentação Detalhada dos Arquivos

### 4.1 Configuração e Ambiente

#### `package.json`
- Define o projeto como `guia-hospedes` v0.1.0
- Especifica `packageManager: npm@10.8.2` para consistência entre ambientes
- `engines: { node: "20.x", npm: "10.x" }` garante compatibilidade
- Scripts importantes:
  - `dev`: servidor de desenvolvimento Next.js
  - `build`: build de produção com otimizações
  - `db:seed`: popula o banco com dados demo via `tsx prisma/seed.ts`
  - `db:push`: sincroniza schema com banco sem migrações
  - `typecheck`: verificação TypeScript sem emitir arquivos
  - `postinstall`: gera cliente Prisma automaticamente após `npm install`

#### `next.config.ts`
- **Decisão:** NÃO usa `output: 'standalone'` para evitar incompatibilidades de runtime no Railway.
- Configura `images.remotePatterns` para permitir domínios externos (`images.unsplash.com`, `*.googleusercontent.com`)
- `typescript.ignoreBuildErrors: false` garante que erros de tipo bloqueiem o build

#### `.env.example`
- Template de todas as variáveis de ambiente necessárias
- NUNCA deve conter valores reais (apenas placeholders)
- Variáveis incluem: `DATABASE_URL`, `NEXTAUTH_SECRET`, `SMTP_*`, `WHATSAPP_*`, etc.

#### `tsconfig.json`
- Configuração padrão do Next.js com TypeScript
- Path aliases: `@/*` aponta para `./src/*`
- Target: ES2017, módulos ESNext

#### `prisma/schema.prisma`
- Define 17 modelos de dados e 17 enums
- Modelos principais:
  - `User`: usuários do sistema com roles (ADMIN, MANAGER, HOST)
  - `Organization`: multi-tenancy (várias empresas isoladas)
  - `Property`: imóveis com slug único para SEO
  - `Guide`: guias digitais com versionamento e slug
  - `PropertyCheckIn`, `PropertyCheckOut`, `PropertyWiFi`, `PropertyRules`: dados específicos do imóvel
  - `PropertyDevice`, `PropertyContact`, `LocalRecommendation`, `PropertyLink`: listas relacionadas
  - `ShareLog`: logs de compartilhamento por canal
  - `Integration`, `AirbnbConnection`, `SyncLog`: integrações externas
  - `MessageTemplate`: templates de mensagens com variáveis

**Decisão de design:** Cada seção do guia (check-in, Wi-Fi, regras) tem sua própria tabela em vez de um JSON genérico. Isso permite:
- Validação de tipos no banco
- Consultas otimizadas por seção
- Facilidade para adicionar campos novos no futuro

#### `prisma/seed.ts`
- Script que popula o banco com dados de demonstração
- Cria 2 organizações, 3 usuários, 5 imóveis, guias, templates, integrações
- Cada imóvel recebe automaticamente check-in, check-out, Wi-Fi, regras, dispositivos, contatos, recomendações e links
- Usuários demo:
  - `joao@guiahospedes.com` / `senha123` (ADMIN)
  - `maria@exemplo.com` / `senha123` (MANAGER)
  - `carlos@exemplo.com` / `senha123` (HOST)
- Executado via `npm run db:seed`

---

### 4.2 Autenticação e Sessão

#### `src/lib/session.ts`
- Implementação manual de sessão JWT usando a biblioteca `jose`
- **Funções exportadas:**
  - `createSessionToken(payload)`: assina um JWT com expiração de 30 dias
  - `verifySessionToken(token)`: verifica e decodifica o JWT
  - `getSession()`: lê o cookie `session-token` e retorna a sessão
  - `setSessionCookie(token)`: define cookie HTTP-only, Secure em produção, SameSite=Lax
  - `deleteSessionCookie()`: remove o cookie de sessão
- **Payload da sessão:** inclui `id`, `email`, `name`, `role`, `organizationId`, `organizationName`, `image`
- **Segurança:** cookie `httpOnly` (não acessível via JavaScript), `secure` apenas em produção

**Decisão:** O segredo JWT vem de `AUTH_SECRET` ou `NEXTAUTH_SECRET` (fallback). Se nenhum estiver configurado, a aplicação lança erro no startup.

#### `src/middleware.ts`
- Middleware de rota do Next.js executado em TODAS as requisições
- **Matcher:** `/((?!api|_next/static|_next/image|favicon.ico).*)` — ignora API e assets
- **Lógica:**
  1. Define rotas públicas: `/`, `/precos`, `/contato`, `/login`, e tudo em `/g/*` (guias públicos)
  2. Ignora rotas de API e assets estáticos
  3. Lê o cookie `session-token`
  4. Se não houver sessão e a rota não for pública, redireciona para `/login` com `callbackUrl`
- Usa `ensureValidUrl()` para corrigir URLs sem protocolo (comum em deploys)

#### `src/app/api/auth/login/route.ts`
- API Route POST para autenticação
- **Fluxo:**
  1. Recebe `email` e `senha`
  2. Tenta buscar usuário no banco primeiro (com bcrypt)
  3. Se falhar, usa fallback de usuários demo hardcoded (sem bcrypt)
  4. Cria JWT com `createSessionToken()`
  5. Define cookie com `setSessionCookie()`
  6. Retorna `{ success: true, user: { name, email } }`
- **Decisão:** O fallback de demo users permite testar a aplicação mesmo sem banco configurado.

#### `src/app/api/auth/logout/route.ts`
- API Route POST para logout
- Simplesmente chama `deleteSessionCookie()`

#### `src/app/api/auth/session/route.ts`
- API Route GET para obter dados da sessão atual
- Retorna `{ user: { name, email, image } }` ou `{ user: null }`
- Usado pelo hook `useUser()` no frontend para exibir dados do usuário logado

---

### 4.3 Banco de Dados e Utilitários

#### `src/lib/db.ts`
- Exporta a instância `db` do PrismaClient
- **Padrão Singleton:** usa variável global para reutilizar a conexão em desenvolvimento (evita múltiplas instâncias no hot-reload)
- **Proxy de fallback:** se o Prisma falhar ao inicializar, retorna um proxy que resolve `null` para qualquer chamada. Isso evita crashes durante builds ou quando o banco está indisponível.

#### `src/lib/utils.ts`
- `cn(...inputs)`: função utilitária que combina `clsx` (condicional) + `tailwind-merge` (sem conflitos). Usada em praticamente todos os componentes.
- `ensureValidUrl(url)`: garante que URLs tenham protocolo `https://`. Essencial porque plataformas de deploy (Railway, Vercel) às vezes injetam domínios sem protocolo.

#### `src/lib/env.ts`
- Centraliza todas as variáveis de ambiente em um único objeto tipado `EnvConfig`
- **Decisão:** ler de `process.env` diretamente, sem SDK externo (como t3-env)
- Fallbacks sensatos para desenvolvimento:
  - `DATABASE_URL` default: `file:./dev.db`
  - `NEXTAUTH_SECRET` default: `dev-secret-change-in-production`
  - `SMTP_HOST` default: `smtp.gmail.com`
- Exporta `env` já instanciado para uso em toda a aplicação

#### `src/lib/constants.ts`
- Constantes de domínio da aplicação
- Dicionários de tradução para enums do Prisma:
  - `PROPERTY_TYPES`: APARTAMENT → Apartamento
  - `PROPERTY_STATUS`: DRAFT → Rascunho (com cores semanticas)
  - `GUIDE_STATUS`, `SHARE_CHANNELS`, `TEMPLATE_TYPES`, etc.
- `DASHBOARD_NAV`: array de navegação do sidebar com labels, hrefs e ícones

---

### 4.4 Design System e Estilos

#### `src/app/globals.css`
- **Design system completo** usando a nova sintaxe do Tailwind CSS v4 com `@theme inline`
- **Tokens de cores personalizados:**
  - Paleta de marca rosa (`brand-50` a `brand-900`)
  - `brand-500: #b6465f` — cor primária (rosa escuro)
  - `brand-300: #f4a9ba` — rosa claro
  - `brand-soft: #ebd4cb`, `brand-warm: #da9f93`
  - Escala completa de slate (cinza azulado)
  - Cores semânticas: warning, error
- **Tokens de raio:** `--radius-sm`, `--radius-md`, `--radius-lg`, etc., calculados a partir de `--radius: 0.5rem`
- **Variáveis CSS por tema:**
  - `:root` (light): fundo branco, texto slate-900, primária rosa
  - `.dark` (dark): fundo slate-950, texto slate-50, primária rosa claro
- **Sidebar tokens:**
  - Light: `--sidebar: #18181b` (zinc-900), `--sidebar-accent: #27272a` (zinc-800)
  - Dark: `--sidebar: #09090b` (zinc-950), `--sidebar-accent: #27272a`
  - **Decisão:** cinza escuro (zinc) em vez de azul escuro (slate). Cria uma identidade visual mais neutra e elegante, deixando o rosa da marca como única cor de destaque.
- **Acessibilidade:**
  - `:focus-visible` com outline de 2px na cor `--ring`
  - `@media (prefers-reduced-motion: reduce)` desabilita animações
  - `@media (pointer: coarse)` garante touch targets mínimos de 44px
- **Utilitários customizados:**
  - `.gradient-hero`, `.gradient-dark-hero`, `.gradient-brand-soft`
  - `.shadow-card`, `.shadow-card-hover`, `.shadow-elevated`

---

### 4.5 Layouts e Páginas Públicas

#### `src/app/layout.tsx`
- Layout raiz de toda a aplicação
- **Fontes:**
  - `DM_Sans` (sans-serif) para texto corrido
  - `DM_Serif_Display` (serif) para títulos e headings
  - Variáveis CSS: `--font-sans`, `--font-serif`
- **Metadata:**
  - Título padrão: "GuiaHóspedes — Guias Digitais para Imóveis de Hospedagem"
  - Template: `%s | GuiaHóspedes`
  - OpenGraph configurado para compartilhamento social
  - Locale: `pt_BR`
- **Providers:**
  - `TooltipProvider`: contexto para tooltips acessíveis
  - `Toaster`: notificações toast no canto superior direito
- **Acessibilidade:**
  - `lang="pt-BR"` no HTML
  - `scroll-behavior: smooth`
  - Body com `min-h-full flex flex-col`

#### `src/app/page.tsx`
- Landing page pública (não requer autenticação)
- Apresenta o produto, benefícios e call-to-action
- Layout com gradiente hero, cards de funcionalidades, depoimentos
- Link para `/login` na navegação

#### `src/app/login/page.tsx`
- Página de autenticação completa
- **Componente `LoginForm`:**
  - Client Component (`'use client'`) por usar hooks (`useState`, `useSearchParams`)
  - Campos: email, senha (com toggle de visibilidade)
  - Validação de campos obrigatórios
  - Submissão via `fetch('/api/auth/login')`
  - Redirecionamento para `callbackUrl` (ou `/app` se não houver)
  - Estados: `isLoading`, `error`
- **Dados de demonstração exibidos:**
  - Lista os 3 usuários demo com email e senha
  - Facilita testes em apresentações
- **Acessibilidade:**
  - Labels associados aos inputs via `htmlFor`
  - Botão de mostrar/ocultar senha com `aria-label`
  - Estados de erro em `role="alert"` (implícito no div de erro)

---

### 4.6 Área Administrativa (Dashboard)

#### `src/app/app/layout.tsx`
- Layout da área logada (`/app/*`)
- **Server Component:** verifica sessão com `getSession()`
- Se não autenticado, redireciona para `/login`
- Estrutura:
  - Skip link para conteúdo principal (acessibilidade)
  - `<Sidebar />` fixo à esquerda
  - `<Topbar />` sticky no topo
  - `<main>` com conteúdo das páginas filhas
- Padding responsivo: `lg:pl-64` acompanha largura do sidebar

#### `src/components/dashboard/sidebar.tsx`
- **Decisão de refatoração:** componente reescrito para eliminar código duplicado e padronizar estados.
- **Tokens de estilo exportados:**
  - `navItemBase`: classes base para todos os itens de navegação
  - `navItemActive` / `navItemInactive`: estados de ativação
  - `actionBtnBase`: classes base para botões de ação (logout, toggle)
- **Componentes reutilizáveis:**
  - `NavLink`: link de navegação com detecção automática de rota ativa via `usePathname()`
  - `LogoutButton`: botão de logout reutilizável
- **Comportamento:**
  - Itens ativos recebem `bg-sidebar-accent` e `text-sidebar-accent-foreground`
  - Hover padronizado com `hover:bg-sidebar-accent/50`
  - Animação `active:scale-[0.98]` em todos os botões interativos
  - Transições: `transition-all duration-200 ease-in-out`
  - Focus visible com `focus-visible:ring-2 focus-visible:ring-sidebar-primary/50`
- **Sidebar desktop:**
  - Fixo à esquerda, `z-40`
  - Toggle de colapso: `w-16` (colapsado) vs `w-64` (expandido)
  - Transição suave de largura: `transition-all duration-300 ease-in-out`
- **Decisão de remoção:** `MobileMenuButton` foi removido deste arquivo. O menu mobile agora vive exclusivamente no `Topbar`, eliminando duplicação de código.

#### `src/components/dashboard/topbar.tsx`
- Barra superior do dashboard
- **Funcionalidades:**
  - Breadcrumbs dinâmicos baseados no `pathname`
  - Campo de busca (estático, sem funcionalidade implementada)
  - Botão de notificações com badge vermelho
  - Menu do usuário (dropdown com avatar)
  - Botão de menu mobile (hambúrguer) que abre Sheet
- **Hook `useUser()`:**
  - Client-side fetch para `/api/auth/session`
  - Armazena dados do usuário em state
- **Componente `MobileMenu`:**
  - Sheet lateral controlado por estado local `open`
  - Reutiliza `NavLink` e `LogoutButton` do `sidebar.tsx`
  - **Decisão:** fecha automaticamente ao clicar em qualquer link
  - Usa `SheetTrigger` com `render` prop para compatibilidade com Base UI
- **Padronização visual:**
  - Todos os botões têm `transition-all duration-200 ease-in-out`
  - Todos os botões têm `active:scale-95`
  - Todos os botões têm `focus-visible:ring-2 focus-visible:ring-ring/50`

#### `src/app/app/page.tsx` (Dashboard)
- Server Component que busca dados do banco em paralelo via `Promise.all()`
- **Métricas exibidas:**
  - Total de imóveis
  - Guias publicados
  - Guias em rascunho
  - Total de guias
- **Cards de ação rápida:**
  - Cadastrar novo imóvel
  - Ver todos os imóveis
  - Compartilhar guia
- **Lista de compartilhamentos recentes:**
  - Busca últimos 5 `ShareLog` com relacionamentos
  - Formata data para `pt-BR`
  - Badge de status (verde = enviado, âmbar = pendente)

---

### 4.7 Gestão de Imóveis

#### `src/app/app/imoveis/page.tsx` e `properties-client.tsx`
- Lista todos os imóveis da organização
- Server Component busca dados; Client Component renderiza interface interativa
- Cards com imagem de capa, nome, status, cidade/estado
- Botões de ação: editar, excluir, visualizar guia

#### `src/app/app/imoveis/novo/page.tsx`
- Formulário multi-etapas para cadastro de imóvel
- Wizard com seções: Informações Básicas, Check-in, Check-out, Wi-Fi, Regras, Equipamentos, Contatos, Região
- Checklist de progresso no sidebar direito
- **Decisão:** usa Server Action `createProperty` para submissão

#### `src/app/actions/create-property.ts`
- Server Action para criação de imóvel
- **Geração de slug:**
  - Normaliza nome (minúsculas, remove acentos, substitui espaços por hífens)
  - Limita a 60 caracteres
  - Verifica unicidade no banco
- **Auto-criação de organização:**
  - **Decisão:** se não existir nenhuma organização, cria uma padrão automaticamente (`"Minha Organização"`)
  - Isso resolve o erro "Execute o seed primeiro" que ocorria em bancos vazios
- Criação transacional:
  - Property (dados básicos)
  - PropertyCheckIn (opcional)
  - PropertyCheckOut (opcional)
  - PropertyWiFi (opcional)
  - PropertyRules (obrigatório)
  - PropertyDevice[] (opcional)
  - PropertyContact[] (opcional)
  - Guide (automático, status DRAFT)
- Chama `revalidatePath('/app/imoveis')` para atualizar cache

#### `src/app/actions/update-property.ts`
- Server Action para atualização completa de imóvel
- Usa `db.$transaction()` para garantir atomicidade
- Estratégia `upsert` para check-in, check-out, Wi-Fi e regras (cria se não existir, atualiza se existir)
- Estratégia "delete all + recreate" para dispositivos e contatos (mais simples que diff)
- Revalida paths afetados

#### `src/app/actions/delete-property.ts`
- Server Action para exclusão de imóvel
- Verifica existência antes de deletar
- Cascata automática via `onDelete: Cascade` no Prisma
- Revalida path da lista

---

### 4.8 Guia Público para Hóspedes

#### `src/app/g/[slug]/page.tsx`
- **Hub central do guia** — página que o hóspede acessa via QR Code ou link
- **Server Component:** busca dados do banco em tempo real
- **Layout mobile-first:** `max-w-lg mx-auto` para simular experiência de app
- **Seções dinâmicas:**
  - "Primeiros passos": check-in, Wi-Fi, WhatsApp do anfitrião (com dados reais)
  - "Tudo sobre o imóvel": grid 2 colunas com todas as seções
  - Cards desabilitados (`opacity-60`) quando não há dados
- **Barra flutuante inferior:**
  - Botão "Falar com o Anfitrião" (WhatsApp) fixo na parte inferior
  - Aparece apenas se houver contato do anfitrião com WhatsApp
- **Decisão de UX:**
  - Cores por seção (azul para check-in, verde para Wi-Fi, etc.)
  - Ícones grandes e escaneáveis
  - Botões com `active:scale-95` para feedback tátil em mobile
  - Copy-to-clipboard para nome da rede Wi-Fi

#### `src/app/g/[slug]/*/page.tsx` (páginas individuais)
- Subpáginas do guia: `check-in`, `check-out`, `wifi`, `regras`, `equipamentos`, `contatos`, `dicas`, `links`
- Cada uma usa `GuidePageTemplate` para consistência visual
- Layout mobile-first otimizado para leitura rápida

#### `src/components/shared/guide-page-template.tsx`
- **Template base para todas as páginas do guia público**
- Recebe props: `slug`, `title`, `subtitle`, `icon`, `iconColor`, `iconBgColor`, `children`, `propertyName`, `hostWhatsapp`
- **Componentes auxiliares exportados:**
  - `PrimaryCard`: card de destaque, padding maior, bordas arredondadas
  - `SecondaryCard`: card compacto para informações secundárias
  - `InfoRow`: linha com label (small caps) + valor
  - `TimelineItem`: item de timeline numerado para checklists
  - `ActionButton`: botão CTA grande com variantes de cor
- **Acessibilidade:**
  - Skip link para conteúdo principal
  - Header sticky com botão de voltar
  - Bottom bar fixo com navegação rápida

---

### 4.9 Componentes Compartilhados

#### `src/components/shared/copy-button.tsx`
- Botão que copia texto para a área de transferência
- Estados: ícone de copiar → ícone de checkmark (feedback visual)
- Usa `navigator.clipboard.writeText()`

#### `src/components/shared/empty-state.tsx`
- Ilustração padrão para estados vazios (lista sem itens, etc.)
- Recebe título, descrição e ação opcional

#### `src/components/shared/page-header.tsx`
- Header padronizado para páginas internas
- Título, breadcrumb opcional, e ações (botões no canto direito)

#### `src/components/shared/image-upload.tsx`
- Componente de upload de imagens
- Preview, drag-and-drop, validação de tipo/tamanho
- Usa Server Action `uploadImage`

#### `src/components/shared/interactive-checklist.tsx`
- Checklist interativo com progresso visual
- Usado no wizard de cadastro de imóvel

---

### 4.10 Componentes UI (shadcn/ui)

Todos os componentes em `src/components/ui/` são primitivos reutilizáveis baseados em Radix UI ou Base UI.

| Componente | Base | Uso principal |
|-----------|------|---------------|
| `button.tsx` | CVA | Botões com variantes: default, secondary, ghost, link, destructive |
| `card.tsx` | HTML | Containers com header, content, footer |
| `dialog.tsx` | Radix Dialog | Modais e diálogos de confirmação |
| `sheet.tsx` | Base UI Dialog | Painéis laterais (menu mobile, filtros) |
| `dropdown-menu.tsx` | Base UI Menu | Menus contextuais (usuário, ações) |
| `input.tsx` | HTML | Campos de texto com estados focus/error |
| `select.tsx` | Radix Select | Dropdowns de seleção |
| `tabs.tsx` | Radix Tabs | Navegação por abas |
| `table.tsx` | HTML | Tabelas de dados |
| `badge.tsx` | CVA | Labels de status (Published, Draft, etc.) |
| `avatar.tsx` | Radix Avatar | Fotos de perfil com fallback de iniciais |
| `tooltip.tsx` | Radix Tooltip | Dicas ao passar o mouse |
| `sonner.tsx` | Sonner | Notificações toast |
| `toast.tsx` | Radix Toast | Notificações estilo toast (alternativa) |

**Decisão de arquitetura:** Todos os componentes UI usam a função `cn()` para mesclagem de classes, permitindo override de estilos via prop `className` sem conflitos.

---

### 4.11 Outras Páginas do Dashboard

#### `src/app/app/imoveis/[id]/page.tsx`
- Página de detalhes do imóvel
- Exibe todas as informações em abas ou seções
- Links para editar, excluir, preview do guia

#### `src/app/app/imoveis/[id]/editar/page.tsx`
- Formulário de edição completo do imóvel
- Reutiliza componentes do formulário de criação
- Preenche dados existentes via Server Component

#### `src/app/app/imoveis/[id]/preview/page.tsx`
- Preview do guia como o hóspede veria
- Reutiliza componentes do guia público

#### `src/app/app/configuracoes/page.tsx` e `settings-client.tsx`
- Configurações da organização
- Dados da empresa, branding, domínio personalizado
- Integrações (Airbnb, WhatsApp, e-mail)
- Templates de mensagens

#### `src/app/app/compartilhamento/page.tsx` e `sharing-client.tsx`
- Interface de compartilhamento de guias
- Gera links, QR Codes, mensagens para WhatsApp/e-mail
- Histórico de compartilhamentos

#### `src/app/app/guias/page.tsx`
- Lista de guias com filtros por status
- Ações: publicar, despublicar, revisar

#### `src/app/app/analytics/page.tsx`
- Estatísticas de uso dos guias
- Visualizações, compartilhamentos, taxa de conversão

---

### 4.12 Tipagens

#### `src/types/index.ts`
- `PropertyWithRelations`: tipo completo de imóvel com todas as relações aninhadas
- `GuidePublicData`: tipo dos dados expostos publicamente no guia do hóspede
- **Decisão:** manter tipagens separadas do Prisma Client quando necessário formatar ou omitir campos sensíveis

---

## 5. Fluxos de Dados Principais

### 5.1 Cadastro de Imóvel
```
Usuário preenche formulário multi-etapas
        ↓
Clica em "Criar Imóvel"
        ↓
Client Component chama Server Action `createProperty(input)`
        ↓
Server Action:
  1. Busca/cria organização
  2. Gera slug único
  3. Cria Property + relações em uma transação
  4. Cria Guide automático (status DRAFT)
  5. Revalida cache da lista
        ↓
Retorna { success: true, propertyId }
        ↓
Redireciona para página do imóvel ou mostra toast de sucesso
```

### 5.2 Autenticação
```
Usuário acessa /login
        ↓
Preenche email/senha → submit
        ↓
POST /api/auth/login
        ↓
API Route:
  1. Busca usuário no banco (bcrypt)
  2. Fallback para demo users
  3. Cria JWT com jose
  4. Define cookie HTTP-only
        ↓
Redireciona para /app (ou callbackUrl)
        ↓
Middleware verifica cookie em cada requisição
        ↓
Se cookie inválido/ausente → redireciona para /login
```

### 5.3 Visualização do Guia pelo Hóspede
```
Hóspede recebe link (ex: /g/flat-elegance-paulista)
        ↓
Acessa via QR Code, WhatsApp ou e-mail
        ↓
Server Component busca Guide pelo slug
        ↓
Inclui Property com todas as relações
        ↓
Verifica se status === 'PUBLISHED'
        ↓
Renderiza página mobile-first com dados reais
        ↓
Hóspede navega entre seções (check-in, Wi-Fi, etc.)
```

---

## 6. Decisões de Design e UX

### 6.1 Paleta de Cores
- **Cor primária:** Rosa (`#b6465f` / `#f4a9ba` no dark mode)
  - Transmite calor, hospitalidade, cuidado
  - Diferencia da competição que usa azul/ciano genérico
- **Sidebar:** Cinza escuro zinc (`#18181b` light, `#09090b` dark)
  - Substituiu o azul escuro slate original
  - Cria contraste elegante com o rosa da marca
  - Evita "fadiga de azul" comum em dashboards
- **Cores semânticas:**
  - Verde para sucesso/publicado
  - Âmbar para rascunho/pendente
  - Vermelho para erro/destrutivo
  - Azul para informações/check-in

### 6.2 Tipografia
- **DM Sans:** fonte geométrica moderna, excelente legibilidade em telas
- **DM Serif Display:** serif elegante para títulos, transmite sofisticação e hospitalidade de luxo
- **Escala:** headings com `font-heading font-semibold tracking-tight`

### 6.3 Animações e Micro-interações
- **Padrão estabelecido:** `transition-all duration-200 ease-in-out`
- **Feedback tátil:** `active:scale-[0.98]` ou `active:scale-95`
- **Foco acessível:** `focus-visible:ring-2 focus-visible:ring-color/50`
- **Redução de movimento:** respeita `prefers-reduced-motion`

### 6.4 Responsividade
- **Mobile-first:** todos os componentes são projetados para mobile primeiro
- **Breakpoints:**
  - `sm:` 640px (small tablets)
  - `md:` 768px (tablets)
  - `lg:` 1024px (desktop — sidebar aparece)
  - `xl:` 1280px (telas grandes)
- **Sidebar:** visível apenas em `lg:` e acima
- **Menu mobile:** Sheet lateral em telas menores

### 6.5 Acessibilidade
- Skip links em todas as páginas principais
- Todos os ícones decorativos têm `aria-hidden="true"`
- Todos os botões interativos têm `aria-label`
- Estados ativos indicados por `aria-current="page"`
- Contraste de cores adequado (texto sobre fundos)
- Focus visible sempre visível (não escondido)

---

## 7. Decisões de Banco de Dados

### 7.1 Multi-tenancy
- Cada `Property` pertence a uma `Organization`
- Cada `User` pertence a uma `Organization`
- Usuários de diferentes organizações não veem dados uns dos outros
- **Decisão:** não usar row-level security (RLS) do PostgreSQL. O isolamento é feito via application-level queries com `organizationId`.

### 7.2 Slugs e SEO
- Todos os imóveis e guias têm `slug` único
- Slugs são gerados automaticamente a partir do nome
- Normalizados: minúsculas, sem acentos, sem caracteres especiais, espaços → hífens
- Limitados a 60 caracteres
- Verificação de unicidade antes da criação

### 7.3 Cascatas e Deleção
- Todas as relações de Property usam `onDelete: Cascade`
- Ao deletar um imóvel, todos os dados relacionados são deletados automaticamente
- Isso evita dados órfãos no banco

---

## 8. Deploy e Operações

### 8.1 Desenvolvimento Local
```bash
npm install          # instala dependências + gera Prisma Client
npm run db:push      # sincroniza schema com SQLite
npm run db:seed      # popula dados demo
npm run dev          # inicia servidor em localhost:3000
```

### 8.2 Build e Type-check
```bash
npm run typecheck    # verifica tipos TypeScript
npm run lint         # executa ESLint
npm run build        # build de produção
```

### 8.3 Deploy para Railway
```bash
railway up --environment production --service guia-hospedes
```
- Railway detecta automaticamente o projeto Next.js
- Variáveis de ambiente configuradas no dashboard do Railway
- PostgreSQL provisionado como serviço adicional
- Build otimizado para Node.js 20

---

## 9. Convenções de Código

### 9.1 Nomenclatura
- **Arquivos:** kebab-case (`create-property.ts`, `guide-page-template.tsx`)
- **Componentes:** PascalCase (`Sidebar`, `Topbar`, `NavLink`)
- **Funções:** camelCase (`getSession`, `createProperty`)
- **Constantes:** UPPER_SNAKE_CASE (`DEMO_USERS`, `COOKIE_NAME`)
- **Tipos/Interfaces:** PascalCase (`SessionPayload`, `PropertyWithRelations`)

### 9.2 Organização de Imports
1. React/Next.js
2. Bibliotecas externas
3. Componentes internos (absolute imports via `@/`)
4. Utilitários e tipos
5. Estilos

### 9.3 Server vs Client Components
- **Server Components:** páginas que buscam dados, layouts, formulários simples
- **Client Components (`'use client'`):** formulários interativos, hooks (`useState`, `useEffect`), componentes com event handlers
- **Decisão:** preferir Server Components sempre que possível para reduzir JS no cliente

### 9.4 Server Actions
- Toda mutação de dados usa Server Actions (`'use server'`)
- Localizadas em `src/app/actions/`
- Nomenclatura: verbo + entidade (`createProperty`, `updateProperty`, `deleteProperty`)
- Retornam `{ success: boolean, error?: string }` para facilitar tratamento de erro no cliente

---

## 10. Considerações de Segurança

1. **Variáveis de ambiente:** arquivo `.env` está no `.gitignore`. Nunca commitar secrets.
2. **Senhas:** sempre hasheadas com bcrypt (rounds: 10)
3. **Cookies:** `httpOnly`, `secure` em produção, `sameSite: 'lax'`
4. **JWT:** expira em 30 dias, assinado com secret de 32+ caracteres
5. **Uploads:** validação de tipo e tamanho de arquivo
6. **SQL Injection:** protegido pelo Prisma ORM (queries parametrizadas)
7. **XSS:** React escapa automaticamente conteúdo inserido
8. **CSRF:** protegido pelo SameSite=Lax nos cookies

---

## 11. Roadmap e Extensões Futuras

Áreas identificadas para evolução:
1. **Internacionalização (i18n):** suporte a múltiplos idiomas nos guias
2. **Notificações push:** lembretes de check-in/check-out via WhatsApp
3. **Reservas:** integração com calendários (Airbnb, Booking.com)
4. **Analytics avançado:** heatmaps de navegação no guia
5. **White-label:** personalização completa de marca por organização
6. **App mobile:** PWA ou app nativo para hóspedes
7. **Pagamentos:** integração com gateways para upsells

---

*Documentação gerada em: 21 de Abril de 2026*
*Versão do projeto: 0.1.0*
*Autor: Agentes de IA (Claude/OpenCode)*
