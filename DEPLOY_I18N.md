# Deploy do Multilinguismo

## 1. Aplicar migration no banco (obrigatorio)

O ambiente local nao consegue acessar o banco remoto (Neon). Aplique o SQL diretamente no console do Neon:

### Opcao A: Console do Neon (recomendado)
1. Acesse https://console.neon.tech
2. Selecione seu projeto
3. Va em "SQL Editor"
4. Cole e execute:

```sql
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "translations" JSONB;
```

### Opcao B: CLI (se tiver psql instalado)
```bash
psql "sua-database-url" -f prisma/migrations/add_translations_column.sql
```

## 2. Configurar API de traducao (opcional — padrao ja funciona gratis!)

O sistema ja vem configurado com **LibreTranslate** como provedor padrao. Ele e:
- **100% gratuito**
- **Open-source**
- **Nao precisa de cadastro nem cartao de credito**
- Funciona sem configurar nenhuma variavel extra

Se quiser usar outro provedor, adicione no `.env` do Railway:

### Opcao A: LibreTranslate (padrao, recomendado, gratis)
Nao precisa configurar nada! Ja funciona assim:
```env
TRANSLATION_API_PROVIDER=libretranslate
```

Se quiser usar uma instancia propria (self-hosted):
```env
TRANSLATION_API_PROVIDER=libretranslate
LIBRETRANSLATE_URL=https://seu-servidor.com/translate
```

### Opcao B: DeepL (requer chave de API)
A DeepL tem uma **API Free** separada do plano Free do tradutor web:
1. Va em https://www.deepl.com/pro-api
2. Crie uma conta de **DeepL API Free**
3. Copie a chave (termina em `:fx`)
```env
TRANSLATION_API_PROVIDER=deepl
TRANSLATION_API_KEY=sua-chave-fx
```
Limite: 500.000 caracteres/mes gratis.

### Opcao C: Google Translate (requer chave de API)
```env
TRANSLATION_API_PROVIDER=google
TRANSLATION_API_KEY=sua-chave-do-google-cloud
```
Requer projeto no Google Cloud com billing ativado.

## 3. Deploy no Railway

O build ja passou localmente. Basta fazer o deploy normal:

```bash
# Se estiver usando git no projeto
git add .
git commit -m "feat: multilinguismo pt/en/es nas guias"
git push
```

O Railway vai detectar o push e fazer o deploy automaticamente.

## 4. Testar

1. Acesse uma guia publica (ex: `/g/nome-do-imovel`)
2. Clique nas bandeirinhas no header para trocar o idioma
3. No dashboard, va em um imovel > Guia > "Traduções"
4. Teste gerar traducoes automaticamente (funciona gratis com LibreTranslate)

## 5. Rollback (se necessario)

```sql
ALTER TABLE "properties" DROP COLUMN IF EXISTS "translations";
```
