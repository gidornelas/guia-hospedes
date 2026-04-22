# Plano de Melhoria de Frontend, UI e UX

> Documento de planejamento para evolucao visual e de experiencia do site publico, dashboard e guia do hospede.
> Atualizado com base no estado atual do produto, no progresso ja entregue e nas frentes ainda em aberto.

## 1. Objetivo

Elevar o GuiaHospedes de um produto funcional para uma experiencia mais consistente, clara e memoravel em tres frentes:

- conversao no site publico
- produtividade no dashboard
- experiencia mobile do hospede no guia publico

## 2. Base ja construida

O projeto ja tem uma fundacao boa para evoluir sem retrabalho estrutural:

- [x] Design system inicial com tokens, tipografia e componentes `shadcn/ui`
- [x] Landing page extensa com hero, problema, solucao, beneficios e CTA final
- [x] Dashboard com sidebar, topbar, cards, tabelas e paginas principais
- [x] Stepper de cadastro de imovel com 8 etapas
- [x] Guia publico mobile-first com hub e subpaginas
- [x] Preview do guia dentro do dashboard

## 2.1 Status consolidado da fase atual

### Entregas ja implementadas nesta frente

- [x] Landing page revisada com ancoras funcionais, microcopy central melhorada e CTA persistente no mobile
- [x] Shell do dashboard ajustada para notebook pequeno e tablet com drawer em vez de sidebar fixa precoce
- [x] `PageHeader` e `EmptyState` promovidos a padroes visuais compartilhados
- [x] Lista, detalhe, preview e compartilhamento de imoveis reestruturados com mais clareza e responsividade
- [x] Stepper de criacao e edicao de imovel transformado em fluxo guiado, com progresso e acoes sticky
- [x] Analytics, integracoes, configuracoes, guias e modelos de mensagem refinados para leitura mais executiva
- [x] Fluxo de autenticacao real entregue com login, cadastro, Google OAuth e recuperacao de senha
- [x] Shell visual das telas de autenticacao simplificada para focar no formulario principal
- [x] Checklist visual de QA criado em `docs/frontend_qa_checklist.md`

### Pendencias que ainda fazem sentido

- [ ] Fechar a ultima revisao de encoding e microcopy em todo o projeto
- [ ] Adicionar mais evidencias visuais reais na landing, como screenshots do fluxo
- [ ] Criar modal ou checklist de publicacao antes de publicar o guia
- [ ] Explorar QR com copia/download e uma mini timeline de atualizacao do guia
- [ ] Homologar em producao o fluxo completo de autenticacao com Google e SMTP reais
- [ ] Executar a rodada final de QA visual em todos os breakpoints e anotar ajustes finos

## 3. Diagnostico atual

### Pontos fortes

- [x] Direcao visual definida e coerente com hospitalidade premium
- [x] Boa cobertura das telas principais
- [x] Tipografia e paleta com potencial de marca
- [x] Estrutura do App Router facilita separar areas publicas e autenticadas
- [x] O produto ja transmite uma proposta real, e nao apenas um prototipo visual

### Gaps percebidos

- [ ] Corrigir textos com problema de encoding e mojibake na UI, metadados e documentos
- [x] Corrigir links e ancoras da landing que apontavam para secoes inexistentes
- [ ] Consolidar um padrao visual unico entre landing, autenticacao, dashboard e guia publico
- [x] Melhorar responsividade da navegacao do dashboard, especialmente sidebar fixa e comportamento mobile
- [x] Corrigir quebras de layout em larguras intermediarias
- [x] Remover larguras fixas que estouravam o layout, especialmente em previews, iframes e molduras de device
- [x] Dar mais profundidade de produto para paginas ainda mockadas, como compartilhamento, analytics, integracoes e configuracoes
- [x] Reduzir carga cognitiva do stepper de imovel com melhor agrupamento, resumo e feedback
- [x] Fortalecer estados de vazio, loading, erro e sucesso nas areas principais da aplicacao
- [x] Criar uma experiencia mais premium e orientada a acao no guia publico
- [x] Substituir o fluxo antigo baseado em contas demo por autenticacao real

### Achados recentes desta rodada de analise

