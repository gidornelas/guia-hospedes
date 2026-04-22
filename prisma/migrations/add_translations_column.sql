-- Migration: Adicionar coluna translations na tabela properties
-- Aplicar no console SQL do Neon (ou via psql)

ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "translations" JSONB;

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' AND column_name = 'translations';
