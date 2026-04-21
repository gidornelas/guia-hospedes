# Plano de Implementação — Funcionalidades Pendentes

> **Modo de execução:** Este plano deve ser executado **uma etapa por vez**. Não avance para a próxima etapa sem que a anterior esteja completa, testada e aprovada pelo usuário.

**Objetivo:** Implementar as funcionalidades pendentes do GuiaHóspedes, transformando o front-end mockado em um produto funcional com dados persistentes.

**Stack:** Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui + Prisma ORM + SQLite + NextAuth v5

---

## Etapa 1: Server Actions — Criar Imóvel ✅

**Status:** Concluído

**Objetivo:** Fazer o formulário de novo imóvel salvar dados reais no banco de dados.

**Arquivos afetados:**
- Criar: `src/app/actions/create-property.ts`
- Modificar: `src/app/app/imoveis/novo/page.tsx`

**O que fazer:**
1. Criar Server Action `createProperty` que:
   - Recebe formData serializado do cliente
   - Gera slug único baseado no nome do imóvel (ex: `flat-elegance-paulista`)
   - Cria o Property no banco com `status: DRAFT`
   - Cria registros relacionados: CheckIn, CheckOut, WiFi, Rules
   - Cria registros de Devices e Contacts (arrays)
   - Cria um Guide associado com `status: DRAFT`
   - Retorna o ID do imóvel criado
2. Atualizar `handleSubmit` no formulário novo para:
   - Serializar formData (exceto recommendations que fica para depois)
   - Chamar `createProperty` via server action
   - Redirecionar para `/app/imoveis/[id]` em caso de sucesso
   - Mostrar erro em caso de falha (toast com sonner)

**Critério de aceite:** Após preencher o stepper de 8 etapas e clicar "Criar Imóvel", os dados são salvos no banco e o usuário é redirecionado para a página de detalhe do imóvel criado.

---

## Etapa 2: Server Actions — Editar Imóvel ✅

**Status:** Concluído

**Objetivo:** Permitir editar um imóvel existente com dados pré-preenchidos.

**Arquivos afetados:**
- Criar: `src/app/actions/update-property.ts`
- Criar: `src/app/app/imoveis/[id]/editar/page.tsx`

**O que fazer:**
1. Criar Server Action `updateProperty` que:
   - Recebe o `id` do imóvel e os dados atualizados
   - Atualiza o Property e todos os registros relacionados
   - Usa `upsert` para CheckIn, CheckOut, WiFi, Rules (cria se não existe, atualiza se existe)
   - Deleta e recria Devices e Contacts (乍 mais simples que sync diff)
   - Retorna sucesso/falha
2. Criar página `/app/imoveis/[id]/editar` que:
   - Busca dados do imóvel com todas relações (server component)
   - Passa dados para um componente client que pré-preenche o formulário
   - Reutiliza o mesmo stepper visual do "Novo Imóvel"
   - No submit, chama `updateProperty` e redireciona para detalhe

**Critério de aceite:** Ao acessar `/app/imoveis/[id]/editar`, o formulário vem preenchido com dados existentes. Ao salvar, as alterações são persistidas.

---

## Etapa 3: Server Actions — Excluir Imóvel ✅

**Status:** Concluído

**Objetivo:** Permitir excluir um imóvel com confirmação.

**Arquivos afetados:**
- Criar: `src/app/actions/delete-property.ts`
- Modificar: `src/app/app/imoveis/page.tsx`
- Modificar: `src/app/app/imoveis/[id]/page.tsx`

**O que fazer:**
1. Criar Server Action `deleteProperty` que:
   - Recebe o `id` do imóvel
   - Verifica se o imóvel existe
   - Deleta em cascade (Prisma já faz cascade por causa do `onDelete: Cascade` no schema)
   - Retorna sucesso/falha
2. Adicionar botão "Excluir" na página de detalhe do imóvel
3. Adicionar dialog de confirmação com AlertDialog do shadcn/ui
4. Após excluir, redirecionar para lista de imóveis

**Critério de aceite:** Ao clicar "Excluir" e confirmar, o imóvel e todos os dados relacionados são removidos do banco e o usuário é redirecionado para a lista.