- [x] A shell autenticada nao pode depender apenas do breakpoint `lg`
- [x] Alguns cabecalhos internos assumiam uma linha unica e quebravam quando coexistiam breadcrumb, titulo e botoes
- [x] O preview do guia usava moldura mobile com largura fixa de `375px`, gerando sobra visual e desalinhamento
- [x] O padrao atual de tabs precisava prever largura total, wrap e empilhamento
- [x] Faltava um padrao responsivo claro para areas com iframe, preview e alternancia entre visualizacao mobile e desktop
- [x] O menu lateral ja tem padrao funcional em resolucoes intermediarias e agora entra na fase de ajuste fino
- [x] O shell de autenticacao ficou mais direto apos a remocao do painel lateral promocional

## 4. Principios para a evolucao

- [ ] Priorizar clareza antes de ornamentacao
- [ ] Manter linguagem visual de hospitalidade premium, sem parecer template generico
- [ ] Tratar mobile como principal no guia do hospede e relevante no dashboard
- [ ] Reduzir esforco por tarefa no painel administrativo
- [ ] Tornar toda acao importante visivel, contextual e reversivel
- [ ] Usar microcopy mais util, humana e objetiva
- [ ] Garantir acessibilidade minima AA, foco visivel e navegacao por teclado
- [ ] Desenhar breakpoints intermediarios com intencao, e nao apenas mobile e desktop

## 4.1 Direcao cromatica recomendada

Aplicar a paleta rosa da cliente de forma controlada, sem transformar o produto em uma interface excessivamente colorida. A base do sistema deve continuar clara, neutra e funcional.

### Paleta de apoio da marca

- `#EBD4CB` para fundos suaves, superficies de destaque e areas editoriais
- `#DA9F93` para apoios visuais, elementos secundarios e estados sutis
- `#B6465F` como cor principal de marca
- `#890620` para hover, active, titulos fortes e destaques mais densos
- `#2C0703` para textos de alta enfase e contraste sofisticado

### Regras de uso

- [x] Manter `background` principal claro, com branco e off-white como base
- [x] Preservar neutros como preto, cinza, branco e variacoes de slate no corpo do sistema
- [x] Usar rosa apenas em menus ativos, botoes, links, badges, icones, highlights e textos destacados
- [x] Evitar telas inteiras com fundo rosa ou excesso de blocos coloridos concorrendo entre si
- [x] Garantir contraste e legibilidade antes de qualquer decisao estetica
- [x] Aplicar a paleta com mais liberdade na landing e no guia publico do que no dashboard operacional
- [x] Fazer o dashboard parecer profissional e limpo, com branding rosa apenas nos pontos de acao e identidade

## 5. Roadmap sugerido

## Etapa 0 - Fundamentos visuais e consistencia (Parcial)

- [x] Aplicar a nova direcao cromatica com base neutra clara e rosa restrito a elementos de destaque
- [x] Revisar tokens de cor para superficies, bordas, hover, status, destaque e fundos de secao
- [x] Padronizar raios, sombras, espacamentos e altura de componentes interativos
- [x] Definir padroes globais para `page header`, `section header`, `empty state`, `stats card`, `table toolbar` e `action bar`
- [x] Criar variacoes semanticas mais refinadas para sucesso, atencao, erro, informacao e rascunho
- [ ] Corrigir encoding de textos no frontend, metadados, constantes e documentacao de interface
- [ ] Padronizar uso de icones por contexto para evitar excesso visual
- [ ] Revisar contraste, legibilidade e hierarquia de titulos
- [ ] Criar checklist visual de consistencia para todas as paginas futuras

### Resultado esperado

- [x] O produto passa a ter uma identidade visual unificada e mais madura
- [x] As proximas telas podem evoluir sem reinventar layout ou estilo

## Etapa 1 - Landing page e site publico (Parcial)

- [x] Reestruturar a hero para comunicar melhor promessa, publico e beneficio imediato
- [x] Reforcar a prova de valor com numeros e badges de confianca
- [x] Revisar header para ter navegacao funcional
- [x] Criar secao de precos com tres planos
- [x] Ajustar CTA principal e secundario para fluxos reais
- [x] Dar mais ritmo visual com alternancia de densidade e fundos
- [ ] Melhorar mockups do produto com mais fidelidade
- [x] Reescrever microcopy central da landing e corrigir CTAs quebrados
- [ ] Inserir secao de objecoes e respostas rapidas
- [x] Criar footer mais util com links reais e navegacao clara
- [x] Melhorar versao mobile com CTA persistente

