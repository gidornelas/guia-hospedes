# Checklist de QA Visual de Frontend

> Roteiro incremental de validacao por etapas do projeto.
> Use este documento como checklist vivo antes de fechar uma frente de frontend ou antes de validar producao.

## Como usar

- Marque os itens conforme a etapa for sendo validada
- Se surgir regressao, adicione uma observacao na etapa correspondente
- Priorize primeiro local ou preview e depois producao
- Sempre que houver incremento relevante de frontend, atualize este arquivo na mesma rodada

## Etapa 0 - Fundamentos visuais e consistencia

- [x] Revisar tipografia, pesos e hierarquia de titulos (DialogTitle e SheetTitle ajustados para `text-lg font-semibold`)
- [x] Conferir consistencia de espacamentos entre secoes, cards e blocos de formulario (padroes `p-5`/`gap-4`/`space-y-6` consistentes no dashboard)
- [x] Validar uso coerente da paleta rosa da marca sem excesso visual (uso funcional em alertas, badges e empty states, sem saturacao)
- [x] Verificar contraste minimo em botoes, badges, links e textos auxiliares (contrastes validados: brand-700 sobre brand-50, muted-foreground sobre background)
- [x] Procurar encoding quebrado ou caracteres estranhos na UI (encoding corrigido em 12 arquivos principais: auth, dashboard e guia publico)
- [x] Revisar icones repetidos ou fora de contexto (icone de check-out no stepper trocado de `Clock` para `LogOut`)

### Mapa visual atual do dashboard

- [x] `reservas`: metric cards, toolbar de filtros e empty state interno alinhados ao padrao visual do dashboard
- [x] `compartilhamento`: resumo superior, estado sem guias publicados e estado sem selecao alinhados ao mesmo sistema de cards
- [x] `dashboard home`: cards de metrica ajustados para o mesmo ritmo visual usado nas paginas internas
- [x] `guias`: summary cards, busca e lista principal alinhados ao padrao de section card e cards de metrica
- [x] `reservas/calendario`: header interno, legenda e densidade do grid alinhados ao mesmo nivel visual das telas principais
- [x] `modelos de mensagem`: metric cards, section card, busca e estados vazios alinhados ao padrao compartilhado do dashboard
- [x] Corrigir mojibake e encoding quebrado nas telas mais usadas do dashboard (`home`, `compartilhamento` e `modelos de mensagem`)

## Etapa 1 - Landing page e site publico

- [x] Validar header com navegacao funcional em desktop e mobile
- [x] Validar hero, CTA principal e CTA secundario
- [x] Confirmar ancoras e links internos funcionando
- [x] Revisar secao de precos sem quebras visuais
- [x] Validar footer com links reais e legiveis
- [x] Validar CTA persistente no mobile
- [x] Conferir demo publica do guia abrindo corretamente

## Etapa 1.1 - Autenticacao e acesso

### Validacao visual

- [x] Revisar `/login` em desktop, notebook, tablet e mobile (encoding corrigido, layout centralizado responsivo)
- [x] Revisar `/cadastro` em desktop, notebook, tablet e mobile (encoding corrigido, grid responsivo sm:grid-cols-2)
- [x] Revisar `/esqueci-senha` em desktop, notebook, tablet e mobile (encoding corrigido, estados de erro/sucesso com aria-live)
- [x] Revisar `/redefinir-senha` com token valido e layout consistente (encoding corrigido, tratamento de token ausente)
- [x] Confirmar que o shell de autenticacao esta centralizado e sem painel lateral promocional
- [x] Validar botoes primarios e secundarios com largura correta no mobile
- [x] Revisar mensagens de erro, sucesso e ajuda nas telas de auth

### Fluxos funcionais

- [ ] Criar conta real em `/cadastro`
- [ ] Fazer login com e-mail e senha em `/login`
- [ ] Validar checkbox de `manter conectado`
- [ ] Validar saida e novo acesso com sessao persistida
- [ ] Validar redirect para `/app` apos login
- [ ] Validar rota protegida redirecionando para `/login` quando deslogado

### Integrações externas

- [ ] Validar login com Google em ambiente configurado
- [ ] Validar retorno de erro amigável quando Google não estiver configurado
- [ ] Validar envio de recuperacao de senha com SMTP configurado
- [ ] Validar troca de senha via token

### Producao

- [ ] Validar `/cadastro` em producao
- [ ] Validar `/login` em producao
- [ ] Validar Google OAuth em producao
- [ ] Validar recuperacao de senha em producao

## Etapa 2 - Shell do dashboard e navegacao

- [x] Validar sidebar fixa em desktop grande
- [x] Validar drawer do menu em notebook pequeno, tablet e mobile
- [x] Confirmar item ativo unico na navegacao (logica `getActiveNavHref` com match mais especifico validada)
- [x] Verificar breadcrumbs sem quebra visual
- [x] Confirmar header sem sobreposicao com conteudo sticky (cards sticky do stepper e edicao receberam `z-20`, abaixo do topbar `z-30`)
- [x] Revisar `PageHeader` com titulo, descricao, badges e acoes
- [x] Confirmar tabs com wrap e clique confortavel em larguras medias
- [x] Confirmar botoes primarios e secundarios com largura correta no mobile
- [x] Revisar tabelas com fallback em cards quando necessario
- [x] Revisar vazios com CTA principal e texto orientado a acao

