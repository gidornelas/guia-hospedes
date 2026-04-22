# Plano de Melhoria de Frontend, UI e UX

> Documento de planejamento para evolução visual e de experiência do **site público**, **dashboard** e **guia do hóspede**.
> Baseado na leitura de `docs/implementation-plan.md`, do progresso já executado e do estado atual das telas em `src/app`.

## 1. Objetivo

Elevar o GuiaHóspedes de um produto funcional e promissor para uma experiência mais consistente, confiável, clara e memorável em três frentes:

- conversão no site público
- produtividade no dashboard
- experiência mobile do hóspede no guia público

## 2. Base já construída

O projeto já tem uma fundação boa para evoluir sem retrabalho estrutural:

- [x] Design system inicial com tokens, tipografia e componentes `shadcn/ui`
- [x] Landing page extensa com hero, problema, solução, benefícios e CTA final
- [x] Dashboard com sidebar, topbar, cards, tabelas e páginas principais
- [x] Stepper de cadastro de imóvel com 8 etapas
- [x] Guia público mobile-first com hub e subpáginas
- [x] Preview do guia dentro do dashboard

## 2.1 Status consolidado da fase atual

### Entregas já implementadas nesta frente

- [x] Landing page revisada com âncoras funcionais, microcopy central melhorada e CTA persistente no mobile
- [x] Shell do dashboard ajustada para notebook pequeno e tablet com drawer em vez de sidebar fixa precoce
- [x] `PageHeader` e `EmptyState` promovidos a padrões visuais compartilhados
- [x] Lista, detalhe, preview e compartilhamento de imóveis reestruturados com mais clareza e responsividade
- [x] Stepper de criação e edição de imóvel transformado em fluxo guiado, com progresso e ações sticky
- [x] Analytics, integrações, configurações, guias e modelos de mensagem refinados para leitura mais executiva
- [x] Checklist visual de QA criado em `docs/frontend_qa_checklist.md`

### Pendências que ainda fazem sentido

- [ ] Fechar a última revisão de encoding e microcopy em todo o projeto
- [ ] Adicionar mais evidências visuais reais na landing, como screenshots do fluxo
- [ ] Criar modal/checklist de publicação antes de publicar o guia
- [ ] Explorar QR com cópia/download e uma mini timeline de atualização do guia
- [ ] Executar a rodada final de QA visual em todos os breakpoints e anotar eventuais ajustes finos

## 3. Diagnóstico atual

### Pontos fortes

- [x] Direção visual já definida e coerente com hospitalidade premium
- [x] Boa cobertura das telas principais
- [x] Tipografia e paleta com potencial de marca
- [x] Estrutura do App Router facilita separar áreas públicas e autenticadas
- [x] O produto já transmite uma proposta real, e não apenas um protótipo visual

### Gaps percebidos

- [ ] Corrigir textos com problema de encoding e mojibake na UI, metadados e documentos
- [x] Corrigir links e âncoras da landing que ainda apontavam para seções inexistentes
- [ ] Consolidar um padrão visual único entre landing, dashboard e guia público
- [x] Melhorar responsividade da navegação do dashboard, especialmente sidebar fixa e comportamento mobile
- [x] Corrigir quebras de layout em larguras intermediárias, onde menus, headers, tabs e barras de ação ainda se comportavam como desktop
- [x] Remover larguras fixas e padrões que estouravam o layout, especialmente em previews, iframes e molduras de device
- [x] Dar mais profundidade de produto para páginas ainda muito mockadas, como compartilhamento, analytics, integrações e configurações
- [x] Reduzir carga cognitiva do stepper de imóvel com melhor agrupamento, resumo e feedback
- [x] Fortalecer estados de vazio, loading, erro e sucesso nas áreas principais da aplicação
- [x] Criar uma experiência mais premium e mais orientada à ação no guia público

### Achados recentes desta rodada de análise

