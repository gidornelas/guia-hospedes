# Checklist de QA Visual de Frontend

> Roteiro incremental de validacao por etapas do projeto.
> Use este documento como checklist vivo antes de fechar uma frente de frontend ou antes de validar producao.

## Como usar

- Marque os itens conforme a etapa for sendo validada
- Se surgir regressao, adicione uma observacao na etapa correspondente
- Priorize primeiro local ou preview e depois producao

## Etapa 0 - Fundamentos visuais e consistencia

- [ ] Revisar tipografia, pesos e hierarquia de titulos
- [ ] Conferir consistencia de espacamentos entre secoes, cards e blocos de formulario
- [ ] Validar uso coerente da paleta rosa da marca sem excesso visual
- [ ] Verificar contraste minimo em botoes, badges, links e textos auxiliares
- [ ] Procurar encoding quebrado ou caracteres estranhos na UI
- [ ] Revisar icones repetidos ou fora de contexto

## Etapa 1 - Landing page e site publico

- [ ] Validar header com navegacao funcional em desktop e mobile
- [ ] Validar hero, CTA principal e CTA secundario
- [ ] Confirmar ancoras e links internos funcionando
- [ ] Revisar secao de precos sem quebras visuais
- [ ] Validar footer com links reais e legiveis
- [ ] Validar CTA persistente no mobile
- [ ] Conferir demo publica do guia abrindo corretamente

## Etapa 1.1 - Autenticacao e acesso

### Validacao visual

- [ ] Revisar `/login` em desktop, notebook, tablet e mobile
- [ ] Revisar `/cadastro` em desktop, notebook, tablet e mobile
- [ ] Revisar `/esqueci-senha` em desktop, notebook, tablet e mobile
- [ ] Revisar `/redefinir-senha` com token valido e layout consistente
- [ ] Confirmar que o shell de autenticacao esta centralizado e sem painel lateral promocional
- [ ] Validar botoes primarios e secundarios com largura correta no mobile
- [ ] Revisar mensagens de erro, sucesso e ajuda nas telas de auth

### Fluxos funcionais

- [ ] Criar conta real em `/cadastro`
- [ ] Fazer login com e-mail e senha em `/login`
- [ ] Validar checkbox de `manter conectado`
- [ ] Validar saida e novo acesso com sessao persistida
- [ ] Validar redirect para `/app` apos login
- [ ] Validar rota protegida redirecionando para `/login` quando deslogado

### Integracoes externas

- [ ] Validar login com Google em ambiente configurado
- [ ] Validar retorno de erro amigavel quando Google nao estiver configurado
- [ ] Validar envio de recuperacao de senha com SMTP configurado
- [ ] Validar troca de senha via token

### Producao

- [ ] Validar `/cadastro` em producao
- [ ] Validar `/login` em producao
- [ ] Validar Google OAuth em producao
- [ ] Validar recuperacao de senha em producao

## Etapa 2 - Shell do dashboard e navegacao

- [ ] Validar sidebar fixa em desktop grande
- [ ] Validar drawer do menu em notebook pequeno, tablet e mobile
- [ ] Confirmar item ativo unico na navegacao
- [ ] Verificar breadcrumbs sem quebra visual
- [ ] Confirmar header sem sobreposicao com conteudo sticky
- [ ] Revisar `PageHeader` com titulo, descricao, badges e acoes
- [ ] Confirmar tabs com wrap e clique confortavel em larguras medias
- [ ] Confirmar botoes primarios e secundarios com largura correta no mobile
- [ ] Revisar tabelas com fallback em cards quando necessario
- [ ] Revisar vazios com CTA principal e texto orientado a acao

## Etapa 3 - Fluxos de imoveis

- [ ] Testar lista de imoveis em mobile, tablet, notebook e desktop
- [ ] Validar detalhe do imovel, aba `Resumo` e aba `Guia`
- [ ] Validar status do imovel e status do guia sem ambiguidade
- [ ] Validar cards de completude do cadastro
- [ ] Validar stepper de novo imovel ate a ultima etapa
- [ ] Validar edicao de imovel com autosave, resumo lateral e acoes sticky
- [ ] Validar cadastros dinamicos de equipamentos e contatos
- [ ] Validar preview parcial do guia durante preenchimento

## Etapa 4 - Compartilhamento, publicacao e preview

- [ ] Validar cards de canal e mensagens de bloqueio
- [ ] Validar historico de compartilhamento em larguras intermediarias
- [ ] Validar biblioteca de modelos de mensagem com e sem templates
- [ ] Validar preview do guia em mobile e desktop
- [ ] Validar estado de rascunho, publicado e nao publicado
- [ ] Revisar alternancia Mobile/Desktop sem desalinhamento
- [ ] Revisar iframe ou frame do preview sem sobra horizontal
- [ ] Validar destaque do link publico e QR code

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

## Etapa 6 - Analytics, integracoes e configuracoes

- [ ] Validar cards de metricas e graficos simplificados no mobile
- [ ] Validar filtros e leitura executiva em analytics
- [ ] Validar mapeamento de Airbnb sem overflow horizontal
- [ ] Validar cards-resumo de configuracoes
- [ ] Validar preview da marca em tempo real
- [ ] Validar avisos de risco e dependencias
- [ ] Validar fallback de configuracoes sem organizacao

## Etapa 7 - Microcopy, estados e acessibilidade

- [ ] Revisar textos em portugues do Brasil
- [ ] Confirmar estados de loading, sucesso, erro e vazio
- [ ] Revisar labels, aria-labels e foco visivel
- [ ] Conferir navegacao por teclado nas telas principais
- [ ] Validar tamanho de toque e legibilidade no mobile
- [ ] Revisar skeletons e feedbacks de carregamento

## Etapa 8 - Entrega tecnica

- [ ] Rodar `npm run typecheck`
- [ ] Rodar `npm run build`
- [ ] Validar preview ou ambiente de staging antes do deploy final
- [ ] Validar producao apos deploy
- [ ] Anotar regressões ou ajustes finos encontrados no QA final
