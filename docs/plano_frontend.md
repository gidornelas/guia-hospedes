# Plano de Melhoria de Frontend, UI e UX

> Documento de planejamento para evolução visual e de experiência do **site público**, **dashboard** e **guia do hóspede**.
> Baseado na leitura de `docs/implementation-plan.md`, `PROGRESS.md`, `PLAN.md` e no estado atual das telas em `src/app`.

## 1. Objetivo

Elevar o GuiaHóspedes de um produto visualmente promissor e funcional para uma experiência mais consistente, confiável, clara e memorável em três frentes:

- conversão no site público
- produtividade no dashboard
- experiência mobile do hóspede no guia público

## 2. Base já construída

O projeto já tem uma boa fundação para evoluir sem retrabalho estrutural:

- [x] Design system inicial com tokens, tipografia e componentes `shadcn/ui`
- [x] Landing page extensa com hero, problema, solução, benefícios e CTA final
- [x] Dashboard com sidebar, topbar, cards, tabelas e páginas principais
- [x] Stepper de cadastro de imóvel com 8 etapas
- [x] Guia público mobile-first com hub e subpáginas
- [x] Preview do guia dentro do dashboard

## 3. Diagnóstico atual

### Pontos fortes

- [x] Direção visual já definida e coerente com hospitalidade premium
- [x] Boa cobertura de telas principais
- [x] Tipografia e paleta têm potencial de marca
- [x] Estrutura do App Router facilita separar áreas públicas e autenticadas

### Gaps percebidos

- [ ] Corrigir textos com problema de encoding e mojibake na UI e metadados (`GuiaHÃ³spedes`, `ImÃ³veis`, etc.)
- [ ] Corrigir links e âncoras da landing que hoje apontam para seções inexistentes, como `#precos` e `#contato`
- [ ] Consolidar um padrão visual único entre landing, dashboard e guia público
- [ ] Melhorar responsividade da navegação do dashboard, especialmente sidebar fixa e comportamento mobile
- [ ] Dar mais profundidade de produto para páginas ainda muito mockadas, como compartilhamento, analytics, integrações e configurações
- [ ] Reduzir carga cognitiva do stepper de imóvel com melhor agrupamento, resumo e feedback
- [ ] Fortalecer estados de vazio, loading, erro e sucesso em toda a aplicação
- [ ] Criar uma experiência mais “premium” e mais orientada à ação no guia público

## 4. Princípios para a evolução

- [ ] Priorizar clareza antes de ornamentação
- [ ] Manter linguagem visual de hospitalidade premium, sem parecer template genérico
- [ ] Tratar mobile como principal no guia do hóspede e relevante no dashboard
- [ ] Reduzir esforço por tarefa no painel administrativo
- [ ] Tornar toda ação importante visível, contextual e reversível
- [ ] Usar microcopy mais útil, humana e objetiva
- [ ] Garantir acessibilidade mínima AA, foco visível e navegação por teclado

## 4.1 Direção cromática recomendada

Aplicar a paleta rosa da cliente de forma controlada, sem transformar o produto em uma interface excessivamente colorida. A base do sistema deve continuar clara, neutra e funcional.

### Paleta de apoio da marca

- `#EBD4CB` para fundos suaves, superfícies de destaque e áreas editoriais
- `#DA9F93` para apoios visuais, elementos secundários e estados sutis
- `#B6465F` como cor principal de marca
- `#890620` para hover, active, títulos fortes e destaques mais densos
- `#2C0703` para textos de alta ênfase e contraste sofisticado

### Regras de uso

- [ ] Manter `background` principal claro, com branco e off-white como base
- [ ] Preservar neutros como preto, cinza, branco e variações de slate no corpo do sistema
- [ ] Usar rosa apenas em menus ativos, botões, links, badges, ícones, highlights e textos destacados
- [ ] Evitar telas inteiras com fundo rosa ou excesso de blocos coloridos concorrendo entre si
- [ ] Garantir contraste e legibilidade antes de qualquer decisão estética
- [ ] Aplicar a paleta com mais liberdade na landing e no guia público do que no dashboard operacional
- [ ] Fazer o dashboard parecer profissional e limpo, com branding rosa apenas nos pontos de ação e identidade