- [x] A shell autenticada não pode depender apenas do breakpoint `lg`
- [x] Alguns cabeçalhos internos assumiam uma linha única e quebravam quando coexistiam breadcrumb, título e botões
- [x] O preview do guia usava moldura mobile com largura fixa de `375px`, gerando sobra visual e desalinhamento
- [x] O padrão atual de tabs precisava prever largura total, wrap e empilhamento
- [x] Faltava um padrão responsivo claro para áreas com iframe, preview e alternância entre visualização mobile e desktop
- [x] O menu lateral já tem padrão funcional em resoluções intermediárias e agora entra na fase de ajuste fino

## 4. Princípios para a evolução

- [ ] Priorizar clareza antes de ornamentação
- [ ] Manter linguagem visual de hospitalidade premium, sem parecer template genérico
- [ ] Tratar mobile como principal no guia do hóspede e relevante no dashboard
- [ ] Reduzir esforço por tarefa no painel administrativo
- [ ] Tornar toda ação importante visível, contextual e reversível
- [ ] Usar microcopy mais útil, humana e objetiva
- [ ] Garantir acessibilidade mínima AA, foco visível e navegação por teclado
- [ ] Desenhar breakpoints intermediários com intenção, e não apenas mobile e desktop

## 4.1 Direção cromática recomendada

Aplicar a paleta rosa da cliente de forma controlada, sem transformar o produto em uma interface excessivamente colorida. A base do sistema deve continuar clara, neutra e funcional.

### Paleta de apoio da marca

- `#EBD4CB` para fundos suaves, superfícies de destaque e áreas editoriais
- `#DA9F93` para apoios visuais, elementos secundários e estados sutis
- `#B6465F` como cor principal de marca
- `#890620` para hover, active, títulos fortes e destaques mais densos
- `#2C0703` para textos de alta ênfase e contraste sofisticado

### Regras de uso

- [x] Manter `background` principal claro, com branco e off-white como base
- [x] Preservar neutros como preto, cinza, branco e variações de slate no corpo do sistema
- [x] Usar rosa apenas em menus ativos, botões, links, badges, ícones, highlights e textos destacados
- [x] Evitar telas inteiras com fundo rosa ou excesso de blocos coloridos concorrendo entre si
- [x] Garantir contraste e legibilidade antes de qualquer decisão estética
- [x] Aplicar a paleta com mais liberdade na landing e no guia público do que no dashboard operacional
- [x] Fazer o dashboard parecer profissional e limpo, com branding rosa apenas nos pontos de ação e identidade

## 5. Roadmap sugerido

## Etapa 0 - Fundamentos visuais e consistência ✅ (Parcial)

- [x] Aplicar a nova direção cromática com base neutra clara e rosa restrito a elementos de destaque
- [x] Revisar tokens de cor para superfícies, bordas, hover, status, destaque e fundos de seção
- [x] Padronizar raios, sombras, espaçamentos e altura de componentes interativos
- [x] Definir padrões globais para `page header`, `section header`, `empty state`, `stats card`, `table toolbar` e `action bar`
- [x] Criar variações semânticas mais refinadas para sucesso, atenção, erro, informação e rascunho
- [ ] Corrigir encoding de textos no frontend, metadados, constantes e documentação de interface
- [ ] Padronizar uso de ícones por contexto para evitar excesso visual
- [ ] Revisar contraste, legibilidade e hierarquia de títulos
- [ ] Criar checklist visual de consistência para todas as páginas futuras

### Resultado esperado

- [x] O produto passa a ter uma identidade visual unificada e mais madura
- [x] As próximas telas podem evoluir sem reinventar layout ou estilo

## Etapa 1 - Landing page e site público ✅ (Parcial)

- [x] Reestruturar a hero para comunicar melhor promessa, público e benefício imediato
- [x] Reforçar a prova de valor com números e badges de confiança
- [x] Revisar header para ter navegação funcional
- [x] Criar seção de preços com três planos
- [x] Ajustar CTA principal e secundário para fluxos reais
- [x] Dar mais ritmo visual com alternância de densidade e fundos
- [ ] Melhorar mockups do produto com mais fidelidade
- [x] Reescrever microcopy central da landing e corrigir CTAs quebrados
- [ ] Inserir seção de objeções e respostas rápidas
- [x] Criar footer mais útil com links reais e navegação clara
- [x] Melhorar versão mobile com CTA persistente

