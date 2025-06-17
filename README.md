# Gerenciamento de Turmas

Sistema completo para cadastro, gerenciamento e reativação de Professores, Disciplinas, Salas e Turmas.

## Funcionalidades
- CRUD completo para Professores, Disciplinas, Salas e Turmas
- Busca e ordenação por até dois atributos em todas as listagens
- Botões de editar/desativar nas tabelas principais
- Campo "ativo" oculto em formulários de cadastro/edição
- Tela separada para reativação de registros inativos
- Validação de CPF, unicidade, limites de caracteres e campos obrigatórios
- Aplicação totalmente containerizada com Docker

## 🐳 Execução com Docker

### Pré-requisitos
- Docker Desktop instalado
- Docker Compose

### 🚀 Iniciando a aplicação

#### Modo Produção (recomendado)
```powershell
# Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd GerenciamentoTurma

# Construir e iniciar todos os serviços
docker-compose up --build -d

# Ou usando Makefile (se disponível)
make build
make up
```

#### Modo Desenvolvimento
```powershell
# Para desenvolvimento com hot reload
docker-compose -f docker-compose.dev.yml up --build -d

# Ou usando Makefile
make dev
```

### 📱 Acessando a aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **pgAdmin**: http://localhost:5050 (admin@admin.com / admin123)
- **Banco PostgreSQL**: localhost:5432

### 🛠️ Comandos úteis

```powershell
# Ver logs da aplicação
docker-compose logs -f

# Parar a aplicação
docker-compose down

# Parar e remover volumes (reset completo)
docker-compose down -v

# Executar migrações do banco
docker-compose exec backend npx prisma migrate deploy

# Acessar shell do backend
docker-compose exec backend sh

# Acessar banco de dados
docker-compose exec database psql -U postgres -d gerenciamento_turma
```

### 🗂️ Estrutura dos Containers

- **database**: PostgreSQL 15 com dados persistentes
- **backend**: API Node.js + Express + Prisma
- **frontend**: React + TypeScript servido via Nginx
- **pgAdmin**: Interface web para gerenciar o banco (opcional)

## 📋 Makefile (Comandos simplificados)

Se disponível, você pode usar estes comandos:

```powershell
make help           # Lista todos os comandos
make build          # Constrói as imagens
make up             # Inicia produção
make dev            # Inicia desenvolvimento
make down           # Para a aplicação
make logs           # Visualiza logs
make clean          # Limpeza completa
make db-migrate     # Executa migrações
make status         # Status dos containers
```

## 🔧 Desenvolvimento Local (sem Docker)

### Backend
```powershell
cd backend
npm install
npm run dev
```

### Frontend
```powershell
cd frontend
npm install
npm start
```

## 🏗️ Arquitetura

- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Frontend**: React + TypeScript + Bootstrap
- **Banco de dados**: PostgreSQL
- **Containerização**: Docker + Docker Compose
- **Proxy reverso**: Nginx (para frontend)

## 📊 Monitoramento

A aplicação inclui health checks para todos os serviços:
- Backend: `GET /api/health`
- Frontend: `GET /health`
- Database: health check interno do PostgreSQL

## 🛡️ Segurança

- Containers executam com usuários não-root
- Headers de segurança configurados no Nginx
- Isolamento de rede entre containers
- Volumes persistentes para dados do banco

## 📝 Observações

- Primeira execução pode demorar devido ao build das imagens
- Os dados do banco são persistidos em volumes Docker
- Para reset completo, use `docker-compose down -v`
- Em produção, altere as senhas padrão nos arquivos de configuração

## Publicação no GitHub

1. Crie um repositório no GitHub (ex: `GerenciamentoTurma`).
2. No diretório do projeto, inicialize o git e faça o push:
   ```powershell
   git init
   git add .
   git commit -m "Projeto Gerenciamento de Turmas"
   git branch -M main
   git remote add origin https://github.com/<SEU_USUARIO>/<NOME_REPO>.git
   git push -u origin main
   ```

## Observações
- Para rodar localmente sem Docker, instale as dependências em `backend` e `frontend` e rode ambos separadamente.
- O backend utiliza Prisma e Express. O frontend utiliza React + TypeScript.
- Todas as validações e fluxos exigidos pelo cliente estão implementados.

---

Dúvidas ou problemas? Consulte o código ou abra uma issue no repositório.
