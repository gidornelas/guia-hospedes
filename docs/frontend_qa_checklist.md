# Checklist de QA Visual de Frontend

> Roteiro incremental de validacao por etapas do projeto.
> Use este documento como checklist vivo antes de fechar uma frente de frontend ou antes de validar producao.

## Como usar

- Marque os itens conforme a etapa for sendo validada
- Se surgir regressao, adicione uma observacao na etapa correspondente
- Priorize primeiro local ou preview e depois producao
- Sempre que houver incremento relevante de frontend, atualize este arquivo na mesma rodada

## Etapa 0 - Fundamentos visuais e consistencia

- [ ] Revisar tipografia, pesos e hierarquia de titulos
- [ ] Conferir consistencia de espacamentos entre secoes, cards e blocos de formulario
- [ ] Validar uso coerente da paleta rosa da marca sem excesso visual
- [ ] Verificar contraste minimo em botoes, badges, links e textos auxiliares
- [ ] Procurar encoding quebrado ou caracteres estranhos na UI
- [ ] Revisar icones repetidos ou fora de contexto

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

- [ ] Revisar `/login` em desktop, notebook, tablet e mobile
- [ ] Revisar `/cadastro` em desktop, notebook, tablet e mobile
- [ ] Revisar `/esqueci-senha` em desktop, notebook, tablet e mobile
- [ ] Revisar `/redefinir-senha` com token valido e layout consistente
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
- [ ] Confirmar item ativo unico na navegacao
- [x] Verificar breadcrumbs sem quebra visual
- [ ] Confirmar header sem sobreposicao com conteudo sticky
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
- [ ] Validar stepper de novo imóvel até a última etapa
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

- [ ] Validar hub inicial em iPhone e Android
- [ ] Validar bottom bar sticky
- [ ] Validar subpaginas com `GuidePageTemplate`
- [ ] Validar legibilidade de botoes, badges e cartoes
- [ ] Validar secao de check-in com timeline, endereco e Maps
- [ ] Validar secao de Wi-Fi com acao de copia
- [ ] Validar secao de contatos com prioridade correta
- [ ] Validar secao de regras com linguagem amigavel
- [ ] Validar secao de dicas da regiao com rota e telefone
- [ ] Validar check-out com checklist persistente

## Etapa 6 - Analytics, integrações e configurações

- [x] Validar cards de metricas e graficos simplificados no mobile
- [x] Validar filtros e leitura executiva em analytics
- [x] Validar mapeamento de Airbnb sem overflow horizontal
- [x] Validar cards-resumo de configurações
- [x] Validar preview da marca em tempo real
- [x] Validar avisos de risco e dependencias
- [ ] Validar fallback de configurações sem organização

## Etapa 7 - Microcopy, estados e acessibilidade

> Os itens abaixo representam o fechamento completo da etapa em todo o produto.
> O bloco "Progresso atual da Etapa 7" registra as frentes ja cobertas por rodada.

- [ ] Revisar textos em portugues do Brasil
- [ ] Confirmar estados de loading, sucesso, erro e vazio
- [ ] Revisar labels, aria-labels e foco visivel
- [ ] Conferir navegacao por teclado nas telas principais
- [ ] Validar tamanho de toque e legibilidade no mobile
- [ ] Revisar skeletons e feedbacks de carregamento

### Progresso atual da Etapa 7

- [x] `reservas`, `guias`, `modelos de mensagem` e `compartilhamento` com labels conectados, `aria-label` nas acoes criticas e feedback mais claro durante envio
- [x] Skeletons de rota adicionados em `reservas`, `guias`, `modelos de mensagem` e `compartilhamento`
- [x] `login`, `cadastro`, `esqueci-senha` e `redefinir-senha` com mensagens em `aria-live`, `aria-invalid`, `autocomplete`, dicas de formulario e fallback visual mais consistente
- [x] Guia publico com foco visivel em acoes principais, `aria-label` em links sensiveis e botoes de copia mais claros em `hub`, `check-in` e `wifi`
- [x] Guia publico reforcado em `check-out`, `contatos`, `dicas` e `links` com foco visivel, `aria-label` contextual e microcopy limpa para uso mobile
- [x] Guia publico concluido em `regras` e `equipamentos` com leitura mais consistente, icones sem ruido para leitor de tela e acabamento final de contraste/legibilidade

## Etapa 8 - Entrega tecnica

> O terminal atual conseguiu validar build, typecheck e status do Railway, mas nao conseguiu abrir a URL publica nem consultar logs remotos por limitacao de conexao externa deste ambiente.

- [x] Rodar `npm run typecheck`
- [x] Rodar `npm run build`
- [ ] Validar preview ou ambiente de staging antes do deploy final
- [ ] Validar producao apos deploy

### Progresso atual da Etapa 8

- [x] Projeto Railway confirmado em `production` via `railway status`
- [x] Deploy recente com status `SUCCESS` identificado em `2026-04-22 21:53:10 -03:00`
- [ ] Nao ha ambiente de `staging` separado documentado ate agora; falta decidir se a validacao sera em preview dedicado ou direto na URL publica
- [ ] Validacao HTTP da URL publica ainda precisa ser concluida em navegador ou runner com acesso externo
- [ ] Anotar regressões ou ajustes finos encontrados no QA final
