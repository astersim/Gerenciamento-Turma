@echo off
echo 🔍 Validando configuração Docker...
echo.

REM Verificar se os arquivos necessários existem
echo 📁 Verificando arquivos necessários:

if exist "docker-compose.yml" (
    echo ✅ docker-compose.yml
) else (
    echo ❌ docker-compose.yml ^(não encontrado^)
)

if exist "backend\Dockerfile" (
    echo ✅ backend\Dockerfile
) else (
    echo ❌ backend\Dockerfile ^(não encontrado^)
)

if exist "backend\.dockerignore" (
    echo ✅ backend\.dockerignore
) else (
    echo ❌ backend\.dockerignore ^(não encontrado^)
)

if exist "frontend\Dockerfile" (
    echo ✅ frontend\Dockerfile
) else (
    echo ❌ frontend\Dockerfile ^(não encontrado^)
)

if exist "frontend\.dockerignore" (
    echo ✅ frontend\.dockerignore
) else (
    echo ❌ frontend\.dockerignore ^(não encontrado^)
)

if exist "frontend\nginx.conf" (
    echo ✅ frontend\nginx.conf
) else (
    echo ❌ frontend\nginx.conf ^(não encontrado^)
)

echo.
echo 🐳 Verificando instalação do Docker:

REM Verificar Docker
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker instalado
    docker --version
) else (
    echo ❌ Docker não está instalado
    echo    Consulte DOCKER_INSTALL.md para instruções de instalação
)

REM Verificar Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker Compose instalado
    docker-compose --version
) else (
    echo ❌ Docker Compose não está instalado
)

echo.
echo 📋 Verificando configuração do docker-compose.yml:

if exist "docker-compose.yml" (
    docker-compose config >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Sintaxe do docker-compose.yml está correta
    ) else (
        echo ❌ Erro na sintaxe do docker-compose.yml
        echo    Execute: docker-compose config
    )
) else (
    echo ❌ docker-compose.yml não encontrado
)

echo.
echo 🚀 Para executar a aplicação:
echo    1. Certifique-se que o Docker está rodando
echo    2. Execute: docker-compose up --build -d
echo    3. Acesse: http://localhost
echo.
echo 📚 Para mais informações:
echo    - README.md - Instruções gerais
echo    - DOCKER_INSTALL.md - Instalação do Docker
echo.
pause