### Sugestoes especificas

- [x] Incluir bloco "para quem e" com gestores, anfitrioes e operacoes
- [x] Incluir demo real do guia com link publico
- [ ] Inserir screenshots reais do fluxo de cadastro, publicacao e compartilhamento
- [ ] Trabalhar visual mais editorial nas secoes de beneficios e depoimentos

## Etapa 1.1 - Autenticacao e acesso (Parcial)

- [x] Substituir o acesso demo por login real com e-mail e senha
- [x] Criar pagina de cadastro real com criacao da conta inicial
- [x] Adicionar login com Google no mesmo fluxo de acesso
- [x] Implementar "esqueci minha senha" e redefinicao por token
- [x] Ajustar feedbacks de erro para cenarios de Google nao configurado ou falha na autenticacao
- [x] Simplificar o shell das telas de auth para uma experiencia mais direta e menos promocional
- [ ] Validar Google OAuth em producao com variaveis e redirect URI definitivos
- [ ] Validar SMTP real para recuperacao por e-mail em producao

### Resultado esperado

- [x] O produto passa a ter um fluxo de acesso compativel com uso real
- [ ] A experiencia de entrada fica totalmente homologada tambem em producao

## Etapa 2 - Casca do dashboard e navegacao (Parcial)

- [x] Resolver a relacao entre sidebar e area de conteudo
- [x] Criar navegacao mobile com `Sheet/Drawer`
- [x] Melhorar topbar com breadcrumbs responsivos e busca
- [ ] Tornar breadcrumbs mais informativos em paginas profundas
- [x] Criar padrao para cabecalho de pagina com `PageHeader`
- [x] Padronizar largura maxima e ritmo vertical das paginas internas
- [x] Criar estados de loading e skeleton
- [x] Criar empty states com CTA acionavel
- [x] Revisar densidade visual das tabelas para leitura mais rapida
- [x] Melhorar responsividade de tabelas com alternativas em cards no mobile
- [x] Revisar breakpoints do shell autenticado para nao depender so de `lg`
- [x] Garantir `min-w-0`, `flex-wrap` e empilhamento controlado em cabecalhos, breadcrumbs e barras de acao
- [x] Padronizar comportamento de tabs em larguras estreitas, evitando listas com `w-fit` quando o contexto pede ocupacao total
- [x] Definir padrao de navegacao lateral para resolucoes intermediarias, com foco em clareza do item ativo e toque confortavel

### Resultado esperado

- [x] O dashboard fica mais leve de navegar e mais consistente entre modulos
- [x] A sensacao deixa de ser "colecao de telas" e passa a ser "produto"

## Etapa 3 - Lista, detalhe e gestao de imoveis (Parcial)

- [x] Reestruturar a pagina de imoveis com toolbar mais completa
- [x] Criar visao por cards para mobile e tabela para desktop
- [x] Adicionar cards de estatisticas no topo
- [x] Dar mais evidencia ao status do imovel e do guia sem duplicidade
- [x] Melhorar a pagina de detalhe do imovel com blocos de resumo mais escaneaveis
- [x] Trazer acoes criticas para action bar responsiva
- [x] Enriquecer a aba "Guia" com status, versao, publicacao e acoes de compartilhamento
- [x] Melhorar a visualizacao de equipamentos e contatos com cards coloridos por prioridade
- [x] Adicionar indicadores de completude do cadastro por imovel
- [x] Criar empty states inteligentes com CTA para editar

### Sugestoes especificas

- [x] Usar badges mais claros para separar status do imovel e status do guia
- [x] Exibir "faltando para publicar" com checklist resumido por imovel
- [ ] Criar mini timeline de atualizacao e publicacao do guia

## Etapa 4 - Stepper de cadastro e edicao de imovel (Parcial)

- [x] Redesenhar o stepper para reduzir sensacao de formulario longo
- [x] Transformar cada etapa em um bloco mais guiado, com titulo, objetivo e exemplo
- [x] Adicionar validacao por etapa com feedback imediato e linguagem amigavel
- [x] Inserir barra de progresso real com nocao de conclusao
- [x] Criar resumo lateral ou final com checklist do que ja foi preenchido
- [x] Melhorar os campos de regras com componentes mais semanticos e menos improvisados
- [x] Melhorar cadastros dinamicos de equipamentos e contatos
- [x] Criar acoes sticky no mobile para `Anterior`, `Proximo` e `Salvar rascunho`
- [x] Adicionar autosave visivel com feedback de status
- [x] Dar mais contexto para a etapa "Regiao"
- [x] Incluir preview parcial do guia durante o preenchimento