### Sugestões específicas

- [x] Incluir bloco "para quem é" com gestores, anfitriões e operações
- [x] Incluir demo real do guia com link público
- [ ] Inserir screenshots reais do fluxo de cadastro, publicação e compartilhamento
- [ ] Trabalhar visual mais editorial nas seções de benefícios e depoimentos

## Etapa 2 - Casca do dashboard e navegação ✅ (Parcial)

- [x] Resolver a relação entre sidebar e área de conteúdo
- [x] Criar navegação mobile com `Sheet/Drawer`
- [x] Melhorar topbar com breadcrumbs responsivos e busca
- [ ] Tornar breadcrumbs mais informativos em páginas profundas
- [x] Criar padrão para cabeçalho de página com `PageHeader`
- [x] Padronizar largura máxima e ritmo vertical das páginas internas
- [x] Criar estados de loading e skeleton
- [x] Criar empty states com CTA acionável
- [x] Revisar densidade visual das tabelas para leitura mais rápida
- [x] Melhorar responsividade de tabelas com alternativas em cards no mobile
- [x] Revisar breakpoints do shell autenticado para não depender só de `lg`
- [x] Garantir `min-w-0`, `flex-wrap` e empilhamento controlado em cabeçalhos, breadcrumbs e barras de ação
- [x] Padronizar comportamento de tabs em larguras estreitas, evitando listas com `w-fit` quando o contexto pede ocupação total
- [x] Definir padrão de navegação lateral para resoluções intermediárias, com foco em clareza do item ativo e toque confortável

### Resultado esperado

- [x] O dashboard fica mais leve de navegar e mais consistente entre módulos
- [x] A sensação deixa de ser "coleção de telas" e passa a ser "produto"

## Etapa 3 - Lista, detalhe e gestão de imóveis ✅ (Parcial)

- [x] Reestruturar a página de imóveis com toolbar mais completa
- [x] Criar visão por cards para mobile e tabela para desktop
- [x] Adicionar cards de estatísticas no topo
- [x] Dar mais evidência ao status do imóvel e do guia sem duplicidade
- [x] Melhorar a página de detalhe do imóvel com blocos de resumo mais escaneáveis
- [x] Trazer ações críticas para action bar responsiva
- [x] Enriquecer a aba "Guia" com status, versão, publicação e ações de compartilhamento
- [x] Melhorar a visualização de equipamentos e contatos com cards coloridos por prioridade
- [x] Adicionar indicadores de completude do cadastro por imóvel
- [x] Criar empty states inteligentes com CTA para editar

### Sugestões específicas

- [x] Usar badges mais claros para separar status do imóvel e status do guia
- [x] Exibir "faltando para publicar" com checklist resumido por imóvel
- [ ] Criar mini timeline de atualização e publicação do guia

## Etapa 4 - Stepper de cadastro e edição de imóvel ✅ (Parcial)

- [x] Redesenhar o stepper para reduzir sensação de formulário longo
- [x] Transformar cada etapa em um bloco mais guiado, com título, objetivo e exemplo
- [x] Adicionar validação por etapa com feedback imediato e linguagem amigável
- [x] Inserir barra de progresso real com noção de conclusão
- [x] Criar resumo lateral ou final com checklist do que já foi preenchido
- [x] Melhorar os campos de regras com componentes mais semânticos e menos improvisados
- [x] Melhorar cadastros dinâmicos de equipamentos e contatos
- [x] Criar ações sticky no mobile para `Anterior`, `Próximo` e `Salvar rascunho`
- [x] Adicionar autosave visível com feedback de status
- [x] Dar mais contexto para a etapa "Região"
- [x] Incluir preview parcial do guia durante o preenchimento

### Resultado esperado

- [x] Menos abandono no cadastro
- [x] Menos erro de preenchimento
- [x] Melhor percepção de progresso e controle

