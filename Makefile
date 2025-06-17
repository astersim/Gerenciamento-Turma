# Makefile para gerenciar containers Docker

.PHONY: help build up down restart logs clean dev prod

# Comandos para produção
build:
	@echo "🔨 Construindo imagens Docker..."
	docker-compose build

up:
	@echo "🚀 Iniciando aplicação em produção..."
	docker-compose up -d

down:
	@echo "🛑 Parando aplicação..."
	docker-compose down

restart:
	@echo "🔄 Reiniciando aplicação..."
	docker-compose restart

logs:
	@echo "📋 Visualizando logs..."
	docker-compose logs -f

clean:
	@echo "🧹 Limpando containers e volumes..."
	docker-compose down -v
	docker system prune -f

# Comandos para desenvolvimento
dev:
	@echo "🚀 Iniciando aplicação em desenvolvimento..."
	docker-compose -f docker-compose.dev.yml up -d

dev-build:
	@echo "🔨 Construindo imagens para desenvolvimento..."
	docker-compose -f docker-compose.dev.yml build

dev-down:
	@echo "🛑 Parando ambiente de desenvolvimento..."
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	@echo "📋 Visualizando logs de desenvolvimento..."
	docker-compose -f docker-compose.dev.yml logs -f

# Comandos para banco de dados
db-migrate:
	@echo "📊 Executando migrações do banco..."
	docker-compose exec backend npx prisma migrate deploy

db-reset:
	@echo "🔄 Resetando banco de dados..."
	docker-compose exec backend npx prisma migrate reset --force

db-seed:
	@echo "🌱 Populando banco de dados..."
	docker-compose exec backend npm run init-db

# Comandos utilitários
shell-backend:
	@echo "💻 Acessando shell do backend..."
	docker-compose exec backend sh

shell-frontend:
	@echo "💻 Acessando shell do frontend..."
	docker-compose exec frontend sh

shell-db:
	@echo "💻 Acessando shell do banco..."
	docker-compose exec database psql -U postgres -d gerenciamento_turma

# Status dos containers
status:
	@echo "📊 Status dos containers..."
	docker-compose ps

# Ajuda
help:
	@echo "🆘 Comandos disponíveis:"
	@echo ""
	@echo "Produção:"
	@echo "  make build     - Constrói as imagens Docker"
	@echo "  make up        - Inicia a aplicação"
	@echo "  make down      - Para a aplicação"
	@echo "  make restart   - Reinicia a aplicação"
	@echo "  make logs      - Visualiza os logs"
	@echo "  make clean     - Remove containers e volumes"
	@echo ""
	@echo "Desenvolvimento:"
	@echo "  make dev       - Inicia em modo desenvolvimento"
	@echo "  make dev-build - Constrói imagens para desenvolvimento"
	@echo "  make dev-down  - Para ambiente de desenvolvimento"
	@echo "  make dev-logs  - Visualiza logs de desenvolvimento"
	@echo ""
	@echo "Banco de dados:"
	@echo "  make db-migrate - Executa migrações"
	@echo "  make db-reset   - Reseta o banco"
	@echo "  make db-seed    - Popula o banco"
	@echo ""
	@echo "Utilitários:"
	@echo "  make shell-backend  - Acessa shell do backend"
	@echo "  make shell-frontend - Acessa shell do frontend"
	@echo "  make shell-db       - Acessa shell do banco"
	@echo "  make status         - Mostra status dos containers"
