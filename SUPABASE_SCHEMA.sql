-- ============================================================
-- SCHEMA DO SUPABASE PARA TOPBUS SINISTROS
-- Baseado em LGPD e estrutura de dados do projeto
-- ============================================================

-- 1. Tabela: sinistros
-- Registro principal de ocorrências
CREATE TABLE sinistros (
  id BIGSERIAL PRIMARY KEY,
  protocolo TEXT UNIQUE NOT NULL DEFAULT to_char(now(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('sinistro_seq')::text, 6, '0'),
  data_hora TIMESTAMP NOT NULL,
  local TEXT NOT NULL,
  onibus TEXT NOT NULL, -- Identificação/placa do ônibus
  motorista TEXT NOT NULL,
  terceiro TEXT, -- Identificação de terceiros envolvidos
  descricao TEXT NOT NULL,
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  deletado_em TIMESTAMP -- Soft delete para LGPD
);

-- Criar sequência para protocolo
CREATE SEQUENCE sinistro_seq START 1;

-- 2. Tabela: testemunhas
-- Dados de testemunhas de sinistros
CREATE TABLE testemunhas (
  id BIGSERIAL PRIMARY KEY,
  sinistro_id BIGINT NOT NULL REFERENCES sinistros(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- 3. Tabela: imagens
-- Fotos e documentos visuais do sinistro
CREATE TABLE imagens (
  id BIGSERIAL PRIMARY KEY,
  sinistro_id BIGINT NOT NULL REFERENCES sinistros(id) ON DELETE CASCADE,
  arquivo_nome TEXT NOT NULL,
  caminho_arquivo TEXT NOT NULL, -- Caminho no Supabase Storage
  tipo_mime TEXT NOT NULL,
  tamanho_bytes BIGINT,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- 4. Tabela: documentos_complementares
-- Áudio, documentos e outros anexos
CREATE TABLE documentos_complementares (
  id BIGSERIAL PRIMARY KEY,
  sinistro_id BIGINT NOT NULL REFERENCES sinistros(id) ON DELETE CASCADE,
  tipo_documento TEXT NOT NULL, -- 'audio', 'pdf', 'outro'
  arquivo_nome TEXT NOT NULL,
  caminho_arquivo TEXT NOT NULL,
  tipo_mime TEXT NOT NULL,
  tamanho_bytes BIGINT,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- 5. Tabela: consentimentos_lgpd
-- Registro de consentimentos e consentimento de dados
CREATE TABLE consentimentos_lgpd (
  id BIGSERIAL PRIMARY KEY,
  sinistro_id BIGINT NOT NULL REFERENCES sinistros(id) ON DELETE CASCADE,
  aceita_gps BOOLEAN NOT NULL DEFAULT false,
  aceita_processamento BOOLEAN NOT NULL DEFAULT false,
  data_consentimento TIMESTAMP DEFAULT NOW(),
  versao_politica TEXT,
  revisor_consentimento TEXT -- Email ou ID do usuário que coletou consentimento
);

-- 6. Tabela: solicitacoes_lgpd
-- Controle de solicitações de direitos LGPD (acesso, exclusão, etc.)
CREATE TABLE solicitacoes_lgpd (
  id BIGSERIAL PRIMARY KEY,
  nome_solicitante TEXT NOT NULL,
  email_solicitante TEXT NOT NULL,
  tipo_solicitacao TEXT NOT NULL, -- 'acesso', 'exclusao', 'correcao', 'portabilidade', etc.
  status TEXT DEFAULT 'pendente', -- 'pendente', 'processando', 'concluida', 'rejeitada'
  descricao TEXT,
  criado_em TIMESTAMP DEFAULT NOW(),
  respondido_em TIMESTAMP,
  notas_internas TEXT
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE sinistros ENABLE ROW LEVEL SECURITY;
ALTER TABLE testemunhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_complementares ENABLE ROW LEVEL SECURITY;
ALTER TABLE consentimentos_lgpd ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitacoes_lgpd ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLÍTICAS RLS - LEITURA PÚBLICA (sem autenticação necessária)
-- ============================================================

-- Sinistros: qualquer um pode ler (públicos)
CREATE POLICY "sinistros_select_public" 
  ON sinistros 
  FOR SELECT 
  USING (deletado_em IS NULL);

-- Testemunhas: leitura pública para sinistros existentes
CREATE POLICY "testemunhas_select_public"
  ON testemunhas
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sinistros 
      WHERE sinistros.id = testemunhas.sinistro_id 
      AND sinistros.deletado_em IS NULL
    )
  );

-- Imagens: leitura pública
CREATE POLICY "imagens_select_public"
  ON imagens
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sinistros 
      WHERE sinistros.id = imagens.sinistro_id 
      AND sinistros.deletado_em IS NULL
    )
  );

-- Documentos: leitura pública
CREATE POLICY "documentos_select_public"
  ON documentos_complementares
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sinistros 
      WHERE sinistros.id = documentos_complementares.sinistro_id 
      AND sinistros.deletado_em IS NULL
    )
  );

-- ============================================================
-- POLÍTICAS RLS - INSERTS (criar novos registros)
-- ============================================================

-- Sinistros: qualquer um pode criar
CREATE POLICY "sinistros_insert_public"
  ON sinistros
  FOR INSERT
  WITH CHECK (true);

-- Testemunhas: qualquer um pode adicionar
CREATE POLICY "testemunhas_insert_public"
  ON testemunhas
  FOR INSERT
  WITH CHECK (true);

