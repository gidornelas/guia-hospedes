# Regras para Agentes de IA

## Segurança de Secrets

- NUNCA leia, exiba ou compartilhe o conteúdo de arquivos .env, .env.local ou qualquer arquivo *.secret, *.key, *.pem
- NUNCA inclua senhas, tokens, API keys ou credenciais em respostas ou commits
- Se precisar referenciar uma variável de ambiente, use o 이름 da variável (ex: DATABASE_URL) sem o valor
- Use .env.example como referência para variáveis disponíveis — ele contém apenas valores placeholder
- Valores reais ficam apenas no arquivo .env local (gitignored) ou no dashboard da plataforma de deploy

## Estrutura do Projeto

- Stack: Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui + Prisma ORM + SQLite + NextAuth v5
- Interface em português do Brasil
- Banco de dados: SQLite (dev) / PostgreSQL (prod, via Prisma)
- Autenticação: NextAuth v5 com Credentials Provider e demo users hardcoded
- Variáveis de ambiente: ler de process.env diretamente, sem SDK externo

## Comandos

- 
pm run dev — servidor de desenvolvimento
- 
pm run build — build de produção
- 
pm run db:seed — popular banco com dados demo
- 
pm run typecheck — verificar tipos TypeScript
- 
pm run lint — executar ESLint
- 
pm run lint:fix — corrigir problemas do ESLint

## Convenções

- Sempre executar 
pm run build após fazer mudanças para verificar
- Comentários em código apenas quando necessário
- Não criar arquivos .md de documentação a menos que explicitamente pedido
- Seguir padrões existentes no codebase
- Não comitar mudanças a menos que o usuário peça explicitamente
