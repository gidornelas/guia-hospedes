# Setup de autenticacao

Este projeto agora usa autenticacao real com:

- login por e-mail e senha
- cadastro de conta real
- login com Google
- manter conectado
- esqueci a senha
- redefinicao de senha por token

## 1. Atualizar o banco

Depois de puxar estas mudancas, rode:

```bash
npm run db:generate
npm run db:push
```

Se quiser popular dados de exemplo do produto sem criar usuarios de login prontos:

```bash
npm run db:seed
```

Observacao:
- o seed continua criando organizacoes, imoveis, guias e templates
- o seed nao cria mais usuarios demo

## 2. Criar sua primeira conta

Com a aplicacao rodando, abra:

- `http://localhost:3000/cadastro`

Preencha:

- nome completo
- e-mail real
- senha
- nome da operacao ou empresa, se quiser

Ao finalizar, a conta ja entra autenticada e cria uma organizacao inicial automaticamente.

## 3. Configurar login com Google

### No Google Cloud Console

1. Acesse `https://console.cloud.google.com/`
2. Crie ou selecione um projeto.
3. Configure a tela de consentimento OAuth.
4. Crie uma credencial do tipo `OAuth Client ID`.
5. Escolha `Web application`.

### Authorized redirect URIs

Use exatamente estas URLs:

- local: `http://localhost:3000/api/auth/google/callback`
- producao: `https://SEU-DOMINIO/api/auth/google/callback`

### Variaveis de ambiente

Preencha no `.env` local e no provedor de deploy:

```env
GOOGLE_CLIENT_ID="seu-client-id"
GOOGLE_CLIENT_SECRET="seu-client-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="um-secret-forte"
```

Em producao, troque `http://localhost:3000` pela URL real do app.

## 4. Configurar recuperacao de senha por e-mail

Para enviar o link de redefinicao de verdade, configure SMTP:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-de-app"
EMAIL_FROM="seu-email@gmail.com"
```

### Se usar Gmail

1. Ative verificacao em duas etapas na conta Google.
2. Gere uma `App Password`.
3. Use essa senha em `SMTP_PASS`.

Sem SMTP configurado:

- em desenvolvimento o sistema nao quebra
- o endpoint devolve um `previewUrl`
- a tela de "Esqueci a senha" mostra esse link para teste local

Em producao:

- se SMTP nao estiver configurado, o envio de e-mail falha por seguranca

## 5. Variaveis minimas para ambiente local

```env
DATABASE_URL="postgresql://usuario:senha@host/database?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="troque-por-um-secret-forte"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
EMAIL_FROM="noreply@guiahospedes.com"
```

## 6. Fluxos disponiveis

- `/login`: login por senha + botao Google + manter conectado
- `/cadastro`: criacao de conta real
- `/esqueci-senha`: solicita link de redefinicao
- `/redefinir-senha?token=...`: troca de senha

## 7. Checklist rapido

- [ ] Rodei `npm run db:generate`
- [ ] Rodei `npm run db:push`
- [ ] Ajustei `.env`
- [ ] Criei a primeira conta em `/cadastro`
- [ ] Testei login por e-mail e senha
- [ ] Testei login com Google
- [ ] Testei esqueci a senha
