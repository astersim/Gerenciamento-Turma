# Gerenciamento de Turmas

Sistema completo para cadastro, gerenciamento e reativação de Professores, Disciplinas, Salas e Turmas.

## Funcionalidades
- CRUD completo para Professores, Disciplinas, Salas e Turmas
- Busca e ordenação por até dois atributos em todas as listagens
- Botões de editar/desativar nas tabelas principais
- Campo "ativo" oculto em formulários de cadastro/edição
- Tela separada para reativação de registros inativos
- Validação de CPF, unicidade, limites de caracteres e campos obrigatórios
- Docker para backend, frontend e banco de dados PostgreSQL

## Execução com Docker

1. **Clone o repositório:**
   ```powershell
   git clone <URL_DO_REPOSITORIO>
   cd GerenciamentoTurma
   ```
2. **Suba os containers:**
   ```powershell
   cd backend
   docker compose -f docker-compose.postgres.yml up --build
   ```
   Isso irá subir o banco de dados, backend e frontend.

3. **Acesse o sistema:**
   - Frontend: http://localhost:3001
   - Backend (API): http://localhost:3000/api

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