## Etapa 3 - Fluxos de imóveis

- [x] Testar lista de imóveis em mobile, tablet, notebook e desktop
- [x] Validar detalhe do imóvel, aba `Resumo` e aba `Guia`
- [x] Validar status do imóvel e status do guia sem ambiguidade
- [x] Validar cards de completude do cadastro
- [x] Validar stepper de novo imóvel até a última etapa (8 etapas completas, validacao por step, preview e rascunho funcionando)
- [x] Validar edição de imóvel com autosave, resumo lateral e ações sticky
- [x] Validar cadastros dinamicos de equipamentos e contatos
- [x] Validar preview parcial do guia durante preenchimento

## Etapa 4 - Compartilhamento, publicacao e preview

- [x] Validar cards de canal e mensagens de bloqueio
- [x] Validar historico de compartilhamento em larguras intermediarias
- [x] Validar biblioteca de modelos de mensagem com e sem templates
- [x] Validar preview do guia em mobile e desktop
- [x] Validar estado de rascunho, publicado e não publicado
- [x] Revisar alternancia Mobile/Desktop sem desalinhamento
- [x] Revisar iframe ou frame do preview sem sobra horizontal
- [x] Validar destaque do link publico e QR code

## Etapa 5 - Guia publico do hospede

- [x] Validar hub inicial em iPhone e Android (preview banner com `z-20`, Wi-Fi card agora é Link, grid responsiva com `truncate`, encoding validado, `overflow-x-hidden` para prevenir scroll horizontal)
- [x] Validar bottom bar sticky (bottom bar do hub e template com `pb-[env(safe-area-inset-bottom)]` para iPhones com notch; footer com `pb-28` de folga)
- [x] Validar subpaginas com `GuidePageTemplate` (skip link presente, header sticky com `z-10`, bottom bar com botao Voltar + WhatsApp, max-w-lg centralizado)
- [x] Validar legibilidade de botoes, badges e cartoes (botoes com min-h-11 min-w-11 no CopyButton, cards com shadow-sm e bordas claras, textos com contraste adequado)
- [x] Validar secao de check-in com timeline, endereco e Maps (timeline de 3 passos, botao Abrir no Maps com encodeURIComponent, copia de endereco via CopyButton)
- [x] Validar secao de Wi-Fi com acao de copia (nome da rede e senha com CopyButton, dica de conexao mobile, card primario centralizado)
- [x] Validar secao de contatos com prioridade correta (HOST > EMERGENCY > outros, cards com acoes Ligar/WhatsApp/E-mail, icones diferenciados por prioridade)
- [x] Validar secao de regras com linguagem amigavel (cards com linguagem positiva/negativa, icones semanticos, introducao explicativa)
- [x] Validar secao de dicas da regiao com rota e telefone (cards por categoria com foto, endereco e distancia com icones diferenciados, botoes Maps/Instagram)
- [x] Validar check-out com checklist persistente (checklist interativo com progresso, persistencia em localStorage, aria-pressed e aria-label)

### Melhorias adicionais na Etapa 5 (2026-04-23)

- [x] Skeleton de loading criado para todas as subpáginas do guia (`src/app/g/[slug]/loading.tsx`)
- [x] Metadata dinâmica com OpenGraph e Twitter Cards no layout do guia (`generateMetadata`)
- [x] `overflow-x-hidden` adicionado ao hub e ao template para prevenir scroll horizontal acidental
- [x] Touch target mínimo de 44px reforçado no `CopyButton` (`min-h-11 min-w-11`)

## Etapa 6 - Analytics, integrações e configurações

- [x] Validar cards de metricas e graficos simplificados no mobile
- [x] Validar filtros e leitura executiva em analytics
- [x] Validar mapeamento de Airbnb sem overflow horizontal
- [x] Validar cards-resumo de configurações
- [x] Validar preview da marca em tempo real
- [x] Validar avisos de risco e dependencias
- [x] Validar fallback de configurações sem organização (EmptyState com alerta informativo ja implementado em `settings-page`)

## Etapa 7 - Microcopy, estados e acessibilidade

> Os itens abaixo representam o fechamento completo da etapa em todo o produto.
> O bloco "Progresso atual da Etapa 7" registra as frentes ja cobertas por rodada.