### Resultado esperado

- [x] Menos abandono no cadastro
- [x] Menos erro de preenchimento
- [x] Melhor percepcao de progresso e controle

## Etapa 5 - Compartilhamento, publicacao e preview (Parcial)

- [x] Transformar a pagina de compartilhamento em fluxo orientado por tarefa
- [x] Exibir preview real da mensagem e do link antes do envio
- [x] Dar destaque maior ao link publico, QR code e canal recomendado
- [x] Mostrar disponibilidade do guia e possiveis bloqueios para compartilhar
- [x] Melhorar historico de envios com filtros por imovel, canal, data e status
- [x] Criar cards de canal com contexto de uso
- [x] Melhorar preview do guia com estados para rascunho, publicado e nao publicado
- [x] Incluir informacoes uteis no preview
- [x] Criar area de acoes rapidas no preview
- [ ] Planejar modal de publicacao com checklist de prontidao antes de publicar
- [x] Remover moldura mobile de largura fixa no preview e adotar frame escalavel ou adaptativo
- [x] Reorganizar header e tabs do preview para comportamento fluido em notebook pequeno e tablet landscape
- [x] Definir padrao para previews com iframe: limite de largura, escala visual e fallback quando nao houver espaco horizontal

### Sugestoes especificas

- [x] Destacar "proximo melhor passo" em cada estado do guia
- [x] Exibir mensagem "este guia ainda nao esta publico" com CTA claro
- [ ] Permitir copiar QR e baixar imagem do QR futuramente
- [x] Transformar a alternancia Mobile/Desktop em controle realmente responsivo, sem quebrar alinhamento ou gerar areas vazias exageradas
- [x] Priorizar layout em duas zonas: contexto e acoes acima, preview abaixo

## Etapa 6 - Guia publico do hospede

### Hub inicial

- [x] Dar mais personalidade e acolhimento ao hub inicial do guia
- [x] Melhorar a hierarquia do cabecalho com nome do imovel, localizacao e contexto da estadia
- [x] Criar bloco inicial com tres acoes mais importantes
- [x] Reorganizar a grade de botoes por prioridade de uso
- [x] Usar melhor estados desabilitados para secoes sem conteudo
- [x] Reforcar sensacao de confianca com identidade da propriedade
- [x] Barra flutuante no mobile com botao "Chamar anfitriao" persistente
- [ ] Adicionar hero com nome do imovel em destaque e foto da propriedade

### Template unificado das subpaginas

- [x] Criar `GuidePageTemplate` compartilhado para todas as subpaginas
- [x] Header padronizado com icone da secao e nome do imovel
- [x] Botao "Voltar ao inicio" sempre visivel
- [x] Bottom bar sticky com acoes rapidas
- [x] Skip-to-content link
- [x] Hierarquia visual entre card primario e card secundario
- [x] Componentes auxiliares compartilhados

### Check-in

- [x] Timeline visual por momento da estadia
- [x] Card primario com horario de check-in em destaque
- [x] Botao "Copiar endereco" alem de "Abrir no Maps"
- [x] Card de metodo de acesso com icone semantico

### Wi-Fi

- [x] Layout mais escaneavel com dica mobile
- [x] Componente `CopyButton` compartilhado

### Contatos

- [x] Separar em tres grupos: anfitriao, suporte e emergencia
- [x] Manter anfitriao sempre primeiro
- [x] Botoes de acao direta em cada card

### Regras

- [x] Reformular linguagem negativa para positiva
- [x] Aplicar icones semanticos por regra
- [x] Destacar regras de silencio e visitas como texto contextual

### Equipamentos

- [x] Mapear tipos de equipamento para icones corretos
- [x] Usar labels semanticos por tipo de equipamento

### Dicas da regiao

- [x] Botao "Como chegar" com Google Maps por dica
- [x] Badge de distancia com icone de rota
- [x] Botao "Ligar" quando houver telefone
- [x] Layout mais card-based

### Check-out

- [x] Checklist interativo com persistencia em `localStorage`
- [x] Card primario com horario em destaque
- [x] Timeline do processo de saida
- [x] Progresso visual do checklist

