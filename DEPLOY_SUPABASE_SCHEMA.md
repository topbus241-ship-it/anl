# Guia de Implantação do Schema Supabase

## Visão Geral
Este guia orienta você a implantar o banco de dados PostgreSQL no projeto Supabase TOPBUS Sinistros.

## Pré-requisitos
- Projeto Supabase criado: `howaipkfjdtvdyvekwyok`
- Acesso ao Supabase Dashboard
- Arquivo SQL: `SUPABASE_SCHEMA.sql`

## Passos de Implantação

### 1. Acessar o SQL Editor do Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Selecione o projeto `howaipkfjdtvdyvekwyok`
3. No painel esquerdo, clique em **SQL Editor**
4. Clique no botão **+ New Query** ou **Create a new query**

### 2. Copiar e Executar o SQL

1. Abra o arquivo `SUPABASE_SCHEMA.sql` no seu editor
2. Copie **TODO** o conteúdo do arquivo SQL
3. Cole no editor de SQL do Supabase
4. Clique no botão **Run** (ou pressione `Ctrl + Enter`)

⚠️ **Importante:** Execute todo o arquivo de uma vez para garantir que as dependências (sequências, chaves estrangeiras) sejam criadas na ordem correta.

### 3. Verificar a Implantação

Após executar o SQL com sucesso, você verá mensagens como:
```
CREATE TABLE (ok)
CREATE SEQUENCE (ok)
ALTER TABLE (ok)
CREATE POLICY (ok)
```

### 4. Criar Buckets de Armazenamento

1. No painel do Supabase, vá para **Storage** (lado esquerdo)
2. Clique em **New Bucket**
3. Configure:
   - **Nome:** `sinistros`
   - **Tornado público:** ✓ Sim
   - Clique **Create Bucket**

### 5. Configurar Políticas de Armazenamento

1. Clique no bucket `sinistros`
2. Vá para a aba **Policies** (Políticas)
3. Clique **New Policy → For full customization**
4. Crie estas políticas:

#### Política 1: Permitir Upload Público
```sql
CREATE POLICY "Permitir upload público" ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'sinistros');
```

#### Política 2: Permitir Leitura Pública
```sql
CREATE POLICY "Permitir leitura pública" ON storage.objects
FOR SELECT 
USING (bucket_id = 'sinistros');
```

#### Política 3: Permitir Deleção
```sql
CREATE POLICY "Permitir deleção" ON storage.objects
FOR DELETE 
USING (bucket_id = 'sinistros');
```

### 6. Verificar Variáveis de Ambiente

Certifique-se de que seu `.env.local` contém:

```bash
REACT_APP_SUPABASE_URL=https://howaipkfjdtvdyvekwyok.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 7. Testar Conexão

Execute seu aplicativo e tente:

1. **Enviar um formulário de sinistro** → Deve ser criado um registro em `sinistros`
2. **Fazer upload de fotos** → Deve aparecer em `sinistros/` no Storage
3. **Verificar na tabela** → Acesse **SQL Editor** e execute:
   ```sql
   SELECT * FROM sinistros LIMIT 10;
   SELECT * FROM imagens LIMIT 10;
   ```

## Rollback (Desfazer)

Se precisar desfazer a implantação:

1. Vá para **SQL Editor**
2. Cole este comando:
   ```sql
   -- ⚠️ CUIDADO: Isso deletará TODOS os dados!
   DROP TABLE IF EXISTS solicitacoes_lgpd CASCADE;
   DROP TABLE IF EXISTS consentimentos_lgpd CASCADE;
   DROP TABLE IF EXISTS documentos_complementares CASCADE;
   DROP TABLE IF EXISTS imagens CASCADE;
   DROP TABLE IF EXISTS testemunhas CASCADE;
   DROP TABLE IF EXISTS sinistros CASCADE;
   DROP SEQUENCE IF EXISTS sinistro_seq;
   ```
3. Clique **Run**

## Troubleshooting

### Erro: "Sequence does not exist"
- **Solução:** Execute novamente TODO o arquivo SQL. A sequência pode não ter sido criada corretamente na primeira execução.

### Erro: "Foreign key constraint violated"
- **Solução:** Certifique-se de que tabelas dependentes (`testemunhas`, `imagens`, etc.) estão inserindo com `sinistro_id` válido.

### RLS bloqueia todas as operações
- **Solução:** As políticas já estão configuradas para permitir inserção e leitura públicas. Se não funcionar, adicione:
  ```sql
  ALTER TABLE sinistros DISABLE ROW LEVEL SECURITY;
  -- Depois, ative novamente e reconfigure as políticas
  ```

### Imagens não aparecem no Storage
- **Solução:** Verifique se as políticas de Storage foram criadas. Vá para **Storage → sinistros → Policies** e confirme que existem.

## Próximas Etapas

1. ✅ Implantar schema SQL
2. ✅ Criar buckets de armazenamento
3. ✅ Configurar políticas de Storage
4. ⏳ Testar fluxo completo de formulário → Supabase
5. ⏳ Implementar autenticação de Dashboard (admin)
6. ⏳ Configurar backups automáticos
7. ⏳ Implementar rotinas de limpeza de dados (LGPD - 90 dias)

## Referências

- [Documentação Supabase Database](https://supabase.com/docs/guides/database)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase SQL Editor](https://supabase.com/docs/guides/database/sql-editor)

## Suporte

Se encontrar problemas:
1. Verifique os logs do Supabase em **Monitoring → Logs**
2. Consulte a aba **Console** do navegador para erros de cliente
3. Teste endpoints manualmente via **REST API** (Supabase oferece URL de API)
