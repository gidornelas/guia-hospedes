# Regras para Agentes de IA

## Seguranca de secrets

- Nunca leia, exiba ou compartilhe o conteudo de `.env`, `.env.local` ou qualquer arquivo de credencial.
- Nunca inclua senhas, tokens, API keys ou conexoes reais em respostas ou commits.
- Quando precisar citar configuracao, use apenas o nome da variavel, sem o valor.
- Use `.env.example` como referencia publica.

## Estrutura atual do projeto

- Stack: Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui (base-ui) + Prisma ORM + PostgreSQL
- Interface em portugues do Brasil
- Banco de dados: PostgreSQL
- Autenticacao: fluxo manual com JWT em cookie HTTP-only
- Auth implementado: login por senha, cadastro real, Google OAuth, lembrar sessao e recuperacao de senha
- Variaveis de ambiente: leitura direta de `process.env`

## Funcionalidades implementadas

- CRUD completo de imoveis com guia digital
- Publicacao/despublicacao de guia com slug publico
- Compartilhamento via WhatsApp, E-mail, Link e QR Code
- QR Code gerado com `react-qr-code`
- Modelos de mensagem personalizaveis (templates)
- Analytics com dados reais (acessos, compartilhamentos, canais)
- Sistema de reservas (booking) com check-in/check-out
- Geracao de PDF do guia com `@react-pdf/renderer`
- **Multilinguismo nas guias (PT/EN/ES)** com seletor de idioma, traducao automatica (LibreTranslate padrao, DeepL, Google) e editor manual
- Landing page completa (14 componentes)
- Tela de configuracoes da organizacao
- Integracoes (Airbnb, WhatsApp, E-mail, Storage)

## Esquema de Traducoes (Multilinguismo)

### Modelo de dados
O campo `Property.translations` (JSONB no PostgreSQL) armazena traducoes aninhadas por locale:
```
{
  "pt-BR": {},
  "en": { "welcomeMessage": "...", "checkIn": { "instructions": "..." }, ... },
  "es": { ... }
}
```

### Campos traduziveis
- Property: welcomeMessage, shortDescription
- CheckIn/CheckOut: instructions, accessMethod, notes, exitChecklist
- WiFi: notes
- Rules: silence, visits, trash, equipmentUse, notes
- Devices: name, instructions
- Contacts: name
- Recommendations: name, description
- Links: label

### Fluxo de fallback
1. Hospede abre guia → idioma default PT-BR
2. Troca idioma via bandeirinhas → salvo em localStorage + URL `?lang=`
3. Renderizacao: busca traducao no JSON → se nao encontrar, usa valor original em PT

### Provedores de traducao automatica
- LibreTranslate (padrao, gratis, open-source, sem chave)
- DeepL API Free/Pro (requer TRANSLATION_API_KEY)
- Google Translate (requer TRANSLATION_API_KEY)

### Arquivos principais
- `src/lib/i18n/` — dicionarios pt-BR.ts, en.ts, es.ts, types.ts, index.ts
- `src/lib/translate.ts` — helpers getPropertyTranslations, translateField, translatePath
- `src/lib/translation-api.ts` — integracao com APIs de traducao
- `src/app/actions/translations.ts` — Server Actions generateTranslations, updatePropertyTranslations
- `src/components/shared/language-provider.tsx` — React Context + localStorage
- `src/components/shared/language-switcher.tsx` — bandeirinhas no header

## Comandos mais usados

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de producao
- `npm run db:generate` — gerar Prisma Client
- `npm run db:push` — sincronizar schema com banco
- `npm run db:seed` — popular dados iniciais do produto
- `npm run typecheck` — verificar tipos TypeScript
- `npm run lint` — executar ESLint

## Convencoes

- Rodar `npm run build` antes de considerar uma frente concluida
- Evitar comentarios desnecessarios no codigo
- Nao criar documentacao nova sem necessidade real ou pedido explicito
- Seguir os padroes existentes do codebase
- Nao comitar nem fazer push sem pedido explicito do usuario