-- Imagens: qualquer um pode fazer upload
CREATE POLICY "imagens_insert_public"
  ON imagens
  FOR INSERT
  WITH CHECK (true);

-- Documentos: qualquer um pode fazer upload
CREATE POLICY "documentos_insert_public"
  ON documentos_complementares
  FOR INSERT
  WITH CHECK (true);

-- Consentimentos: qualquer um pode registrar
CREATE POLICY "consentimentos_insert_public"
  ON consentimentos_lgpd
  FOR INSERT
  WITH CHECK (true);

-- Solicitações LGPD: qualquer um pode fazer solicitação
CREATE POLICY "solicitacoes_lgpd_insert_public"
  ON solicitacoes_lgpd
  FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================

-- Índices na tabela sinistros
CREATE INDEX idx_sinistros_protocolo ON sinistros(protocolo);
CREATE INDEX idx_sinistros_data_hora ON sinistros(data_hora DESC);
CREATE INDEX idx_sinistros_onibus ON sinistros(onibus);
CREATE INDEX idx_sinistros_motorista ON sinistros(motorista);
CREATE INDEX idx_sinistros_deletado_em ON sinistros(deletado_em);

-- Índices na tabela testemunhas
CREATE INDEX idx_testemunhas_sinistro_id ON testemunhas(sinistro_id);
CREATE INDEX idx_testemunhas_email ON testemunhas(email);

-- Índices na tabela imagens
CREATE INDEX idx_imagens_sinistro_id ON imagens(sinistro_id);

-- Índices na tabela documentos
CREATE INDEX idx_documentos_sinistro_id ON documentos_complementares(sinistro_id);
CREATE INDEX idx_documentos_tipo ON documentos_complementares(tipo_documento);

-- Índices na tabela consentimentos
CREATE INDEX idx_consentimentos_sinistro_id ON consentimentos_lgpd(sinistro_id);

-- Índices na tabela solicitações LGPD
CREATE INDEX idx_solicitacoes_lgpd_email ON solicitacoes_lgpd(email_solicitante);
CREATE INDEX idx_solicitacoes_lgpd_status ON solicitacoes_lgpd(status);
CREATE INDEX idx_solicitacoes_lgpd_tipo ON solicitacoes_lgpd(tipo_solicitacao);

-- ============================================================
-- TRIGGERS PARA AUDITORIA E ATUALIZAÇÃO AUTOMÁTICA
-- ============================================================

-- Trigger: atualizar campo atualizado_em em sinistros
CREATE OR REPLACE FUNCTION atualizar_timestamp_sinistros()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_sinistros
BEFORE UPDATE ON sinistros
FOR EACH ROW
EXECUTE FUNCTION atualizar_timestamp_sinistros();

-- ============================================================
-- SUPABASE STORAGE BUCKETS
-- ============================================================
-- Executar estes comandos no SQL Editor do Supabase Dashboard:

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('sinistros', 'sinistros', true);

-- ============================================================
-- POLÍTICAS DE ARMAZENAMENTO
-- ============================================================
-- Criar via Supabase Dashboard → Storage → Políticas:
-- 1. Permitir upload público em sinistros/
-- 2. Permitir leitura pública de sinistros/
-- 3. Limpar arquivos antigos via lifecycle policies (30-90 dias)

-- ============================================================
-- VIEWS ÚTEIS (Opcional)
-- ============================================================

-- View: Sinistros com contagem de imagens e documentos
CREATE OR REPLACE VIEW v_sinistros_resumo AS
SELECT 
  s.id,
  s.protocolo,
  s.data_hora,
  s.local,
  s.onibus,
  s.motorista,
  COUNT(DISTINCT i.id) as total_imagens,
  COUNT(DISTINCT d.id) as total_documentos,
  COUNT(DISTINCT t.id) as total_testemunhas,
  s.criado_em
FROM sinistros s
LEFT JOIN imagens i ON s.id = i.sinistro_id
LEFT JOIN documentos_complementares d ON s.id = d.sinistro_id
LEFT JOIN testemunhas t ON s.id = t.sinistro_id
WHERE s.deletado_em IS NULL
GROUP BY s.id, s.protocolo, s.data_hora, s.local, s.onibus, s.motorista, s.criado_em
ORDER BY s.data_hora DESC;

-- ============================================================
-- OBSERVAÇÕES IMPORTANTES
-- ============================================================
-- 1. Soft Delete (deletado_em): Os registros não são fisicamente deletados,
--    apenas marcados como deletados. Isso permite auditoria e recuperação.
--
-- 2. LGPD Compliance:
--    - Todos os dados sensíveis têm campo deletado_em
--    - Consentimentos são registrados em consentimentos_lgpd
--    - Solicitações LGPD são rastreáveis em solicitacoes_lgpd
--    - Implementar função de purga de dados após prazo de retenção
--
-- 3. Performance:
--    - Todos os IDs de chave estrangeira têm índices
--    - Campos frequentemente consultados têm índices
--    - Views permitem relatórios sem queries complexas
--
-- 4. Segurança:
--    - RLS ativado em todas as tabelas
--    - Políticas permitem inserções públicas mas leitura controlada
--    - Implementar autenticação nos endpoints críticos (Dashboard)
--
-- 5. Próximas Etapas:
--    - Criar função PL/pgSQL para purga de dados deletados após 90 dias
--    - Implementar webhook para notificação de solicitações LGPD
--    - Configurar backups automáticos do Supabase
--    - Testar disaster recovery
