#!/bin/bash

# Script para validar a configuração Docker

echo "🔍 Validando configuração Docker..."
echo

# Verificar se os arquivos necessários existem
files=(
    "docker-compose.yml"
    "backend/Dockerfile"
    "backend/.dockerignore"
    "frontend/Dockerfile"
    "frontend/.dockerignore"
    "frontend/nginx.conf"
)

echo "📁 Verificando arquivos necessários:"
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (não encontrado)"
    fi
done

echo
echo "🐳 Verificando instalação do Docker:"

# Verificar Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker instalado: $(docker --version)"
else
    echo "❌ Docker não está instalado"
    echo "   Consulte DOCKER_INSTALL.md para instruções de instalação"
fi

# Verificar Docker Compose
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose instalado: $(docker-compose --version)"
elif docker compose version &> /dev/null; then
    echo "✅ Docker Compose (plugin) instalado: $(docker compose version)"
else
    echo "❌ Docker Compose não está instalado"
fi

echo
echo "📋 Verificando configuração do docker-compose.yml:"

if [ -f "docker-compose.yml" ]; then
    # Verificar sintaxe do docker-compose
    if docker-compose config &> /dev/null; then
        echo "✅ Sintaxe do docker-compose.yml está correta"
    else
        echo "❌ Erro na sintaxe do docker-compose.yml"
        echo "   Execute: docker-compose config"
    fi
else
    echo "❌ docker-compose.yml não encontrado"
fi

echo
echo "🚀 Para executar a aplicação:"
echo "   1. Certifique-se que o Docker está rodando"
echo "   2. Execute: docker-compose up --build -d"
echo "   3. Acesse: http://localhost"

echo
echo "📚 Para mais informações:"
echo "   - README.md - Instruções gerais"
echo "   - DOCKER_INSTALL.md - Instalação do Docker"
