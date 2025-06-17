# Gerenciamento de Turmas

Sistema completo para cadastro, gerenciamento e reativação de Professores, Disciplinas, Salas, Turmas e Alunos com sistema de matrículas.

## Funcionalidades
- CRUD completo para Professores, Disciplinas, Salas, Turmas e Alunos
- Sistema de matrículas com gerenciamento de alunos por turma
- Reativação de registros desativados (soft delete)
- Busca e ordenação por até dois atributos em todas as listagens
- Validação de CPF, unicidade, limites de caracteres e campos obrigatórios
- Interface responsiva com Bootstrap
- Containerização completa com Docker

## 🐳 Execução com Docker (Recomendado)

### Pré-requisitos
- Docker
- Docker Compose

### Execução Rápida

**Windows:**
```powershell
.\setup-docker.bat
```

**Linux/Mac:**
```bash
chmod +x setup-docker.sh
./setup-docker.sh
```

### Execução Manual

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd GerenciamentoTurma
   ```

2. **Inicie todos os serviços:**
   ```bash
   docker-compose up --build -d
   ```

3. **Acesse o sistema:**
   - **Frontend:** http://localhost (porta 80)
   - **Backend API:** http://localhost:3000/api
   - **Banco PostgreSQL:** localhost:5432

### Comandos Úteis

```bash
# Ver logs em tempo real
docker-compose logs -f

# Parar a aplicação
docker-compose down

# Parar e limpar volumes (remove dados do banco)
docker-compose down -v

# Reconstruir apenas um serviço
docker-compose up --build <nome-do-serviço>
```

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