---

## Etapa 4: Publicação/Despublicação de Guia ✅

**Status:** Concluído

**Objetivo:** Permitir publicar e despublicar um guia com toggle.

**Arquivos afetados:**
- Criar: `src/app/actions/toggle-guide-status.ts`
- Modificar: `src/app/app/imoveis/[id]/page.tsx`

**O que fazer:**
1. Criar Server Action `toggleGuideStatus` que:
   - Recebe o `propertyId`
   - Se status for DRAFT ou UNPUBLISHED → muda para PUBLISHED e seta `publishedAt`
   - Se status for PUBLISHED → muda para UNPUBLISHED
   - Incrementa `version` a cada publicação
   - Retorna o novo status
2. Adicionar botão de publish/unpublish na aba "Guia" da página de detalhe
   - PUBLISHED → botão "Despublicar" (vermelho)
   - DRAFT/UNPUBLISHED → botão "Publicar" (verde)
3. Adicionar feedback visual (toast + badge atualizado)

**Critério de ação:** Ao clicar "Publicar", o status muda para PUBLISHED, o slug fica acessível publicamente, e o badge atualiza visualmente. Ao clicar "Despublicar", o guia volta para UNPUBLISHED e deixa de ser acessível via `/g/[slug]`.

---

## Etapa 5: Compartilhamento Dinâmico ✅

**Status:** Concluído

**Objetivo:** Tornar a página de compartilhamento funcional com dados reais do banco.

**Arquivos afetados:**
- Modificar: `src/app/app/compartilhamento/page.tsx`
- Criar: `src/app/actions/share-guide.ts`

**O que fazer:**
1. Criar componente client para o formulário de compartilhamento (a página atual é server component)
2. Dinamizar o seletor de imóveis (buscar propriedades com guias PUBLICADOS)
3. Gerar link dinâmico baseado no slug do guia: `${APP_URL}/g/${slug}`
4. Implementar botão "Copiar Link" funcional
5. Implementar botão WhatsApp que abre wa.me com mensagem personalizada
6. Implementar botão E-mail que abre mailto: com template
7. Registrar ShareLog no banco quando compartilhar

**Critério de aceite:** Ao selecionar um imóvel e preencher dados do hóspede, o link gerado é real e funcional. Os botões WhatsApp e E-mail abrem os apps corretos com mensagem preenchida.

---

## Etapa 6: Geração de QR Code

**Objetivo:** Gerar QR Code funcional para cada guia publicado.

**Arquivos afetados:**
- Modificar: `src/app/app/compartilhamento/page.tsx`
- Modificar: `src/app/app/imoveis/[id]/page.tsx`

**O que fazer:**
1. Usar a lib `react-qr-code` (já instalada no package.json)
2. Criar componente `<QRCodeCard>` que recebe uma URL e renderiza o QR Code
3. Adicionar na página de compartilhamento (abaixo do link copiável)
4. Adicionar na página de detalhe do imóvel (seção do guia)
5. Estilizar com borda, logo e URL impressos abaixo

**Critério de aceite:** O QR Code é gerado dinamicamente apontando para a URL pública do guia e pode ser escaneado por qualquer câmera de celular.

---

## Etapa 7: Landing Page Funcional (Links e CTAs) ✅

**Status:** Concluído

**Objetivo:** Conectar os CTAs da landing page às rotas reais do app.

**Arquivos afetados:**
- Modificar: `src/app/(public)/page.tsx` (ou equivalente landing page)
- Verificar se os links "Começar agora" apontam para `/login` ou `/app`

**O que fazer:**
1. Verificar todos os links/CTAs da landing page
2. Garantir que "Começar agora" → `/login`
3. Garantir que "Ver demo" → link para um guia público de exemplo
4. Garantir que "Login" → `/login`
5. Garantir que links de footer estão corretos

**Critério de aceite:** Todos os botões da landing page levam a rotas existentes e funcionais.

---

## Etapa 8: Tela de Configurações — Salvar no Banco ✅

**Status:** Concluído