- [x] Revisar textos em portugues do Brasil (encoding corrigido em auth e dashboard; microcopy ja validada em rodadas anteriores)
- [x] Confirmar estados de loading, sucesso, erro e vazio (skeletons de rota presentes, empty states com CTA, toasts de feedback)
- [x] Revisar labels, aria-labels e foco visivel (progresso anterior mantido; foco visivel reforcado em globals.css)
- [x] Conferir navegacao por teclado nas telas principais (skip link no dashboard, focus-visible em botoes e links)
- [x] Validar tamanho de toque e legibilidade no mobile (touch target minimo 44px em globals.css, botoes w-full no mobile)
- [x] Revisar skeletons e feedbacks de carregamento (skeletons de pagina em reservas, guias, modelos-mensagem, compartilhamento; AuthFormSkeleton)

### Progresso atual da Etapa 7

- [x] `reservas`, `guias`, `modelos de mensagem` e `compartilhamento` com labels conectados, `aria-label` nas acoes criticas e feedback mais claro durante envio
- [x] Skeletons de rota adicionados em `reservas`, `guias`, `modelos de mensagem` e `compartilhamento`
- [x] `login`, `cadastro`, `esqueci-senha` e `redefinir-senha` com mensagens em `aria-live`, `aria-invalid`, `autocomplete`, dicas de formulario e fallback visual mais consistente
- [x] Guia publico com foco visivel em acoes principais, `aria-label` em links sensiveis e botoes de copia mais claros em `hub`, `check-in` e `wifi`
- [x] Guia publico reforcado em `check-out`, `contatos`, `dicas` e `links` com foco visivel, `aria-label` contextual e microcopy limpa para uso mobile
- [x] Guia publico concluido em `regras` e `equipamentos` com leitura mais consistente, icones sem ruido para leitor de tela e acabamento final de contraste/legibilidade

## Etapa 8 - Entrega tecnica

> O terminal atual conseguiu validar build, typecheck e status do Railway, mas nao conseguiu abrir a URL publica nem consultar logs remotos por limitacao de conexao externa deste ambiente.

- [x] Rodar `npm run typecheck` (revalidado em 2026-04-23, sem erros)
- [x] Rodar `npm run build` (revalidado em 2026-04-23, build limpo com 28 paginas; loading.tsx do guia e metadata dinâmica incluídos)
- [ ] Validar preview ou ambiente de staging antes do deploy final
- [ ] Validar producao apos deploy

### Correções do PROGRESSO.md aplicadas nesta rodada

**Rodada 1 (2026-04-23):**
- [x] **C5** — Removidas rotas `/precos` e `/contato` inexistentes do `middleware.ts`
- [x] **C8** — Sanitização de URLs no guia público (`sanitizeHref` em `links`, `dicas`; bloqueia `javascript:`, `data:`, `file:`)
- [x] **I2** — Redirect automático para `/app` quando usuário já logado acessa `/login` ou `/cadastro`
- [x] **I4** — `window.location.reload()` após `deleteReservation` e `updateReservationStatus` no client
- [x] **I8** — `DialogTrigger` em `property-actions.tsx` corrigido para usar `render` (padrão @base-ui)
- [x] **I11** — Hero CTA principal aponta para `/cadastro` em vez de `/login`
- [x] **I14** — Checklist de check-out agora separa por quebra de linha (`\n`) em vez de ponto (`.`)
- [x] **I20** — `shareGuide` valida se `guideId` existe antes de criar `shareLog`
- [x] **I23** — Seções sem dados no hub usam `<div>` em vez de `<Link href="#">` (evita scroll to top)
- [x] **M2** — Metadata dinâmica com OpenGraph/Twitter Cards no layout do guia público

**Rodada 2 (2026-04-23):**
- [x] **I1** — Validação de força de senha no cadastro (maiúscula, minúscula, número, caractere especial)
- [x] **I5/I6** — Forms de nova/editar reserva agora usam shadcn Select (antes usavam `<select>` nativo)
- [x] **I9** — Criada constante `ROUTES` em `lib/constants.ts`; `property-actions.tsx` usa `ROUTES.imoveis`
- [x] **I13** — `guide-access-tracker` protegido contra duplo mount com `useRef(hasLogged)`
- [x] **M1** — Tipos inferidos do Prisma (`GuideContact`, `GuideDevice`, `GuideRecommendation`, `GuideLink`) exportados de `guide-utils.ts`; `any` types removidos do guia público
- [x] **M4** — `<img>` nativo substituído por `<Image>` do Next.js nas recomendações (`dicas/page.tsx`)
- [x] **M6** — `<select>` nativos dos forms de reserva substituídos por shadcn Select com ARIA/keyboard
- [x] **M7** — Landing page com `pb-28` para evitar que CTA fixo mobile sobreponha o footer

### Progresso atual da Etapa 8

- [x] Projeto Railway confirmado em `production` via `railway status`
- [x] Deploy recente com status `SUCCESS` identificado em `2026-04-22 21:53:10 -03:00`
- [ ] Nao ha ambiente de `staging` separado documentado ate agora; falta decidir se a validacao sera em preview dedicado ou direto na URL publica
- [ ] Validacao HTTP da URL publica ainda precisa ser concluida em navegador ou runner com acesso externo
- [ ] Anotar regressões ou ajustes finos encontrados no QA final
