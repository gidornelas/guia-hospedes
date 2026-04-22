# Checklist de QA Visual de Frontend

## Shell do Dashboard

- [ ] Validar sidebar fixa em desktop grande
- [ ] Validar drawer do menu em notebook pequeno, tablet e mobile
- [ ] Confirmar item ativo único na navegação
- [ ] Verificar breadcrumbs sem quebra visual
- [ ] Confirmar header sem sobreposição com conteúdo sticky

## Páginas Internas

- [ ] Revisar `PageHeader` com título, descrição, badges e ações
- [ ] Confirmar tabs com wrap e clique confortável em larguras médias
- [ ] Confirmar botões primários e secundários com largura correta no mobile
- [ ] Revisar tabelas com fallback em cards quando necessário
- [ ] Revisar vazios com CTA principal e texto orientado à ação

## Fluxos de Imóveis

- [ ] Testar lista de imóveis em mobile, tablet, notebook e desktop
- [ ] Validar detalhe do imóvel, aba `Resumo` e aba `Guia`
- [ ] Validar stepper de novo imóvel até a última etapa
- [ ] Validar edição de imóvel com autosave, resumo lateral e ações sticky
- [ ] Validar preview do guia em mobile e desktop

## Compartilhamento e Mensagens

- [ ] Validar cards de canal e mensagens de bloqueio
- [ ] Validar histórico de compartilhamento em larguras intermediárias
- [ ] Validar biblioteca de modelos de mensagem com e sem templates

## Analytics, Integrações e Configurações

- [ ] Validar cards de métricas e gráficos simplificados no mobile
- [ ] Validar mapeamento de Airbnb sem overflow horizontal
- [ ] Validar cards-resumo de configurações
- [ ] Validar fallback de configurações sem organização

## Guia Público

- [ ] Validar hub inicial em iPhone e Android
- [ ] Validar bottom bar sticky
- [ ] Validar subpáginas com `GuidePageTemplate`
- [ ] Validar legibilidade de botões, badges e cartões

## Microcopy e Estados

- [ ] Revisar textos em português do Brasil
- [ ] Procurar encoding quebrado ou caracteres estranhos
- [ ] Confirmar estados de loading, sucesso, erro e vazio
- [ ] Revisar labels, aria-labels e foco visível

## Entrega

- [ ] Rodar `npm run typecheck`
- [ ] Rodar `npm run build`
- [ ] Validar produção ou preview antes do deploy final
