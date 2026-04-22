# Documentacao do GuiaHospedes

## Visao geral

GuiaHospedes e uma plataforma SaaS para criacao, publicacao e compartilhamento de guias digitais para imoveis de hospedagem. O produto combina:

- landing publica para captacao
- dashboard autenticado para operacao
- guias publicos para hospedes
- compartilhamento por WhatsApp, e-mail, link e QR Code

## Stack atual

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16 + React 19 + TypeScript |
| UI | Tailwind CSS 4 + shadcn/ui + Lucide |
| Backend | App Router + API Routes |
| Banco | PostgreSQL |
| ORM | Prisma |
| Sessao | JWT em cookie HTTP-only |
| Senhas | bcryptjs |
| E-mail | Nodemailer |

## Autenticacao atual

O projeto nao usa NextAuth em runtime. A autenticacao atual e manual, com sessao JWT e cookies seguros.

Fluxos implementados:

- `/login`: login com e-mail e senha
- `/cadastro`: criacao de conta real
- `/api/auth/google`: login com Google OAuth
- `/esqueci-senha`: solicitacao de redefinicao
- `/redefinir-senha?token=...`: troca de senha
- `manter conectado`: controla duracao da sessao

O schema agora suporta:

- `User.password` opcional
- `User.googleId`
- `User.emailVerifiedAt`
- `PasswordResetToken`

## Estrutura principal

```text
guia-hospedes/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── api/auth/
│   │   ├── app/
│   │   ├── cadastro/
│   │   ├── esqueci-senha/
│   │   ├── g/
│   │   ├── login/
│   │   └── redefinir-senha/
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── shared/
│   │   └── ui/
│   └── lib/
│       ├── auth.ts
│       ├── db.ts
│       ├── env.ts
│       ├── mailer.ts
│       └── session.ts
├── docs/
│   ├── autenticacao_setup.md
│   ├── frontend_qa_checklist.md
│   └── plano_frontend.md
└── README.md
```

## Modulos entregues

### Landing

- landing reestruturada
- CTA persistente no mobile
- links e ancoras corrigidos
- paleta de marca aplicada com base neutra

### Dashboard

- shell responsiva com sidebar/drawer
- headers e action bars melhorados
- listas e detalhes de imoveis refinados
- preview do guia adaptativo
- telas de analytics, integracoes, configuracoes, guias e modelos revisadas

### Guia publico

- hub principal e subpaginas mobile-first
- estados vazios mais guiados
- contato rapido com anfitriao
- copy actions e cards mais claros

### Compartilhamento

- WhatsApp, e-mail, link e QR Code
- historico no banco
- preview mais orientado por tarefa

## Seed

`npm run db:seed` continua populando:

- organizacoes
- imoveis
- guias
- templates
- logs e integracoes de exemplo

Mas nao cria mais usuarios demo para login.

## Arquivos importantes

- [README.md](README.md): inicio rapido
- [docs/autenticacao_setup.md](docs/autenticacao_setup.md): Google OAuth e SMTP
- [docs/plano_frontend.md](docs/plano_frontend.md): roadmap e execucao do frontend
- [docs/frontend_qa_checklist.md](docs/frontend_qa_checklist.md): checklist visual
- [DEPLOY_RAPIDO.md](DEPLOY_RAPIDO.md): checklist operacional do Railway
- [DEPLOY_PROD.md](DEPLOY_PROD.md): guia de deploy em producao

## Observacoes operacionais

- `npm run build` e a validacao principal antes de deploy
- `npm run typecheck` pode esbarrar ocasionalmente em artefatos gerados pelo Next dentro de `.next/types`
- o deploy atual e feito no Railway com banco PostgreSQL
