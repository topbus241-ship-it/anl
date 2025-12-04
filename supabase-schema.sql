-- TOPBUS - Schema de Sinistros
-- Execute este SQL no Supabase Dashboard > SQL Editor

-- Tabela principal de sinistros
CREATE TABLE IF NOT EXISTS public.sinistros (
    id SERIAL PRIMARY KEY,
    protocolo VARCHAR(50) UNIQUE NOT NULL,
    data_hora TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    empresa VARCHAR(20) DEFAULT 'TOPBUS',
    local_acidente TEXT NOT NULL,
    onibus VARCHAR(20) NOT NULL,
    motorista VARCHAR(100) NOT NULL,
    chapa VARCHAR(20),
    responsabilidade VARCHAR(20) CHECK (responsabilidade IN ('motorista', 'terceiro')),
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de testemunhas
CREATE TABLE IF NOT EXISTS public.testemunhas (
    id SERIAL PRIMARY KEY,
    sinistro_id INTEGER REFERENCES public.sinistros(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de imagens
CREATE TABLE IF NOT EXISTS public.imagens (
    id SERIAL PRIMARY KEY,
    sinistro_id INTEGER REFERENCES public.sinistros(id) ON DELETE CASCADE,
    nome_arquivo VARCHAR(255) NOT NULL,
    url_publica TEXT,
    path_storage TEXT,
    tamanho INTEGER,
    tipo_mime VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_sinistros_protocolo ON public.sinistros(protocolo);
CREATE INDEX IF NOT EXISTS idx_sinistros_data ON public.sinistros(data_hora);
CREATE INDEX IF NOT EXISTS idx_testemunhas_sinistro ON public.testemunhas(sinistro_id);
CREATE INDEX IF NOT EXISTS idx_imagens_sinistro ON public.imagens(sinistro_id);

-- Row Level Security (RLS)
ALTER TABLE public.sinistros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testemunhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imagens ENABLE ROW LEVEL SECURITY;

-- Policies (permitir acesso público para o sistema TOPBUS)
CREATE POLICY "Allow all access to sinistros" ON public.sinistros FOR ALL USING (true);
CREATE POLICY "Allow all access to testemunhas" ON public.testemunhas FOR ALL USING (true);
CREATE POLICY "Allow all access to imagens" ON public.imagens FOR ALL USING (true);

-- Storage bucket para imagens
INSERT INTO storage.buckets (id, name, public) VALUES ('sinistros', 'sinistros', true) ON CONFLICT DO NOTHING;

-- Policy para o bucket
CREATE POLICY "Allow public uploads" ON storage.objects FOR ALL USING (bucket_id = 'sinistros');