## 5. Roadmap sugerido

## Etapa 0 — Fundamentos visuais e consistência ✅ (Parcial)

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

## Etapa 1 — Landing page e site público ✅ (Parcial)

- [x] Reestruturar a hero para comunicar melhor promessa, público e benefício imediato
- [x] Reforçar a prova de valor com números e badges de confiança
- [x] Revisar header para ter navegação funcional (#recursos, #como-funciona, #precos)
- [x] Criar seção de `Preços` com 3 planos (Grátis, Pro, Empresa)
- [x] Ajustar CTA principal e secundário para fluxos reais (login, demo pública)
- [x] Dar mais ritmo visual com alternância de densidade e fundos
- [ ] Melhorar mockups do produto com mais fidelidade
- [ ] Reescrever microcopy de marketing completo
- [ ] Inserir seção de objeções e respostas rápidas
- [x] Criar footer mais útil com links reais e navegação clara
- [ ] Melhorar versão mobile com CTA persistente

### Sugestões específicas

- [x] Incluir bloco “para quem é” com gestores, anfitriões e operações
- [x] Incluir demo real do guia com link público (/g/flat-elegance-paulista)
- [ ] Inserir screenshots reais do fluxo: cadastro, publicação, compartilhamento
- [ ] Trabalhar visual mais editorial nas seções de benefícios e depoimentos

## Etapa 2 — Casca do dashboard e navegação ✅ (Parcial)

- [x] Resolver a relação entre sidebar colapsada e área de conteúdo (layout ajustado com `lg:pl-64`)
- [x] Criar navegação mobile com `Sheet/Drawer` (menu hambúrguer no mobile)
- [x] Melhorar topbar com breadcrumbs responsivos e busca
- [ ] Tornar breadcrumbs mais informativos em páginas profundas
- [x] Criar padrão para cabeçalho de página com `PageHeader`
- [x] Padronizar largura máxima e ritmo vertical das páginas internas
- [x] Criar estados de loading e skeleton (`Skeleton`, `StatCardSkeleton`, `TableRowSkeleton`, `CardSkeleton`)
- [x] Criar empty states com CTA acionável (aplicado em imóveis)
- [ ] Revisar densidade visual das tabelas para leitura mais rápida
- [ ] Melhorar responsividade de tabelas com alternativas em cards no mobile

### Resultado esperado

- [ ] O dashboard fica mais leve de navegar e mais consistente entre módulos
- [ ] A sensação deixa de ser “coleção de telas” e passa a ser “produto”

## Etapa 3 — Lista, detalhe e gestão de imóveis ✅ (Parcial)

- [x] Reestruturar a página de imóveis com toolbar mais completa: busca, filtros, status
- [x] Criar visão por cards para mobile e tabela para desktop (toggle entre views)
- [x] Adicionar cards de estatísticas no topo (total, com guia, publicados, rascunho)
- [ ] Dar mais evidência ao status do imóvel e do guia sem duplicidade/confusão
- [x] Melhorar a página de detalhe do imóvel com blocos de resumo mais escaneáveis
- [x] Trazer ações críticas para action bar responsiva: editar, preview, publicar, compartilhar
- [ ] Enriquecer a aba “Guia” com status, versão, publicação, QR code e últimos compartilhamentos
- [x] Melhorar a visualização de equipamentos e contatos com cards coloridos por prioridade
- [x] Adicionar indicadores de completude do cadastro por imóvel (checklist visual)
- [x] Criar empty states inteligentes com CTA para editar

### Sugestões específicas

- [x] Usar badges mais claros para separar `status do imóvel` de `status do guia`
- [x] Exibir “faltando para publicar” com checklist resumido por imóvel
- [ ] Criar uma mini timeline de atualização/publicação do guia

## Etapa 4 — Stepper de cadastro e edição de imóvel ✅ (Parcial)

- [x] Redesenhar o stepper para reduzir sensação de formulário longo
- [x] Transformar cada etapa em um bloco mais guiado, com título, objetivo e exemplo
- [x] Adicionar validação por etapa com feedback imediato e linguagem amigável
- [x] Inserir barra de progresso real com noção de conclusão
- [x] Criar resumo lateral ou final com checklist do que já foi preenchido
- [x] Melhorar os campos de regras com componentes mais semânticos e menos improvisados
- [x] Melhorar cadastros dinâmicos de equipamentos e contatos com cards mais compactos e reordenáveis
- [x] Criar ações sticky no mobile para `Anterior`, `Próximo`, `Salvar rascunho`
- [x] Adicionar autosave visível com feedback de status
- [x] Dar mais contexto para a etapa “Região”, hoje com sensação de placeholder
- [x] Incluir preview parcial do guia durante o preenchimento, mesmo que simplificado

### Resultado esperado

- [ ] Menos abandono no cadastro
- [ ] Menos erro de preenchimento
- [ ] Melhor percepção de progresso e controle

## Etapa 5 — Compartilhamento, publicação e preview ✅ (Parcial)

- [x] Transformar a página de compartilhamento em fluxo orientado por tarefa
- [x] Exibir preview real da mensagem e do link antes do envio
- [x] Dar destaque maior ao link público, QR code e canal recomendado
- [x] Mostrar disponibilidade do guia e possíveis bloqueios para compartilhar
- [x] Melhorar histórico de envios com filtros por imóvel, canal, data e status
- [x] Criar cards de canal com contexto de uso: WhatsApp, e-mail, link, QR
- [x] Melhorar preview do guia com estados para rascunho, publicado e não publicado
- [x] Incluir informações úteis no preview: slug, versão, última publicação e compatibilidade mobile
- [x] Criar área de ações rápidas no preview: copiar link, abrir público, compartilhar, publicar
- [ ] Planejar modal de publicação com checklist de prontidão antes de publicar

### Sugestões específicas

- [ ] Destacar “próximo melhor passo” em cada estado do guia
- [ ] Exibir mensagem “este guia ainda não está público” com CTA claro
- [ ] Permitir copiar QR e baixar imagem do QR futuramente

## Etapa 6 — Guia público do hóspede ✅

### Hub Inicial
- [x] Dar mais personalidade e acolhimento ao hub inicial do guia
- [x] Melhorar a hierarquia do cabeçalho com nome do imóvel, localização e contexto da estadia
- [x] Criar um bloco inicial com 3 ações mais importantes: check-in, Wi-Fi, falar com anfitrião
- [x] Reorganizar a grade de botões por prioridade de uso, não apenas por categoria
- [x] Usar melhor estados desabilitados para seções sem conteúdo
- [x] Reforçar sensação de confiança com identidade da propriedade e assinatura visual
- [x] Barra flutuante no mobile com botão "Chamar anfitrião" persistente
- [ ] Adicionar hero com nome do imóvel em destaque e foto da propriedade (futuro)

### Template Unificado das Subpáginas
- [x] Criar `GuidePageTemplate` compartilhado para todas as subpáginas
- [x] Header padronizado com ícone da seção + nome do imóvel
- [x] Botão "Voltar ao início" sempre visível
- [x] Bottom bar sticky com ações rápidas (voltar ao hub, WhatsApp anfitrião)
- [x] Skip-to-content link
- [x] Hierarquia visual: card primário (info essencial, maior, com destaque) vs card secundário (complementar, mais compacto)
- [x] Componentes auxiliares: PrimaryCard, SecondaryCard, InfoRow, TimelineItem, ActionButton

### Check-in
- [x] Timeline visual: "Antes de chegar" → "Na chegada" → "Durante a estadia"
- [x] Card primário: horário de check-in em destaque (grande)
- [x] Botão "Copiar endereço" além de "Abrir no Maps"
- [x] Card de método de acesso com ícone semântico

### Wi-Fi
- [x] Layout mais escaneável com dica mobile
- [x] Componente CopyButton compartilhado

### Contatos
- [x] Separar em 3 grupos: Anfitrião (destaque especial), Suporte, Emergência (cor vermelha)
- [x] Anfitrião sempre primeiro, independente da ordem no banco
- [x] Botões de ação direta: "Ligar", "WhatsApp", "E-mail" em cada card

### Regras
- [x] Reformular linguagem negativa para positiva:
  - "Fumar: Não permitido" → "Ambiente livre de fumaça"
  - "Pets: Não permitido" → "Sem animais de estimação"
  - "Festas: Não permitido" → "Ambiente tranquilo, sem eventos"
- [x] Ícones semânticos para cada regra
- [x] Destacar regras de silêncio e visitas como texto contextual

### Equipamentos
- [x] Mapear tipos de equipamento para ícones corretos (ar-condicionado, geladeira, máquina de lavar, micro-ondas, cafeteira, TV, etc.)
- [x] Labels semânticos por tipo de equipamento

### Dicas da Região
- [x] Botão "Como chegar" com Google Maps por dica
- [x] Badge de distância com ícone de rota
- [x] Botão "Ligar" se houver telefone
- [x] Layout mais card-based

### Check-out
- [x] Checklist interativo com checkboxes (persiste no localStorage)
- [x] Card primário com horário em destaque
- [x] Timeline: "No dia da saída" → "Antes de sair" → "Após a saída"
- [x] Progresso visual do checklist (% completo)

### Links Úteis
- [x] Ícones semânticos por tipo de link (Google Maps, WhatsApp, Instagram, etc.)

### Sugestões específicas

- [x] Criar modo “primeiros passos da chegada” no topo do guia
- [x] Agrupar regras em formato mais amigável e menos punitivo
- [x] Transformar contatos em cartões por prioridade: anfitrião, suporte, emergência
- [x] Dar mais valor à seção de dicas com categoria, distância e botão de rota

## Etapa 7 — Analytics, integrações e configurações ✅ (Parcial)

- [x] Substituir cards mockados por visual mais orientado a decisão
- [x] Melhorar analytics com filtros de período, comparação e leitura executiva
- [x] Criar padrões de gráficos e cartões de insight em vez de apenas blocos estáticos
- [x] Reestruturar integrações com status, saúde da conexão, última sincronização e próxima ação
- [x] Criar checklists de configuração nas integrações
- [x] Melhorar a página de configurações com preview da marca em tempo real
- [x] Agrupar configurações por impacto: operação, marca, domínio, mensagens
- [x] Melhorar formulário de marca com amostras mais reais do resultado final
- [x] Exibir avisos de risco e dependência para domínio, e-mail e WhatsApp

### Resultado esperado

- [ ] Áreas secundárias deixam de parecer placeholders
- [ ] A aplicação transmite mais confiança operacional

## Etapa 8 — Acessibilidade, performance e qualidade percebida ✅ (Parcial)

- [x] Fazer auditoria de contraste, foco visível e ordem de navegação por teclado
- [x] Revisar labels, descrições e mensagens de erro dos formulários
- [x] Garantir que todos os botões e ícones tenham propósito e acessibilidade
- [x] Padronizar skeletons e feedbacks de carregamento
- [x] Revisar tamanho de toque e legibilidade no mobile
- [ ] Otimizar imagens, iframes e áreas pesadas do preview
- [ ] Planejar testes visuais e responsivos para landing, dashboard e guia público
- [ ] Criar checklist de QA visual antes de cada entrega de frontend

## 6. Ordem recomendada de execução

- [ ] 1. Fundamentos visuais e correções de consistência
- [ ] 2. Landing page e conversão
- [ ] 3. Casca do dashboard e navegação responsiva
- [ ] 4. Lista/detalhe de imóveis
- [ ] 5. Stepper de cadastro/edição
- [ ] 6. Compartilhamento, publicação e preview
- [ ] 7. Guia público do hóspede
- [ ] 8. Analytics, integrações e configurações
- [ ] 9. Rodada final de acessibilidade, performance e polimento

## 7. Quick wins de alto impacto

- [x] Aplicar os novos tokens de marca sem alterar o fundo claro e a base neutra do produto
- [x] Criar headers de página consistentes no dashboard
- [x] Melhorar empty states e estados vazios com CTA
- [ ] Corrigir encoding textual em toda a UI
- [ ] Corrigir links quebrados e âncoras inexistentes na landing
- [ ] Ajustar sidebar/layout para comportamento responsivo real
- [ ] Revisar stepper para progressão mais clara
- [ ] Fortalecer a tela de compartilhamento com preview real
- [ ] Repriorizar botões principais do guia do hóspede

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
- [ ] Sempre validar as melhorias em desktop e mobile
- [ ] Sempre revisar microcopy em português do Brasil após cada etapa
