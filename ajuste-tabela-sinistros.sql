-- TOPBUS - Ajuste da estrutura da tabela sinistros
-- Execute no Supabase SQL Editor

-- 1. Verificar colunas atuais
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'sinistros' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Adicionar colunas que podem estar faltando (se não existirem)
DO $"$$" 
BEGIN
    -- Verificar se coluna 'local' existe, senão adicionar
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sinistros' 
        AND column_name = 'local' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.sinistros ADD COLUMN local TEXT;
    END IF;
    
    -- Verificar se coluna 'terceiro' existe, senão adicionar
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sinistros' 
        AND column_name = 'terceiro' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.sinistros ADD COLUMN terceiro TEXT;
    END IF;
    
    -- Verificar se coluna 'testemunhas' existe, senão adicionar
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sinistros' 
        AND column_name = 'testemunhas' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.sinistros ADD COLUMN testemunhas JSONB DEFAULT '[]';
    END IF;
    
    -- Verificar se coluna 'fotos' existe, senão adicionar
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sinistros' 
        AND column_name = 'fotos' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.sinistros ADD COLUMN fotos JSONB DEFAULT '[]';
    END IF;
    
    -- Verificar se coluna 'status' existe, senão adicionar
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sinistros' 
        AND column_name = 'status' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.sinistros ADD COLUMN status VARCHAR(20) DEFAULT 'pendente';
    END IF;
END
$"$$";

-- 3. Atualizar dados existentes se necessário
UPDATE public.sinistros 
SET 
    local = local_acidente 
WHERE local IS NULL AND local_acidente IS NOT NULL;

-- 4. Verificar dados inseridos
SELECT 
    id,
    protocolo,
    empresa,
    local,
    onibus,
    motorista,
    chapa,
    status,
    jsonb_array_length(COALESCE(fotos, '[]'::jsonb)) as num_fotos,
    created_at
FROM public.sinistros 
ORDER BY created_at DESC 
LIMIT 5;

-- 5. Contar registros por status
SELECT 
    status,
    COUNT(*) as quantidade
FROM public.sinistros 
GROUP BY status
ORDER BY quantidade DESC;