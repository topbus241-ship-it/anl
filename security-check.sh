#!/bin/bash
# ============================================================
# Script de Verificação de Segurança - TOPBUS Sinistros v2.0
# ============================================================
# Uso: bash security-check.sh

echo "🔍 VERIFICAÇÃO DE SEGURANÇA - TOPBUS Sinistros v2.0"
echo "=================================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0
SUCCESS=0

# Função para reportar erro
report_error() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

# Função para reportar aviso
report_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

# Função para reportar sucesso
report_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((SUCCESS++))
}

# ============================================================
# 1. VERIFICAR CREDENCIAIS EXPOSTAS
# ============================================================
echo "1️⃣  Verificando credenciais expostas..."
echo ""

if grep -r "howaipkfjdtvdyvekwyok" src/ 2>/dev/null; then
    report_error "Chave Supabase ainda exposta no código!"
else
    report_success "Nenhuma chave Supabase exposta"
fi

if grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" src/ 2>/dev/null; then
    report_error "Token JWT exposto no código!"
else
    report_success "Nenhum token JWT exposto"
fi

if grep -r "REACT_APP_API_KEY" src/ 2>/dev/null | grep -v "import.meta.env"; then
    report_warning "Chave de API pode estar hardcoded"
else
    report_success "API Keys usando variáveis de ambiente"
fi

echo ""

# ============================================================
# 2. VERIFICAR .env.local
# ============================================================
echo "2️⃣  Verificando configuração .env.local..."
echo ""

if [ ! -f .env.local ]; then
    report_warning ".env.local não encontrado (crie uma cópia de .env.example)"
else
    if grep -q "VITE_SUPABASE_URL" .env.local; then
        report_success ".env.local contém VITE_SUPABASE_URL"
    else
        report_error ".env.local sem VITE_SUPABASE_URL"
    fi

    if grep -q "VITE_SUPABASE_ANON_KEY" .env.local; then
        report_success ".env.local contém VITE_SUPABASE_ANON_KEY"
    else
        report_error ".env.local sem VITE_SUPABASE_ANON_KEY"
    fi
fi

echo ""

# ============================================================
# 3. VERIFICAR .gitignore
# ============================================================
echo "3️⃣  Verificando .gitignore..."
echo ""

if grep -q "\.env\.local" .gitignore 2>/dev/null; then
    report_success ".env.local está no .gitignore"
else
    report_warning "⚠️  .env.local pode não estar no .gitignore"
fi

if grep -q "\.env\$" .gitignore 2>/dev/null; then
    report_success ".env está no .gitignore"
else
    report_warning "⚠️  .env pode não estar no .gitignore"
fi

echo ""

# ============================================================
# 4. VERIFICAR COMPONENTES SUPABASE
# ============================================================
echo "4️⃣  Verificando componentes Supabase..."
echo ""

if [ -f "src/lib/supabase.js" ]; then
    if grep -q "import.meta.env.VITE_SUPABASE_URL" src/lib/supabase.js; then
        report_success "supabase.js usando variáveis de ambiente"
    else
        report_error "supabase.js não está usando env vars!"
    fi
else
    report_warning "supabase.js não encontrado"
fi

if [ -f "src/components/FormularioSinistro-supabase.jsx" ]; then
    report_success "Componente FormularioSinistro-supabase.jsx criado"
else
    report_warning "FormularioSinistro-supabase.jsx não encontrado"
fi

echo ""

# ============================================================
# 5. VERIFICAR DOCUMENTAÇÃO
# ============================================================
echo "5️⃣  Verificando documentação..."
echo ""

if [ -f "DEPLOY_SUPABASE_SEGURO.md" ]; then
    report_success "Guia DEPLOY_SUPABASE_SEGURO.md existe"
else
    report_error "Guia DEPLOY_SUPABASE_SEGURO.md não encontrado"
fi

if [ -f "SEGURANCA.md" ]; then
    report_success "Relatório SEGURANCA.md existe"
else
    report_error "Relatório SEGURANCA.md não encontrado"
fi

if [ -f ".env.example" ]; then
    if grep -q "VITE_SUPABASE_URL" .env.example; then
        report_success ".env.example configurado corretamente"
    else
        report_error ".env.example incompleto"
    fi
else
    report_error ".env.example não encontrado"
fi

echo ""

# ============================================================
# 6. VERIFICAR PROPAGANDAS LOVABLE
# ============================================================
echo "6️⃣  Verificando propagandas Lovable..."
echo ""

if grep -r -i "lovable\|made with\|powered by" src/ 2>/dev/null; then
    report_warning "Possível propaganda Lovable encontrada"
else
    report_success "Nenhuma propaganda Lovable detectada"
fi

echo ""

# ============================================================
# 7. VERIFICAR package.json
# ============================================================
echo "7️⃣  Verificando package.json..."
echo ""

if grep -q "@supabase/supabase-js" package.json; then
    report_success "@supabase/supabase-js instalado"
else
    report_warning "@supabase/supabase-js não em package.json"
fi

echo ""

# ============================================================
# RESUMO
# ============================================================
echo "=================================================="
echo "📊 RESUMO DA VERIFICAÇÃO"
echo "=================================================="
echo ""
echo -e "${GREEN}✅ Sucesso: $SUCCESS${NC}"
echo -e "${YELLOW}⚠️  Avisos: $WARNINGS${NC}"
echo -e "${RED}❌ Erros: $ERRORS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ TUDO OK PARA DEPLOY!${NC}"
    exit 0
else
    echo -e "${RED}❌ CORRIJA OS ERROS ACIMA ANTES DE FAZER DEPLOY${NC}"
    exit 1
fi