## Etapa 5 - Compartilhamento, publicação e preview ✅ (Parcial)

- [x] Transformar a página de compartilhamento em fluxo orientado por tarefa
- [x] Exibir preview real da mensagem e do link antes do envio
- [x] Dar destaque maior ao link público, QR code e canal recomendado
- [x] Mostrar disponibilidade do guia e possíveis bloqueios para compartilhar
- [x] Melhorar histórico de envios com filtros por imóvel, canal, data e status
- [x] Criar cards de canal com contexto de uso
- [x] Melhorar preview do guia com estados para rascunho, publicado e não publicado
- [x] Incluir informações úteis no preview
- [x] Criar área de ações rápidas no preview
- [ ] Planejar modal de publicação com checklist de prontidão antes de publicar
- [x] Remover moldura mobile de largura fixa no preview e adotar frame escalável ou adaptativo
- [x] Reorganizar header e tabs do preview para comportamento fluido em notebook pequeno e tablet landscape
- [x] Definir padrão para previews com iframe: limite de largura, escala visual e fallback quando não houver espaço horizontal

### Sugestões específicas

- [x] Destacar "próximo melhor passo" em cada estado do guia
- [x] Exibir mensagem "este guia ainda não está público" com CTA claro
- [ ] Permitir copiar QR e baixar imagem do QR futuramente
- [x] Transformar a alternância Mobile/Desktop em controle realmente responsivo, sem quebrar alinhamento ou gerar áreas vazias exageradas
- [x] Priorizar layout em duas zonas: contexto e ações acima, preview abaixo, em vez de insistir em composições horizontais apertadas

## Etapa 6 - Guia público do hóspede ✅

### Hub inicial

- [x] Dar mais personalidade e acolhimento ao hub inicial do guia
- [x] Melhorar a hierarquia do cabeçalho com nome do imóvel, localização e contexto da estadia
- [x] Criar bloco inicial com três ações mais importantes
- [x] Reorganizar a grade de botões por prioridade de uso
- [x] Usar melhor estados desabilitados para seções sem conteúdo
- [x] Reforçar sensação de confiança com identidade da propriedade
- [x] Barra flutuante no mobile com botão "Chamar anfitrião" persistente
- [ ] Adicionar hero com nome do imóvel em destaque e foto da propriedade

### Template unificado das subpáginas

- [x] Criar `GuidePageTemplate` compartilhado para todas as subpáginas
- [x] Header padronizado com ícone da seção e nome do imóvel
- [x] Botão "Voltar ao início" sempre visível
- [x] Bottom bar sticky com ações rápidas
- [x] Skip-to-content link
- [x] Hierarquia visual entre card primário e card secundário
- [x] Componentes auxiliares compartilhados

### Check-in

- [x] Timeline visual por momento da estadia
- [x] Card primário com horário de check-in em destaque
- [x] Botão "Copiar endereço" além de "Abrir no Maps"
- [x] Card de método de acesso com ícone semântico

### Wi-Fi

- [x] Layout mais escaneável com dica mobile
- [x] Componente `CopyButton` compartilhado

### Contatos

- [x] Separar em três grupos: anfitrião, suporte e emergência
- [x] Manter anfitrião sempre primeiro
- [x] Botões de ação direta em cada card

### Regras

- [x] Reformular linguagem negativa para positiva
- [x] Aplicar ícones semânticos por regra
- [x] Destacar regras de silêncio e visitas como texto contextual

### Equipamentos

- [x] Mapear tipos de equipamento para ícones corretos
- [x] Usar labels semânticos por tipo de equipamento

### Dicas da região

- [x] Botão "Como chegar" com Google Maps por dica
- [x] Badge de distância com ícone de rota
- [x] Botão "Ligar" quando houver telefone
- [x] Layout mais card-based

### Check-out

- [x] Checklist interativo com persistência em `localStorage`
- [x] Card primário com horário em destaque
- [x] Timeline do processo de saída
- [x] Progresso visual do checklist

### Links úteis

- [x] Ícones semânticos por tipo de link

