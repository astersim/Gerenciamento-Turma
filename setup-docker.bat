@echo off
echo 🐳 Configurando Gerenciamento de Turmas com Docker...

REM Verificar se o Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker não está instalado. Por favor, instale o Docker primeiro.
    pause
    exit /b 1
)

REM Verificar se o Docker Compose está instalado
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro.
    pause
    exit /b 1
)

REM Parar containers existentes
echo 🛑 Parando containers existentes...
docker-compose down

REM Construir e iniciar os serviços
echo 🔨 Construindo e iniciando os serviços...
docker-compose up --build -d

REM Aguardar os serviços ficarem prontos
echo ⏳ Aguardando os serviços ficarem prontos...
timeout /t 30 /nobreak >nul

REM Verificar o status dos containers
echo 📊 Status dos containers:
docker-compose ps

echo.
echo ✅ Aplicação configurada com sucesso!
echo.
echo 🌐 Acesse a aplicação em: http://localhost
echo 🔧 API Backend disponível em: http://localhost:3000
echo 🗄️  Banco de dados PostgreSQL na porta: 5432
echo.
echo Para ver os logs em tempo real:
echo   docker-compose logs -f
echo.
echo Para parar a aplicação:
echo   docker-compose down
echo.
echo Para parar e remover volumes (limpar banco):
echo   docker-compose down -v
echo.
pause
