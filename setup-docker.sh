#!/bin/bash

# Script para configurar e executar a aplicação com Docker

echo "🐳 Configurando Gerenciamento de Turmas com Docker..."

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover volumes (opcional - descomente se quiser limpar o banco)
# echo "🗑️  Removendo volumes..."
# docker-compose down -v

# Construir e iniciar os serviços
echo "🔨 Construindo e iniciando os serviços..."
docker-compose up --build -d

# Aguardar os serviços ficarem prontos
echo "⏳ Aguardando os serviços ficarem prontos..."
sleep 30

# Verificar o status dos containers
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "✅ Aplicação configurada com sucesso!"
echo ""
echo "🌐 Acesse a aplicação em: http://localhost"
echo "🔧 API Backend disponível em: http://localhost:3000"
echo "🗄️  Banco de dados PostgreSQL na porta: 5432"
echo ""
echo "Para ver os logs em tempo real:"
echo "  docker-compose logs -f"
echo ""
echo "Para parar a aplicação:"
echo "  docker-compose down"
echo ""
echo "Para parar e remover volumes (limpar banco):"
echo "  docker-compose down -v"