### Sugestões específicas

- [x] Criar modo "primeiros passos da chegada" no topo do guia
- [x] Agrupar regras em formato mais amigável e menos punitivo
- [x] Transformar contatos em cartões por prioridade
- [x] Dar mais valor à seção de dicas com categoria, distância e botão de rota

## Etapa 7 - Analytics, integrações e configurações ✅ (Parcial)

- [x] Substituir cards mockados por visual mais orientado a decisão
- [x] Melhorar analytics com filtros de período, comparação e leitura executiva
- [x] Criar padrões de gráficos e cartões de insight
- [x] Reestruturar integrações com status, saúde da conexão, última sincronização e próxima ação
- [x] Criar checklists de configuração nas integrações
- [x] Melhorar a página de configurações com preview da marca em tempo real
- [x] Agrupar configurações por impacto
- [x] Melhorar formulário de marca com amostras mais reais do resultado final
- [x] Exibir avisos de risco e dependência para domínio, e-mail e WhatsApp

### Resultado esperado

- [x] Áreas secundárias deixam de parecer placeholders
- [x] A aplicação transmite mais confiança operacional

## Etapa 8 - Acessibilidade, performance e qualidade percebida ✅ (Parcial)

- [x] Fazer auditoria de contraste, foco visível e ordem de navegação por teclado
- [x] Revisar labels, descrições e mensagens de erro dos formulários
- [x] Garantir que todos os botões e ícones tenham propósito e acessibilidade
- [x] Padronizar skeletons e feedbacks de carregamento
- [x] Revisar tamanho de toque e legibilidade no mobile
- [ ] Otimizar imagens, iframes e áreas pesadas do preview
- [x] Planejar testes visuais e responsivos para landing, dashboard e guia público
- [x] Criar checklist de QA visual antes de cada entrega de frontend

## 6. Ordem recomendada de execução

- [x] 1. Fundamentos visuais e correções de consistência
- [ ] 2. Landing page e conversão
- [x] 3. Casca do dashboard e navegação responsiva
- [x] 4. Lista e detalhe de imóveis
- [x] 5. Stepper de cadastro e edição
- [x] 6. Compartilhamento, publicação e preview
- [x] 7. Guia público do hóspede
- [x] 8. Analytics, integrações e configurações
- [ ] 9. Rodada final de acessibilidade, performance e polimento

## 7. Quick wins de alto impacto

- [x] Aplicar os novos tokens de marca sem alterar o fundo claro e a base neutra do produto
- [x] Criar headers de página consistentes no dashboard
- [x] Melhorar empty states com CTA
- [ ] Corrigir encoding textual em toda a UI
- [x] Corrigir links quebrados e âncoras inexistentes na landing
- [x] Ajustar sidebar e layout para comportamento responsivo real
- [x] Corrigir preview do guia para não depender de largura fixa de device
- [x] Revisar tabs, headers e action bars que quebram em larguras intermediárias
- [x] Revisar stepper para progressão mais clara
- [x] Fortalecer a tela de compartilhamento com preview real
- [x] Repriorizar botões principais do guia do hóspede

## 8. Métricas para acompanhar após a execução

- [ ] Taxa de clique no CTA principal da landing
- [ ] Taxa de login após visita ao site público
- [ ] Tempo médio para cadastrar e publicar um imóvel
- [ ] Taxa de conclusão do stepper
- [ ] Uso de compartilhamento por WhatsApp versus link direto
- [ ] Taxa de acesso ao guia público em mobile
- [ ] Redução de dúvidas repetidas do hóspede
- [ ] Engajamento nas páginas do guia: Wi-Fi, check-in, contatos e dicas

## 9. Observações finais

- [ ] Priorizar primeiro consistência e clareza antes de aumentar complexidade visual
- [ ] Evitar retrabalho em telas ainda dependentes de dados reais, mas já definir o padrão visual delas
- [ ] Sempre validar as melhorias em desktop, notebook pequeno, tablet e mobile
- [ ] Sempre revisar microcopy em português do Brasil após cada etapa