### Links uteis

- [x] Icones semanticos por tipo de link

### Sugestoes especificas

- [x] Criar modo "primeiros passos da chegada" no topo do guia
- [x] Agrupar regras em formato mais amigavel e menos punitivo
- [x] Transformar contatos em cartoes por prioridade
- [x] Dar mais valor a secao de dicas com categoria, distancia e botao de rota

## Etapa 7 - Analytics, integracoes e configuracoes (Parcial)

- [x] Substituir cards mockados por visual mais orientado a decisao
- [x] Melhorar analytics com filtros de periodo, comparacao e leitura executiva
- [x] Criar padroes de graficos e cartoes de insight
- [x] Reestruturar integracoes com status, saude da conexao, ultima sincronizacao e proxima acao
- [x] Criar checklists de configuracao nas integracoes
- [x] Melhorar a pagina de configuracoes com preview da marca em tempo real
- [x] Agrupar configuracoes por impacto
- [x] Melhorar formulario de marca com amostras mais reais do resultado final
- [x] Exibir avisos de risco e dependencia para dominio, e-mail e WhatsApp

### Resultado esperado

- [x] Areas secundarias deixam de parecer placeholders
- [x] A aplicacao transmite mais confianca operacional

## Etapa 8 - Acessibilidade, performance e qualidade percebida (Parcial)

- [x] Fazer auditoria de contraste, foco visivel e ordem de navegacao por teclado
- [x] Revisar labels, descricoes e mensagens de erro dos formularios
- [x] Garantir que todos os botoes e icones tenham proposito e acessibilidade
- [x] Padronizar skeletons e feedbacks de carregamento
- [x] Revisar tamanho de toque e legibilidade no mobile
- [ ] Otimizar imagens, iframes e areas pesadas do preview
- [x] Planejar testes visuais e responsivos para landing, dashboard e guia publico
- [x] Criar checklist de QA visual antes de cada entrega de frontend

## 6. Ordem recomendada de execucao

- [x] 1. Fundamentos visuais e correcoes de consistencia
- [ ] 2. Landing page e conversao
- [x] 3. Autenticacao e acesso real
- [x] 4. Casca do dashboard e navegacao responsiva
- [x] 5. Lista e detalhe de imoveis
- [x] 6. Stepper de cadastro e edicao
- [x] 7. Compartilhamento, publicacao e preview
- [x] 8. Guia publico do hospede
- [x] 9. Analytics, integracoes e configuracoes
- [ ] 10. Rodada final de acessibilidade, performance e polimento

## 7. Quick wins de alto impacto

- [x] Aplicar os novos tokens de marca sem alterar o fundo claro e a base neutra do produto
- [x] Criar headers de pagina consistentes no dashboard
- [x] Melhorar empty states com CTA
- [ ] Corrigir encoding textual em toda a UI
- [x] Corrigir links quebrados e ancoras inexistentes na landing
- [x] Ajustar sidebar e layout para comportamento responsivo real
- [x] Corrigir preview do guia para nao depender de largura fixa de device
- [x] Revisar tabs, headers e action bars que quebram em larguras intermediarias
- [x] Entregar autenticacao real com login, cadastro, Google e recuperacao de senha
- [x] Revisar stepper para progressao mais clara
- [x] Fortalecer a tela de compartilhamento com preview real
- [x] Repriorizar botoes principais do guia do hospede

## 8. Metricas para acompanhar apos a execucao

- [ ] Taxa de clique no CTA principal da landing
- [ ] Taxa de login apos visita ao site publico
- [ ] Tempo medio para cadastrar e publicar um imovel
- [ ] Taxa de conclusao do stepper
- [ ] Uso de compartilhamento por WhatsApp versus link direto
- [ ] Taxa de acesso ao guia publico em mobile
- [ ] Reducao de duvidas repetidas do hospede
- [ ] Engajamento nas paginas do guia: Wi-Fi, check-in, contatos e dicas

## 9. Observacoes finais

- [ ] Priorizar primeiro consistencia e clareza antes de aumentar complexidade visual
- [ ] Evitar retrabalho em telas ainda dependentes de dados reais, mas ja definir o padrao visual delas
- [ ] Sempre validar as melhorias em desktop, notebook pequeno, tablet e mobile
- [ ] Sempre revisar microcopy em portugues do Brasil apos cada etapa