**Objetivo:** Fazer a tela de configurações salvar dados reais da organização.

**Arquivos afetados:**
- Criar: `src/app/actions/update-organization.ts`
- Modificar: `src/app/app/configuracoes/page.tsx`

**O que fazer:**
1. Criar Server Action `updateOrganization` que atualiza:
   - Nome da empresa, gestor, telefone, e-mail, WhatsApp
   - Cor primária da marca (brandSettings como JSON)
   - Domínio público dos guias
2. Converter a página de configurações para usar dados reais do banco
3. Implementar formulários com react-hook-form + zod para validação

**Critério de aceite:** Ao editar configurações e salvar, os dados persistem no banco e refletem na próxima visita.

---

## Etapa 9: Preparação para Deploy (Railway) ✅

**Status:** Concluído

**Objetivo:** Preparar o projeto para deploy no Railway, mantendo SQLite por enquanto.

**Arquivos afetados:**
- Criar: `Dockerfile` ou `nixpacks.toml`
- Modificar: `package.json` (adicionar script `postinstall` para prisma generate)
- Modificar: `next.config.ts` se necessário
- Criar: `.env.production` template
- Criar: `railway.toml` ou `railway.json`

**O que fazer:**
1. Adicionar script `postinstall` no package.json: `prisma generate`
2. Adicionar script `db:migrate:deploy`: `prisma migrate deploy` (para produção)
3. Garantir que o build funciona com `npm run build`
4. Garantir que `next start` funciona após build
5. Criar documentação de deploy com:
   - Variáveis de ambiente necessárias
   - Passos para configurar no Railway
   - Script de seed para produção

**Nota sobre SQLite:** No Railway, o filesystem é efêmero. Isso significa que o banco será perdido a cada redeploy. Isso é aceitável para demo/staging. Para produção persistente, será necessário migrar para PostgreSQL (etapa futura).

**Critério de aceite:** O projeto faz deploy com sucesso no Railway e está acessível via URL pública.

---

## Etapa 10: Melhorias do Guia Público do Hóspede ✅

**Status:** Concluído

**Objetivo:** Elevar a experiência do guia público de funcional para acolhedora, clara e orientada por prioridade.

**Arquivos afetados:**
- Criar: `src/components/shared/guide-page-template.tsx`
- Criar: `src/components/shared/guide-bottom-bar.tsx`
- Modificar: `src/app/g/[slug]/page.tsx`
- Modificar: `src/app/g/[slug]/check-in/page.tsx`
- Modificar: `src/app/g/[slug]/check-out/page.tsx`
- Modificar: `src/app/g/[slug]/wifi/page.tsx`
- Modificar: `src/app/g/[slug]/contatos/page.tsx`
- Modificar: `src/app/g/[slug]/regras/page.tsx`
- Modificar: `src/app/g/[slug]/equipamentos/page.tsx`
- Modificar: `src/app/g/[slug]/dicas/page.tsx`
- Modificar: `src/app/g/[slug]/links/page.tsx`

**O que fazer:**

### 1. Template Unificado
- Criar `GuidePageTemplate` com header padronizado, botão voltar, bottom bar sticky
- Hierarquia visual: card primário (info essencial, destaque) vs card secundário
- Skip-to-content link para acessibilidade

### 2. Check-in
- Timeline visual: "Antes de chegar" → "Na chegada" → "Durante a estadia"
- Card primário com horário em destaque grande
- Botão "Copiar endereço" + "Abrir no Maps"
- Card de método de acesso com ícone semântico

### 3. Check-out
- Checklist interativo com checkboxes (persiste no localStorage)
- Card primário com horário em destaque
- Timeline: "No dia da saída" → "Antes de sair" → "Após a saída"

### 4. Contatos
- Separar em 3 grupos: Anfitrião (destaque especial), Suporte, Emergência
- Anfitrião sempre primeiro, independente da ordem no banco
- Cards com botões de ação direta: "Ligar", "WhatsApp", "E-mail"

### 5. Regras
- Reformular linguagem negativa para positiva ("Não permitido" → "Ambiente livre de fumaça")
- Ícones semânticos por tipo de regra
- Destacar silêncio e visitas como texto contextual

