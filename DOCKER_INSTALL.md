# Guia de Instalação do Docker

## Windows

### Opção 1: Docker Desktop (Recomendado)
1. Baixe o Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Execute o instalador
3. Reinicie o computador se solicitado
4. Abra o Docker Desktop e aguarde inicializar
5. Verifique a instalação:
   ```powershell
   docker --version
   docker-compose --version
   ```

### Opção 2: Docker via Chocolatey
```powershell
# Instalar Chocolatey (se não tiver)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Instalar Docker
choco install docker-desktop
```

## Linux (Ubuntu/Debian)

```bash
# Atualizar pacotes
sudo apt update

# Instalar dependências
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release

# Adicionar chave GPG oficial do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adicionar repositório
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Reiniciar para aplicar mudanças
sudo reboot
```

## macOS

### Opção 1: Docker Desktop
1. Baixe o Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Arraste o Docker.app para a pasta Applications
3. Abra o Docker Desktop

### Opção 2: Via Homebrew
```bash
# Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Docker
brew install --cask docker
```

## Verificação da Instalação

Após a instalação, verifique se tudo está funcionando:

```bash
# Verificar versão do Docker
docker --version

# Verificar versão do Docker Compose
docker-compose --version

# Testar Docker
docker run hello-world
```

## Solução de Problemas

### Windows
- **Erro "Docker daemon is not running"**: Abra o Docker Desktop
- **Erro de virtualização**: Habilite a virtualização na BIOS
- **WSL2 requerido**: Instale o WSL2 se solicitado

### Linux
- **Permission denied**: Execute `sudo usermod -aG docker $USER` e faça logout/login
- **Service not running**: Execute `sudo systemctl start docker`

### macOS
- **Docker Desktop não inicia**: Verifique as permissões de segurança nas Preferências do Sistema
