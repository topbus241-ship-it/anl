-- ============================================================
-- TOPBUS - Schema Seguro de Sinistros com RLS
-- ============================================================
-- Execute este SQL no Supabase Dashboard > SQL Editor
-- Siga a ordem abaixo para evitar erros de dependência

-- ============================================================
-- 1. CRIAR TABELAS (sem RLS inicialmente)
-- ============================================================

-- Tabela principal de sinistros
CREATE TABLE IF NOT EXISTS public.sinistros (
    id BIGSERIAL PRIMARY KEY,
    protocolo VARCHAR(50) UNIQUE NOT NULL,
    data_hora TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    empresa VARCHAR(20) NOT NULL CHECK (empresa IN ('TOPBUS', 'BELO_MONTE')),
    local_acidente TEXT NOT NULL,
    onibus VARCHAR(20) NOT NULL,
    motorista VARCHAR(100) NOT NULL,
    chapa VARCHAR(20),
    responsabilidade VARCHAR(20) NOT NULL CHECK (responsabilidade IN ('MOTORISTA_TOPBUS', 'TERCEIRO')),
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID DEFAULT auth.uid(),
    is_public BOOLEAN DEFAULT false
);

-- Tabela de testemunhas
CREATE TABLE IF NOT EXISTS public.testemunhas (
    id BIGSERIAL PRIMARY KEY,
    sinistro_id BIGINT NOT NULL REFERENCES public.sinistros(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de imagens (arquivo de metadados)
CREATE TABLE IF NOT EXISTS public.imagens (
    id BIGSERIAL PRIMARY KEY,
    sinistro_id BIGINT NOT NULL REFERENCES public.sinistros(id) ON DELETE CASCADE,
    nome_arquivo VARCHAR(255) NOT NULL,
    url_publica TEXT,
    path_storage VARCHAR(255),
    tamanho INTEGER,
    tipo_mime VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 2. CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================================

CREATE INDEX idx_sinistros_protocolo ON public.sinistros(protocolo);
CREATE INDEX idx_sinistros_data ON public.sinistros(data_hora);
CREATE INDEX idx_sinistros_empresa ON public.sinistros(empresa);
CREATE INDEX idx_sinistros_created_by ON public.sinistros(created_by);
CREATE INDEX idx_testemunhas_sinistro ON public.testemunhas(sinistro_id);
CREATE INDEX idx_imagens_sinistro ON public.imagens(sinistro_id);

-- ============================================================
-- 3. HABILITAR ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.sinistros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testemunhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imagens ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. CRIAR POLICIES SEGURAS
-- ============================================================

-- Para sinistros públicos (apenas leitura sem autenticação)
CREATE POLICY "Permitir leitura de sinistros públicos" 
ON public.sinistros 
FOR SELECT 
USING (is_public = true);

-- Para sinistros autenticados (criador pode ler/atualizar/deletar)
CREATE POLICY "Criador pode gerenciar seus sinistros" 
ON public.sinistros 
FOR ALL 
USING (
    auth.role() = 'authenticated' AND 
    (created_by = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
)
WITH CHECK (
    auth.role() = 'authenticated' AND 
    (created_by = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
);

-- Para inserção de novos sinistros (requer autenticação)
CREATE POLICY "Autenticados podem inserir sinistros" 
ON public.sinistros 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Testemunhas: herdam política do sinistro relacionado
CREATE POLICY "Leitura de testemunhas conforme sinistro" 
ON public.testemunhas 
FOR SELECT 
USING (
    sinistro_id IN (
        SELECT id FROM public.sinistros 
        WHERE is_public = true OR 
              (auth.role() = 'authenticated' AND (created_by = auth.uid() OR auth.jwt() ->> 'role' = 'admin'))
    )
);

CREATE POLICY "Gerenciar testemunhas conforme sinistro" 
ON public.testemunhas 
FOR ALL 
USING (
    sinistro_id IN (
        SELECT id FROM public.sinistros 
        WHERE auth.role() = 'authenticated' AND 
              (created_by = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
);

-- Imagens: herdam política do sinistro relacionado
CREATE POLICY "Leitura de imagens conforme sinistro" 
ON public.imagens 
FOR SELECT 
USING (
    sinistro_id IN (
        SELECT id FROM public.sinistros 
        WHERE is_public = true OR 
              (auth.role() = 'authenticated' AND (created_by = auth.uid() OR auth.jwt() ->> 'role' = 'admin'))
    )
);

CREATE POLICY "Gerenciar imagens conforme sinistro" 
ON public.imagens 
FOR ALL 
USING (
    sinistro_id IN (
        SELECT id FROM public.sinistros 
        WHERE auth.role() = 'authenticated' AND 
              (created_by = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
);

-- ============================================================
-- 5. STORAGE - Bucket para imagens (execute no Dashboard)
-- ============================================================
-- Ir para: Storage > Buckets > New Bucket
-- Nome: "sinistros"
-- Public (deixar sem marcar - vamos usar policies)

-- SQL para criar via SQL Editor:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sinistros', 'sinistros', false) 
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. STORAGE POLICIES - RLS para Upload Seguro
-- ============================================================

-- Permitir leitura pública de imagens (opcional, depende da política)
CREATE POLICY "Leitura pública de imagens" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'sinistros' AND (storage.foldername(name))[1] = 'public');

-- Permitir upload apenas para autenticados
CREATE POLICY "Upload de sinistros para autenticados" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
    bucket_id = 'sinistros' AND 
    auth.role() = 'authenticated'
);

-- Deletar apenas próprios uploads
CREATE POLICY "Deletar uploads pessoais" 
ON storage.objects 
FOR DELETE 
USING (
    bucket_id = 'sinistros' AND 
    auth.role() = 'authenticated' AND 
    owner = auth.uid()
);

-- ============================================================
-- 7. TRIGGERS PARA AUDITORIA (Opcional)
-- ============================================================

-- Criar tabela de auditoria
CREATE TABLE IF NOT EXISTS public.sinistros_audit (
    id BIGSERIAL PRIMARY KEY,
    sinistro_id BIGINT NOT NULL REFERENCES public.sinistros(id) ON DELETE CASCADE,
    acao VARCHAR(50) NOT NULL,
    usuario_id UUID,
    dados_anteriores JSONB,
    dados_novos JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_sinistro ON public.sinistros_audit(sinistro_id);

-- Trigger para auditoria de alterações
CREATE OR REPLACE FUNCTION audit_sinistros()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.sinistros_audit (sinistro_id, acao, usuario_id, dados_novos)
        VALUES (NEW.id, 'INSERT', auth.uid(), row_to_json(NEW));
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.sinistros_audit (sinistro_id, acao, usuario_id, dados_anteriores, dados_novos)
        VALUES (NEW.id, 'UPDATE', auth.uid(), row_to_json(OLD), row_to_json(NEW));
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.sinistros_audit (sinistro_id, acao, usuario_id, dados_anteriores)
        VALUES (OLD.id, 'DELETE', auth.uid(), row_to_json(OLD));
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_sinistros
AFTER INSERT OR UPDATE OR DELETE ON public.sinistros
FOR EACH ROW
EXECUTE FUNCTION audit_sinistros();

-- ============================================================
-- 8. FUNÇÕES AUXILIARES SEGURAS
-- ============================================================

-- Função para contar sinistros (visível apenas para usuários autenticados)
CREATE OR REPLACE FUNCTION count_sinistros_user()
RETURNS INTEGER AS $$
BEGIN
    IF auth.role() != 'authenticated' THEN
        RETURN 0;
    END IF;
    
    RETURN (
        SELECT COUNT(*) FROM public.sinistros 
        WHERE created_by = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- PRÓXIMAS ETAPAS
-- ============================================================
-- 1. Ir para Authentication > Users > Invite
-- 2. Criar usuários para os administradores
-- 3. Definir roles (admin, user) via JWT claims
-- 4. Configurar CORS no painel do Supabase
-- 5. Testar policies com usuários teste