### 6. Equipamentos
- Mapear tipos para ícones corretos (ar-condicionado, geladeira, cafeteira, etc.)
- Badge de cômodo se disponível

### 7. Dicas da Região
- Botão "Como chegar" com Google Maps por dica
- Badge de distância com ícone de rota
- Layout mais card-based

### 8. Links Úteis
- Ícones semânticos por tipo de link

### 9. Hub
- Barra flutuante no mobile com botão "Chamar anfitrião" persistente

**Critério de aceite:** O guia público transmite acolhimento, as informações mais importantes se destacam visualmente, e o hóspede consegue completar suas tarefas principais (chegar, conectar Wi-Fi, contatar anfitrião) em no máximo 3 toques.

---

## Etapa 11: Deploy em Produção (Neon + Railway + GitHub) 🔄

**Status:** Em progresso

**Objetivo:** Subir a aplicação para produção com banco PostgreSQL persistente, hospedagem na Railway e CI/CD no GitHub.

**Arquivos afetados:**
- Criar: `DEPLOY_PROD.md`
- Criar: `.github/workflows/ci.yml`
- Modificar: `prisma/schema.prisma`
- Modificar: `prisma.config.ts`
- Modificar: `next.config.ts`
- Modificar: `nixpacks.toml`
- Modificar: `.env.example`
- Criar: `prisma/migrations/20260421_init_postgres/migration.sql`

**O que fazer:**

### 1. Neon (PostgreSQL)
- [x] Criar projeto no Neon
- [x] Copiar `DATABASE_URL`
- [ ] Adicionar IP do Railway na allowlist (se necessário)
- [ ] Aplicar migration no Neon
- [ ] Rodar seed no Neon

### 2. Prisma
- [x] Alterar `provider` de `"sqlite"` para `"postgresql"`
- [x] Backup migrations SQLite
- [x] Criar nova migration para PostgreSQL
- [ ] Testar localmente com PostgreSQL (Docker ou Neon dev branch)

### 3. Next.js
- [x] Adicionar `output: 'standalone'` no `next.config.ts`
- [x] Atualizar `nixpacks.toml` para build de produção
- [x] Atualizar `.env.example` com template de produção

### 4. GitHub
- [ ] Criar repositório no GitHub
- [ ] Push do código para `main`
- [x] Criar workflow de CI (`.github/workflows/ci.yml`)
- [ ] Verificar CI passando

### 5. Railway
- [ ] Criar projeto no Railway
- [ ] Conectar repositório GitHub
- [ ] Configurar variáveis de ambiente (`DATABASE_URL`, `NEXTAUTH_SECRET`, etc.)
- [ ] Deploy inicial
- [ ] Obter URL pública
- [ ] Atualizar `NEXTAUTH_URL` e `NEXT_PUBLIC_APP_URL`

### 6. Validação
- [ ] Testar login com usuário de demo
- [ ] Criar imóvel pelo stepper
- [ ] Publicar guia
- [ ] Acessar guia público
- [ ] Verificar persistência após novo deploy

**Critério de aceite:** A aplicação está acessível via URL pública, dados persistem entre deploys, e o guia público funciona corretamente.

---

## Ordem de Execução

```
Etapa 1 → Etapa 2 → Etapa 3 → Etapa 4 → Etapa 5 → Etapa 6 → Etapa 7 → Etapa 8 → Etapa 9 → Etapa 10 → Etapa 11
```

Cada etapa deve ser executada individualmente. Após completar uma etapa:
1. Rodar `npm run build` para verificar que compila
2. Rodar `npm run typecheck` para verificar tipos
3. Testar manualmente no browser
4. Reportar resultado ao usuário
5. Aguardar aprovação antes de avançar

---

## Decisão Arquitetural: Server Actions

Todas as mutações de dados (criar, editar, excluir) usarão **Next.js Server Actions** ao invés de API routes tradicionais. Vantagens:
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
```

Cada Server Action seguirá o padrão:
```typescript
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
// ... zod schemas, ação, retorno tipado
```
